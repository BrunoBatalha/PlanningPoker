# Publicação de artigos

1. Confirme que o idioma existe em `src/locales/<locale>.json` e copie o template
   mais próximo para `<locale>/<identificador>.mdx`. Traduções são opcionais e só
   devem ser publicadas depois de revisão editorial humana.
2. Use o mesmo `<identificador>` em todos os idiomas; o slug dentro do frontmatter
   deve ser localizado.
3. Use slugs localizados e salve capa, visual interno e card social em uma pasta
   previsível dentro de `public/blog/<identificador>/`.
4. Mantenha `status: "draft"` enquanto escreve e revisa.
5. Altere o arquivo revisado para `status: "published"`.
6. Execute `npm run validate:locales`, `npm run validate:articles`, `npm run lint`
   e `npm run build`.
7. Publique pelo fluxo normal de Git e deploy do projeto.

Artigos com data futura só entram nas rotas públicas após a data e um novo build.
O comando `generate:articles` também atualiza
`src/generated/editorial-registry.json`, usado para evitar canibalização.
