'use client'
import { Header } from "@/components";
import CreateRoomButton from "@/components/CreateRoomButton";
import { CheckCircleIcon, StarIcon } from "@/components/Icons";
import { ChevronRightIcon } from "@chakra-ui/icons";
import {
    Alert,
    AlertIcon,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Card,
    CardBody,
    CardHeader,
    Container,
    Divider,
    Flex,
    Heading,
    HStack,
    Icon,
    Image,
    List,
    ListIcon,
    ListItem,
    OrderedList,
    SimpleGrid,
    Text,
    UnorderedList,
    VStack
} from "@chakra-ui/react";
import Link from "next/link";

export default function WhatIsPlanningPokerPage() {
  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "O que é Planning Poker? Guia Completo da Técnica de Estimativa Ágil",
            "description": "Aprenda tudo sobre Planning Poker: o que é, como funciona, benefícios, regras e como usar esta técnica de estimativa ágil em equipes Scrum.",
            "author": {
              "@type": "Organization",
              "name": "Planning Poker Online"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Planning Poker Online",
              "logo": {
                "@type": "ImageObject",
                "url": "https://battlepoker.devnabatalha.com/logo.png"
              }
            },
            "datePublished": "2025-09-21",
            "dateModified": "2025-09-21",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://battlepoker.devnabatalha.com/o-que-e-planning-poker"
            },
            "image": "https://battlepoker.devnabatalha.com/og-planning-poker-guide.jpg"
          })
        }}
      />

      <Header />

      <Container maxW="4xl" py={8}>
        {/* Breadcrumbs */}
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/" color="purple.600">
              <HStack spacing={2}>
                <Image src="/logo.png" alt="Logo" w={6} h={6} />
                <Text>Início</Text>
              </HStack>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#" color="gray.600">
              O que é Planning Poker
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Hero Section */}
        <VStack spacing={6} align="stretch" mb={12}>
          <Box>
            <Badge colorScheme="purple" mb={3}>
              GUIA COMPLETO
            </Badge>
            <Heading 
              as="h1" 
              size="2xl" 
              mb={4}
              color="gray.800"
              lineHeight="1.2"
            >
              O que é Planning Poker? Guia Completo da Técnica de Estimativa Ágil
            </Heading>
            <Text fontSize="xl" color="gray.600" lineHeight="1.6" mb={6}>
              Descubra como o <strong>Planning Poker</strong> revoluciona a estimativa de projetos ágeis. 
              Aprenda a técnica, benefícios e como implementar em sua equipe Scrum de forma eficiente.
            </Text>
            <CreateRoomButton />
          </Box>
        </VStack>

        {/* Table of Contents */}
        <Card mb={8} bg="blue.50" borderLeft="4px solid" borderLeftColor="blue.500">
          <CardHeader pb={2}>
            <Heading as="h2" size="md" color="blue.700">
              📋 Índice do Conteúdo
            </Heading>
          </CardHeader>
          <CardBody pt={0}>
            <OrderedList spacing={2} color="blue.600">
              <ListItem><Link href="#definicao">O que é Planning Poker?</Link></ListItem>
              <ListItem><Link href="#como-funciona">Como Funciona o Planning Poker</Link></ListItem>
              <ListItem><Link href="#sequencia-fibonacci">A Sequência de Fibonacci</Link></ListItem>
              <ListItem><Link href="#beneficios">Benefícios do Planning Poker</Link></ListItem>
              <ListItem><Link href="#passo-a-passo">Como Fazer Planning Poker (Passo a Passo)</Link></ListItem>
              <ListItem><Link href="#cartas">Tipos de Cartas e Valores</Link></ListItem>
              <ListItem><Link href="#dicas">Dicas e Melhores Práticas</Link></ListItem>
              <ListItem><Link href="#ferramentas">Ferramentas para Planning Poker Online</Link></ListItem>
            </OrderedList>
          </CardBody>
        </Card>

        {/* Main Content */}
        <VStack spacing={10} align="stretch">
          
          {/* Section 1: Definition */}
          <Box id="definicao">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              O que é Planning Poker?
            </Heading>
            
            <Text fontSize="lg" mb={4} lineHeight="1.7">
              O <strong>Planning Poker</strong> (também conhecido como <strong>Scrum Poker</strong>) é uma técnica de 
              <strong> estimativa ágil</strong> baseada em consenso, amplamente utilizada em metodologias ágeis 
              como Scrum e Kanban. Foi criada por James Grenning em 2002 e popularizada por Mike Cohn.
            </Text>
            
            <Alert status="info" mb={6}>
              <AlertIcon />
              <Text>
                <strong>Definição:</strong> Planning Poker é um método colaborativo onde equipes usam cartas 
                numeradas para estimar o esforço, complexidade ou tamanho de tarefas em projetos de software.
              </Text>
            </Alert>

            <Text fontSize="lg" mb={4} lineHeight="1.7">
              Esta técnica combina elementos de <strong>estimativa por analogia</strong>, <strong>opinião de especialistas</strong> 
              e <strong>desagregação</strong> para criar estimativas mais precisas e reduzir o viés de ancoragem 
              que pode ocorrer em estimativas tradicionais.
            </Text>
          </Box>

          <Divider />

          {/* Section 2: How it Works */}
          <Box id="como-funciona">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Como Funciona o Planning Poker
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <Card>
                <CardHeader>
                  <Heading as="h3" size="md" color="purple.600">
                    🎯 Objetivo Principal
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Obter estimativas consensuais evitando influência mútua entre membros da equipe, 
                    resultando em previsões mais precisas.
                  </Text>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading as="h3" size="md" color="green.600">
                    ⚡ Processo Dinâmico
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text>
                    Combina discussão em grupo com votação individual, garantindo que todas as 
                    perspectivas sejam consideradas na estimativa final.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Heading as="h3" size="lg" mb={4} color="gray.700">
              Processo do Planning Poker:
            </Heading>
            
            <OrderedList spacing={3} fontSize="lg">
              <ListItem>
                <strong>Apresentação da User Story:</strong> O Product Owner apresenta a história 
                de usuário que será estimada
              </ListItem>
              <ListItem>
                <strong>Discussão:</strong> A equipe esclarece dúvidas e discute os requisitos
              </ListItem>
              <ListItem>
                <strong>Estimativa Individual:</strong> Cada membro escolhe uma carta secretamente
              </ListItem>
              <ListItem>
                <strong>Revelação Simultânea:</strong> Todos revelam suas cartas ao mesmo tempo
              </ListItem>
              <ListItem>
                <strong>Discussão das Diferenças:</strong> Membros com estimativas extremas explicam seus pontos de vista
              </ListItem>
              <ListItem>
                <strong>Nova Rodada:</strong> O processo se repete até chegar a um consenso
              </ListItem>
            </OrderedList>
          </Box>

          <Divider />

          {/* Section 3: Fibonacci Sequence */}
          <Box id="sequencia-fibonacci">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Por que usar a Sequência de Fibonacci?
            </Heading>
            
            <Text fontSize="lg" mb={4} lineHeight="1.7">
              A <strong>sequência de Fibonacci</strong> (0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89) é amplamente 
              usada no Planning Poker por refletir a <strong>incerteza natural</strong> em estimativas de software.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
              <Card bg="orange.50" borderLeft="4px solid" borderLeftColor="orange.400">
                <CardBody>
                  <Heading as="h4" size="sm" mb={2} color="orange.600">
                    🎯 Precisão Natural
                  </Heading>
                  <Text fontSize="sm">
                    Conforme as tarefas ficam maiores, nossa capacidade de estimar com precisão diminui. 
                    Os intervalos maiores da sequência refletem essa realidade.
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="blue.50" borderLeft="4px solid" borderLeftColor="blue.400">
                <CardBody>
                  <Heading as="h4" size="sm" mb={2} color="blue.600">
                    ⚖️ Evita Falsas Precisões
                  </Heading>
                  <Text fontSize="sm">
                    Impede que a equipe gaste tempo debatendo se uma tarefa é 16 ou 17 pontos, 
                    quando a diferença real é insignificante.
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="green.50" borderLeft="4px solid" borderLeftColor="green.400">
                <CardBody>
                  <Heading as="h4" size="sm" mb={2} color="green.600">
                    🚀 Força Divisão
                  </Heading>
                  <Text fontSize="sm">
                    Tarefas muito grandes (21+ pontos) indicam necessidade de quebrar em 
                    subtarefas menores e mais gerenciáveis.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Section 4: Benefits */}
          <Box id="beneficios">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Benefícios do Planning Poker
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="lg" color="purple.600" mb={2}>
                  🎯 Para a Equipe
                </Heading>
                
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    <Text as="span" fontWeight="semibold">Reduz viés de ancoragem:</Text> Evita que estimativas 
                    sejam influenciadas pela primeira opinião expressa
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    <Text as="span" fontWeight="semibold">Promove discussão:</Text> Encoraja o compartilhamento 
                    de conhecimento e diferentes perspectivas
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    <Text as="span" fontWeight="semibold">Maior precisão:</Text> Estudos mostram que Planning 
                    Poker produz estimativas mais precisas que outros métodos
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.500" />
                    <Text as="span" fontWeight="semibold">Engajamento da equipe:</Text> Todos participam 
                    ativamente do processo de planejamento
                  </ListItem>
                </List>
              </VStack>
              
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="lg" color="blue.600" mb={2}>
                  📈 Para o Projeto
                </Heading>
                
                <List spacing={3}>
                  <ListItem>
                    <ListIcon as={StarIcon} color="blue.500" />
                    <Text as="span" fontWeight="semibold">Planejamento mais confiável:</Text> Estimativas 
                    consensuais resultam em sprints mais previsíveis
                  </ListItem>
                  <ListItem>
                    <ListIcon as={StarIcon} color="blue.500" />
                    <Text as="span" fontWeight="semibold">Identificação de riscos:</Text> Discussões revelam 
                    dependências e complexidades ocultas
                  </ListItem>
                  <ListItem>
                    <ListIcon as={StarIcon} color="blue.500" />
                    <Text as="span" fontWeight="semibold">Melhoria contínua:</Text> A equipe aprende e 
                    refina suas estimativas ao longo do tempo
                  </ListItem>
                  <ListItem>
                    <ListIcon as={StarIcon} color="blue.500" />
                    <Text as="span" fontWeight="semibold">Transparência:</Text> Processo aberto e colaborativo 
                    aumenta a confiança nas estimativas
                  </ListItem>
                </List>
              </VStack>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Section 5: Step by Step */}
          <Box id="passo-a-passo">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Como Fazer Planning Poker: Passo a Passo Detalhado
            </Heading>
            
            <Alert status="success" mb={6}>
              <AlertIcon />
              <Text>
                <strong>Dica Pro:</strong> Use nossa ferramenta online gratuita para facilitar 
                o processo e manter todos engajados!
              </Text>
            </Alert>

            <VStack spacing={6} align="stretch">
              {[
                {
                  step: "1",
                  title: "Preparação da Sessão",
                  content: "Reúna a equipe de desenvolvimento, Scrum Master e Product Owner. Prepare a lista de User Stories do Product Backlog que serão estimadas.",
                  tips: ["Limite a sessão a 2 horas", "Tenha as User Stories bem definidas", "Garante que todos tenham acesso às cartas"]
                },
                {
                  step: "2", 
                  title: "Apresentação da User Story",
                  content: "O Product Owner apresenta a User Story, explica os critérios de aceitação e responde perguntas da equipe.",
                  tips: ["Seja claro nos requisitos", "Use exemplos práticos", "Esclareça todas as dúvidas"]
                },
                {
                  step: "3",
                  title: "Discussão Inicial",
                  content: "A equipe discute a implementação, identifica dependências, riscos e complexidades técnicas.",
                  tips: ["Limite o tempo de discussão", "Foque no escopo da story", "Anote pontos importantes"]
                },
                {
                  step: "4",
                  title: "Estimativa Individual",
                  content: "Cada membro escolhe uma carta com sua estimativa secretamente, sem revelar para os outros.",
                  tips: ["Pense na complexidade total", "Compare com stories similares", "Considere sua experiência"]
                },
                {
                  step: "5",
                  title: "Revelação Simultânea",
                  content: "Todos revelam suas cartas ao mesmo tempo. Se há consenso (todas iguais ou próximas), a estimativa está pronta.",
                  tips: ["Revele exatamente ao mesmo tempo", "Observe as diferenças", "Celebre consensos rápidos"]
                },
                {
                  step: "6",
                  title: "Discussão das Diferenças",
                  content: "Se há divergências significativas, membros com estimativas extremas (maior e menor) explicam seus pontos de vista.",
                  tips: ["Ouça atentamente", "Foque nos argumentos técnicos", "Evite convencer, apenas explique"]
                },
                {
                  step: "7",
                  title: "Nova Rodada",
                  content: "Após a discussão, uma nova rodada de estimativas é feita. Repete até chegar ao consenso.",
                  tips: ["Máximo 3-4 rodadas", "Se não há consenso, divida a story", "Documente a decisão final"]
                }
              ].map((item, index) => (
                <Card key={index} bg={index % 2 === 0 ? "purple.50" : "blue.50"}>
                  <CardBody>
                    <HStack align="start" spacing={4}>
                      <Box 
                        w={12} 
                        h={12} 
                        bg={index % 2 === 0 ? "purple.500" : "blue.500"} 
                        color="white" 
                        borderRadius="full" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        fontWeight="bold"
                        fontSize="lg"
                        flexShrink={0}
                      >
                        {item.step}
                      </Box>
                      <VStack align="start" spacing={3} flex={1}>
                        <Heading as="h3" size="md" color="gray.700">
                          {item.title}
                        </Heading>
                        <Text fontSize="md" lineHeight="1.6">
                          {item.content}
                        </Text>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={2}>
                            💡 Dicas:
                          </Text>
                          <UnorderedList fontSize="sm" color="gray.600" pl={4}>
                            {item.tips.map((tip, tipIndex) => (
                              <ListItem key={tipIndex}>{tip}</ListItem>
                            ))}
                          </UnorderedList>
                        </Box>
                      </VStack>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          <Divider />

          {/* Section 6: Card Types */}
          <Box id="cartas">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Tipos de Cartas e Valores no Planning Poker
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <Card>
                <CardHeader>
                  <Heading as="h3" size="md" color="purple.600">
                    🔢 Sequência Fibonacci Clássica
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Text mb={3}>A mais utilizada em Planning Poker:</Text>
                  <Flex wrap="wrap" gap={2}>
                    {['0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89'].map(value => (
                      <Badge key={value} colorScheme="purple" fontSize="md" p={2}>
                        {value}
                      </Badge>
                    ))}
                  </Flex>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <Heading as="h3" size="md" color="blue.600">
                    ⚡ Cartas Especiais
                  </Heading>
                </CardHeader>
                <CardBody>
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Badge colorScheme="orange" fontSize="md">?</Badge>
                      <Text fontSize="sm">Não sei / Preciso de mais informações</Text>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="green" fontSize="md">☕</Badge>
                      <Text fontSize="sm">Preciso de uma pausa</Text>
                    </HStack>
                    <HStack>
                      <Badge colorScheme="red" fontSize="md">∞</Badge>
                      <Text fontSize="sm">Tarefa muito grande / Impossível estimar</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Heading as="h3" size="lg" mb={4} color="gray.700">
              Interpretação dos Valores:
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {[
                { value: "0", meaning: "Tarefa já está pronta ou é trivial", color: "gray" },
                { value: "1", meaning: "Tarefa muito simples, conhecida", color: "green" },
                { value: "2", meaning: "Tarefa simples com pouca complexidade", color: "green" },
                { value: "3", meaning: "Tarefa de complexidade baixa-média", color: "yellow" },
                { value: "5", meaning: "Tarefa de complexidade média", color: "yellow" },
                { value: "8", meaning: "Tarefa complexa, mas bem entendida", color: "orange" },
                { value: "13", meaning: "Tarefa muito complexa ou com incertezas", color: "red" },
                { value: "21+", meaning: "Considere dividir em tarefas menores", color: "red" }
              ].map((item, index) => (
                <Card key={index} size="sm">
                  <CardBody>
                    <HStack spacing={3}>
                      <Badge colorScheme={item.color} fontSize="lg" minW="8">
                        {item.value}
                      </Badge>
                      <Text fontSize="sm">{item.meaning}</Text>
                    </HStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Section 7: Tips and Best Practices */}
          <Box id="dicas">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Dicas e Melhores Práticas
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <Card bg="green.50" borderLeft="4px solid" borderLeftColor="green.400">
                <CardHeader>
                  <Heading as="h3" size="md" color="green.600">
                    ✅ Faça Assim
                  </Heading>
                </CardHeader>
                <CardBody>
                  <UnorderedList spacing={2}>
                    <ListItem>Mantenha sessões de no máximo 2 horas</ListItem>
                    <ListItem>Limite a 3-4 rodadas por User Story</ListItem>
                    <ListItem>Use um moderador experiente</ListItem>
                    <ListItem>Documente as estimativas e premissas</ListItem>
                    <ListItem>Revise estimativas após completar as tarefas</ListItem>
                    <ListItem>Mantenha o foco na User Story em discussão</ListItem>
                    <ListItem>Celebre consensos rápidos</ListItem>
                  </UnorderedList>
                </CardBody>
              </Card>
              
              <Card bg="red.50" borderLeft="4px solid" borderLeftColor="red.400">
                <CardHeader>
                  <Heading as="h3" size="md" color="red.600">
                    ❌ Evite Fazer
                  </Heading>
                </CardHeader>
                <CardBody>
                  <UnorderedList spacing={2}>
                    <ListItem>Permitir que membros sêniores dominem</ListItem>
                    <ListItem>Estimar sem critérios de aceitação claros</ListItem>
                    <ListItem>Forçar consenso muito rapidamente</ListItem>
                    <ListItem>Incluir tempo de testes na estimativa</ListItem>
                    <ListItem>Estimar tarefas de infraestrutura junto com features</ListItem>
                    <ListItem>Usar Planning Poker para avaliar performance</ListItem>
                    <ListItem>Debater estimativas por mais de 15 minutos</ListItem>
                  </UnorderedList>
                </CardBody>
              </Card>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Section 8: Tools */}
          <Box id="ferramentas">
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Ferramentas para Planning Poker Online
            </Heading>
            
            <Text fontSize="lg" mb={6} lineHeight="1.7">
              Com equipes remotas se tornando cada vez mais comuns, ferramentas online para Planning Poker 
              são essenciais. Nossa plataforma oferece tudo que você precisa para sessões eficazes:
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
              <Card bg="purple.50" borderTop="4px solid" borderTopColor="purple.500">
                <CardBody textAlign="center">
                  <Icon as={CheckCircleIcon} w={12} h={12} color="purple.500" mb={4} />
                  <Heading as="h3" size="md" mb={3} color="purple.600">
                    Colaboração em Tempo Real
                  </Heading>
                  <Text fontSize="sm">
                    Veja as escolhas de todos simultaneamente, exatamente como no Planning Poker presencial.
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="blue.50" borderTop="4px solid" borderTopColor="blue.500">
                <CardBody textAlign="center">
                  <Icon as={StarIcon} w={12} h={12} color="blue.500" mb={4} />
                  <Heading as="h3" size="md" mb={3} color="blue.600">
                    Sem Cadastro Necessário
                  </Heading>
                  <Text fontSize="sm">
                    Comece em segundos! Crie uma sala, compartilhe o link e sua equipe pode participar imediatamente.
                  </Text>
                </CardBody>
              </Card>
              
              <Card bg="green.50" borderTop="4px solid" borderTopColor="green.500">
                <CardBody textAlign="center">
                  <Icon as={CheckCircleIcon} w={12} h={12} color="green.500" mb={4} />
                  <Heading as="h3" size="md" mb={3} color="green.600">
                    100% Gratuito
                  </Heading>
                  <Text fontSize="sm">
                    Nossa ferramenta é completamente gratuita, sem limitações de uso ou número de participantes.
                  </Text>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Card bg="gradient" bgGradient="linear(to-r, purple.500, blue.500)" color="white" p={8}>
              <VStack spacing={4} textAlign="center">
                <Heading as="h3" size="lg">
                  Pronto para começar seu Planning Poker?
                </Heading>
                <Text fontSize="lg">
                  Crie uma sala agora e experimente a diferença que o Planning Poker faz no seu time!
                </Text>
                <CreateRoomButton />
              </VStack>
            </Card>
          </Box>

          {/* FAQ Section */}
          <Box>
            <Heading as="h2" size="xl" mb={6} color="gray.800">
              Perguntas Frequentes sobre Planning Poker
            </Heading>
            
            <VStack spacing={4} align="stretch">
              {[
                {
                  question: "Qual a diferença entre Planning Poker e outras técnicas de estimativa?",
                  answer: "O Planning Poker combina estimativa individual com discussão em grupo, reduzindo viés de ancoragem e promovendo consenso. Outras técnicas como estimativa por analogia ou opinião de especialistas não oferecem a mesma proteção contra influências."
                },
                {
                  question: "Quanto tempo demora uma sessão de Planning Poker?",
                  answer: "Geralmente 1-2 horas para estimar 8-12 User Stories. O tempo varia conforme a complexidade das histórias e experiência da equipe. Sessões mais longas tendem a ser menos produtivas."
                },
                {
                  question: "Quantas pessoas podem participar do Planning Poker?",
                  answer: "O ideal são 4-8 pessoas (equipe de desenvolvimento + Scrum Master + Product Owner). Com mais de 10 pessoas, a dinâmica fica complexa e pode ser necessário dividir em grupos menores."
                },
                {
                  question: "E se a equipe nunca chegar a um consenso?",
                  answer: "Se após 3-4 rodadas não há consenso, considere: dividir a User Story em partes menores, buscar mais informações com stakeholders, ou usar a média das estimativas como decisão pragmática."
                },
                {
                  question: "Planning Poker funciona para equipes remotas?",
                  answer: "Sim! Ferramentas online como a nossa tornam o Planning Poker ainda mais eficaz para equipes remotas, garantindo que todos participem igualmente independente da localização."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardBody>
                    <Heading as="h3" size="md" mb={3} color="gray.700">
                      {faq.question}
                    </Heading>
                    <Text color="gray.600" lineHeight="1.6">
                      {faq.answer}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* Call to Action Footer */}
          <Card bg="purple.600" color="white" textAlign="center" p={8}>
            <VStack spacing={4}>
              <Heading as="h2" size="xl">
                Transforme seu Planning com Planning Poker
              </Heading>
              <Text fontSize="lg" maxW="2xl">
                Junte-se a milhares de equipes que já melhoraram suas estimativas e planejamento 
                usando nossa ferramenta gratuita de Planning Poker online.
              </Text>
              <HStack spacing={4}>
                <CreateRoomButton />
                <Button 
                  as={Link} 
                  href="/faq" 
                  variant="outline" 
                  colorScheme="white" 
                  size="lg"
                >
                  FAQ - Perguntas Frequentes
                </Button>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </>
  );
}
