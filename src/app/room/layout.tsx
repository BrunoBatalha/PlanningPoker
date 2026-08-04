import type { Metadata } from "next";
import { headers } from "next/headers";

import { getLocaleCatalog } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/lib/locale-routing";

export function generateMetadata(): Metadata {
  const requestedLocale = headers().get("x-battle-poker-locale");
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const catalog = getLocaleCatalog(locale);
  const seo = catalog.seo.room;

  return {
    title: seo.title,
    description: seo.description,
    robots: {
      index: false,
      follow: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
    openGraph: {
      title: seo.title,
      description: seo.openGraphDescription,
      locale: catalog.$locale.openGraphLocale,
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 300,
          height: 300,
          alt: "Battle Poker - Planning Poker Online",
        },
      ],
    },
  };
}

export default function RoomLayout({ children }: { children: React.ReactNode }) {
  return children;
}
