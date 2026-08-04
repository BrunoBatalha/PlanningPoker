import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { isArticlePublic, loadArticleLibrary } from "../src/lib/articles";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "battle-poker-articles-"));
const articleRoot = path.join(root, "articles");
const publicRoot = path.join(root, "public");

function reset() {
  fs.rmSync(root, { recursive: true, force: true });
  fs.mkdirSync(path.join(articleRoot, "pt-BR"), { recursive: true });
  fs.mkdirSync(path.join(articleRoot, "en"), { recursive: true });
  fs.mkdirSync(path.join(publicRoot, "articles"), { recursive: true });
  fs.mkdirSync(path.join(publicRoot, "blog"), { recursive: true });
  fs.writeFileSync(path.join(publicRoot, "articles", "cover.webp"), "fixture");
  fs.writeFileSync(path.join(publicRoot, "blog", "social.webp"), "fixture");
}

function article(overrides: Record<string, string> = {}, body = "## Conteudo\n\nTexto util.") {
  const values = {
    status: "published",
    slug: "artigo-teste",
    title: "Artigo teste",
    description: "Descricao do artigo teste.",
    summary: "Resumo editorial do artigo teste.",
    author: "Equipe Battle Poker",
    primaryKeyword: "planning poker teste",
    publishedAt: "2026-01-10",
    coverImage: "/articles/cover.webp",
    coverAlt: "Capa do artigo teste",
    socialImage: "/blog/social.webp",
    searchIntent: "Resolver um problema pratico de estimativa.",
    ctaTitle: "Teste com sua equipe",
    ctaDescription: "Crie uma sala e coloque o aprendizado em pratica.",
    ctaButton: "Criar sala",
    ...overrides,
  };
  return `---\n${Object.entries(values).map(([key, value]) => `${key}: "${value}"`).join("\n")}\nsecondaryKeywords:\n  - "estimativa agil"\nrelatedContent:\n  - "/o-que-e-planning-poker"\n  - "/faq"\n---\n\n${body}\n`;
}

function write(locale: "pt-BR" | "en", id: string, source: string) {
  fs.writeFileSync(path.join(articleRoot, locale, `${id}.mdx`), source);
}

function validate() {
  return loadArticleLibrary({ articleRoot, publicRoot, today: "2026-02-01" });
}

function expectFailure(pattern: RegExp) {
  assert.throws(validate, pattern);
}

try {
  reset();
  write("pt-BR", "pair", article());
  write("en", "pair", article({ slug: "test-article" }));
  assert.equal(validate().records.length, 2);

  reset();
  write("pt-BR", "draft", article({ status: "draft" }));
  assert.equal(validate().records.length, 1);

  reset();
  write("pt-BR", "missing-pair", article());
  assert.equal(validate().records.length, 1);

  reset();
  write("pt-BR", "one", article({ status: "draft", slug: "repetido" }));
  write("pt-BR", "two", article({ status: "draft", slug: "repetido" }));
  expectFailure(/slug .* duplicado/);

  reset();
  write("pt-BR", "invalid-date", article({ status: "draft", publishedAt: "2026-02-31" }));
  expectFailure(/data valida/);

  reset();
  write("pt-BR", "missing-cover", article({ status: "draft", coverImage: "/articles/missing.webp" }));
  expectFailure(/capa nao encontrada/);

  reset();
  write("pt-BR", "h1", article({ status: "draft" }, "# Titulo duplicado"));
  expectFailure(/nao pode conter h1/);

  reset();
  write("pt-BR", "body-image", article({ status: "draft" }, '<ArticleImage src="/blog/missing-body.webp" alt="Teste" width={10} height={10} />'));
  expectFailure(/imagem do corpo 1 nao encontrada/);

  reset();
  write("pt-BR", "future", article({ publishedAt: "2026-03-01" }));
  const future = validate().records[0];
  assert.equal(isArticlePublic(future, "2026-02-01"), false);
  assert.equal(isArticlePublic({ ...future, status: "draft", publishedAt: "2026-01-01" }, "2026-02-01"), false);

  console.log("Validacao editorial: 9 cenarios aprovados.");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
