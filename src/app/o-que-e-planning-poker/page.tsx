import type { Metadata } from "next";

import WhatIsPlanningPokerPage from "./WhatIsPlanningPokerPage";
import { createLocalizedMetadata, createPublicPageSchemas } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";

export const metadata: Metadata = createLocalizedMetadata({ locale: "pt-BR", page: "guide", type: "article" });

export default function Page() {
  return (
    <>
      <StructuredData schemas={createPublicPageSchemas("pt-BR", "guide")} />
      <WhatIsPlanningPokerPage />
    </>
  );
}
