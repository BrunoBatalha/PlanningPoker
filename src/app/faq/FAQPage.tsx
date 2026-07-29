'use client'

import { AppShell, GlassPanel, Header } from '@/components'
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
import Head from 'next/head'
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

const categoryColors = {
  basico: 'blue',
  tecnico: 'purple',
  metodologia: 'green',
  pratico: 'orange'
}

const categoryLabels = {
  basico: 'Básico',
  tecnico: 'Técnico',
  metodologia: 'Metodologia',
  pratico: 'Prático'
}

const categoryIcons = {
  basico: QuestionIcon,
  tecnico: FaChartLine,
  metodologia: FaLightbulb,
  pratico: FaUsers
}

export default function FAQPage() {
  const borderColor = 'whiteAlpha.200'
  const hoverBg = 'whiteAlpha.100'
  const categoryBg = 'whiteAlpha.50'

  // Schema JSON-LD para FAQ
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(faq => ({
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
        name: 'Home',
        item: 'https://battlepoker.devnabatalha.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
        item: 'https://battlepoker.devnabatalha.com/faq'
      }
    ]
  }

  return (
    <AppShell>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema)
          }}
        />
      </Head>

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
              <BreadcrumbLink as={NextLink} href="/">
                Home
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
              Perguntas Frequentes
            </Heading>
            <Text textStyle="body-lg" color="ink.300" maxW="3xl">
              Encontre respostas para as principais dúvidas sobre Planning Poker, 
              metodologia ágil e como usar o Battle Poker para melhorar suas estimativas.
            </Text>
            
            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full" maxW="2xl">
              <GlassPanel p={4} textAlign="center">
                <Icon as={QuestionIcon} color="signal.blue" mb={2} />
                <Text textStyle="h3">25+</Text>
                <Text textStyle="body-sm" color="ink.300">Perguntas</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaUsers} color="signal.green" mb={2} />
                <Text textStyle="h3">4</Text>
                <Text textStyle="body-sm" color="ink.300">Categorias</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={FaClock} color="signal.amber" mb={2} />
                <Text textStyle="h3">5min</Text>
                <Text textStyle="body-sm" color="ink.300">Leitura Média</Text>
              </GlassPanel>
              <GlassPanel p={4} textAlign="center">
                <Icon as={CheckCircleIcon} color="brand.300" mb={2} />
                <Text textStyle="h3">100%</Text>
                <Text textStyle="body-sm" color="ink.300">Úteis</Text>
              </GlassPanel>
            </SimpleGrid>
          </VStack>

          {/* FAQ Content */}
          <GlassPanel p={{ base: 5, md: 8 }} strength="strong">
            <VStack spacing={8} align="stretch">
              {/* Category Filters */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={4}>Categorias</Heading>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const IconComponent = categoryIcons[key as keyof typeof categoryIcons]
                    const count = faqData.filter(faq => faq.category === key).length
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
                          <Text textStyle="body-sm" color="ink.300">{count} perguntas</Text>
                        </Box>
                      </Flex>
                    )
                  })}
                </SimpleGrid>
              </Box>

              <Divider />

              {/* FAQ Accordion */}
              <Box>
                <Heading as="h2" textStyle="h4" mb={6}>Todas as Perguntas</Heading>
                <Accordion allowMultiple>
                  {faqData.map((faq, index) => (
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
                <Heading as="h2" textStyle="h2">Ainda tem dúvidas?</Heading>
                <Text color="ink.300" maxW="2xl" textStyle="body">
                  Não encontrou a resposta que procurava? Experimente o Battle Poker 
                  e descubra como o Planning Poker pode transformar suas estimativas ágeis.
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full" maxW="lg">
                  <Button
                    as={NextLink}
                    href="/"
                    variant="premium"
                    size="lg"
                    leftIcon={<Icon as={FaUsers} />}
                  >
                    Criar Sala
                  </Button>
                  <Button
                    as={NextLink}
                    href="/o-que-e-planning-poker"
                    variant="glass"
                    size="lg"
                    leftIcon={<Icon as={FaLightbulb} />}
                  >
                    Guia Completo
                  </Button>
                </SimpleGrid>
                
                <Box mt={8} p={6} bg="whiteAlpha.50" borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
                  <Text textStyle="body-sm" color="ink.300" textAlign="center">
                    💡 <strong>Dica:</strong> Marque esta página nos favoritos para consultar sempre que precisar!
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
