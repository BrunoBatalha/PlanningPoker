import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";
import {
  getArticleAlternates,
  getPublishedArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles";

type PagePair = {
  portuguese: string;
  english: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

const pagePairs: PagePair[] = [
  { portuguese: "", english: "/en", changeFrequency: "weekly", priority: 1 },
  {
    portuguese: "/o-que-e-planning-poker",
    english: "/en/what-is-planning-poker",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { portuguese: "/faq", english: "/en/faq", changeFrequency: "monthly", priority: 0.8 },
  { portuguese: "/artigos", english: "/en/articles", changeFrequency: "weekly", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = pagePairs.flatMap(({ portuguese, english, changeFrequency, priority }) => {
    const languages = {
      "pt-BR": `${SITE_URL}${portuguese}`,
      en: `${SITE_URL}${english}`,
      "x-default": `${SITE_URL}${portuguese}`,
    };

    return [
      {
        url: `${SITE_URL}${portuguese}`,
        changeFrequency,
        priority,
        alternates: { languages },
      },
      {
        url: `${SITE_URL}${english}`,
        changeFrequency,
        priority,
        alternates: { languages },
      },
    ];
  });

  const articles = (["pt-BR", "en"] as const).flatMap((locale) =>
    getPublishedArticles(locale).flatMap((summary) => {
      const article = getPublishedArticleBySlug(locale, summary.slug);
      if (!article) return [];
      const alternates = getArticleAlternates(article);
      if (!alternates) return [];
      const path = locale === "en" ? alternates.en : alternates["pt-BR"];
      if (!path) return [];
      const languages = {
        ...(alternates["pt-BR"]
          ? { "pt-BR": `${SITE_URL}${alternates["pt-BR"]}` }
          : {}),
        ...(alternates.en ? { en: `${SITE_URL}${alternates.en}` } : {}),
        ...(alternates["pt-BR"]
          ? { "x-default": `${SITE_URL}${alternates["pt-BR"]}` }
          : {}),
      };

      return [{
        url: `${SITE_URL}${path}`,
        lastModified: article.updatedAt ?? article.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages },
      }];
    }),
  );

  return [...staticPages, ...articles];
}
