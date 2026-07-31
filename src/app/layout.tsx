import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import Script from "next/script";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Battle Poker | Planning Poker Online Gratuito",
    template: "%s | Battle Poker",
  },
  description:
    "Planning Poker gratuito para equipes ágeis. Crie uma sala, vote com Fibonacci e cartas especiais, e revele estimativas simultaneamente. Sem cadastro e em tempo real.",
  keywords: [
    "planning poker",
    "scrum poker",
    "estimativa ágil",
    "fibonacci planning",
    "user story points",
    "ferramenta scrum",
    "planning poker online",
    "planning poker gratuito",
  ].join(", "),
  authors: [{ name: "Planning Poker Online" }],
  creator: "Planning Poker Online",
  metadataBase: new URL("https://battlepoker.devnabatalha.com"),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://battlepoker.devnabatalha.com",
    title: "Battle Poker | Planning Poker Online Gratuito",
    description:
      "Crie uma sala, compartilhe o link e revele estimativas simultaneamente. Sem cadastro e em tempo real.",
    siteName: "Battle Poker",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Battle Poker - Planning Poker online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Battle Poker | Planning Poker Online Gratuito",
    description:
      "Crie uma sala, compartilhe o link e revele estimativas simultaneamente.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Battle Poker",
    alternateName: "Planning Poker Online",
    description:
      "Ferramenta gratuita de Planning Poker para equipes ágeis. Crie uma sala, compartilhe o link e revele cartas simultaneamente.",
    url: "https://battlepoker.devnabatalha.com",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Project Management",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
    featureList: [
      "Salas compartilháveis por link",
      "Votação com cartas Fibonacci, ? e ☕",
      "Colaboração em tempo real",
      "Revelação simultânea das cartas",
      "Média e distribuição dos votos",
      "Histórico de rodadas confirmadas",
      "Sem cadastro",
      "Interface responsiva em português",
    ],
    potentialAction: {
      "@type": "UseAction",
      target: "https://battlepoker.devnabatalha.com",
      name: "Criar uma sala no Battle Poker",
    },
  };

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#080D1D" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xuv5tc8pai");`}
        </Script>
      </body>
      <GoogleAnalytics gaId="G-8G413NF4HG" />
    </html>
  );
}
