import { localeCatalogs, type Locale } from "@/generated/locale-catalogs";

export function getLocaleCatalog(locale: Locale) {
  const catalog = localeCatalogs[locale];
  if (!catalog) throw new Error(`Catálogo não encontrado para ${locale}`);
  return catalog;
}
