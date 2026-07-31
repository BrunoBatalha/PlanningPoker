import type { Metadata } from "next";

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
