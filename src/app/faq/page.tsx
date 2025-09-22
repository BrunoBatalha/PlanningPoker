import { Metadata } from 'next'
import FAQPage from './FAQPage'

export const metadata: Metadata = {
  title: 'FAQ - Perguntas Frequentes sobre Planning Poker | Battle Poker',
  description: 'Encontre respostas para as principais dúvidas sobre Planning Poker. FAQ completo com mais de 20 perguntas sobre metodologia ágil, Scrum e estimativas.',
  keywords: [
    'planning poker faq',
    'perguntas frequentes planning poker',
    'dúvidas scrum poker',
    'como usar planning poker',
    'metodologia ágil faq',
    'estimativas scrum',
    'battle poker ajuda',
    'planning poker dúvidas',
    'scrum master perguntas',
    'agile estimation faq',
    'fibonacci planning poker',
    'poker planning questions',
    'story points faq',
    'retrospectiva scrum',
    'sprint planning faq',
    'equipe ágil perguntas',
    'desenvolvimento ágil faq',
    'facilitação scrum',
    'consensus estimation',
    'agile poker help'
  ],
  authors: [{ name: 'Battle Poker Team' }],
  creator: 'Battle Poker',
  publisher: 'Battle Poker',
  category: 'Technology',
  classification: 'Agile Development Tools',
  openGraph: {
    title: 'FAQ - Perguntas Frequentes sobre Planning Poker | Battle Poker',
    description: 'Encontre respostas para as principais dúvidas sobre Planning Poker. FAQ completo com mais de 20 perguntas sobre metodologia ágil, Scrum e estimativas.',
    url: 'https://battlepoker.devnabatalha.com/faq',
    siteName: 'Battle Poker',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: 'https://battlepoker.devnabatalha.com/og-image-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'FAQ Planning Poker - Battle Poker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ - Perguntas Frequentes sobre Planning Poker',
    description: 'Encontre respostas para as principais dúvidas sobre Planning Poker. FAQ completo com mais de 20 perguntas sobre metodologia ágil.',
    creator: '@battlepoker',
    images: ['https://battlepoker.devnabatalha.com/og-image-faq.jpg'],
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
  alternates: {
    canonical: 'https://battlepoker.devnabatalha.com/faq',
  },
  other: {
    'google-site-verification': 'seu-codigo-google-verification',
    'article:author': 'Battle Poker Team',
    'article:section': 'FAQ',
    'article:tag': 'Planning Poker, Scrum, Agile, FAQ',
  },
}

export default function FAQ() {
  return <FAQPage />
}
