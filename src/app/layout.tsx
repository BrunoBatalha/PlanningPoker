import type { Metadata } from "next";
import { Providers } from "./providers";
import { fonts } from "@/chakraUi/fonts";

export const metadata: Metadata = {
  title: "Planning Poker",
  description: "Planning Poker for Scrum or Lean Kanban Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={fonts.roboto.variable}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
