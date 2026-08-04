import fs from "node:fs";
import path from "node:path";

import { z } from "zod";

import type { LocaleCatalog } from "../src/lib/locale-types";
import type { ArticleLocale, ArticleSummary } from "../src/lib/articles";

const root = process.cwd();
const localeRoot = process.env.BATTLE_POKER_LOCALE_ROOT
  ? path.resolve(process.env.BATTLE_POKER_LOCALE_ROOT)
  : path.join(root, "src", "locales");
const generatedRoot = process.env.BATTLE_POKER_GENERATED_ROOT
  ? path.resolve(process.env.BATTLE_POKER_GENERATED_ROOT)
  : path.join(root, "src", "generated");
const segmentSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nonEmptyString = z.string().trim().min(1);

const pageSeoSchema = z.object({
  title: nonEmptyString,
  description: nonEmptyString,
  breadcrumbLabel: nonEmptyString,
}).strict();

const catalogSchema = z.object({
  $locale: z.object({
    id: nonEmptyString.regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/),
    languageTag: nonEmptyString,
    openGraphLocale: nonEmptyString.regex(/^[a-z]{2,3}_[A-Z]{2}$/),
    urlPrefix: z.union([z.literal(""), segmentSchema]),
    nativeName: nonEmptyString,
    shortName: nonEmptyString.max(5),
    default: z.boolean(),
  }).strict(),
  routes: z.object({
    guide: segmentSchema,
    faq: segmentSchema,
    articles: segmentSchema,
  }).strict(),
  seo: z.object({
    home: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      priceCurrency: nonEmptyString.regex(/^[A-Z]{3}$/),
      featureList: z.array(nonEmptyString).min(1),
    }).strict(),
    guide: pageSeoSchema,
    faq: pageSeoSchema,
    articles: pageSeoSchema,
    room: z.object({
      title: nonEmptyString,
      description: nonEmptyString,
      openGraphDescription: nonEmptyString,
    }).strict(),
  }).strict(),
  messages: z.record(z.string(), z.unknown()),
  guide: z.record(z.string(), z.unknown()),
  faq: z.array(z.object({
    id: nonEmptyString,
    question: nonEmptyString,
    answer: nonEmptyString,
    category: z.enum(["basico", "tecnico", "metodologia", "pratico"]),
  }).strict()).min(1),
}).strict();

function formatPath(parts: Array<string | number>) {
  return parts.map(String).join(".");
}

function compareShape(reference: unknown, candidate: unknown, parts: Array<string | number>, errors: string[]) {
  if (Array.isArray(reference)) {
    if (!Array.isArray(candidate)) {
      errors.push(`${formatPath(parts)} deve ser uma lista`);
      return;
    }
    if (candidate.length !== reference.length) {
      errors.push(`${formatPath(parts)} deve ter ${reference.length} item(ns), recebeu ${candidate.length}`);
      return;
    }
    reference.forEach((entry, index) => compareShape(entry, candidate[index], [...parts, index], errors));
    return;
  }
  if (reference && typeof reference === "object") {
    if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
      errors.push(`${formatPath(parts)} deve ser um objeto`);
      return;
    }
    const referenceKeys = Object.keys(reference as Record<string, unknown>).sort();
    const candidateKeys = Object.keys(candidate as Record<string, unknown>).sort();
    const missing = referenceKeys.filter((key) => !candidateKeys.includes(key));
    const extra = candidateKeys.filter((key) => !referenceKeys.includes(key));
    if (missing.length) errors.push(`${formatPath(parts)} chaves ausentes: ${missing.join(", ")}`);
    if (extra.length) errors.push(`${formatPath(parts)} chaves extras: ${extra.join(", ")}`);
    for (const key of referenceKeys.filter((entry) => candidateKeys.includes(entry))) {
      compareShape(
        (reference as Record<string, unknown>)[key],
        (candidate as Record<string, unknown>)[key],
        [...parts, key],
        errors,
      );
    }
    return;
  }
  if (typeof candidate !== typeof reference) {
    errors.push(`${formatPath(parts)} deve ser ${typeof reference}`);
  }
}

function readCatalogs() {
  const files = fs.readdirSync(localeRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .sort((a, b) => a.name.localeCompare(b.name));
  const catalogs = new Map<string, LocaleCatalog>();
  const errors: string[] = [];

  for (const file of files) {
    const id = file.name.slice(0, -5);
    const source = JSON.parse(fs.readFileSync(path.join(localeRoot, file.name), "utf8"));
    const result = catalogSchema.safeParse(source);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push(`${file.name}:${formatPath(issue.path as Array<string | number>)} ${issue.message}`);
      }
      continue;
    }
    if (result.data.$locale.id !== id) errors.push(`${file.name}: $locale.id deve ser "${id}"`);
    if (catalogs.has(id)) errors.push(`locale duplicado: ${id}`);
    catalogs.set(id, result.data as LocaleCatalog);
  }

  if (catalogs.size === 0) errors.push("nenhum catálogo encontrado em src/locales");
  const defaults = [...catalogs.values()].filter((catalog) => catalog.$locale.default);
  if (defaults.length !== 1) errors.push(`deve existir exatamente um locale padrão; encontrados: ${defaults.length}`);
  if (defaults[0]?.$locale.urlPrefix !== "") errors.push("o locale padrão deve usar urlPrefix vazio");

  const prefixes = new Map<string, string>();
  for (const [id, catalog] of catalogs) {
    if (!catalog.$locale.default && !catalog.$locale.urlPrefix) errors.push(`${id}: locale não padrão deve ter urlPrefix`);
    const existing = prefixes.get(catalog.$locale.urlPrefix);
    if (existing) errors.push(`${id}: urlPrefix também usado por ${existing}`);
    prefixes.set(catalog.$locale.urlPrefix, id);
    const routeValues = Object.values(catalog.routes);
    if (new Set(routeValues).size !== routeValues.length) errors.push(`${id}: segmentos de rota duplicados`);
  }

  const defaultCatalog = defaults[0];
  if (defaultCatalog) {
    const defaultFaq = new Map(defaultCatalog.faq.map((item) => [item.id, item.category]));
    for (const [id, catalog] of catalogs) {
      if (catalog === defaultCatalog) continue;
      compareShape(defaultCatalog.messages, catalog.messages, [id, "messages"], errors);
      compareShape(defaultCatalog.guide, catalog.guide, [id, "guide"], errors);
      const candidateFaq = new Map(catalog.faq.map((item) => [item.id, item.category]));
      const missingFaq = [...defaultFaq.keys()].filter((key) => !candidateFaq.has(key));
      const extraFaq = [...candidateFaq.keys()].filter((key) => !defaultFaq.has(key));
      if (missingFaq.length) errors.push(`${id}.faq IDs ausentes: ${missingFaq.join(", ")}`);
      if (extraFaq.length) errors.push(`${id}.faq IDs extras: ${extraFaq.join(", ")}`);
      for (const [faqId, category] of defaultFaq) {
        if (candidateFaq.has(faqId) && candidateFaq.get(faqId) !== category) {
          errors.push(`${id}.faq.${faqId} deve manter a categoria ${category}`);
        }
      }
    }
  }

  if (errors.length) throw new Error(`Falha na validação dos locales:\n- ${errors.join("\n- ")}`);
  return { catalogs, defaultCatalog: defaultCatalog! };
}

function writeLocaleRegistry(catalogs: Map<string, LocaleCatalog>, defaultCatalog: LocaleCatalog) {
  fs.mkdirSync(generatedRoot, { recursive: true });
  const ids = [...catalogs.keys()];
  const imports = ids.map((id, index) => `import catalog${index} from "@/locales/${id}.json";`).join("\n");
  const entries = ids.map((id, index) => `  ${JSON.stringify(id)}: catalog${index},`).join("\n");
  const source = `${imports}\n\nimport type { LocaleCatalog } from "@/lib/locale-types";\n\nexport const localeIds = ${JSON.stringify(ids)} as const;\nexport type Locale = (typeof localeIds)[number];\nexport const defaultLocale = ${JSON.stringify(defaultCatalog.$locale.id)} as Locale;\nexport const localeCatalogs = {\n${entries}\n} as unknown as Record<Locale, LocaleCatalog>;\n`;
  fs.writeFileSync(path.join(generatedRoot, "locale-catalogs.ts"), source, "utf8");

  const manifest = {
    defaultLocale: defaultCatalog.$locale.id,
    locales: [...catalogs.values()].map((catalog) => catalog.$locale),
    routes: Object.fromEntries([...catalogs].map(([id, catalog]) => [id, catalog.routes])),
  };
  fs.writeFileSync(path.join(generatedRoot, "locale-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function main() {
  const { catalogs, defaultCatalog } = readCatalogs();
  writeLocaleRegistry(catalogs, defaultCatalog);
  if (process.env.BATTLE_POKER_LOCALES_ONLY === "1") {
    console.log(`Locales válidos: ${catalogs.size}.`);
    return;
  }

  const articleLibrary = await import(`../src/lib/articles.ts?generated=${Date.now()}`);
  const getPublishedArticles = articleLibrary.getPublishedArticles as (locale: ArticleLocale) => ArticleSummary[];
  const validateArticleLibrary = articleLibrary.validateArticleLibrary as () => number;
  const localeIds = [...catalogs.keys()];
  const count = validateArticleLibrary();
  const manifest = Object.fromEntries(localeIds.map((locale) => [
    locale,
    getPublishedArticles(locale as ArticleLocale).map(({ slug }) => slug),
  ]));
  const editorialRegistry = localeIds.flatMap((locale) =>
    getPublishedArticles(locale as ArticleLocale).map((article) => ({
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

  fs.writeFileSync(path.join(generatedRoot, "article-slugs.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  fs.writeFileSync(path.join(generatedRoot, "editorial-registry.json"), `${JSON.stringify(editorialRegistry, null, 2)}\n`, "utf8");

  const publishedIds = new Set(editorialRegistry.map((article) => article.id));
  const missingTranslations: string[] = [];
  for (const articleId of publishedIds) {
    for (const locale of localeIds) {
      if (!editorialRegistry.some((article) => article.id === articleId && article.locale === locale)) {
        missingTranslations.push(`${articleId}: tradução publicada ausente em ${locale}`);
      }
    }
  }
  if (missingTranslations.length) {
    console.warn(`Traduções de artigos pendentes:\n- ${missingTranslations.join("\n- ")}`);
  }
  console.log(`Conteúdo gerado: ${catalogs.size} locale(s) e ${count} arquivo(s) MDX.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
