import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FAQPage from "@/app/faq/FAQPage";
import WhatIsPlanningPokerPage from "@/app/o-que-e-planning-poker/WhatIsPlanningPokerPage";
import { ArticlesIndexPage } from "@/components/Articles/ArticlesIndexPage";
import { StructuredData } from "@/components/StructuredData";
import { getPublishedArticles } from "@/lib/articles";
import {
  defaultLocale,
  getLocaleByPrefix,
  getLocaleRoutes,
  getPageBySegment,
  localeDefinitions,
} from "@/lib/locale-routing";
import { createLocalizedMetadata, createPublicPageSchemas } from "@/lib/seo";

type LocalizedSectionProps = { params: { locale: string; section: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return localeDefinitions
    .filter((definition) => definition.id !== defaultLocale)
    .flatMap((definition) => Object.values(getLocaleRoutes(definition.id)).map((section) => ({
      locale: definition.urlPrefix,
      section,
    })));
}

function resolveParams(params: LocalizedSectionProps["params"]) {
  const locale = getLocaleByPrefix(params.locale);
  if (!locale || locale === defaultLocale) notFound();
  const page = getPageBySegment(locale, params.section);
  if (!page) notFound();
  return { locale, page };
}

export function generateMetadata({ params }: LocalizedSectionProps): Metadata {
  const { locale, page } = resolveParams(params);
  return createLocalizedMetadata({ locale, page, type: page === "guide" ? "article" : "website" });
}

export default function LocalizedSection({ params }: LocalizedSectionProps) {
  const { locale, page } = resolveParams(params);
  if (page === "articles") return <ArticlesIndexPage locale={locale} articles={getPublishedArticles(locale)} />;
  if (page === "faq") return <><StructuredData schemas={createPublicPageSchemas(locale, "faq")} /><FAQPage /></>;
  return <><StructuredData schemas={createPublicPageSchemas(locale, "guide")} /><WhatIsPlanningPokerPage /></>;
}
