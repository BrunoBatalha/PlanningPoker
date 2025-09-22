import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: "Sala de Planning Poker - Battle Poker",
    template: "%s | Battle Poker"
  },
  description: "Sala colaborativa de Planning Poker para estimativa ágil em tempo real. Participe com sua equipe para estimar user stories usando a metodologia ágil.",
  robots: {
    index: false,
    follow: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  openGraph: {
    title: "Sala de Planning Poker - Battle Poker",
    description: "Sala colaborativa de Planning Poker para estimativa ágil em tempo real",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 300,
        height: 300,
        alt: "Battle Poker - Planning Poker Online"
      }
    ]
  }
}

export default function RoomLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
