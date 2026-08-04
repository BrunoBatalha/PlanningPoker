import type { Metadata } from "next";

import { ArticlesIndexPage } from "@/components/Articles/ArticlesIndexPage";
import { getPublishedArticles } from "@/lib/articles";
import { createLocalizedMetadata } from "@/lib/seo";

export const metadata: Metadata = createLocalizedMetadata({ locale: "pt-BR", page: "articles" });

export default function ArticlesPage() {
  return <ArticlesIndexPage articles={getPublishedArticles("pt-BR")} locale="pt-BR" />;
}
