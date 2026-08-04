import type { Metadata } from "next";

import { ArticlesIndexPage } from "@/components/Articles/ArticlesIndexPage";
import { getPublishedArticles } from "@/lib/articles";
import { createLocalizedMetadata } from "@/lib/seo";

const title = "Planning Poker Articles | Battle Poker";
const description =
  "Practical guides to improve refinement, agile estimation and product conversations with Planning Poker.";

export const metadata: Metadata = createLocalizedMetadata({
  title,
  description,
  canonicalPath: "/en/articles",
  portuguesePath: "/artigos",
  englishPath: "/en/articles",
  locale: "en_US",
});

export default function EnglishArticlesPage() {
  return <ArticlesIndexPage articles={getPublishedArticles("en")} locale="en" />;
}
