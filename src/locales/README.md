# Adicionar um idioma

1. Copie um dos arquivos JSON desta pasta para `<locale>.json`.
2. Preencha `$locale`, os segmentos de `routes`, o conteúdo de `seo` e traduza
   integralmente `messages`, `guide` e `faq`.
3. Use nomes nativos em `$locale.nativeName` e um `languageTag` BCP 47 válido.
4. Mantenha `default: false`; somente `pt-BR` é o locale padrão.
5. Execute `npm run validate:locales`, `npm run lint` e `npm run build`.

O gerador executado antes de `dev` e `build` descobre os JSONs automaticamente e
atualiza tipos, rotas, sitemap, metatags e o seletor de idioma. Não edite arquivos
em `src/generated` manualmente.

Artigos são opcionais. Para publicá-los, crie `src/content/articles/<locale>/` e
use o mesmo nome de arquivo das demais traduções do artigo.
