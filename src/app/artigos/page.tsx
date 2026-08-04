import type { Metadata } from "next";

import { ArticlesIndexPage } from "@/components/Articles/ArticlesIndexPage";
import { getPublishedArticles } from "@/lib/articles";
import { createLocalizedMetadata } from "@/lib/seo";

const title = "Artigos sobre Planning Poker | Battle Poker";
const description =
  "Guias práticos para melhorar refinamentos, estimativas ágeis e conversas de produto com Planning Poker.";

export const metadata: Metadata = createLocalizedMetadata({
  title,
  description,
  canonicalPath: "/artigos",
  portuguesePath: "/artigos",
  englishPath: "/en/articles",
  locale: "pt_BR",
});

export default function ArticlesPage() {
  return <ArticlesIndexPage articles={getPublishedArticles("pt-BR")} locale="pt-BR" />;
}
