import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import Script from "next/script";

import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://battlepoker.devnabatalha.com"),
  applicationName: "Battle Poker",
  authors: [{ name: "Battle Poker" }],
  creator: "Battle Poker",
  publisher: "Battle Poker",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
  const locale =
    headers().get("x-battle-poker-locale") === "en" ? "en" : "pt-BR";

  return (
    <html lang={locale}>
      <body>
        <Providers>{children}</Providers>
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
