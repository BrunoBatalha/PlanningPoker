import catalog0 from "@/locales/en.json";
import catalog1 from "@/locales/pt-BR.json";

import type { LocaleCatalog } from "@/lib/locale-types";

export const localeIds = ["en","pt-BR"] as const;
export type Locale = (typeof localeIds)[number];
export const defaultLocale = "pt-BR" as Locale;
export const localeCatalogs = {
  "en": catalog0,
  "pt-BR": catalog1,
} as unknown as Record<Locale, LocaleCatalog>;
