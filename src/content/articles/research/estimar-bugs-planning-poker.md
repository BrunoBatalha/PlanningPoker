# Pesquisa editorial — estimativa de bugs com Planning Poker

Data da pesquisa: 2026-08-18

Mercado pretendido: Brasil, português do Brasil

Consultas pesquisadas:

- `como estimar bugs story points`
- `bugs devem ter story points`
- `estimativa de bugs Scrum Planning Poker`
- `Planning Poker bugs estimar defeitos`
- `Planning Poker erros comuns`
- `Planning Poker tamanhos de camiseta`

## Limitação da pesquisa

O navegador interno solicitado não pôde ser inicializado: a versão carregada do pacote apontava para um arquivo ausente e a versão instalada foi recusada pelo caminho de confiança do runtime. A pesquisa textual online foi concluída, mas a SERP visual do Google Brasil com `hl=pt-BR`, `gl=br`, `pws=0`, os blocos “As pessoas também perguntam” e “Pesquisas relacionadas” ficaram **não verificados** nesta execução.

## Norte editorial

- Palavra-chave principal: **estimar bugs com story points**.
- Secundárias: bugs devem ter story points; estimativa de bugs no Scrum; Planning Poker para bugs; story points em bugs; como estimar defeitos de software.
- Intenção: decisão operacional e tutorial. A pessoa quer saber se deve pontuar um defeito e como evitar uma estimativa baseada apenas no sintoma.
- Pergunta central: este bug exige resposta imediata, investigação timeboxed ou já tem uma correção comparável que pode ser estimada?
- Problema do leitor: regras absolutas misturam gravidade, prioridade, incerteza, tamanho, Definition of Done e velocidade.
- Ação após a leitura: classificar um bug entre mitigar, investigar e estimar; preparar o item; conduzir uma rodada e registrar uma política consistente.

## Canibalização

O catálogo publicado cobre definição geral, story points, Fibonacci, sessão remota, divergência após revelação, prontidão no refinamento, cartas especiais e vantagens/limitações. Existe também trabalho local preexistente e não commitado sobre participantes.

O novo artigo não repete a calibração geral de story points nem o checklist amplo de refinamento. Seu recorte é específico a defeitos: separa incidente, diagnóstico e correção; explica quando não pontuar; trata Definition of Done e dupla contagem; oferece uma política para bugs e velocidade. Links para os guias gerais aprofundam o método sem disputar a mesma pergunta principal.

## Resultados e padrões observados

A busca misturou páginas comerciais de ferramentas, guias gerais de story points, discussão em Scrum.org, artigo de Mike Cohn e fóruns. As variações recorrentes foram:

- bugs devem receber pontos?
- correções contam na velocidade?
- bugs desconhecidos devem virar spike?
- severidade muda a estimativa?
- um defeito encontrado na mesma Sprint deve ser pontuado novamente?
- como incluir diagnóstico e testes na carta?

## Concorrentes analisados

### 1. Planning-Poker.app — “Estimating Bugs and Defects with Planning Poker: Should You Estimate Bug Fixes?”

- URL: https://planning-poker.app/blog/estimating-bugs-defects-planning-poker
- Description observada: promete análise de prós, contras, abordagens híbridas, framework de decisão e impacto na velocidade.
- H1: igual ao title e duplicado no HTML indexado.
- H2 principais: debate; argumentos contra; argumentos a favor; framework de decisão; impacto na velocidade; templates; boas práticas; conclusão.
- Exemplos: bug de login estimado em `3` que revela race condition e cresce para `21`; cálculos de velocidade; templates de ticket.
- Tabelas: decisão por severidade, complexidade, causa conhecida e política de velocidade.
- Imagens/diagramas: capa e estrutura visual de framework; a verificação visual completa ficou indisponível.
- FAQ: perguntas distribuídas no conteúdo, sem bloco verificável nesta leitura.
- Profundidade: alta e muito abrangente.
- Força: cobre os dois lados e oferece decisões concretas.
- Lacuna: usa limites arbitrários por horas/severidade e afirma estatísticas de previsão/custo sem fonte verificável no texto observado; mistura prioridade com tamanho e apresenta políticas como recomendação ampla.

### 2. Scrum.org — “Should ‘Bugs’ Have ‘Points’?”

- URL: https://www.scrum.org/resources/blog/should-bugs-have-points
- Description observada: pergunta direta sobre pontos em bugs.
- H1: `Should ‘Bugs’ Have ‘Points’?`.
- H2 principais: a página indexada é essencialmente um vídeo; não há tutorial textual estruturado por H2.
- Exemplos/taxonomia: diferencia defeito antes da entrega, defeito escapado, dívida técnica e “bug” real.
- Tabelas: não.
- Imagens: player/capa do vídeo.
- FAQ: não.
- Profundidade: conceitual, dependente do vídeo.
- Força: questiona o uso amplo da palavra bug e evita uma resposta universal.
- Lacuna: falta checklist, fluxo de decisão, cenário completo e roteiro para Planning Poker.

### 3. DevPlus — “O que é Planning Poker e como usar na Sprint Planning”

- URL: https://devplus.com.br/blog/planning-poker-o-que-e-como-usar-sprint-planning/
- Description observada: guia geral para usar Planning Poker na Sprint Planning.
- H1: igual ao title.
- H2 principais: conceito, funcionamento, passo a passo, tempo estimado, erros comuns e conclusão.
- Exemplos: fluxo com preparação, apresentação, votação, divergência e registro.
- Tabelas: duração sugerida por tamanho de Sprint e quantidade de histórias.
- Imagens: recursos do guia geral; sem diagrama específico de bugs.
- FAQ: não visível.
- Profundidade: média; bugs aparecem em um único erro comum.
- Força: português natural e escaneabilidade para iniciantes.
- Lacuna: afirma que bug sem pontos “infla” a velocidade e impossibilita planejamento sem distinguir defeito na mesma entrega, incidente, legado ou causa desconhecida.

### 4. ScrumPoker.it — “How to Estimate Bugs in Scrum (Without Screwing Up Your Sprint)”

- URL: https://www.scrumpoker.it/en/blog/3
- Description observada: guia para estimar bugs no Scrum sem comprometer a Sprint.
- H1: igual ao title.
- H2 principais: estimar ou não; como usar story points; onde colocar bugs; erros; uso da ferramenta; FAQ; conclusão.
- Exemplo: erro `500` após OAuth estimado em `3`, incluindo diagnóstico, correção e reteste.
- Tabelas: não.
- Imagens: uma capa.
- FAQ: pontos na velocidade; bugs inesperados; bugs encontrados por QA.
- Profundidade: curta.
- Força: direto, apresenta exceções para cosmético, regressão complexa e produção crítica.
- Lacuna: recomenda “sim” e limite de cerca de 15 minutos sem fonte; não separa severidade de tamanho nem ensina prontidão diagnóstica.

### 5. TeamRetro — “What are story points?”

- URL: https://www.teamretro.com/guides/agile-estimation-guide/what-are-story-points/
- Description observada: guia amplo de story points e estimativa ágil.
- H1: `What are story points?`.
- H2 relevantes: qual trabalho pontuar; bugs; testes e QA; retrospectiva; perguntas frequentes.
- Exemplo: formulário que aceita quantidade negativa como correção delimitada; corrupção de dados e aumento de latência como investigação.
- Tabelas: não na seção de bugs.
- Imagens/diagramas: não verificados visualmente.
- FAQ: inclui “Should bugs have story points?” e “Do story points include testing?”.
- Profundidade: alta no tema story points, curta no recorte de bugs.
- Força: regra simples e útil — causa conhecida/correção clara pode ser estimada; problema exploratório vai para investigação timeboxed.
- Lacuna: o recorte fica enterrado no guia geral e não cobre incidente, Definition of Done, dupla contagem, fluxo ou exemplo completo.

### 6. Mountain Goat Software — “Should Story Points Be Assigned to a Bug Fixing Story?”

- URL: https://www.mountaingoatsoftware.com/blog/should-story-points-be-assigned-to-a-bug-fixing-story/1000
- H1: igual ao title.
- H2 principais: conteúdo curto contínuo, biografia do autor e relacionados.
- Exemplos: backlog legado; velocidade `25` com `5` pontos por Sprint em bugs; efeito de suspender correções por seis Sprints.
- Tabelas: não.
- Imagens: capa e foto do autor.
- FAQ: não.
- Profundidade: focada em velocidade e defeitos legados.
- Força: autoria reconhecida, explicita duas leituras válidas do sinal de velocidade.
- Lacuna: não ensina quando o próprio bug está pronto para estimar nem trata incidente e investigação.

## Lacuna editorial escolhida

Produzir a resposta mais prática em português para a decisão anterior à carta:

1. começar com uma matriz de cinco situações;
2. separar urgência, prontidão e tamanho;
3. definir evidências mínimas para estimar sem exigir diagnóstico perfeito;
4. apresentar um fluxo visual entre mitigar, investigar, esclarecer e estimar;
5. ensinar uma rodada de Planning Poker específica para bugs;
6. mostrar cenário feliz, falha operacional e alternativa investigativa;
7. comparar políticas de velocidade sem declarar uma regra universal;
8. incluir dupla contagem, Definition of Done e pontos retroativos entre os erros comuns.

## Fontes verificadas

- Scrum Guide: https://scrumguides.org/scrum-guide.html
  - Sustenta que Developers que farão o trabalho são responsáveis pelo sizing; o Product Owner pode influenciar ao esclarecer trade-offs; Scrum não prescreve story points.
- Agile Alliance — glossário: https://agilealliance.org/agile101/agile-glossary/
  - Define Product Backlog como lista que pode conter features, mudanças, bug fixes, infraestrutura e outras atividades.
- Agile Alliance — points: https://agilealliance.org/glossary/points-estimates-in/
  - Sustenta pontos como unidade relativa e alerta contra tratar estimativa como compromisso firme.
- Scrum.org — David Sabine: https://www.scrum.org/resources/blog/should-bugs-have-points
  - Referência opinativa para distinguir tipos de “bug” e evitar uma política universal.
- Mountain Goat Software — Mike Cohn: https://www.mountaingoatsoftware.com/blog/should-story-points-be-assigned-to-a-bug-fixing-story/1000
  - Compara os efeitos de incluir ou excluir correções legadas da velocidade.
- Atlassian: https://www.atlassian.com/agile/project-management/estimation
  - Explica story points como esforço relativo com complexidade, risco, quantidade de trabalho e desconhecidos; usa bug simples como exemplo.

## Separação entre fato, interpretação e recomendação

- **Fato documentado:** Scrum atribui sizing aos Developers e não exige story points; Product Backlog pode conter correções; pontos são usados como estimativa relativa.
- **Interpretação editorial:** o problema de busca está na mistura entre impacto, desconhecimento e tamanho.
- **Recomendação prática:** mitigar impacto ativo; investigar causa/alcance desconhecidos; estimar a correção completa quando houver fronteira comparável; evitar dupla contagem e pontuação retroativa.
- **Funcionalidade verificada no código do Battle Poker:** sala sem cadastro, link compartilhável, rodada nomeada, cartas numéricas, `?` e `☕`, votos ocultos, revelação simultânea, média/distribuição, estimativa acordada, histórico e refazer rodada.

## Recursos produzidos

- capa WebP 1600×900 gerada por IA e otimizada;
- diagrama de decisão SVG 1400×788;
- versão móvel do diagrama SVG 768×1120;
- card LinkedIn WebP 1200×630 com ilustração gerada por IA e tipografia aplicada de forma determinística;
- texto social em arquivo separado.

Nenhum screenshot de interface foi incorporado: o conteúdo ensina uma decisão e um protocolo, não cliques ou uma tela específica do produto.
