"use client";

import { Box, Heading, HStack, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import type { ArticleSummary } from "@/lib/articles";
import { getLocaleDefinition } from "@/lib/locale-routing";
import { useTranslations } from "@/i18n";

export function ArticleCard({ article, href }: { article: ArticleSummary; href: string }) {
  const t = useTranslations("articles");
  const formattedDate = new Intl.DateTimeFormat(getLocaleDefinition(article.locale).languageTag, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${article.publishedAt}T00:00:00.000Z`));

  return (
    <LinkBox
      as="article"
      overflow="hidden"
      border="1px solid"
      borderColor="whiteAlpha.200"
      borderRadius="3xl"
      bg="canvas.800"
      boxShadow="glass"
      transition="transform 180ms ease, border-color 180ms ease"
      _hover={{ transform: "translateY(-4px)", borderColor: "brand.300" }}
    >
      <Box position="relative" aspectRatio={16 / 9} overflow="hidden">
        <Image
          src={article.coverImage}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box p={{ base: 5, md: 6 }}>
        <HStack color="ink.400" textStyle="caption" spacing={2} mb={3} flexWrap="wrap">
          <Text as="time" dateTime={article.publishedAt}>{formattedDate}</Text>
          <Text aria-hidden="true">·</Text>
          <Text>{t("readingTime", { minutes: article.readingTime })}</Text>
        </HStack>
        <Heading as="h2" textStyle="h3">
          <LinkOverlay as={Link} href={href}>{article.title}</LinkOverlay>
        </Heading>
        <Text color="ink.300" mt={3} noOfLines={3}>{article.description}</Text>
        <Text color="brand.200" mt={5} fontWeight="700">{t("readArticle")} →</Text>
      </Box>
    </LinkBox>
  );
}
