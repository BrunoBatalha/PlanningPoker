import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

export const ARTICLE_LOCALES = ["pt-BR", "en"] as const;

export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];
export type ArticleStatus = "draft" | "published";

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "deve usar o formato YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "deve ser uma data valida");

const articleFrontmatterSchema = z.object({
  status: z.enum(["draft", "published"]),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "deve estar em kebab-case ASCII"),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  author: z.string().trim().min(1),
  primaryKeyword: z.string().trim().min(1),
  secondaryKeywords: z.array(z.string().trim().min(1)).min(1),
  searchIntent: z.string().trim().min(1),
  relatedContent: z.array(z.string().startsWith("/")).min(2).max(4),
  publishedAt: dateSchema,
  updatedAt: dateSchema.optional(),
  coverImage: z.string().refine(
    (value) => value.startsWith("/articles/") || value.startsWith("/blog/"),
    "deve apontar para /articles/ ou /blog/",
  ),
  coverAlt: z.string().trim().min(1),
  socialImage: z.string().startsWith("/blog/"),
  ctaTitle: z.string().trim().min(1),
  ctaDescription: z.string().trim().min(1),
  ctaButton: z.string().trim().min(1),
});

export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

export type ArticleRecord = ArticleFrontmatter & {
  id: string;
  locale: ArticleLocale;
  content: string;
  readingTime: number;
};

export type ArticleSummary = Omit<ArticleRecord, "content">;

export type ArticleLibraryOptions = {
  articleRoot?: string;
  publicRoot?: string;
  today?: string;
};

const DEFAULT_ARTICLE_ROOT = path.join(
  process.cwd(),
  "src",
  "content",
  "articles",
);
const DEFAULT_PUBLIC_ROOT = path.join(process.cwd(), "public");

function formatZodIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join(", ");
}

function calculateReadingTime(content: string) {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_[\]()!-]/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function isPathInside(parent: string, candidate: string) {
  const relative = path.relative(parent, candidate);
  return relative !== "" && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function readLocaleArticles(
  locale: ArticleLocale,
  articleRoot: string,
  publicRoot: string,
  errors: string[],
) {
  const localeDirectory = path.join(articleRoot, locale);
  if (!fs.existsSync(localeDirectory)) return [];

  return fs
    .readdirSync(localeDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap<ArticleRecord>((entry) => {
      const id = entry.name.slice(0, -4);
      const filePath = path.join(localeDirectory, entry.name);
      const source = fs.readFileSync(filePath, "utf8");
      const parsed = matter(source);
      const result = articleFrontmatterSchema.safeParse(parsed.data);

      if (!result.success) {
        errors.push(`${locale}/${entry.name}: ${formatZodIssues(result.error)}`);
        return [];
      }

      const frontmatter = result.data;
      if (frontmatter.updatedAt && frontmatter.updatedAt < frontmatter.publishedAt) {
        errors.push(`${locale}/${entry.name}: updatedAt deve ser igual ou posterior a publishedAt`);
      }

      if (/^#\s+/m.test(parsed.content)) {
        errors.push(`${locale}/${entry.name}: o corpo nao pode conter h1; o titulo da pagina ja e o h1`);
      }

      for (const [label, imagePath] of [
        ["capa", frontmatter.coverImage],
        ["imagem social", frontmatter.socialImage],
      ] as const) {
        const resolvedImagePath = path.resolve(publicRoot, imagePath.slice(1));
        if (
          !isPathInside(path.resolve(publicRoot), resolvedImagePath) ||
          !fs.existsSync(resolvedImagePath)
        ) {
          errors.push(`${locale}/${entry.name}: ${label} nao encontrada em public${imagePath}`);
        }
      }

      return [
        {
          ...frontmatter,
          id,
          locale,
          content: parsed.content.trim(),
          readingTime: calculateReadingTime(parsed.content),
        },
      ];
    });
}

export function loadArticleLibrary(options: ArticleLibraryOptions = {}) {
  const articleRoot = options.articleRoot ?? DEFAULT_ARTICLE_ROOT;
  const publicRoot = options.publicRoot ?? DEFAULT_PUBLIC_ROOT;
  const errors: string[] = [];
  const records = ARTICLE_LOCALES.flatMap((locale) =>
    readLocaleArticles(locale, articleRoot, publicRoot, errors),
  );

  for (const locale of ARTICLE_LOCALES) {
    const slugs = new Map<string, string>();
    for (const article of records.filter((record) => record.locale === locale)) {
      const existingId = slugs.get(article.slug);
      if (existingId) {
        errors.push(`${locale}: slug "${article.slug}" duplicado em ${existingId}.mdx e ${article.id}.mdx`);
      } else {
        slugs.set(article.slug, article.id);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Falha na validacao dos artigos:\n- ${errors.join("\n- ")}`);
  }

  const today = options.today ?? new Date().toISOString().slice(0, 10);
  return { records, today };
}

function getDefaultLibrary() {
  return loadArticleLibrary();
}

function isPublicArticle(article: ArticleRecord, records: ArticleRecord[], today: string) {
  return article.status === "published" && article.publishedAt <= today;
}

export function getPublishedArticles(locale: ArticleLocale): ArticleSummary[] {
  const { records, today } = getDefaultLibrary();
  return records
    .filter(
      (article) => article.locale === locale && isPublicArticle(article, records, today),
    )
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map(({ content: _content, ...article }) => article);
}

export function getPublishedArticleBySlug(
  locale: ArticleLocale,
  slug: string,
): ArticleRecord | undefined {
  const { records, today } = getDefaultLibrary();
  const article = records.find(
    (record) => record.locale === locale && record.slug === slug,
  );
  return article && isPublicArticle(article, records, today) ? article : undefined;
}

export function getArticleAlternates(article: ArticleRecord) {
  const { records, today } = getDefaultLibrary();
  if (!isPublicArticle(article, records, today)) return undefined;
  const portuguese = records.find(
    (record) => record.id === article.id && record.locale === "pt-BR",
  );
  const english = records.find(
    (record) => record.id === article.id && record.locale === "en",
  );
  return {
    ...(portuguese && isPublicArticle(portuguese, records, today)
      ? { "pt-BR": `/artigos/${portuguese.slug}` }
      : {}),
    ...(english && isPublicArticle(english, records, today)
      ? { en: `/en/articles/${english.slug}` }
      : {}),
  } as const;
}

export function getRelatedArticles(article: ArticleRecord, limit = 3) {
  return getPublishedArticles(article.locale)
    .filter((candidate) => candidate.id !== article.id)
    .slice(0, limit);
}

export function getPublishedArticlePairs() {
  const portugueseArticles = getPublishedArticles("pt-BR");
  const englishArticles = getPublishedArticles("en");
  return portugueseArticles.flatMap((portuguese) => {
    const english = englishArticles.find((article) => article.id === portuguese.id);
    return english ? [{ portuguese, english }] : [];
  });
}

export function validateArticleLibrary() {
  return loadArticleLibrary().records.length;
}
