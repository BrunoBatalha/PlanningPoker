import type { Metadata } from "next";

import FAQPage from "./FAQPage";
import { createLocalizedMetadata } from "@/lib/seo";

export const metadata: Metadata = createLocalizedMetadata({
  title: "Perguntas Frequentes sobre Planning Poker | Battle Poker",
  description:
    "Respostas para as principais dúvidas sobre Planning Poker, estimativas Scrum, story points e uso da ferramenta online.",
  canonicalPath: "/faq",
  portuguesePath: "/faq",
  englishPath: "/en/faq",
  locale: "pt_BR",
});

export default function FAQ() {
  return <FAQPage />;
}
