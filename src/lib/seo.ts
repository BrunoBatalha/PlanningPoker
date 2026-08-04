import type { Metadata } from "next";
import type { ArticleRecord } from "@/lib/articles";

export const SITE_URL = "https://planningpoker.devnabatalha.com";

const SOCIAL_IMAGE = {
  url: `${SITE_URL}/logo.png`,
  width: 1024,
  height: 1024,
  alt: "Battle Poker",
};

type LocalizedMetadataInput = {
  title: string;
  description: string;
  canonicalPath: string;
  portuguesePath: string;
  englishPath: string;
  locale: "pt_BR" | "en_US";
  type?: "website" | "article";
};

export function createLocalizedMetadata({
  title,
  description,
  canonicalPath,
  portuguesePath,
  englishPath,
  locale,
  type = "website",
}: LocalizedMetadataInput): Metadata {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const portugueseUrl = `${SITE_URL}${portuguesePath}`;
  const englishUrl = `${SITE_URL}${englishPath}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "pt-BR": portugueseUrl,
        en: englishUrl,
        "x-default": portugueseUrl,
      },
    },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: "Battle Poker",
      locale,
      alternateLocale: locale === "pt_BR" ? ["en_US"] : ["pt_BR"],
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

type ArticleMetadataInput = {
  article: ArticleRecord;
  canonicalPath: string;
  portuguesePath?: string;
  englishPath?: string;
};

export function createArticleMetadata({
  article,
  canonicalPath,
  portuguesePath,
  englishPath,
}: ArticleMetadataInput): Metadata {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const image = `${SITE_URL}${article.socialImage}`;
  const languages = {
    ...(portuguesePath ? { "pt-BR": `${SITE_URL}${portuguesePath}` } : {}),
    ...(englishPath ? { en: `${SITE_URL}${englishPath}` } : {}),
    ...(portuguesePath ? { "x-default": `${SITE_URL}${portuguesePath}` } : {}),
  };

  return {
    title: `${article.title} | Battle Poker`,
    description: article.description,
    authors: [{ name: article.author, url: SITE_URL }],
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: canonical,
      siteName: "Battle Poker",
      locale: article.locale === "en" ? "en_US" : "pt_BR",
      ...(article.locale === "en" && portuguesePath
        ? { alternateLocale: ["pt_BR"] }
        : article.locale === "pt-BR" && englishPath
          ? { alternateLocale: ["en_US"] }
          : {}),
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
  indexPath,
}: {
  article: ArticleRecord;
  canonicalPath: string;
  indexPath: string;
}) {
  const canonical = `${SITE_URL}${canonicalPath}`;
  const indexUrl = `${SITE_URL}${indexPath}`;
  const homeUrl = article.locale === "en" ? `${SITE_URL}/en` : SITE_URL;
  const homeLabel = article.locale === "en" ? "Home" : "Inicio";
  const indexLabel = article.locale === "en" ? "Articles" : "Artigos";

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.description,
      image: `${SITE_URL}${article.coverImage}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt ?? article.publishedAt,
      inLanguage: article.locale,
      mainEntityOfPage: canonical,
      author: { "@type": "Organization", name: article.author, url: SITE_URL },
      publisher: {
        "@type": "Organization",
        name: "Battle Poker",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 1024,
          height: 1024,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: homeLabel, item: homeUrl },
        { "@type": "ListItem", position: 2, name: indexLabel, item: indexUrl },
        { "@type": "ListItem", position: 3, name: article.title, item: canonical },
      ],
    },
  ];
}
