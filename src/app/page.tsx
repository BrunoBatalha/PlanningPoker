'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FiCheck,
  FiClock,
  FiEyeOff,
  FiLink,
  FiShield,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import CreateRoomButton from "@/components/CreateRoomButton";
import { AppShell, GlassPanel, Header } from "@/components";

const benefits = [
  {
    icon: FiZap,
    title: "Colaboração em tempo real",
    description:
      "Acompanhe quem já votou e mantenha o time sincronizado sem atualizar a página.",
    color: "signal.cyan",
  },
  {
    icon: FiShield,
    title: "Estimativas sem influência",
    description:
      "As escolhas ficam secretas até a revelação simultânea das cartas.",
    color: "signal.indigo",
  },
  {
    icon: FiClock,
    title: "Decisões registradas",
    description:
      "Confirme a rodada para guardar a média, a distribuição e os votos no histórico da sala.",
    color: "signal.blue",
  },
];

const steps = [
  {
    number: "01",
    title: "Crie a sala e dê contexto",
    description:
      'Clique em "Criar sala grátis", informe seu nome e nomeie a história ou tarefa da rodada.',
  },
  {
    number: "02",
    title: "Convide seu time",
    description:
      "Compartilhe o link. Cada pessoa entra com o próprio nome, sem criar conta.",
  },
  {
    number: "03",
    title: "Vote em segredo",
    description:
      "Escolha uma carta Fibonacci ou use ? para pedir mais informações e ☕ para sinalizar uma pausa.",
  },
  {
    number: "04",
    title: "Revele e avance",
    description:
      "Compare a média e a distribuição, refaça a rodada ou confirme o resultado e inicie a próxima.",
  },
];

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Battle Poker",
    alternateName: "Planning Poker Online Gratuito",
    url: "https://battlepoker.devnabatalha.com",
    description:
      "Ferramenta gratuita de Planning Poker para equipes ágeis. Crie uma sala, compartilhe o link e revele estimativas simultaneamente.",
    inLanguage: "pt-BR",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Battle Poker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web Browser",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BRL",
      },
      featureList: [
        "Salas compartilháveis por link",
        "Votação em tempo real",
        "Revelação simultânea das cartas",
        "Média e distribuição dos votos",
        "Histórico de rodadas confirmadas",
        "Sem cadastro",
      ],
    },
  };

  return (
    <AppShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <Header showFullLogo />

      <Box as="main">
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Grid
            as="section"
            minH={{ base: "auto", lg: "calc(100dvh - 89px)" }}
            py={{ base: 16, md: 24 }}
            templateColumns={{ base: "1fr", lg: "1.08fr 0.92fr" }}
            gap={{ base: 12, lg: 16 }}
            alignItems="center"
          >
            <VStack align="flex-start" spacing={7}>
              <Tag size="lg" variant="subtle" colorScheme="purple" px={4} py={2}>
                <HStack spacing={2}>
                  <Icon as={FiUsers} />
                  <Text>Planning Poker online e gratuito</Text>
                </HStack>
              </Tag>
              <Box>
                <Heading as="h1" textStyle="display" maxW="4xl">
                  Estimativas mais honestas.{" "}
                  <Text as="span" bgGradient="linear(to-r, brand.200, signal.cyan)" bgClip="text">
                    Conversas melhores.
                  </Text>
                </Heading>
                <Text mt={6} color="ink.300" textStyle="body-lg" maxW="2xl">
                  Reúna seu time, vote com cartas Fibonacci ou especiais e revele todas as
                  estimativas ao mesmo tempo. Sem cadastro e sem distrações.
                </Text>
              </Box>
              <Stack direction={{ base: "column", sm: "row" }} spacing={3} w={{ base: "full", sm: "auto" }}>
                <CreateRoomButton w={{ base: "full", sm: "auto" }} />
                <Button as={Link} href="/o-que-e-planning-poker" size="lg" variant="glass" w={{ base: "full", sm: "auto" }}>
                  Entender como funciona
                </Button>
              </Stack>
              <HStack spacing={{ base: 3, md: 6 }} flexWrap="wrap" color="ink.300" textStyle="body-sm">
                {["Sem cadastro", "Tempo real", "100% gratuito"].map((item) => (
                  <HStack key={item} spacing={1.5}>
                    <Icon as={FiCheck} color="signal.green" />
                    <Text>{item}</Text>
                  </HStack>
                ))}
              </HStack>
            </VStack>

            <Box position="relative" minH={{ base: "430px", md: "520px" }}>
              <Box position="absolute" inset={{ base: "8% 4% 2%", md: "5% 2% 0%" }} borderRadius="3xl" bgGradient="linear(to-br, rgba(112,72,245,0.18), rgba(77,227,227,0.08))" filter="blur(2px)" />
              <GlassPanel position="absolute" inset={{ base: "4% 0 0", sm: "5% 5% 0" }} strength="strong" p={{ base: 5, md: 7 }} overflow="hidden">
                <HStack justify="space-between" mb={8}>
                  <RoundPreviewStatus />
                  <Tag colorScheme="purple">4 pessoas</Tag>
                </HStack>
                <HStack justify="center" spacing={{ base: -3, md: -1 }} py={7}>
                  {["3", "8", "?", "☕"].map((point, index) => (
                    <Box
                      key={point}
                      w={{ base: 16, sm: 20, md: 24 }}
                      h={{ base: 24, sm: 28, md: 32 }}
                      display="grid"
                      placeItems="center"
                      borderRadius="2xl"
                      bg={index === 2 ? "rgba(112, 72, 245, 0.34)" : "rgba(17, 25, 49, 0.94)"}
                      border="1px solid"
                      borderColor={index === 2 ? "brand.300" : "whiteAlpha.200"}
                      boxShadow={index === 2 ? "glowBrand" : "0 14px 30px rgba(0,0,0,.25)"}
                      color="white"
                      textStyle="code-card"
                      transform={`rotate(${(index - 1.5) * 5}deg) translateY(${Math.abs(index - 1.5) * 5}px)`}
                      zIndex={index}
                    >
                      {point}
                    </Box>
                  ))}
                </HStack>
                <VStack spacing={3} align="stretch" mt={7}>
                  {["Marina votou", "Rafael votou", "Joana está pensando"].map((participant, index) => (
                    <HStack key={participant} justify="space-between" p={3} borderRadius="xl" bg="whiteAlpha.50">
                      <Text color="ink.200" textStyle="body-sm">{participant}</Text>
                      <Box boxSize={2} borderRadius="full" bg={index === 2 ? "signal.blue" : "signal.green"} />
                    </HStack>
                  ))}
                </VStack>
              </GlassPanel>
            </Box>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <VStack spacing={4} textAlign="center" mb={10}>
              <Text textStyle="eyebrow">Feito para o ritmo do time</Text>
              <Heading as="h2" textStyle="h2">Planning Poker sem atrito</Heading>
              <Text color="ink.300" maxW="2xl" textStyle="body-lg">
                Uma experiência leve para sprint planning, refinamentos e estimativas remotas.
              </Text>
            </VStack>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              {benefits.map((benefit) => (
                <GlassPanel key={benefit.title} p={{ base: 6, md: 7 }}>
                  <Box display="grid" placeItems="center" boxSize={12} borderRadius="xl" bg="whiteAlpha.100" mb={5}>
                    <Icon as={benefit.icon} color={benefit.color} boxSize={5} />
                  </Box>
                  <Heading as="h3" textStyle="h3">{benefit.title}</Heading>
                  <Text color="ink.300" mt={3} textStyle="body">{benefit.description}</Text>
                </GlassPanel>
              ))}
            </SimpleGrid>
          </Box>

          <Grid as="section" py={{ base: 14, md: 24 }} templateColumns={{ base: "1fr", lg: "0.8fr 1.2fr" }} gap={{ base: 10, lg: 16 }}>
            <Box>
              <Text textStyle="eyebrow">Como funciona</Text>
              <Heading as="h2" textStyle="h2" mt={3}>Da criação ao consenso em quatro passos</Heading>
              <Text color="ink.300" mt={5} textStyle="body-lg">
                O fluxo foi desenhado para manter a atenção na história em discussão — não na ferramenta.
              </Text>
            </Box>
            <VStack spacing={3} align="stretch">
              {steps.map((step) => (
                <GlassPanel key={step.number} p={5} display="grid" gridTemplateColumns="auto 1fr" gap={4} alignItems="start">
                  <Text textStyle="label" color="brand.200" letterSpacing="0.08em">{step.number}</Text>
                  <Box>
                    <Heading as="h3" textStyle="h4">{step.title}</Heading>
                    <Text color="ink.300" mt={2} textStyle="body">{step.description}</Text>
                  </Box>
                </GlassPanel>
              ))}
            </VStack>
          </Grid>

          <Box as="section" py={{ base: 14, md: 24 }}>
            <GlassPanel strength="strong" p={{ base: 7, md: 12 }} overflow="hidden" position="relative">
              <Flex position="absolute" inset="-40% auto auto 58%" w="360px" h="360px" borderRadius="full" bg="brand.500" opacity={0.16} filter="blur(70px)" pointerEvents="none" />
              <Stack direction={{ base: "column", lg: "row" }} justify="space-between" align={{ base: "flex-start", lg: "center" }} spacing={8} position="relative">
                <Box maxW="2xl">
                  <HStack spacing={2} color="signal.cyan" mb={4}>
                    <Icon as={FiLink} />
                    <Text textStyle="eyebrow" color="signal.cyan">Convite por link</Text>
                  </HStack>
                  <Heading as="h2" textStyle="h2">Sua próxima estimativa começa agora</Heading>
                  <Text color="ink.300" mt={3} textStyle="body-lg">
                    Crie uma sala, envie o link e deixe o Battle Poker cuidar da votação e da revelação simultânea.
                  </Text>
                </Box>
                <CreateRoomButton label="Começar gratuitamente" flexShrink={0} w={{ base: "full", lg: "auto" }} />
              </Stack>
            </GlassPanel>
          </Box>

          <VStack as="section" py={{ base: 14, md: 20 }} spacing={8} textAlign="center">
            <Box>
              <Text textStyle="eyebrow">Aprenda mais</Text>
              <Heading as="h2" textStyle="h2" mt={3}>Planning Poker para equipes ágeis</Heading>
              <Text color="ink.300" mt={4} maxW="3xl" textStyle="body">
                Planning Poker é uma técnica de estimativa baseada em consenso. Cada pessoa escolhe uma carta em segredo e todas são reveladas ao mesmo tempo, reduzindo o viés de ancoragem.
              </Text>
            </Box>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
              <Button as={Link} href="/o-que-e-planning-poker" variant="glass" size="lg">Guia completo</Button>
              <Button as={Link} href="/faq" variant="subtle" size="lg">Perguntas frequentes</Button>
            </Stack>
          </VStack>
        </Container>
      </Box>

      <Box as="footer" borderTop="1px solid" borderColor="whiteAlpha.100" py={8}>
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Stack direction={{ base: "column", sm: "row" }} justify="space-between" spacing={3} color="ink.300" textStyle="body-sm">
            <Text>Battle Poker — Planning Poker online gratuito.</Text>
            <HStack spacing={4}>
              <Link href="/o-que-e-planning-poker">Guia</Link>
              <Link href="/faq">FAQ</Link>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </AppShell>
  );
}

function RoundPreviewStatus() {
  return (
    <HStack spacing={2}>
      <Box boxSize={2.5} borderRadius="full" bg="signal.indigo" boxShadow="0 0 18px rgba(155, 138, 251, 0.55)" />
      <Text color="ink.100" textStyle="body-sm" fontWeight="700">Votos secretos</Text>
      <Icon as={FiEyeOff} color="ink.400" />
    </HStack>
  );
}
