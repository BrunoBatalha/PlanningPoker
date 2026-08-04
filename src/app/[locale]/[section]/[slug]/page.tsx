import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/Articles/ArticleBody";
import { ArticleDetailPage } from "@/components/Articles/ArticleDetailPage";
import { StructuredData } from "@/components/StructuredData";
import {
  getArticleAlternates,
  getPublishedArticleBySlug,
  getPublishedArticles,
  getRelatedArticles,
} from "@/lib/articles";
import {
  defaultLocale,
  getLocaleByPrefix,
  getLocaleRoutes,
  localeDefinitions,
} from "@/lib/locale-routing";
import { createArticleMetadata, createArticleSchemas } from "@/lib/seo";

type LocalizedArticleProps = { params: { locale: string; section: string; slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return localeDefinitions
    .filter((definition) => definition.id !== defaultLocale)
    .flatMap((definition) => getPublishedArticles(definition.id).map((article) => ({
      locale: definition.urlPrefix,
      section: getLocaleRoutes(definition.id).articles,
      slug: article.slug,
    })));
}

function resolveArticle(params: LocalizedArticleProps["params"]) {
  const locale = getLocaleByPrefix(params.locale);
  if (!locale || locale === defaultLocale || params.section !== getLocaleRoutes(locale).articles) notFound();
  const article = getPublishedArticleBySlug(locale, params.slug);
  if (!article) notFound();
  const alternates = getArticleAlternates(article);
  if (!alternates) notFound();
  const canonicalPath = alternates[locale];
  if (!canonicalPath) notFound();
  return { article, alternates, canonicalPath };
}

export function generateMetadata({ params }: LocalizedArticleProps): Metadata {
  const { article, alternates, canonicalPath } = resolveArticle(params);
  return createArticleMetadata({ article, alternates, canonicalPath });
}

export default function LocalizedArticle({ params }: LocalizedArticleProps) {
  const { article, alternates, canonicalPath } = resolveArticle(params);
  const { content, ...summary } = article;
  return (
    <>
      <StructuredData schemas={createArticleSchemas({ article, canonicalPath })} />
      <ArticleDetailPage article={summary} alternates={alternates} related={getRelatedArticles(article)}>
        <ArticleBody source={content} />
      </ArticleDetailPage>
    </>
  );
}
