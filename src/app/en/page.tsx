import type { Metadata } from "next";

import HomePage from "../HomePage";
import { createLocalizedMetadata, SITE_URL } from "@/lib/seo";

const title = "Battle Poker | Free Online Planning Poker";
const description =
  "Free online Planning Poker for agile teams. Create a room, share the link and reveal estimates simultaneously, with no sign-up.";

export const metadata: Metadata = createLocalizedMetadata({
  title,
  description,
  canonicalPath: "/en",
  portuguesePath: "",
  englishPath: "/en",
  locale: "en_US",
});

const schema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Battle Poker",
  url: `${SITE_URL}/en`,
  description,
  inLanguage: "en",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Shareable rooms",
    "Real-time voting",
    "Simultaneous card reveal",
    "Vote average and distribution",
    "No sign-up",
  ],
};

export default function EnglishHome() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <HomePage />
    </>
  );
}
