"use client";

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { ArticleSummary } from "@/lib/articles";
import type { Locale } from "@/i18n";
import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/GlassPanel";
import Header from "@/components/Header";
import { useTranslations } from "@/i18n";
import { ArticleCard } from "./ArticleCard";
import CreateRoomButton from "@/components/CreateRoomButton";

export function ArticleDetailPage({
  article,
  alternates,
  related,
  children,
}: {
  article: ArticleSummary;
  alternates: Partial<Record<Locale, string>>;
  related: ArticleSummary[];
  children: ReactNode;
}) {
  const t = useTranslations("articles");
  const indexHref = article.locale === "en" ? "/en/articles" : "/artigos";
  const homeHref = article.locale === "en" ? "/en" : "/";
  const articleHref = article.locale === "en" ? `/en/articles/${article.slug}` : `/artigos/${article.slug}`;
  const formatDate = (date: string) => new Intl.DateTimeFormat(article.locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));

  return (
    <AppShell>
      <Header localeHrefs={alternates} />
      <Box as="main">
        <Container maxW="5xl" px={{ base: 4, md: 6 }} py={{ base: 10, md: 16 }}>
          <Breadcrumb color="ink.300" fontSize="sm" mb={8}>
            <BreadcrumbItem><BreadcrumbLink as={Link} href={homeHref}>{t("home")}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbItem><BreadcrumbLink as={Link} href={indexHref}>{t("breadcrumb")}</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbItem isCurrentPage><BreadcrumbLink href={articleHref} noOfLines={1}>{article.title}</BreadcrumbLink></BreadcrumbItem>
          </Breadcrumb>

          <VStack align="flex-start" spacing={5} maxW="4xl">
            <Text textStyle="eyebrow">{t("eyebrow")}</Text>
            <Heading as="h1" textStyle="h1">{article.title}</Heading>
            <Text color="ink.300" textStyle="body-lg">{article.description}</Text>
            <HStack color="ink.400" textStyle="body-sm" spacing={2} flexWrap="wrap">
              <Text>{t("authorBy", { author: article.author })}</Text>
              <Text aria-hidden="true">·</Text>
              <Text as="time" dateTime={article.publishedAt}>{t("publishedOn", { date: formatDate(article.publishedAt) })}</Text>
              {article.updatedAt && article.updatedAt !== article.publishedAt ? (
                <><Text aria-hidden="true">·</Text><Text as="time" dateTime={article.updatedAt}>{t("updatedOn", { date: formatDate(article.updatedAt) })}</Text></>
              ) : null}
              <Text aria-hidden="true">·</Text>
              <Text>{t("readingTime", { minutes: article.readingTime })}</Text>
            </HStack>
          </VStack>

          <Box position="relative" aspectRatio={16 / 9} overflow="hidden" borderRadius="3xl" mt={{ base: 8, md: 12 }} boxShadow="glassStrong">
            <Image src={article.coverImage} alt={article.coverAlt} fill priority sizes="(max-width: 1024px) 100vw, 960px" style={{ objectFit: "cover" }} />
          </Box>

          <Box as="article" maxW="3xl" mx="auto" py={{ base: 10, md: 16 }}>
            {children}
          </Box>

          <GlassPanel strength="strong" p={{ base: 7, md: 10 }}>
            <Stack direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "flex-start", md: "center" }} spacing={6}>
              <Box maxW="2xl">
                <Heading as="h2" textStyle="h3">{article.ctaTitle}</Heading>
                <Text color="ink.300" mt={2}>{article.ctaDescription}</Text>
              </Box>
              <CreateRoomButton label={article.ctaButton} flexShrink={0} />
            </Stack>
          </GlassPanel>

          {related.length > 0 ? (
            <Box as="section" pt={{ base: 14, md: 20 }} aria-labelledby="related-articles-title">
              <Text textStyle="eyebrow">{t("relatedEyebrow")}</Text>
              <Heading id="related-articles-title" as="h2" textStyle="h2" mt={3} mb={8}>{t("relatedTitle")}</Heading>
              <SimpleGrid columns={{ base: 1, md: related.length === 1 ? 1 : 2, lg: 3 }} spacing={6}>
                {related.map((candidate) => (
                  <ArticleCard
                    key={candidate.id}
                    article={candidate}
                    href={article.locale === "en" ? `/en/articles/${candidate.slug}` : `/artigos/${candidate.slug}`}
                  />
                ))}
              </SimpleGrid>
            </Box>
          ) : null}
        </Container>
      </Box>
      <Box as="footer" borderTop="1px solid" borderColor="whiteAlpha.100" py={8}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }} color="ink.300" textStyle="body-sm">{t("footer")}</Container>
      </Box>
    </AppShell>
  );
}
