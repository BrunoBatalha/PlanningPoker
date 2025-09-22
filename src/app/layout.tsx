import { fonts } from "@/chakraUi/fonts";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Planning Poker Online Gratuito | Ferramenta de Estimativa Ágil",
    template: "%s | Planning Poker Online"
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
    title: 'Planning Poker Online Gratuito | Ferramenta de Estimativa Ágil',
    description: 'Planning Poker gratuito para equipes ágeis. Estime user stories com Fibonacci, revele cartas simultaneamente.',
    siteName: 'Planning Poker Online',
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
    title: 'Planning Poker Online Gratuito',
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
  return (
    <html lang="pt-br" className={fonts.roboto.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#805ad5" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
