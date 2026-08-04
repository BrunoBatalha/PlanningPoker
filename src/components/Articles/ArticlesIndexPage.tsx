"use client";

import { Box, Button, Container, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

import type { ArticleLocale, ArticleSummary } from "@/lib/articles";
import { AppShell } from "@/components/AppShell";
import { GlassPanel } from "@/components/GlassPanel";
import Header from "@/components/Header";
import { useTranslations } from "@/i18n";
import { ArticleCard } from "./ArticleCard";
import { getArticlePath, getLocalizedHref, getPageAlternates } from "@/lib/locale-routing";

export function ArticlesIndexPage({
  articles,
  locale,
}: {
  articles: ArticleSummary[];
  locale: ArticleLocale;
}) {
  const t = useTranslations("articles");
  const guideHref = getLocalizedHref(locale, "guide");

  return (
    <AppShell>
      <Header localeHrefs={getPageAlternates("articles")} />
      <Box as="main">
        <Container maxW="7xl" px={{ base: 4, md: 6 }} py={{ base: 14, md: 20 }}>
          <VStack align="flex-start" spacing={4} maxW="3xl" mb={{ base: 10, md: 14 }}>
            <Text textStyle="eyebrow">{t("eyebrow")}</Text>
            <Heading as="h1" textStyle="h1">{t("indexTitle")}</Heading>
            <Text color="ink.300" textStyle="body-lg">{t("indexDescription")}</Text>
          </VStack>

          {articles.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  href={getArticlePath(locale, article.slug)}
                />
              ))}
            </SimpleGrid>
          ) : (
            <GlassPanel strength="strong" p={{ base: 7, md: 10 }} textAlign="center">
              <Heading as="h2" textStyle="h3">{t("emptyTitle")}</Heading>
              <Text color="ink.300" mt={3} maxW="2xl" mx="auto">{t("emptyDescription")}</Text>
              <Button as={Link} href={guideHref} variant="premium" mt={6}>{t("readGuide")}</Button>
            </GlassPanel>
          )}
        </Container>
      </Box>
      <Box as="footer" borderTop="1px solid" borderColor="whiteAlpha.100" py={8}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }} color="ink.300" textStyle="body-sm">
          {t("footer")}
        </Container>
      </Box>
    </AppShell>
  );
}
