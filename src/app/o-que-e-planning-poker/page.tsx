import WhatIsPlanningPokerPage from '@/app/o-que-e-planning-poker/WhatIsPlanningPokerPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "O que é Planning Poker? Guia Completo da Técnica de Estimativa Ágil | Planning Poker Online",
  description: "Aprenda tudo sobre Planning Poker: o que é, como funciona, benefícios, regras e como usar esta técnica de estimativa ágil em equipes Scrum. Guia completo com exemplos práticos.",
  keywords: [
    "planning poker",
    "o que é planning poker", 
    "scrum poker",
    "estimativa ágil",
    "fibonacci planning",
    "técnica de estimativa",
    "metodologia ágil",
    "scrum estimation",
    "user story points",
    "agile planning"
  ].join(", "),
  openGraph: {
    title: "O que é Planning Poker? Guia Completo da Técnica de Estimativa Ágil",
    description: "Descubra como o Planning Poker revoluciona a estimativa de projetos ágeis. Aprenda a técnica, benefícios e como implementar em sua equipe.",
    type: "article",
    images: [
      {
        url: "/og-planning-poker-guide.jpg",
        width: 1200,
        height: 630,
        alt: "Planning Poker - Técnica de Estimativa Ágil"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "O que é Planning Poker? Guia Completo",
    description: "Aprenda a técnica de estimativa ágil mais usada no mundo. Planning Poker explicado de forma simples e prática.",
    images: ["/twitter-planning-poker-guide.jpg"]
  },
  alternates: {
    canonical: "https://battlepoker.devnabatalha.com/o-que-e-planning-poker"
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
  }
};



export default function Page() {
  return <WhatIsPlanningPokerPage />;
}
