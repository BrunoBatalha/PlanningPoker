import type { Metadata } from "next";

import WhatIsPlanningPokerPage from "../../o-que-e-planning-poker/WhatIsPlanningPokerPage";
import { createLocalizedMetadata, SITE_URL } from "@/lib/seo";

const title = "What Is Planning Poker? Complete Guide | Battle Poker";
const description =
  "Learn what Planning Poker is, how it works, its benefits and how Scrum teams estimate user stories and reach consensus.";
export const metadata: Metadata = createLocalizedMetadata({
  title,
  description,
  canonicalPath: "/en/what-is-planning-poker",
  portuguesePath: "/o-que-e-planning-poker",
  englishPath: "/en/what-is-planning-poker",
  locale: "en_US",
  type: "article",
});

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    inLanguage: "en",
    mainEntityOfPage: `${SITE_URL}/en/what-is-planning-poker`,
    author: { "@type": "Organization", name: "Battle Poker" },
    publisher: {
      "@type": "Organization",
      name: "Battle Poker",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png`, width: 1024, height: 1024 },
    },
    image: `${SITE_URL}/logo.png`,
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "What is Planning Poker", item: `${SITE_URL}/en/what-is-planning-poker` },
    ],
  },
];

export default function EnglishGuide() {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <WhatIsPlanningPokerPage />
    </>
  );
}
