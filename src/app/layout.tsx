import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";

import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Battle Poker | Planning Poker Online Gratuito",
    template: "%s | Battle Poker"
  },
  description: "Planning Poker gratuito para equipes ágeis. Estime user stories com Fibonacci, revele cartas simultaneamente. Sem cadastro, colaboração em tempo real para Scrum.",
  keywords: [
    "planning poker",
    "scrum poker", 
    "estimativa ágil",
    "fibonacci planning",
    "user story points",
    "ferramenta scrum",
    "planning poker online",
    "planning poker gratuito"
  ].join(", "),
  authors: [{ name: "Planning Poker Online" }],
  creator: "Planning Poker Online",
  metadataBase: new URL('https://battlepoker.devnabatalha.com'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://battlepoker.devnabatalha.com',
    title: 'Battle Poker | Planning Poker Online Gratuito',
    description: 'Planning Poker gratuito para equipes ágeis. Estime user stories com Fibonacci, revele cartas simultaneamente.',
    siteName: 'Battle Poker',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Planning Poker Online - Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Battle Poker | Planning Poker Online Gratuito',
    description: 'Ferramenta gratuita de Planning Poker para equipes ágeis',
    images: ['/logo.png'],
    creator: '@planningpoker'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code-here',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Battle Poker Online",
    "alternateName": "Planning Poker Online",
    "description": "Ferramenta gratuita de Planning Poker para equipes ágeis. Estime user stories com Fibonacci, revele cartas simultaneamente. Sem cadastro, colaboração em tempo real para Scrum.",
    "url": "https://battlepoker.devnabatalha.com",
    "applicationCategory": "BusinessApplication",
    "applicationSubCategory": "Project Management",
    "operatingSystem": "Web Browser",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0",
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0],
    "inLanguage": "pt-BR",
    "isAccessibleForFree": true,
    "creator": {
      "@type": "Person",
      "name": "Bruno Batalha",
      "url": "https://devnabatalha.com"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Dev na Batalha",
      "url": "https://devnabatalha.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://battlepoker.devnabatalha.com/logo.png"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2030-12-31"
    },
    "featureList": [
      "Planning Poker Online Gratuito",
      "Estimativa Ágil com Fibonacci",
      "Colaboração em Tempo Real",
      "Scrum Poker Cards",
      "Story Points Estimation",
      "Sprint Planning Tool",
      "Sem Cadastro Necessário",
      "Interface em Português",
      "Multiplayer Real-time",
      "Mobile Responsive"
    ],
    "screenshot": "https://battlepoker.devnabatalha.com/logo.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://battlepoker.devnabatalha.com",
      "name": "Começar Battle Poker"
    }
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
        <Providers>
          {children}
        </Providers>
      </body>
      <GoogleAnalytics gaId="G-8G413NF4HG" />
    </html>
  );
}
