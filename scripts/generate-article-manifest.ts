import fs from "node:fs";
import path from "node:path";

import { getPublishedArticles, validateArticleLibrary } from "../src/lib/articles";

const count = validateArticleLibrary();
const manifest = {
  "pt-BR": getPublishedArticles("pt-BR").map(({ slug }) => slug),
  en: getPublishedArticles("en").map(({ slug }) => slug),
};
const target = path.join(process.cwd(), "src", "generated", "article-slugs.json");
const editorialRegistryTarget = path.join(
  process.cwd(),
  "src",
  "generated",
  "editorial-registry.json",
);
const editorialRegistry = (["pt-BR", "en"] as const).flatMap((locale) =>
  getPublishedArticles(locale).map((article) => ({
    id: article.id,
    locale: article.locale,
    slug: article.slug,
    title: article.title,
    primaryKeyword: article.primaryKeyword,
    secondaryKeywords: article.secondaryKeywords,
    searchIntent: article.searchIntent,
    summary: article.summary,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt ?? article.publishedAt,
    author: article.author,
    relatedContent: article.relatedContent,
  })),
);

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
fs.writeFileSync(
  editorialRegistryTarget,
  `${JSON.stringify(editorialRegistry, null, 2)}\n`,
  "utf8",
);
console.log(`Manifesto e registro editorial gerados: ${count} arquivo(s) MDX.`);
