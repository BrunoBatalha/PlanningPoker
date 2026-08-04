export const PUBLIC_PAGE_KEYS = ["home", "guide", "faq", "articles"] as const;

export type PublicPageKey = (typeof PUBLIC_PAGE_KEYS)[number];
export type RoutedPageKey = Exclude<PublicPageKey, "home">;

export type LocaleDefinition = {
  id: string;
  languageTag: string;
  openGraphLocale: string;
  urlPrefix: string;
  nativeName: string;
  shortName: string;
  default: boolean;
};

export type LocaleRoutes = Record<RoutedPageKey, string>;

export type PageSeo = {
  title: string;
  description: string;
  breadcrumbLabel: string;
};

export type HomeSeo = {
  title: string;
  description: string;
  priceCurrency: string;
  featureList: string[];
};

export type RoomSeo = {
  title: string;
  description: string;
  openGraphDescription: string;
};

export type FaqCategory = "basico" | "tecnico" | "metodologia" | "pratico";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
};

export type LocaleCatalog = {
  $locale: LocaleDefinition;
  routes: LocaleRoutes;
  seo: {
    home: HomeSeo;
    guide: PageSeo;
    faq: PageSeo;
    articles: PageSeo;
    room: RoomSeo;
  };
  messages: Record<string, unknown>;
  guide: Record<string, unknown>;
  faq: FaqItem[];
};

export type LocaleManifest = {
  defaultLocale: string;
  locales: LocaleDefinition[];
  routes: Record<string, LocaleRoutes>;
};
