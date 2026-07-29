# AGENTS.md

## Escopo

Estas instruções valem para todo o repositório.

O projeto é uma aplicação de Planning Poker sem cadastro, com salas compartilháveis,
votação em tempo real e revelação simultânea das cartas. Preserve esse fluxo simples ao
fazer alterações.

## Stack e arquitetura

- Next.js 14 com App Router, React 18 e TypeScript em modo `strict`.
- Chakra UI v2 para componentes, layout e tema.
- Firebase Realtime Database para salas, participantes e votos.
- `framer-motion` para animações pontuais.
- Os aliases `@/*` apontam para `src/*`.
- Componentes que usam hooks, navegação do cliente, `window`, Chakra hooks ou Firebase
  no navegador precisam da diretiva `'use client'`.

Principais áreas:

- `src/app`: páginas, layouts, metadata, sitemap e robots.
- `src/components`: componentes reutilizáveis da interface.
- `src/services`: acesso e operações do domínio no Firebase.
- `src/chakraUi`: provider, fontes e tema global.
- `firebase.js`: inicialização compartilhada do Firebase.
- `public`: manifest, logos e demais arquivos estáticos.

## Modelo de dados e fluxo principal

O Realtime Database usa esta estrutura:

```text
rooms/{roomId}
  isShowingAverage: boolean
  users/{userId}
    username: string
    point: string | null
```

O participante atual é mantido em `sessionStorage`, na chave `currentUser`, com
`{ key, username }`.

Ao alterar o fluxo:

- mantenha compatibilidade com salas já existentes;
- não revele votos individuais antes de `isShowingAverage` ser verdadeiro;
- uma nova rodada deve limpar todos os votos e ocultar o resultado;
- valores não numéricos, como `?` e `☕`, não entram na soma da média;
- valide a existência da sala antes de permitir a entrada;
- concentre operações reutilizáveis do Firebase em `src/services`;
- ao criar listeners com `onValue`, exponha e execute o unsubscribe no cleanup do
  `useEffect` para evitar listeners duplicados.

## Comandos

Use npm, pois `package-lock.json` é o lockfile versionado.

```powershell
npm ci
npm run dev
npm run lint
npm run build
npm start
```

Para configurar o ambiente local:

```powershell
Copy-Item .env.example .env.local
```

Preencha `NEXT_PUBLIC_FIREBASE_API_KEY` em `.env.local`. Variáveis com prefixo
`NEXT_PUBLIC_` são enviadas ao navegador; nunca coloque segredos administrativos
nelas nem versione `.env.local`.

## Convenções de implementação

- Prefira componentes funcionais e tipos explícitos para props e dados do Firebase.
- Reutilize componentes de `src/components` e exports de `src/components/index.ts`
  quando isso mantiver os imports simples.
- Use componentes e props do Chakra UI v2; não introduza APIs exclusivas do Chakra v3.
- Use tokens do tema e props responsivas do Chakra em vez de CSS avulso.
- Preserve a interface em português do Brasil e a terminologia já usada no produto.
- Salve arquivos de texto em UTF-8 e não perpetue texto corrompido por encoding.
- Mantenha páginas informativas renderizáveis no servidor. Transforme em Client
  Component somente a menor parte que realmente precise de APIs do navegador.
- Evite duplicar acesso ao Firebase dentro de páginas quando a operação puder ser
  adicionada a um serviço existente.
- Não altere `package-lock.json` sem uma mudança intencional de dependências.

## SEO e conteúdo público

Mudanças em nome, domínio, descrição, logo ou rotas públicas devem ser refletidas, quando
aplicável, em:

- metadata e JSON-LD de `src/app/layout.tsx`;
- JSON-LD das páginas;
- `src/app/sitemap.ts`;
- `src/app/robots.ts`;
- `public/manifest.json`.

Dados estruturados precisam representar informações reais e verificáveis. Não adicione
avaliações, contagens ou alegações sem uma fonte válida.

## Validação

Antes de concluir uma mudança de código, execute:

```powershell
npm run lint
npm run build
```

O repositório não possui suíte automatizada de testes. Para mudanças no fluxo principal,
faça também uma verificação manual em duas abas ou navegadores:

1. criar uma sala;
2. entrar pelo link com outro nome;
3. votar com os dois participantes;
4. confirmar que os votos ficam ocultos antes da revelação;
5. revelar as cartas e conferir a média;
6. iniciar uma nova rodada e confirmar que os votos foram limpos.

Se algum comando ou teste manual não puder ser executado, informe isso explicitamente no
resumo da alteração.

## Commits

Siga o padrão Conventional Commits já usado no histórico, por exemplo:

```text
feat(room): add voting timer
fix(firebase): unsubscribe room listener
docs: update local setup
```

Mantenha cada commit focado e não misture formatação ou refactors não relacionados com a
mudança solicitada.
