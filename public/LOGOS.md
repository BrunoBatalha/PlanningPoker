# Logos do Planning Poker

Este diretório contém os logos utilizados na aplicação Planning Poker.

## Arquivos de Logo

### `logo.png`
- **Uso**: Logo principal da aplicação
- **Dimensões**: 1024x1024px
- **Formato**: PNG com fundo transparente
- **Utilizado em**:
  - Open Graph images
  - Schema Markup
  - Headers e breadcrumbs

### `logo-text.png`
- **Uso**: Logo com texto completo da marca
- **Dimensões**: 1200x600px
- **Formato**: PNG com fundo transparente
- **Utilizado em**:
  - Materiais de divulgação
  - Apresentações e capas com a assinatura completa

### Ícones de aplicativo
- `favicon-32x32.png`: favicon moderno em PNG
- `apple-touch-icon.png`: ícone de 180x180px para dispositivos Apple
- `icons/icon-192.png`: ícone PWA de 192x192px
- `icons/icon-512.png`: ícone PWA de 512x512px
- `src/app/favicon.ico`: fallback legado gerenciado pelo App Router

## Implementação

Os logos são automaticamente otimizados pelo Next.js e servidos de forma eficiente. A marca usa três cartas sobrepostas para formar um “B”, com o losango central representando um ponto de estimativa e a convergência do time.

## Substituição

Para substituir os logos:
1. Substitua os arquivos `logo.png` e `logo-text.png` neste diretório
2. Mantenha os mesmos nomes de arquivo
3. Use formato PNG para melhor qualidade e suporte a transparência
4. A aplicação automaticamente usará os novos logos

## SEO

Os logos são integrados com:
- Meta tags Open Graph
- Twitter Cards
- Schema.org JSON-LD
- Manifest PWA
- Favicon
