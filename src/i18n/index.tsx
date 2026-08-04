"use client";

import { Button, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useTransition, type ReactNode } from "react";

import en from "@/messages/en.json";
import ptBR from "@/messages/pt-BR.json";

export type Locale = "pt-BR" | "en";
type Messages = typeof ptBR;
type TranslationValues = Record<string, string | number>;
const dictionaries: Record<Locale, Messages> = { "pt-BR": ptBR, en };
const LocaleContext = createContext<Locale>("pt-BR");
const MessagesContext = createContext<Messages>(ptBR);

export function getLocaleFromPath(pathname: string): Locale { return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-BR"; }
export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = getLocaleFromPath(usePathname());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleContext.Provider value={locale}>
      <MessagesContext.Provider value={dictionaries[locale]}>
        {children}
      </MessagesContext.Provider>
    </LocaleContext.Provider>
  );
}
export function useLocale(): Locale { return useContext(LocaleContext); }
export function useTranslations(namespace: keyof Messages) {
  const dictionary = useContext(MessagesContext)[namespace] as Record<string, unknown>;
  const translate = (key: string, values?: TranslationValues) => {
    const message = key.split(".").reduce<unknown>((entry, segment) => (entry as Record<string, unknown>)?.[segment], dictionary);
    if (typeof message !== "string") return key;
    return Object.entries(values ?? {}).reduce((result, [name, value]) => result.replaceAll(`{${name}}`, String(value)), message);
  };
  translate.raw = (key: string) =>
    key.split(".").reduce<unknown>(
      (entry, segment) => (entry as Record<string, unknown>)?.[segment],
      dictionary,
    );
  return translate;
}
export function LanguageSwitcher({
  size = "sm",
  localeHrefs,
}: {
  size?: "sm" | "md";
  localeHrefs?: Partial<Record<Locale, string>>;
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      const mappedHref = localeHrefs?.[nextLocale];
      router.push(mappedHref ?? (nextLocale === "en" ? (pathname === "/" ? "/en" : `/en${pathname}`) : (pathname === "/en" ? "/" : pathname.slice(3) || "/")));
    });
  }

  return <Menu closeOnSelect={!isPending}><MenuButton as={Button} size={size} variant="subtle" aria-label={t("ariaLabel")} isLoading={isPending} loadingText="">{locale === "en" ? "EN" : "PT"}</MenuButton><Portal><MenuList zIndex="dropdown" bg="canvas.800" borderColor="whiteAlpha.200"><MenuItem bg="transparent" onClick={() => switchLocale("pt-BR")} isDisabled={locale === "pt-BR" || isPending}>{t("portuguese")}</MenuItem><MenuItem bg="transparent" onClick={() => switchLocale("en")} isDisabled={locale === "en" || isPending}>{t("english")}</MenuItem></MenuList></Portal></Menu>;
}
