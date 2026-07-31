'use client'

import { AppShell, GlassPanel, Header } from '@/components'
import { useLocale, useTranslations } from '@/i18n'
import { CheckCircleIcon, ChevronRightIcon, QuestionIcon } from '@chakra-ui/icons'
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Container,
    Divider,
    Flex,
    Heading,
    Icon,
    SimpleGrid,
    Text,
    VStack
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { FaChartLine, FaClock, FaLightbulb, FaUsers } from 'react-icons/fa'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'basico' | 'tecnico' | 'metodologia' | 'pratico'
}

const faqData: FAQItem[] = [
  {
    id: 'o-que-e-planning-poker',
    question: 'O que é Planning Poker?',
    answer: 'Planning Poker é uma técnica de estimativa ágil baseada em consenso, usada principalmente em metodologias Scrum. Os membros da equipe usam cartas numeradas (geralmente seguindo a sequência de Fibonacci) para estimar a complexidade, esforço ou tempo necessário para completar uma tarefa ou história de usuário.',
    category: 'basico'
  },
  {
    id: 'como-funciona-planning-poker',
    question: 'Como funciona o Planning Poker?',
    answer: 'O Planning Poker funciona em rodadas: 1) O Product Owner apresenta uma história de usuário; 2) A equipe discute e esclarece dúvidas; 3) Cada membro escolhe uma carta secretamente; 4) Todos revelam as cartas simultaneamente; 5) Se há consenso, a estimativa é aceita; 6) Se não, discute-se as diferenças e repete-se o processo.',
    category: 'basico'
  },
  {
    id: 'sequencia-fibonacci-planning-poker',
    question: 'Por que usar a sequência de Fibonacci no Planning Poker?',
    answer: 'A sequência de Fibonacci (1, 2, 3, 5, 8, 13, 21...) é usada porque reflete a incerteza natural das estimativas. Conforme as tarefas ficam maiores, torna-se mais difícil estimar com precisão, e os intervalos maiores da sequência capturam essa incerteza crescente.',
    category: 'metodologia'
  },
  {
    id: 'beneficios-planning-poker',
    question: 'Quais são os principais benefícios do Planning Poker?',
    answer: 'Os benefícios incluem: estimativas mais precisas através do consenso da equipe, maior engajamento de todos os membros, redução da influência de opiniões dominantes, melhor compreensão dos requisitos, identificação precoce de riscos e dependências, e fortalecimento da colaboração da equipe.',
    category: 'basico'
  },
  {
    id: 'diferenca-story-points-horas',
    question: 'Qual a diferença entre Story Points e estimativa em horas?',
    answer: 'Story Points representam a complexidade relativa, esforço e incerteza de uma tarefa, sendo mais estáveis ao longo do tempo. Estimativas em horas são absolutas e podem variar muito entre pessoas e contextos. Story Points focam no "quão difícil" enquanto horas focam no "quanto tempo".',
    category: 'metodologia'
  },
  {
    id: 'quantas-pessoas-planning-poker',
    question: 'Quantas pessoas devem participar do Planning Poker?',
    answer: 'O ideal são 3-9 pessoas, incluindo desenvolvedores, testadores, arquitetos e o Scrum Master. Muito poucas pessoas limitam perspectivas diferentes, enquanto muitas pessoas tornam o processo longo e difícil de gerenciar. O Product Owner participa apresentando as histórias, mas geralmente não vota.',
    category: 'pratico'
  },
  {
    id: 'quanto-tempo-planning-poker',
    question: 'Quanto tempo deve durar uma sessão de Planning Poker?',
    answer: 'Uma sessão típica dura 1-4 horas, dependendo do número de histórias e da complexidade. Recomenda-se fazer pausas a cada hora e limitar a 2-3 horas por sessão para manter a concentração. Para sprints de 2 semanas, geralmente 2-4 horas são suficientes.',
    category: 'pratico'
  },
  {
    id: 'cartas-planning-poker-valores',
    question: 'Quais valores usar nas cartas de Planning Poker?',
    answer: 'Os valores mais comuns são: 0, 1/2, 1, 2, 3, 5, 8, 13, 20, 40, 100, ∞ (infinito) e ? (dúvida). Algumas equipes usam apenas Fibonacci modificado: 1, 2, 3, 5, 8, 13, 21. O importante é ter uma progressão que reflita a incerteza crescente.',
    category: 'tecnico'
  },
  {
    id: 'planning-poker-remoto',
    question: 'Como fazer Planning Poker remoto ou online?',
    answer: 'Use ferramentas como Battle Poker, Planning Poker Online, ou similares. Garanta que todos tenham boa conexão de internet, câmeras ligadas para melhor comunicação, e estabeleça regras claras. Ferramentas digitais podem até facilitar o processo com timers automáticos e histórico de estimativas.',
    category: 'tecnico'
  },
  {
    id: 'planning-poker-sem-consenso',
    question: 'O que fazer quando não há consenso no Planning Poker?',
    answer: 'Quando as estimativas são muito diferentes: 1) Peça para os membros com estimativas extremas explicarem seu raciocínio; 2) Discuta aspectos técnicos, dependências ou riscos não considerados; 3) Faça uma nova rodada de estimativas; 4) Se persistir a diferença, considere quebrar a história em partes menores.',
    category: 'pratico'
  },
  {
    id: 'planning-poker-historias-grandes',
    question: 'Como lidar com histórias muito grandes no Planning Poker?',
    answer: 'Histórias estimadas acima de 13 pontos devem ser quebradas em histórias menores. Use técnicas como User Story Mapping, decomposição funcional, ou separação por personas. Histórias grandes geralmente indicam falta de clareza nos requisitos ou dependências complexas.',
    category: 'metodologia'
  },
  {
    id: 'papel-product-owner-planning-poker',
    question: 'Qual o papel do Product Owner no Planning Poker?',
    answer: 'O Product Owner apresenta e explica as histórias de usuário, esclarece dúvidas sobre requisitos, define critérios de aceitação, e prioriza as histórias. Geralmente não participa das estimativas para não influenciar a equipe técnica, mas pode opinar sobre valor de negócio.',
    category: 'metodologia'
  },
  {
    id: 'scrum-master-planning-poker',
    question: 'Como o Scrum Master deve facilitar o Planning Poker?',
    answer: 'O Scrum Master facilita o processo mantendo o foco, gerenciando o tempo, garantindo que todos participem, mediando discussões, e ajudando a resolver conflitos. Deve permanecer neutro nas estimativas e focar na qualidade do processo de consenso.',
    category: 'pratico'
  },
  {
    id: 'planning-poker-criterios-aceitacao',
    question: 'Como os critérios de aceitação afetam o Planning Poker?',
    answer: 'Critérios de aceitação claros e bem definidos são essenciais para estimativas precisas. Eles ajudam a equipe a entender exatamente o que precisa ser feito, reduzem ambiguidades, e permitem estimativas mais confiáveis. Histórias sem critérios claros tendem a ter estimativas muito divergentes.',
    category: 'metodologia'
  },
  {
    id: 'planning-poker-dependencias',
    question: 'Como identificar dependências durante o Planning Poker?',
    answer: 'Durante as discussões, questione: "Esta história depende de outras tarefas?", "Precisamos de APIs externas?", "Há dependências de outras equipes?". Mapeie dependências visualmente e considere seu impacto nas estimativas. Dependências podem aumentar significativamente a complexidade.',
    category: 'tecnico'
  },
  {
    id: 'velocidade-equipe-planning-poker',
    question: 'Como calcular a velocidade da equipe com Planning Poker?',
    answer: 'A velocidade é a soma dos story points das histórias completadas em um sprint. Após 3-5 sprints, você terá uma média confiável. Use esta média para planejar sprints futuros, considerando variações sazonais, férias, e mudanças na equipe.',
    category: 'metodologia'
  },
  {
    id: 'planning-poker-novos-membros',
    question: 'Como incluir novos membros da equipe no Planning Poker?',
    answer: 'Novos membros devem observar algumas sessões antes de participar ativamente. Explique o processo, as regras, e o significado dos story points. Emparelhe-os com membros experientes durante as primeiras estimativas. Suas perspectivas frescas podem ser valiosas.',
    category: 'pratico'
  },
  {
    id: 'planning-poker-refinamento-backlog',
    question: 'Planning Poker é igual ao Refinamento de Backlog?',
    answer: 'Não são iguais, mas complementares. O Refinamento de Backlog é um processo contínuo de preparação das histórias (esclarecimentos, divisão, priorização). O Planning Poker é uma técnica específica de estimativa que pode ser usada durante o refinamento ou na Sprint Planning.',
    category: 'metodologia'
  },
  {
    id: 'planning-poker-estimativas-individuais',
    question: 'É melhor estimar individualmente ou em grupo?',
    answer: 'O Planning Poker em grupo é mais eficaz que estimativas individuais porque: combina diferentes perspectivas, reduz viés individual, promove discussões valiosas, identifica riscos e dependências, e cria maior comprometimento da equipe com as estimativas.',
    category: 'basico'
  },
  {
    id: 'planning-poker-arquitetura-tecnica',
    question: 'Como considerar questões técnicas e arquiteturais no Planning Poker?',
    answer: 'Questões técnicas devem ser discutidas abertamente: complexidade do código, necessidade de refatoração, impacto na arquitetura, débito técnico, e requisitos não-funcionais. Desenvolvedores seniores devem compartilhar conhecimento técnico para estimativas mais precisas.',
    category: 'tecnico'
  },
  {
    id: 'planning-poker-retrospectiva-estimativas',
    question: 'Como melhorar as estimativas baseado em retrospectivas?',
    answer: 'Na retrospectiva, analise: quais estimativas foram precisas/imprecisas e por quê, que fatores não foram considerados, como melhorar a decomposição de histórias, e ajustes no processo de Planning Poker. Use dados históricos para calibrar futuras estimativas.',
    category: 'metodologia'
  },
  {
    id: 'planning-poker-ferramentas-digitais',
    question: 'Quais são as melhores ferramentas digitais para Planning Poker?',
    answer: 'Ferramentas populares incluem: Battle Poker, Planning Poker Online, Scrum Poker Cards, PlanITpoker, e Pointing Poker. Escolha baseado em: facilidade de uso, integração com outras ferramentas, suporte a equipes remotas, histórico de estimativas, e custo.',
    category: 'tecnico'
  },
  {
    id: 'planning-poker-metricas-sucesso',
    question: 'Como medir o sucesso do Planning Poker?',
    answer: 'Métricas importantes: precisão das estimativas vs. realidade, redução na variância das estimativas ao longo do tempo, aumento na velocidade da equipe, melhoria na previsibilidade de entregas, e satisfação da equipe com o processo de estimativa.',
    category: 'metodologia'
  },
  {
    id: 'planning-poker-cultura-organizacional',
    question: 'Como o Planning Poker impacta a cultura organizacional?',
    answer: 'O Planning Poker promove transparência, colaboração, e responsabilidade compartilhada. Reduz a cultura de culpa por estimativas incorretas, encoraja discussões abertas sobre dificuldades, e democratiza o processo de tomada de decisões técnicas.',
    category: 'basico'
  },
  {
    id: 'planning-poker-escalabilidade',
    question: 'Planning Poker funciona para projetos grandes e múltiplas equipes?',
    answer: 'Para projetos grandes, use Planning Poker por equipe separadamente, depois normalize estimativas entre equipes. Considere usar técnicas como T-shirt sizing para épicos maiores, e mantenha comunicação constante entre equipes para alinhamento.',
    category: 'tecnico'
  }
]

const englishFaqData: FAQItem[] = [
  ['o-que-e-planning-poker', 'What is Planning Poker?', 'Planning Poker is a consensus-based agile estimation technique in which team members privately choose numbered cards to estimate effort, complexity and uncertainty.', 'basico'],
  ['como-funciona-planning-poker', 'How does Planning Poker work?', 'The Product Owner presents a story, the team discusses it, everyone chooses a card privately, and all cards are revealed together. Differences are discussed before another round.', 'basico'],
  ['sequencia-fibonacci-planning-poker', 'Why use the Fibonacci sequence?', 'The growing gaps in the Fibonacci sequence reflect the increasing uncertainty involved in estimating larger work items.', 'metodologia'],
  ['beneficios-planning-poker', 'What are the main benefits?', 'It reduces anchoring bias, includes every team member, exposes risks early and builds a shared understanding of the work.', 'basico'],
  ['diferenca-story-points-horas', 'What is the difference between story points and hours?', 'Story points express relative effort, complexity and uncertainty. Hours are absolute time estimates and vary more between people and contexts.', 'metodologia'],
  ['quantas-pessoas-planning-poker', 'How many people should participate?', 'Three to nine estimators usually provides enough perspectives without making the discussion difficult to manage.', 'pratico'],
  ['quanto-tempo-planning-poker', 'How long should a session last?', 'Keep sessions focused, take regular breaks and avoid extending a single session beyond two or three hours.', 'pratico'],
  ['cartas-planning-poker-valores', 'Which card values should we use?', 'Most teams use a modified Fibonacci deck together with special cards such as question mark, break and infinity.', 'tecnico'],
  ['planning-poker-remoto', 'How do we run Planning Poker remotely?', 'Use a shared real-time room, establish clear facilitation rules and make sure every participant can discuss and vote independently.', 'tecnico'],
  ['planning-poker-sem-consenso', 'What should we do when there is no consensus?', 'Ask the highest and lowest estimators to explain their reasoning, discuss overlooked risks, and vote again. Split the story if uncertainty remains high.', 'pratico'],
  ['planning-poker-historias-grandes', 'How should we handle very large stories?', 'Break large stories into smaller, independently valuable slices before trying to commit to an estimate.', 'metodologia'],
  ['papel-product-owner-planning-poker', 'What is the Product Owner’s role?', 'The Product Owner explains the story, answers requirement questions and defines acceptance criteria without steering the technical estimate.', 'metodologia'],
  ['scrum-master-planning-poker', 'How should the Scrum Master facilitate?', 'Keep the discussion focused, manage time, include every voice and remain neutral about the estimate itself.', 'pratico'],
  ['planning-poker-criterios-aceitacao', 'How do acceptance criteria affect estimation?', 'Clear acceptance criteria reduce ambiguity and help everyone estimate the same expected outcome.', 'metodologia'],
  ['planning-poker-dependencias', 'How do we identify dependencies?', 'Discuss external APIs, other teams, infrastructure and prerequisite work, then include their uncertainty in the conversation.', 'tecnico'],
  ['velocidade-equipe-planning-poker', 'How is team velocity calculated?', 'Add the story points completed in each sprint and use the average of several sprints for planning, never as an individual performance target.', 'metodologia'],
  ['planning-poker-novos-membros', 'How do we include new team members?', 'Explain the scale and process, let them ask questions, and value their fresh perspective even while they learn the domain.', 'pratico'],
  ['planning-poker-refinamento-backlog', 'Is Planning Poker the same as backlog refinement?', 'No. Refinement prepares and clarifies backlog items; Planning Poker is one estimation technique that can be used during refinement.', 'metodologia'],
  ['planning-poker-estimativas-individuais', 'Is group estimation better than individual estimation?', 'Group estimation combines perspectives and uncovers assumptions that an individual estimate is likely to miss.', 'basico'],
  ['planning-poker-arquitetura-tecnica', 'How should architecture be considered?', 'Discuss code complexity, technical debt, refactoring, non-functional requirements and architectural impact before voting.', 'tecnico'],
  ['planning-poker-retrospectiva-estimativas', 'How can retrospectives improve estimates?', 'Review where estimates diverged from reality, identify missing assumptions and use those lessons in future refinement sessions.', 'metodologia'],
  ['planning-poker-ferramentas-digitais', 'What should we look for in an online tool?', 'Prioritize ease of use, real-time synchronization, remote-team support, useful history and a workflow that does not distract the conversation.', 'tecnico'],
  ['planning-poker-metricas-sucesso', 'How can we measure success?', 'Look for better shared understanding, lower uncertainty, more predictable delivery and team satisfaction—not perfect numeric accuracy.', 'metodologia'],
  ['planning-poker-cultura-organizacional', 'How does Planning Poker affect team culture?', 'It promotes transparency, shared responsibility and open technical discussion while reducing blame around uncertain estimates.', 'basico'],
  ['planning-poker-escalabilidade', 'Does it work for large projects and multiple teams?', 'Yes. Estimate within each team and align scales and assumptions across teams without forcing every team to share identical velocity.', 'tecnico']
].map(([id, question, answer, category]) => ({ id, question, answer, category } as FAQItem))

const categoryColors = {
  basico: 'blue',
  tecnico: 'purple',
  metodologia: 'green',
  pratico: 'orange'
}

const categoryIcons = {
  basico: QuestionIcon,
  tecnico: FaChartLine,
  metodologia: FaLightbulb,
  pratico: FaUsers
}

export default function FAQPage() {
  const locale = useLocale()
  const t = useTranslations('faqPage')
  const prefix = locale === 'en' ? '/en' : ''
  const categoryLabels = {
    basico: t('basic'),
    tecnico: t('technical'),
    metodologia: t('methodology'),
    pratico: t('practical')
  }
  const localizedFaqData = locale === 'en' ? englishFaqData : faqData
  const borderColor = 'whiteAlpha.200'
  const hoverBg = 'whiteAlpha.100'
  const categoryBg = 'whiteAlpha.50'

  // Schema JSON-LD para FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'en' ? 'en' : 'pt-BR',
    mainEntity: localizedFaqData.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  // Schema para BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('home'),
        item: `https://planningpoker.devnabatalha.com${prefix}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: `https://planningpoker.devnabatalha.com${prefix}/faq`
      }
    ]
  }

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />
      
      <Box as="main">
        <Container maxW="7xl" py={{ base: 10, md: 16 }} px={{ base: 4, md: 6 }}>
          {/* Breadcrumbs */}
          <Breadcrumb
            spacing="8px"
            separator={<ChevronRightIcon color="ink.400" />}
            mb={6}
            textStyle="body-sm"
          >
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href={prefix || '/'}>
                {t('home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink href="#" color="brand.200" fontWeight="medium">
                FAQ
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Header Section */}
          <VStack spacing={6} textAlign="center" mb={12}>
            <Heading
              as="h1"
              textStyle="h1"
              bgGradient="linear(to-r, brand.200, signal.cyan)"
              bgClip="text"
            >
              {t('title')}
            </Heading>
            <Text textStyle="body-lg" color="ink.300" maxW="3xl">
              {t('description')}
            </Text>
            
            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full" maxW="2xl">
              <GlassPanel p={4} textAlign="center">
                <Icon as={QuestionIcon} color="signal.blue" mb={2} />
                <Text textStyle="h3">25+</Text>
                <Text textStyle="body-sm" color="ink.300">{t('questions')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaUsers} color="signal.green" mb={2} />
                <Text textStyle="h3">4</Text>
                <Text textStyle="body-sm" color="ink.300">{t('categories')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaClock} color="signal.amber" mb={2} />
                <Text textStyle="h3">5min</Text>
                <Text textStyle="body-sm" color="ink.300">{t('averageReading')}</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={CheckCircleIcon} color="brand.300" mb={2} />
                <Text textStyle="h3">100%</Text>
                <Text textStyle="body-sm" color="ink.300">{t('useful')}</Text>
              </GlassPanel>
            </SimpleGrid>
          </VStack>

          {/* FAQ Content */}
          <GlassPanel p={{ base: 5, md: 8 }} strength="strong">
            <VStack spacing={8} align="stretch">
              {/* Category Filters */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={4}>{t('categories')}</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const IconComponent = categoryIcons[key as keyof typeof categoryIcons]
                    const count = localizedFaqData.filter(faq => faq.category === key).length
                    return (
                      <Flex
                        key={key}
                        align="center"
                        p={3}
                        borderRadius="lg"
                        border="1px"
                        borderColor={borderColor}
                        bg={categoryBg}
                      >
                        <Icon as={IconComponent} color={`${categoryColors[key as keyof typeof categoryColors]}.500`} mr={2} />
                        <Box>
                          <Text textStyle="label">{label}</Text>
                          <Text textStyle="body-sm" color="ink.300">{t('questionCount', { count })}</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* FAQ Accordion */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={6}>{t('allQuestions')}</Heading>
                <Accordion allowMultiple>
                  {localizedFaqData.map((faq) => (
                    <AccordionItem key={faq.id} border="1px" borderColor={borderColor} borderRadius="lg" mb={4}>
                      <h3>
                        <AccordionButton p={{ base: 4, md: 6 }} _hover={{ bg: hoverBg }}>
                          <Box flex="1" textAlign="left">
                            <Flex
                              direction={{ base: "column", sm: "row" }}
                              align={{ base: "flex-start", sm: "center" }}
                              gap={{ base: 2, sm: 3 }}
                            >
                              <Badge 
                                colorScheme={categoryColors[faq.category]} 
                                variant="subtle"
                              >
                                {categoryLabels[faq.category]}
                              </Badge>
                              <Text textStyle="h4">
                                {faq.question}
                              </Text>
                            </Flex>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h3>
                      <AccordionPanel p={{ base: 4, md: 6 }} pt={0}>
                        <Text textStyle="body" color="ink.300">
                          {faq.answer}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>

              <Divider />

              {/* CTA Section */}
              <VStack spacing={6} textAlign="center">
                <Heading as="h2" textStyle="h2">{t('stillQuestions')}</Heading>
                <Text color="ink.300" maxW="2xl" textStyle="body">
                  {t('ctaDescription')}
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="lg">
                  <Button
                    as={NextLink}
                    href={prefix || '/'}
                    variant="premium"
                    size="lg"
                    leftIcon={<Icon as={FaUsers} />}
                  >
                    {t('createRoom')}
                  </Button>
                  <Button
                    as={NextLink}
                    href={locale === 'en' ? '/en/what-is-planning-poker' : '/o-que-e-planning-poker'}
                    variant="glass"
                    size="lg"
                    leftIcon={<Icon as={FaLightbulb} />}
                  >
                    {t('completeGuide')}
                  </Button>
                </SimpleGrid>
                
                <Box mt={8} p={6} bg="whiteAlpha.50" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
                  <Text textStyle="body-sm" color="ink.300" textAlign="center">
                    {t('tip')}
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </GlassPanel>
        </Container>
      </Box>
    </AppShell>
  )
}
