"use client";

import { Button, Menu, MenuButton, MenuItem, MenuList, Portal } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";

import type { Locale } from "@/generated/locale-catalogs";
import { getLocaleDefinition, localeDefinitions } from "@/lib/locale-routing";
import type { LocaleCatalog } from "@/lib/locale-types";

type Messages = Record<string, unknown>;
type TranslationValues = Record<string, string | number>;

const LocaleContext = createContext<Locale | null>(null);
const MessagesContext = createContext<Messages | null>(null);
const ContentContext = createContext<Pick<LocaleCatalog, "guide" | "faq"> | null>(null);

export type { Locale } from "@/generated/locale-catalogs";

export function LanguageProvider({
  children,
  locale,
  catalog,
}: {
  children: ReactNode;
  locale: Locale;
  catalog: LocaleCatalog;
}) {
  return (
    <LocaleContext.Provider value={locale}>
      <MessagesContext.Provider value={catalog.messages}>
        <ContentContext.Provider value={{ guide: catalog.guide, faq: catalog.faq }}>
          {children}
        </ContentContext.Provider>
      </MessagesContext.Provider>
    </LocaleContext.Provider>
  );
}

export function useLocaleContent() {
  const content = useContext(ContentContext);
  if (!content) throw new Error("useLocaleContent deve ser usado dentro de LanguageProvider");
  return content;
}

export function useLocale(): Locale {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error("useLocale deve ser usado dentro de LanguageProvider");
  return locale;
}

export function useTranslations(namespace: string) {
  const messages = useContext(MessagesContext);
  if (!messages) throw new Error("useTranslations deve ser usado dentro de LanguageProvider");
  const dictionary = messages[namespace] as Record<string, unknown> | undefined;
  const translate = (key: string, values?: TranslationValues) => {
    const message = key.split(".").reduce<unknown>(
      (entry, segment) => (entry as Record<string, unknown> | undefined)?.[segment],
      dictionary,
    );
    if (typeof message !== "string") return key;
    return Object.entries(values ?? {}).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      message,
    );
  };
  translate.raw = (key: string) =>
    key.split(".").reduce<unknown>(
      (entry, segment) => (entry as Record<string, unknown> | undefined)?.[segment],
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
  const t = useTranslations("language");
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      window.location.assign(localeHrefs?.[nextLocale] ?? pathname);
    });
  }

  return (
    <Menu closeOnSelect={!isPending}>
      <MenuButton
        as={Button}
        size={size}
        variant="subtle"
        aria-label={t("ariaLabel")}
        isLoading={isPending}
        loadingText=""
      >
        {getLocaleDefinition(locale).shortName}
      </MenuButton>
      <Portal>
        <MenuList zIndex="dropdown" bg="canvas.800" borderColor="whiteAlpha.200">
          {localeDefinitions.map((definition) => (
            <MenuItem
              key={definition.id}
              bg="transparent"
              onClick={() => switchLocale(definition.id)}
              isDisabled={definition.id === locale || isPending}
            >
              {definition.nativeName}
            </MenuItem>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
