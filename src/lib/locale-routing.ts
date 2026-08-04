import localeManifestSource from "@/generated/locale-manifest.json";
import type { Locale } from "@/generated/locale-catalogs";
import type {
  LocaleDefinition,
  LocaleManifest,
  PublicPageKey,
  RoutedPageKey,
} from "@/lib/locale-types";

const manifest = localeManifestSource as LocaleManifest;

export const locales = manifest.locales.map((definition) => definition.id) as Locale[];
export const defaultLocale = manifest.defaultLocale as Locale;
export const localeDefinitions = manifest.locales as Array<LocaleDefinition & { id: Locale }>;

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export function getLocaleDefinition(locale: Locale) {
  const definition = localeDefinitions.find((candidate) => candidate.id === locale);
  if (!definition) throw new Error(`Locale não configurado: ${locale}`);
  return definition;
}

export function getLocaleByPrefix(prefix: string) {
  return localeDefinitions.find((definition) => definition.urlPrefix === prefix)?.id;
}

export function getLocaleRoutes(locale: Locale) {
  const routes = manifest.routes[locale];
  if (!routes) throw new Error(`Rotas não configuradas para ${locale}`);
  return routes;
}

export function getPageBySegment(locale: Locale, segment: string) {
  const entry = Object.entries(getLocaleRoutes(locale)).find(([, value]) => value === segment);
  return entry?.[0] as RoutedPageKey | undefined;
}

export function getLocalizedPath(locale: Locale, page: PublicPageKey) {
  const definition = getLocaleDefinition(locale);
  return buildLocalizedPath(definition, getLocaleRoutes(locale), page);
}

export function buildLocalizedPath(
  definition: LocaleDefinition,
  routes: ReturnType<typeof getLocaleRoutes>,
  page: PublicPageKey,
) {
  const prefix = definition.urlPrefix ? `/${definition.urlPrefix}` : "";
  if (page === "home") return prefix;
  return `${prefix}/${routes[page as RoutedPageKey]}`;
}

export function getLocalizedHref(locale: Locale, page: PublicPageKey) {
  return getLocalizedPath(locale, page) || "/";
}

export function getArticlePath(locale: Locale, slug: string) {
  return `${getLocalizedPath(locale, "articles")}/${slug}`;
}

export function getPageAlternates(page: PublicPageKey) {
  return Object.fromEntries(locales.map((locale) => [locale, getLocalizedHref(locale, page)])) as Record<Locale, string>;
}

export function getLocaleFromPath(pathname: string) {
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  return getLocaleByPrefix(firstSegment) ?? defaultLocale;
}

export function matchAcceptedLanguage(header: string | null | undefined): Locale {
  return matchAcceptedLanguageFromDefinitions(header, localeDefinitions, defaultLocale) as Locale;
}

export function matchAcceptedLanguageFromDefinitions(
  header: string | null | undefined,
  definitions: Array<LocaleDefinition & { id: string }>,
  fallbackLocale: string,
) {
  if (!header) return fallbackLocale;
  const requested = header
    .split(",")
    .map((entry, index) => {
      const [tagPart, ...parameters] = entry.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number(qualityParameter.trim().slice(2)) : 1;
      return { tag: tagPart.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0, index };
    })
    .filter(({ tag, quality }) => tag && quality > 0 && tag !== "*")
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { tag } of requested) {
    const exact = definitions.find((definition) =>
      definition.id.toLowerCase() === tag || definition.languageTag.toLowerCase() === tag,
    );
    if (exact) return exact.id;
  }
  for (const { tag } of requested) {
    const language = tag.split("-")[0];
    const compatible = definitions.find((definition) =>
      definition.id.toLowerCase().split("-")[0] === language ||
      definition.languageTag.toLowerCase().split("-")[0] === language,
    );
    if (compatible) return compatible.id;
  }
  return fallbackLocale;
}

export function resolvePreferredLocale(cookieLocale: string | null | undefined, acceptLanguage: string | null | undefined): Locale {
  return isLocale(cookieLocale) ? cookieLocale : matchAcceptedLanguage(acceptLanguage);
}
