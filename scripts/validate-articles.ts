import { validateArticleLibrary } from "../src/lib/articles";

const count = validateArticleLibrary();
console.log(`Catalogo de artigos valido: ${count} arquivo(s) MDX.`);
