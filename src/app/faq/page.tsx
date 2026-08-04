import type { Metadata } from "next";

import FAQPage from "./FAQPage";
import { createLocalizedMetadata, createPublicPageSchemas } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = createLocalizedMetadata({ locale: "pt-BR", page: "faq" });

export default function FAQ() {
  return <><StructuredData schemas={createPublicPageSchemas("pt-BR", "faq")} /><FAQPage /></>;
}
