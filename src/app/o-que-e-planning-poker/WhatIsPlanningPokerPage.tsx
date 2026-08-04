'use client'

import {
  Badge,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  OrderedList,
  SimpleGrid,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

import { AppShell, Header } from "@/components";
import { CheckCircleIcon, ChevronRightIcon } from "@/components/Icons";
import CreateRoomButton from "@/components/CreateRoomButton";
import { useLocale, useLocaleContent, useTranslations } from "@/i18n";
import { getLocalizedHref, getPageAlternates } from "@/lib/locale-routing";
import type portugueseCatalog from "@/locales/pt-BR.json";

type GuideContent = typeof portugueseCatalog.guide;

export default function WhatIsPlanningPokerPage() {
  const locale = useLocale();
  const content = useLocaleContent().guide as GuideContent;
  const t = useTranslations("guidePage");

  return (
    <AppShell>
      <Header localeHrefs={getPageAlternates("guide")} />
      <Box as="main">
        <Container maxW="4xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="ink.400" />}
            mb={8}
            textStyle="body-sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href={getLocalizedHref(locale, "home")} color="brand.200">
                {t("home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="ink.400">{t("breadcrumb")}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <VStack spacing={6} align="stretch" mb={12}>
            <Box>
              <Badge colorScheme="purple" mb={3}>{t("eyebrow")}</Badge>
              <Heading as="h1" textStyle="h1" mb={4}>{t("title")}</Heading>
              <Text textStyle="body-lg" color="ink.300" mb={6} maxW="70ch">{t("intro")}</Text>
              <CreateRoomButton label={t("createRoom")} />
            </Box>
          </VStack>

          <Card mb={10} bg="rgba(96, 165, 250, 0.08)" borderLeft="4px solid" borderLeftColor="signal.blue">
            <CardBody>
              <Heading as="h2" textStyle="h4" color="signal.blue" mb={3}>{t("tocTitle")}</Heading>
              <OrderedList spacing={2}>
                {[
                  ["#definition", t("definitionTitle")],
                  ["#how", t("howTitle")],
                  ["#fibonacci", t("fibonacciTitle")],
                  ["#benefits", t("benefitsTitle")],
                  ["#steps", t("stepsTitle")],
                  ["#cards", t("cardsTitle")],
                  ["#tips", t("tipsTitle")],
                  ["#tools", t("toolsTitle")],
                ].map(([href, label]) => (
                  <ListItem key={href}><Link href={href}>{label}</Link></ListItem>
                ))}
              </OrderedList>
            </CardBody>
          </Card>

          <VStack spacing={12} align="stretch">
            <Section id="definition" title={t("definitionTitle")}>
              {content.definition.map((paragraph) => (
                <Text key={paragraph} textStyle="body-lg" maxW="70ch">{paragraph}</Text>
              ))}
            </Section>

            <Section id="how" title={t("howTitle")}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                {content.howCards.map((item) => <InfoCard key={item.title} {...item} />)}
              </SimpleGrid>
              <OrderedList spacing={3} textStyle="body-lg" pl={5}>
                {content.process.map((item) => <ListItem key={item}>{item}</ListItem>)}
              </OrderedList>
            </Section>

            <Section id="fibonacci" title={t("fibonacciTitle")}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {content.fibonacci.map((item) => <InfoCard key={item.title} {...item} />)}
              </SimpleGrid>
            </Section>

            <Section id="benefits" title={t("benefitsTitle")}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {content.benefits.map((item) => (
                  <HStack key={item} align="start">
                    <CheckCircleIcon color="signal.green" mt={1} />
                    <Text>{item}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </Section>

            <Section id="steps" title={t("stepsTitle")}>
              <VStack spacing={4} align="stretch">
                {content.steps.map((item, index) => (
                  <Card key={item.title}>
                    <CardBody>
                      <HStack align="start" spacing={4}>
                        <Badge colorScheme="purple" fontSize="md" p={2}>{index + 1}</Badge>
                        <Box>
                          <Heading as="h3" textStyle="h3" mb={2}>{item.title}</Heading>
                          <Text color="ink.300">{item.text}</Text>
                        </Box>
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Section>

            <Section id="cards" title={t("cardsTitle")}>
              <Text textStyle="body-lg">{content.cardsIntro}</Text>
              <HStack spacing={2} flexWrap="wrap">
                {["0", "1", "2", "3", "5", "8", "13", "21"].map((value) => (
                  <Badge key={value} colorScheme="purple" p={3} fontSize="lg">{value}</Badge>
                ))}
              </HStack>
              <Heading as="h3" textStyle="h3">{t("interpretationTitle")}</Heading>
              <UnorderedList spacing={2}>
                {content.specialCards.map((item) => <ListItem key={item}>{item}</ListItem>)}
              </UnorderedList>
            </Section>

            <Section id="tips" title={t("tipsTitle")}>
              <List spacing={3}>
                {content.tips.map((item) => (
                  <ListItem key={item}>
                    <ListIcon as={CheckCircleIcon} color="signal.green" />
                    {item}
                  </ListItem>
                ))}
              </List>
            </Section>

            <Section id="tools" title={t("toolsTitle")}>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
                {content.tools.map((item) => <InfoCard key={item.title} {...item} />)}
              </SimpleGrid>
              <CreateRoomButton label={t("createRoom")} />
            </Section>

            <Section title={t("faqTitle")}>
              <VStack spacing={4} align="stretch">
                {content.faq.map((item) => <InfoCard key={item.question} title={item.question} text={item.answer} />)}
              </VStack>
            </Section>

            <Card bgGradient="linear(to-r, brand.600, #15658A)" color="white">
              <CardBody textAlign="center">
                <VStack spacing={4}>
                  <Heading as="h2" textStyle="h2">{t("finalTitle")}</Heading>
                  <Text textStyle="body-lg">{t("finalDescription")}</Text>
                  <HStack flexWrap="wrap" justify="center">
                    <CreateRoomButton label={t("createRoom")} />
                    <Button as={Link} href={getLocalizedHref(locale, "faq")} variant="outline">{t("faqButton")}</Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </AppShell>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <Box id={id}>
      <Heading as="h2" textStyle="h2" mb={6}>{title}</Heading>
      <VStack align="stretch" spacing={5}>{children}</VStack>
      <Divider mt={10} />
    </Box>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <Card>
      <CardBody>
        <Heading as="h3" textStyle="h3" mb={3}>{title}</Heading>
        <Text color="ink.300">{text}</Text>
      </CardBody>
    </Card>
  );
}
