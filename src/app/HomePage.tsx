'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FiCheck,
  FiClock,
  FiEyeOff,
  FiLink,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import CreateRoomButton from "@/components/CreateRoomButton";
import { AppShell, GlassPanel, Header } from "@/components";
import { useLocale, useTranslations } from "@/i18n";
import { getLocalizedHref, getPageAlternates } from "@/lib/locale-routing";

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("landing");
  const headerT = useTranslations("header");
  const benefits = [
    { icon: FiZap, title: t("benefit1Title"), description: t("benefit1Description"), color: "signal.cyan" },
    { icon: FiShield, title: t("benefit2Title"), description: t("benefit2Description"), color: "signal.indigo" },
    { icon: FiClock, title: t("benefit3Title"), description: t("benefit3Description"), color: "signal.blue" },
  ];
  const steps = [1, 2, 3, 4].map((step) => ({
    number: `0${step}`,
    title: t(`step${step}Title`),
    description: t(`step${step}Description`),
  }));
  return (
    <AppShell>
      <Header showFullLogo localeHrefs={getPageAlternates("home")} />

      <Box as="main">
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Grid
            as="section"
            minH={{ base: "auto", lg: "calc(100dvh - 89px)" }}
            py={{ base: 16, md: 24 }}
            templateColumns={{ base: "1fr", lg: "1.08fr 0.92fr" }}
            gap={{ base: 12, lg: 16 }}
            alignItems="center"
          >
            <VStack align="flex-start" spacing={7}>
              <Tag size="lg" variant="subtle" colorScheme="purple" px={4} py={2}>
                <HStack spacing={2}>
                  <Icon as={FiUsers} />
                  <Text>{t("tagline")}</Text>
                </HStack>
              </Tag>
              <Box>
                <Heading as="h1" textStyle="display" maxW="4xl">
                  {t("heroTitle")}{" "}
                  <Text as="span" bgGradient="linear(to-r, brand.200, signal.cyan)" bgClip="text">
                    {t("heroHighlight")}
                  </Text>
                </Heading>
                <Text mt={6} color="ink.300" textStyle="body-lg" maxW="2xl">
                  {t("heroDescription")}
                </Text>
              </Box>
              <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "full", sm: "auto" }}>
                <CreateRoomButton w={{ base: "full", sm: "auto" }} />
                <Button as={Link} href={getLocalizedHref(locale, "guide")} size="lg" variant="glass" w={{ base: "full", sm: "auto" }}>
                  {t("learnHow")}
                </Button>
              </Stack>
              <HStack spacing={{ base: 3, md: 6 }} flexWrap="wrap" color="ink.300" textStyle="body-sm">
                {[t("proofNoSignup"), t("proofRealtime"), t("proofFree")].map((item) => (
                  <HStack key={item} spacing={1.5}>
                    <Icon as={FiCheck} color="signal.green" />
                    <Text>{item}</Text>
                  </HStack>
                ))}
              </HStack>
            </VStack>

            <Box position="relative" minH={{ base: "430px", md: "520px" }}>
              <Box position="absolute" inset={{ base: "8% 4% 2%", md: "5% 2% 0%" }} borderRadius="3xl" bgGradient="linear(to-br, rgba(112,72,245,0.18), rgba(77,227,227,0.08))" filter="blur(2px)" />
              <GlassPanel position="absolute" inset={{ base: "4% 0 0", sm: "5% 5% 0" }} strength="strong" p={{ base: 5, md: 7 }} overflow="hidden">
                <HStack justify="space-between" mb={8}>
                  <RoundPreviewStatus />
                  <Tag colorScheme="purple">{t("people")}</Tag>
                </HStack>
                <HStack justify="center" spacing={{ base: -3, md: -1 }} py={7}>
                  {["3", "8", "?", "☕"].map((point, index) => (
                    <Box
                      key={point}
                      w={{ base: 16, sm: 20, md: 24 }}
                      h={{ base: 24, sm: 28, md: 32 }}
                      display="grid"
                      placeItems="center"
                      borderRadius="2xl"
                      bg={index === 2 ? "rgba(112, 72, 245, 0.34)" : "rgba(17, 25, 49, 0.94)"}
                      border="1px solid"
                      borderColor={index === 2 ? "brand.300" : "whiteAlpha.200"}
                      boxShadow={index === 2 ? "glowBrand" : "0 14px 30px rgba(0,0,0,.25)"}
                      color="white"
                      textStyle="code-card"
                      transform={`rotate(${(index - 1.5) * 5}deg) translateY(${Math.abs(index - 1.5) * 5}px)`}
                      zIndex={index}
                    >
                      {point}
                    </Box>
                  ))}
                </HStack>
                <VStack spacing={3} align="stretch" mt={7}>
                  {[t("previewVoted1"), t("previewVoted2"), t("previewThinking")].map((participant, index) => (
                    <HStack key={participant} justify="space-between" p={3} borderRadius="xl" bg="whiteAlpha.50">
                      <Text color="ink.200" textStyle="body-sm">{participant}</Text>
                      <Box boxSize={2} borderRadius="full" bg={index === 2 ? "signal.blue" : "signal.green"} />
                    </HStack>
                  ))}
                </VStack>
              </GlassPanel>
            </Box>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <VStack spacing={4} textAlign="center" mb={10}>
              <Text textStyle="eyebrow">{t("benefitsEyebrow")}</Text>
              <Heading as="h2" textStyle="h2">{t("benefitsTitle")}</Heading>
              <Text color="ink.300" maxW="2xl" textStyle="body-lg">
                {t("benefitsDescription")}
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {benefits.map((benefit) => (
                <GlassPanel key={benefit.title} p={{ base: 6, md: 7 }}>
                  <Box display="grid" placeItems="center" boxSize={12} borderRadius="xl" bg="whiteAlpha.100" mb={5}>
                    <Icon as={benefit.icon} color={benefit.color} boxSize={5} />
                  </Box>
                  <Heading as="h3" textStyle="h3">{benefit.title}</Heading>
                  <Text color="ink.300" mt={3} textStyle="body">{benefit.description}</Text>
                </GlassPanel>
              ))}
            </SimpleGrid>
          </Box>

          <Grid as="section" py={{ base: 14, md: 24 }} templateColumns={{ base: "1fr", lg: "0.8fr 1.2fr" }} gap={{ base: 10, lg: 16 }}>
            <Box>
              <Text textStyle="eyebrow">{t("stepsEyebrow")}</Text>
              <Heading as="h2" textStyle="h2" mt={3}>{t("stepsTitle")}</Heading>
              <Text color="ink.300" mt={5} textStyle="body-lg">
                {t("stepsDescription")}
              </Text>
            </Box>
            <VStack spacing={3} align="stretch">
              {steps.map((step) => (
                <GlassPanel key={step.number} p={5} display="grid" gridTemplateColumns="auto 1fr" gap={4} alignItems="start">
                  <Text textStyle="label" color="brand.200" letterSpacing="0.08em">{step.number}</Text>
                  <Box>
                    <Heading as="h3" textStyle="h4">{step.title}</Heading>
                    <Text color="ink.300" mt={2} textStyle="body">{step.description}</Text>
                  </Box>
                </GlassPanel>
              ))}
            </VStack>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <GlassPanel strength="strong" p={{ base: 7, md: 12 }} overflow="hidden" position="relative">
              <Flex position="absolute" inset="-40% auto auto 58%" w="360px" h="360px" borderRadius="full" bg="brand.500" opacity={0.16} filter="blur(70px)" pointerEvents="none" />
              <Stack direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "flex-start", lg: "center" }} spacing={8} position="relative">
                <Box maxW="2xl">
                  <HStack spacing={2} color="signal.cyan" mb={4}>
                    <Icon as={FiLink} />
                    <Text textStyle="eyebrow" color="signal.cyan">{t("ctaEyebrow")}</Text>
                  </HStack>
                  <Heading as="h2" textStyle="h2">{t("ctaTitle")}</Heading>
                  <Text color="ink.300" mt={3} textStyle="body-lg">
                    {t("ctaDescription")}
                  </Text>
                </Box>
                <CreateRoomButton label={t("ctaButton")} flexShrink={0} w={{ base: "full", lg: "auto" }} />
              </Stack>
            </GlassPanel>
          </Box>

          <VStack as="section" py={{ base: 14, md: 20 }} spacing={8} textAlign="center">
            <Box>
              <Text textStyle="eyebrow">{t("learnEyebrow")}</Text>
              <Heading as="h2" textStyle="h2" mt={3}>{t("learnTitle")}</Heading>
              <Text color="ink.300" mt={4} maxW="3xl" textStyle="body">
                {t("learnDescription")}
              </Text>
            </Box>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
              <Button as={Link} href={getLocalizedHref(locale, "guide")} variant="glass" size="lg">{t("completeGuide")}</Button>
              <Button as={Link} href={getLocalizedHref(locale, "faq")} variant="subtle" size="lg">{t("faq")}</Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Box as="footer" borderTop="1px solid" borderColor="whiteAlpha.100" py={8}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" spacing={3} color="ink.300" textStyle="body-sm">
            <Text>{t("footer")}</Text>
            <HStack spacing={4}>
              <Link href={getLocalizedHref(locale, "guide")}>{t("guide")}</Link>
              <Link href={getLocalizedHref(locale, "articles")}>{headerT("articles")}</Link>
              <Link href={getLocalizedHref(locale, "faq")}>{headerT("faq")}</Link>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </AppShell>
  );
}

function RoundPreviewStatus() {
  const t = useTranslations("landing");
  return (
    <HStack spacing={2}>
      <Box boxSize={2.5} borderRadius="full" bg="signal.indigo" boxShadow="0 0 18px rgba(155, 138, 251, 0.55)" />
      <Text color="ink.100" textStyle="body-sm" fontWeight="700">{t("previewSecret")}</Text>
      <Icon as={FiEyeOff} color="ink.400" />
    </HStack>
  );
}
