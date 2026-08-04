import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  buildLocalizedPath,
  getPageAlternates,
  matchAcceptedLanguage,
  matchAcceptedLanguageFromDefinitions,
  resolvePreferredLocale,
} from "../src/lib/locale-routing";
import type { LocaleCatalog, LocaleManifest } from "../src/lib/locale-types";

const workspaceRoot = process.cwd();
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "battle-poker-locales-"));
const localeRoot = path.join(temporaryRoot, "locales");
const generatedRoot = path.join(temporaryRoot, "generated");
const tsxCli = path.join(workspaceRoot, "node_modules", "tsx", "dist", "cli.mjs");
const generator = path.join(workspaceRoot, "scripts", "generate-content.ts");

function readCatalog(id: string) {
  return JSON.parse(fs.readFileSync(path.join(workspaceRoot, "src", "locales", `${id}.json`), "utf8")) as LocaleCatalog;
}

function writeCatalog(id: string, catalog: LocaleCatalog) {
  fs.writeFileSync(path.join(localeRoot, `${id}.json`), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
}

function runGenerator() {
  const result = spawnSync(process.execPath, [tsxCli, generator], {
    cwd: workspaceRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      BATTLE_POKER_LOCALE_ROOT: localeRoot,
      BATTLE_POKER_GENERATED_ROOT: generatedRoot,
      BATTLE_POKER_LOCALES_ONLY: "1",
    },
  });
  if (result.status !== 0) throw new Error(`${result.stdout}${result.stderr}`);
  return result.stdout;
}

function spanishCatalog() {
  const catalog = structuredClone(readCatalog("en"));
  catalog.$locale = {
    id: "es",
    languageTag: "es-ES",
    openGraphLocale: "es_ES",
    urlPrefix: "es",
    nativeName: "Español",
    shortName: "ES",
    default: false,
  };
  catalog.routes = { guide: "que-es-planning-poker", faq: "preguntas", articles: "articulos" };
  return catalog;
}

try {
  fs.mkdirSync(localeRoot, { recursive: true });
  writeCatalog("pt-BR", readCatalog("pt-BR"));
  writeCatalog("en", readCatalog("en"));
  writeCatalog("es", spanishCatalog());

  assert.match(runGenerator(), /Locales válidos: 3/);
  const manifest = JSON.parse(fs.readFileSync(path.join(generatedRoot, "locale-manifest.json"), "utf8")) as LocaleManifest;
  const spanish = manifest.locales.find((definition) => definition.id === "es");
  assert.ok(spanish);
  assert.equal(buildLocalizedPath(spanish, manifest.routes.es, "home"), "/es");
  assert.equal(buildLocalizedPath(spanish, manifest.routes.es, "articles"), "/es/articulos");
  assert.equal(getPageAlternates("home")["pt-BR"], "/");
  assert.equal(getPageAlternates("home").en, "/en");
  assert.equal(
    matchAcceptedLanguageFromDefinitions("fr-FR;q=0.8, es-MX;q=0.9", manifest.locales, manifest.defaultLocale),
    "es",
  );
  assert.equal(matchAcceptedLanguage("en-US,en;q=0.8"), "en");
  assert.equal(resolvePreferredLocale("pt-BR", "en-US"), "pt-BR");
  assert.equal(resolvePreferredLocale("desconhecido", "en-US"), "en");

  const incomplete = spanishCatalog();
  delete (incomplete.messages.header as Record<string, unknown>).menu;
  writeCatalog("es", incomplete);
  assert.throws(runGenerator, /chaves ausentes: menu/);

  const duplicatePrefix = spanishCatalog();
  duplicatePrefix.$locale.urlPrefix = "en";
  writeCatalog("es", duplicatePrefix);
  assert.throws(runGenerator, /urlPrefix também usado por en/);

  console.log("Locales: descoberta, rotas, fallback e validação aprovados.");
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
