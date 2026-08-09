import type { Metadata } from "next";

import type { ArticleRecord } from "@/lib/articles";
import type { Locale } from "@/generated/locale-catalogs";
import { getLocaleCatalog } from "@/i18n/server";
import {
  defaultLocale,
  getLocaleDefinition,
  getLocalizedPath,
  getPageAlternates,
  localeDefinitions,
} from "@/lib/locale-routing";
import type { PublicPageKey } from "@/lib/locale-types";

export const SITE_URL = "https://planningpoker.devnabatalha.com";

const SOCIAL_IMAGE = {
  url: `${SITE_URL}/logo.png`,
  width: 1024,
  height: 1024,
  alt: "Battle Poker",
};

function absoluteUrl(path: string) {
  return `${SITE_URL}${path}`;
}

function metadataLanguages(paths: Partial<Record<Locale, string>>) {
  return {
    ...Object.fromEntries(Object.entries(paths).map(([locale, path]) => [locale, absoluteUrl(path)])),
    ...(paths[defaultLocale] !== undefined ? { "x-default": absoluteUrl(paths[defaultLocale]!) } : {}),
  };
}

export function createLocalizedMetadata({
  locale,
  page,
  type = "website",
}: {
  locale: Locale;
  page: PublicPageKey;
  type?: "website" | "article";
}): Metadata {
  const catalog = getLocaleCatalog(locale);
  const seo = catalog.seo[page];
  const canonicalPath = getLocalizedPath(locale, page);
  const canonical = absoluteUrl(canonicalPath);
  const definition = getLocaleDefinition(locale);

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: metadataLanguages(getPageAlternates(page)),
    },
    openGraph: {
      type,
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: "Battle Poker",
      locale: definition.openGraphLocale,
      alternateLocale: localeDefinitions
        .filter((candidate) => candidate.id !== locale)
        .map((candidate) => candidate.openGraphLocale),
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [SOCIAL_IMAGE.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function createPublicPageSchemas(locale: Locale, page: Exclude<PublicPageKey, "articles">) {
  const catalog = getLocaleCatalog(locale);
  const definition = getLocaleDefinition(locale);
  const canonicalPath = getLocalizedPath(locale, page);
  const canonical = absoluteUrl(canonicalPath);
  const homeUrl = absoluteUrl(getLocalizedPath(locale, "home"));

  if (page === "home") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Battle Poker",
        alternateName: "Planning Poker Online",
        url: SITE_URL,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Battle Poker",
        url: canonical,
        description: catalog.seo.home.description,
        inLanguage: definition.languageTag,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web Browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: catalog.seo.home.priceCurrency },
        featureList: catalog.seo.home.featureList,
      },
    ];
  }

  const pageSeo = catalog.seo[page];
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: catalog.messages.header && (catalog.messages.header as Record<string, string>).homeAria, item: homeUrl },
      { "@type": "ListItem", position: 2, name: pageSeo.breadcrumbLabel, item: canonical },
    ],
  };

  if (page === "faq") {
    return [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: definition.languageTag,
      mainEntity: catalog.faq.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    }, breadcrumb];
  }

  return [{
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pageSeo.title,
    description: pageSeo.description,
    inLanguage: definition.languageTag,
    mainEntityOfPage: canonical,
    author: { "@type": "Organization", name: "Battle Poker", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Battle Poker",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 1024, height: 1024 },
    },
    image: `${SITE_URL}/logo.png`,
  }, breadcrumb];
}

export function createArticleMetadata({
  article,
  canonicalPath,
  alternates,
}: {
  article: ArticleRecord;
  canonicalPath: string;
  alternates: Partial<Record<Locale, string>>;
}): Metadata {
  const canonical = absoluteUrl(canonicalPath);
  const image = absoluteUrl(article.socialImage);
  const definition = getLocaleDefinition(article.locale);
  const alternateLocale = localeDefinitions
    .filter((candidate) => candidate.id !== article.locale && alternates[candidate.id])
    .map((candidate) => candidate.openGraphLocale);

  return {
    title: `${article.title} | Battle Poker`,
    description: article.description,
    authors: [{ name: article.author, url: SITE_URL }],
    alternates: { canonical, languages: metadataLanguages(alternates) },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: "Battle Poker",
      locale: definition.openGraphLocale,
      ...(alternateLocale.length ? { alternateLocale } : {}),
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      authors: [article.author],
      images: [{ url: image, alt: article.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function createArticleSchemas({
  article,
  canonicalPath,
}: {
  article: ArticleRecord;
  canonicalPath: string;
}) {
  const canonical = absoluteUrl(canonicalPath);
  const catalog = getLocaleCatalog(article.locale);
  const definition = getLocaleDefinition(article.locale);
  const indexUrl = absoluteUrl(getLocalizedPath(article.locale, "articles"));
  const homeUrl = absoluteUrl(getLocalizedPath(article.locale, "home"));
  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: absoluteUrl(article.coverImage),
      datePublished: article.publishedAt,
      dateModified: article.updatedAt ?? article.publishedAt,
      inLanguage: definition.languageTag,
      mainEntityOfPage: canonical,
      author: { "@type": "Organization", name: article.author, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Battle Poker",
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 1024, height: 1024 },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: (catalog.messages.articles as Record<string, string>).home, item: homeUrl },
        { "@type": "ListItem", position: 2, name: catalog.seo.articles.breadcrumbLabel, item: indexUrl },
        { "@type": "ListItem", position: 3, name: article.title, item: canonical },
      ],
    },
  ];
}
