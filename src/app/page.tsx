import type { Metadata } from "next";

import HomePage from "./HomePage";
import { createLocalizedMetadata, createPublicPageSchemas } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = createLocalizedMetadata({ locale: "pt-BR", page: "home" });

export default function Page() {
  return (
    <>
      <StructuredData schemas={createPublicPageSchemas("pt-BR", "home")} />
      <HomePage />
    </>
  );
}
