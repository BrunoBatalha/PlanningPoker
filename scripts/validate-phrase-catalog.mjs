import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const CATEGORIES = [
  "deadlines",
  "bugs",
  "scope",
  "meetings",
  "deploy",
  "legacy",
  "testing",
  "git",
  "ai",
  "devLife",
];

const LOCALES = ["pt-BR", "en"];
const PHRASES_PER_CATEGORY = 12;
const MINIMUM_TOTAL = 120;
const MAXIMUM_LENGTH = 54;
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDirectory, "..");

const normalize = (phrase) =>
  phrase.trim().replace(/\s+/gu, " ").toLocaleLowerCase();

const readMessages = async (locale) => {
  const path = resolve(projectRoot, "src", "messages", `${locale}.json`);
  return JSON.parse(await readFile(path, "utf8"));
};

const errors = [];
const catalogs = new Map();

for (const locale of LOCALES) {
  const messages = await readMessages(locale);
  const catalog = messages?.waitingGame?.slice?.phrases;

  if (!catalog || typeof catalog !== "object" || Array.isArray(catalog)) {
    errors.push(`${locale}: waitingGame.slice.phrases não existe.`);
    continue;
  }

  catalogs.set(locale, catalog);

  const unknownCategories = Object.keys(catalog).filter(
    (category) => !CATEGORIES.includes(category),
  );

  if (unknownCategories.length > 0) {
    errors.push(
      `${locale}: categorias desconhecidas: ${unknownCategories.join(", ")}.`,
    );
  }

  const normalizedPhrases = new Map();
  let total = 0;

  for (const category of CATEGORIES) {
    const phrases = catalog[category];

    if (!Array.isArray(phrases)) {
      errors.push(`${locale}.${category}: categoria ausente.`);
      continue;
    }

    if (phrases.length !== PHRASES_PER_CATEGORY) {
      errors.push(
        `${locale}.${category}: esperado ${PHRASES_PER_CATEGORY}, encontrado ${phrases.length}.`,
      );
    }

    total += phrases.length;

    phrases.forEach((phrase, index) => {
      if (typeof phrase !== "string" || phrase.trim().length === 0) {
        errors.push(`${locale}.${category}[${index}]: frase vazia.`);
        return;
      }

      const length = [...phrase].length;
      if (length > MAXIMUM_LENGTH) {
        errors.push(
          `${locale}.${category}[${index}]: ${length} caracteres, limite ${MAXIMUM_LENGTH} ("${phrase}").`,
        );
      }

      const normalized = normalize(phrase);
      const previous = normalizedPhrases.get(normalized);
      if (previous) {
        errors.push(
          `${locale}: frase duplicada em ${previous} e ${category}[${index}] ("${phrase}").`,
        );
      } else {
        normalizedPhrases.set(normalized, `${category}[${index}]`);
      }
    });
  }

  if (total < MINIMUM_TOTAL) {
    errors.push(
      `${locale}: esperado no mínimo ${MINIMUM_TOTAL} frases, encontrado ${total}.`,
    );
  }
}

const portugueseCatalog = catalogs.get("pt-BR");
const englishCatalog = catalogs.get("en");

if (portugueseCatalog && englishCatalog) {
  for (const category of CATEGORIES) {
    const portugueseCount = portugueseCatalog[category]?.length ?? 0;
    const englishCount = englishCatalog[category]?.length ?? 0;

    if (portugueseCount !== englishCount) {
      errors.push(
        `${category}: quantidades diferentes entre pt-BR (${portugueseCount}) e en (${englishCount}).`,
      );
    }
  }
}

if (errors.length > 0) {
  console.error("Catálogo de frases inválido:\n");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  const total = CATEGORIES.length * PHRASES_PER_CATEGORY;
  console.log(
    `Catálogo válido: ${total} frases em pt-BR + ${total} frases em inglês.`,
  );
}
