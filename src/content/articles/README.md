# Publicação de artigos

1. Copie o template do idioma para `<locale>/<identificador>.mdx`. Traduções são
   opcionais e só devem ser publicadas depois de revisão editorial humana.
2. Use slugs localizados e salve capa, visual interno e card social em uma pasta
   previsível dentro de `public/blog/<identificador>/`.
3. Mantenha `status: "draft"` enquanto escreve e revisa.
4. Altere o arquivo revisado para `status: "published"`.
5. Execute `npm run validate:articles`, `npm run lint` e `npm run build`.
6. Publique pelo fluxo normal de Git e deploy do projeto.

Artigos com data futura só entram nas rotas públicas após a data e um novo build.
O comando `generate:articles` também atualiza
`src/generated/editorial-registry.json`, usado para evitar canibalização.
