import type { MetadataRoute } from "next";

import {
  getArticleAlternates,
  getPublishedArticleBySlug,
  getPublishedArticles,
} from "@/lib/articles";
import {
  defaultLocale,
  getLocalizedPath,
  getPageAlternates,
  locales,
} from "@/lib/locale-routing";
import type { PublicPageKey } from "@/lib/locale-types";
import { SITE_URL } from "@/lib/seo";

const pageSettings: Record<PublicPageKey, {
  changeFrequency: "weekly" | "monthly";
  priority: number;
}> = {
  home: { changeFrequency: "weekly", priority: 1 },
  guide: { changeFrequency: "monthly", priority: 0.9 },
  faq: { changeFrequency: "monthly", priority: 0.8 },
  articles: { changeFrequency: "weekly", priority: 0.8 },
};

function absolute(path: string) {
  return `${SITE_URL}${path}`;
}

function languageUrls(paths: Record<string, string>) {
  return {
    ...Object.fromEntries(Object.entries(paths).map(([locale, path]) => [locale, absolute(path)])),
    ...(paths[defaultLocale] !== undefined ? { "x-default": absolute(paths[defaultLocale]) } : {}),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = (Object.keys(pageSettings) as PublicPageKey[]).flatMap((page) => {
    const settings = pageSettings[page];
    const alternates = getPageAlternates(page);
    const languages = languageUrls(alternates);
    return locales.map((locale) => ({
      url: absolute(getLocalizedPath(locale, page)),
      ...settings,
      alternates: { languages },
    }));
  });

  const articles = locales.flatMap((locale) =>
    getPublishedArticles(locale).flatMap((summary) => {
      const article = getPublishedArticleBySlug(locale, summary.slug);
      if (!article) return [];
      const alternates = getArticleAlternates(article);
      if (!alternates) return [];
      const path = alternates[locale];
      if (!path) return [];
      const languagePaths = Object.fromEntries(
        Object.entries(alternates).filter((entry): entry is [string, string] => Boolean(entry[1])),
      );
      return [{
        url: absolute(path),
        lastModified: article.updatedAt ?? article.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages: languageUrls(languagePaths) },
      }];
    }),
  );

  return [...staticPages, ...articles];
}
