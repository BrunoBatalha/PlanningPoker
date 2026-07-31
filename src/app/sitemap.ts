import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/seo";

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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pagePairs.flatMap(({ portuguese, english, changeFrequency, priority }) => {
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
}
