import type { Metadata } from "next";

import FAQPage from "../../faq/FAQPage";
import { createLocalizedMetadata } from "@/lib/seo";

export const metadata: Metadata = createLocalizedMetadata({
  title: "Planning Poker FAQ | Battle Poker",
  description:
    "Answers to common questions about Planning Poker, Scrum estimation, story points and the free online tool.",
  canonicalPath: "/en/faq",
  portuguesePath: "/faq",
  englishPath: "/en/faq",
  locale: "en_US",
});

export default function EnglishFaq() {
  return <FAQPage />;
}
