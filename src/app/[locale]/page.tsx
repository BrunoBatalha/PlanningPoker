import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HomePage from "@/app/HomePage";
import { StructuredData } from "@/components/StructuredData";
import { createLocalizedMetadata, createPublicPageSchemas } from "@/lib/seo";
import { defaultLocale, getLocaleByPrefix, localeDefinitions } from "@/lib/locale-routing";

type LocalePageProps = { params: { locale: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return localeDefinitions
    .filter((definition) => definition.id !== defaultLocale)
    .map((definition) => ({ locale: definition.urlPrefix }));
}

function resolveLocale(prefix: string) {
  const locale = getLocaleByPrefix(prefix);
  if (!locale || locale === defaultLocale) notFound();
  return locale;
}

export function generateMetadata({ params }: LocalePageProps): Metadata {
  return createLocalizedMetadata({ locale: resolveLocale(params.locale), page: "home" });
}

export default function LocalizedHome({ params }: LocalePageProps) {
  const locale = resolveLocale(params.locale);
  return <><StructuredData schemas={createPublicPageSchemas(locale, "home")} /><HomePage /></>;
}
