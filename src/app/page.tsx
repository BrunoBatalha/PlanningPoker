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

const benefits = [
  {
    icon: FiZap,
    title: "Colaboração em tempo real",
    description:
      "Convide sua equipe e acompanhe cada voto chegando, sem atualizar a página.",
    color: "signal.cyan",
  },
  {
    icon: FiShield,
    title: "Estimativas sem influência",
    description:
      "As escolhas permanecem secretas até a revelação simultânea das cartas.",
    color: "signal.indigo",
  },
  {
    icon: FiClock,
    title: "Comece em segundos",
    description:
      "Sem cadastro, instalação ou configuração. Crie a sala e compartilhe o link.",
    color: "signal.blue",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie uma sala",
    description:
      'Clique em "Criar sala grátis" e digite o nome que será exibido para o time.',
  },
  {
    number: "02",
    title: "Convide seu time",
    description:
      "Compartilhe o link. Cada pessoa entra com o próprio nome, sem precisar criar conta.",
  },
  {
    number: "03",
    title: "Vote em segredo",
    description:
      "Escolha uma carta da sequência Fibonacci. O valor continua oculto durante a rodada.",
  },
  {
    number: "04",
    title: "Revele e converse",
    description:
      "Mostre todas as cartas ao mesmo tempo, compare a distribuição e inicie uma nova rodada.",
  },
];

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Battle Poker Online",
    alternateName: "Planning Poker Online Gratuito",
    url: "https://battlepoker.devnabatalha.com",
    description:
      "Ferramenta gratuita de Planning Poker para equipes ágeis. Estime histórias de usuário com sua equipe de forma colaborativa e eficiente usando metodologia Scrum.",
    inLanguage: "pt-BR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://battlepoker.devnabatalha.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Planning Poker Online",
      url: "https://battlepoker.devnabatalha.com",
      logo: {
        "@type": "ImageObject",
        url: "https://battlepoker.devnabatalha.com/logo.png",
      },
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Battle Poker Online",
      applicationCategory: "BusinessApplication",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
      },
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Planning Poker Online",
    url: "https://battlepoker.devnabatalha.com",
    logo: "https://battlepoker.devnabatalha.com/logo.png",
    description:
      "Plataforma líder em ferramentas gratuitas de Planning Poker para equipes ágeis e metodologia Scrum",
    foundingDate: "2024",
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    knowsAbout: [
      "Planning Poker",
      "Scrum",
      "Metodologia Ágil",
      "Estimativa de Software",
      "Fibonacci Planning",
      "User Story Points",
      "Sprint Planning",
      "Desenvolvimento Ágil",
    ],
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Header showFullLogo />

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
              <Tag
                size="lg"
                variant="subtle"
                colorScheme="purple"
                px={4}
                py={2}
              >
                <HStack spacing={2}>
                  <Icon as={FiUsers} />
                  <Text>Planning Poker online e gratuito</Text>
                </HStack>
              </Tag>
              <Box>
                <Heading
                  as="h1"
                  fontSize={{ base: "4xl", sm: "5xl", md: "6xl", xl: "7xl" }}
                  lineHeight={{ base: 1.08, md: 1.02 }}
                  maxW="4xl"
                >
                  Estimativas mais honestas.{" "}
                  <Text
                    as="span"
                    bgGradient="linear(to-r, brand.200, signal.cyan)"
                    bgClip="text"
                  >
                    Conversas melhores.
                  </Text>
                </Heading>
                <Text
                  mt={6}
                  color="ink.300"
                  fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.75"
                  maxW="2xl"
                >
                  Reúna seu time, vote com cartas Fibonacci e revele todas as
                  estimativas ao mesmo tempo. Sem cadastro e sem distrações.
                </Text>
              </Box>
              <Stack
                direction={{ base: "column", sm: "row" }}
                spacing={3}
                w={{ base: "full", sm: "auto" }}
              >
                <CreateRoomButton w={{ base: "full", sm: "auto" }} />
                <Button
                  as={Link}
                  href="/o-que-e-planning-poker"
                  size="lg"
                  variant="glass"
                  w={{ base: "full", sm: "auto" }}
                >
                  Entender como funciona
                </Button>
              </Stack>
              <HStack
                spacing={{ base: 3, md: 6 }}
                flexWrap="wrap"
                color="ink.400"
                fontSize="sm"
              >
                {["Sem cadastro", "Tempo real", "100% gratuito"].map((item) => (
                  <HStack key={item} spacing={1.5}>
                    <Icon as={FiCheck} color="signal.green" />
                    <Text>{item}</Text>
                  </HStack>
                ))}
              </HStack>
            </VStack>

            <Box position="relative" minH={{ base: "430px", md: "520px" }}>
              <Box
                position="absolute"
                inset={{ base: "8% 4% 2%", md: "5% 2% 0%" }}
                borderRadius="3xl"
                bgGradient="linear(to-br, rgba(112,72,245,0.18), rgba(77,227,227,0.08))"
                filter="blur(2px)"
              />
              <GlassPanel
                position="absolute"
                inset={{ base: "4% 0 0", sm: "5% 5% 0" }}
                strength="strong"
                p={{ base: 5, md: 7 }}
                overflow="hidden"
              >
                <HStack justify="space-between" mb={8}>
                  <RoundPreviewStatus />
                  <Tag colorScheme="purple">4 pessoas</Tag>
                </HStack>
                <HStack justify="center" spacing={{ base: -3, md: -1 }} py={7}>
                  {["3", "5", "8", "13"].map((point, index) => (
                    <Box
                      key={point}
                      w={{ base: 16, sm: 20, md: 24 }}
                      h={{ base: 24, sm: 28, md: 32 }}
                      display="grid"
                      placeItems="center"
                      borderRadius="2xl"
                      bg={
                        index === 2
                          ? "rgba(112, 72, 245, 0.34)"
                          : "rgba(17, 25, 49, 0.94)"
                      }
                      border="1px solid"
                      borderColor={
                        index === 2 ? "brand.300" : "whiteAlpha.200"
                      }
                      boxShadow={
                        index === 2 ? "glowBrand" : "0 14px 30px rgba(0,0,0,.25)"
                      }
                      color="white"
                      fontWeight="900"
                      fontSize={{ base: "xl", md: "2xl" }}
                      transform={`rotate(${(index - 1.5) * 5}deg) translateY(${
                        Math.abs(index - 1.5) * 5
                      }px)`}
                      zIndex={index}
                    >
                      {point}
                    </Box>
                  ))}
                </HStack>
                <VStack spacing={3} align="stretch" mt={7}>
                  {["Marina votou", "Rafael votou", "Joana está pensando"].map(
                    (participant, index) => (
                      <HStack
                        key={participant}
                        justify="space-between"
                        p={3}
                        borderRadius="xl"
                        bg="whiteAlpha.50"
                      >
                        <Text color="ink.200" fontSize="sm">
                          {participant}
                        </Text>
                        <Box
                          boxSize={2}
                          borderRadius="full"
                          bg={
                            index === 2 ? "signal.blue" : "signal.green"
                          }
                        />
                      </HStack>
                    ),
                  )}
                </VStack>
              </GlassPanel>
            </Box>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <VStack spacing={4} textAlign="center" mb={10}>
              <Text textStyle="eyebrow">Feito para o ritmo do time</Text>
              <Heading as="h2" size="2xl">
                Planning Poker sem atrito
              </Heading>
              <Text color="ink.300" maxW="2xl" fontSize="lg">
                Uma experiência leve para sprint planning, refinamentos e
                estimativas remotas.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {benefits.map((benefit) => (
                <GlassPanel key={benefit.title} p={{ base: 6, md: 7 }}>
                  <Box
                    display="grid"
                    placeItems="center"
                    boxSize={12}
                    borderRadius="xl"
                    bg="whiteAlpha.100"
                    mb={5}
                  >
                    <Icon as={benefit.icon} color={benefit.color} boxSize={5} />
                  </Box>
                  <Heading as="h3" size="md">
                    {benefit.title}
                  </Heading>
                  <Text color="ink.300" mt={3} lineHeight="1.75">
                    {benefit.description}
                  </Text>
                </GlassPanel>
              ))}
            </SimpleGrid>
          </Box>

          <Grid
            as="section"
            py={{ base: 14, md: 24 }}
            templateColumns={{ base: "1fr", lg: "0.8fr 1.2fr" }}
            gap={{ base: 10, lg: 16 }}
          >
            <Box>
              <Text textStyle="eyebrow">Como funciona</Text>
              <Heading as="h2" size="2xl" mt={3}>
                Da criação ao consenso em quatro passos
              </Heading>
              <Text color="ink.300" mt={5} fontSize="lg" lineHeight="1.75">
                O fluxo foi desenhado para manter a atenção na história em
                discussão — não na ferramenta.
              </Text>
            </Box>
            <VStack spacing={3} align="stretch">
              {steps.map((step) => (
                <GlassPanel
                  key={step.number}
                  p={5}
                  display="grid"
                  gridTemplateColumns="auto 1fr"
                  gap={4}
                  alignItems="start"
                >
                  <Text
                    color="brand.200"
                    fontWeight="900"
                    letterSpacing="0.08em"
                  >
                    {step.number}
                  </Text>
                  <Box>
                    <Heading as="h3" size="sm">
                      {step.title}
                    </Heading>
                    <Text color="ink.300" mt={2} lineHeight="1.7">
                      {step.description}
                    </Text>
                  </Box>
                </GlassPanel>
              ))}
            </VStack>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <GlassPanel
              strength="strong"
              p={{ base: 7, md: 12 }}
              overflow="hidden"
              position="relative"
            >
              <Flex
                position="absolute"
                inset="-40% auto auto 58%"
                w="360px"
                h="360px"
                borderRadius="full"
                bg="brand.500"
                opacity={0.16}
                filter="blur(70px)"
                pointerEvents="none"
              />
              <Stack
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
                align={{ base: "flex-start", lg: "center" }}
                spacing={8}
                position="relative"
              >
                <Box maxW="2xl">
                  <HStack spacing={2} color="signal.cyan" mb={4}>
                    <Icon as={FiLink} />
                    <Text textStyle="eyebrow" color="signal.cyan">
                      Convite por link
                    </Text>
                  </HStack>
                  <Heading as="h2" size="xl">
                    Sua próxima estimativa começa agora
                  </Heading>
                  <Text color="ink.300" mt={3} fontSize="lg">
                    Crie uma sala, envie o link e deixe o Battle Poker cuidar da
                    revelação simultânea.
                  </Text>
                </Box>
                <CreateRoomButton
                  label="Começar gratuitamente"
                  flexShrink={0}
                  w={{ base: "full", lg: "auto" }}
                />
              </Stack>
            </GlassPanel>
          </Box>

          <VStack
            as="section"
            py={{ base: 14, md: 20 }}
            spacing={8}
            textAlign="center"
          >
            <Box>
              <Text textStyle="eyebrow">Aprenda mais</Text>
              <Heading as="h2" size="xl" mt={3}>
                Planning Poker para equipes ágeis
              </Heading>
              <Text color="ink.300" mt={4} maxW="3xl">
                Planning Poker é uma técnica de estimativa baseada em consenso.
                Cada pessoa escolhe uma carta em segredo e todas são reveladas
                ao mesmo tempo, reduzindo o viés de ancoragem.
              </Text>
            </Box>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
              <Button
                as={Link}
                href="/o-que-e-planning-poker"
                variant="glass"
                size="lg"
              >
                Guia completo
              </Button>
              <Button as={Link} href="/faq" variant="subtle" size="lg">
                Perguntas frequentes
              </Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Box
        as="footer"
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
        py={8}
      >
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            spacing={3}
            color="ink.400"
            fontSize="sm"
          >
            <Text>Battle Poker — Planning Poker online gratuito.</Text>
            <HStack spacing={4}>
              <Link href="/o-que-e-planning-poker">Guia</Link>
              <Link href="/faq">FAQ</Link>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </AppShell>
  );
}

function RoundPreviewStatus() {
  return (
    <HStack spacing={2}>
      <Box
        boxSize={2.5}
        borderRadius="full"
        bg="signal.indigo"
        boxShadow="0 0 18px rgba(155, 138, 251, 0.55)"
      />
      <Text color="ink.100" fontSize="sm" fontWeight="800">
        Votos secretos
      </Text>
      <Icon as={FiEyeOff} color="ink.400" />
    </HStack>
  );
}
