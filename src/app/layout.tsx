import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import { Providers } from "./providers";
import { getLocaleCatalog } from "@/i18n/server";
import { defaultLocale, isLocale } from "@/lib/locale-routing";

export const metadata: Metadata = {
  metadataBase: new URL("https://planningpoker.devnabatalha.com"),
  applicationName: "Battle Poker",
  authors: [{ name: "Battle Poker" }],
  creator: "Battle Poker",
  publisher: "Battle Poker",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080D1D",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const requestedLocale = headers().get("x-battle-poker-locale");
  const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;
  const catalog = getLocaleCatalog(locale);

  return (
    <html lang={catalog.$locale.languageTag}>
      <body>
        <Providers locale={locale} catalog={catalog}>{children}</Providers>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xuv5tc8pai");`}
        </Script>
        <GoogleAnalytics gaId="G-8G413NF4HG" />
      </body>
    </html>
  );
}
