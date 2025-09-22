# Logos do Planning Poker

Este diretório contém os logos utilizados na aplicação Planning Poker.

## Arquivos de Logo

### `logo.png`
- **Uso**: Logo principal da aplicação
- **Dimensões recomendadas**: 512x512px ou maior
- **Formato**: PNG com fundo transparente
- **Utilizado em**:
  - Favicon
  - Open Graph images
  - Schema Markup
  - Headers e breadcrumbs
  - Manifest PWA

### `logo-text.png`
- **Uso**: Logo com texto completo da marca
- **Dimensões recomendadas**: Proporção 16:9 ou similar (ex: 800x450px)
- **Formato**: PNG com fundo transparente
- **Utilizado em**:
  - Página principal (hero section)
  - Headers expandidos
  - Marketing materials

## Implementação

Os logos são automaticamente otimizados pelo Next.js e servidos de forma eficiente. Fallbacks estão implementados caso os arquivos de imagem não carreguem.

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
