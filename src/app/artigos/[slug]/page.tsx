import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/Articles/ArticleBody";
import { ArticleDetailPage } from "@/components/Articles/ArticleDetailPage";
import {
  getArticleAlternates,
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/articles";
import { createArticleMetadata, createArticleSchemas } from "@/lib/seo";

type ArticlePageProps = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedArticles("pt-BR").map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps): Metadata {
  const article = getPublishedArticleBySlug("pt-BR", params.slug);
  if (!article) notFound();
  const alternates = getArticleAlternates(article);
  if (!alternates?.["pt-BR"]) notFound();
  return createArticleMetadata({
    article,
    canonicalPath: alternates["pt-BR"],
    portuguesePath: alternates["pt-BR"],
    englishPath: alternates.en,
  });
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getPublishedArticleBySlug("pt-BR", params.slug);
  if (!article) notFound();
  const alternates = getArticleAlternates(article);
  if (!alternates?.["pt-BR"]) notFound();
  const schemas = createArticleSchemas({
    article,
    canonicalPath: alternates["pt-BR"],
    indexPath: "/artigos",
  });
  const { content, ...summary } = article;

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      ))}
      <ArticleDetailPage
        article={summary}
        alternates={alternates}
        related={getRelatedArticles(article)}
      >
        <ArticleBody source={content} />
      </ArticleDetailPage>
    </>
  );
}
