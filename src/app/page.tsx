import CreateRoomButton from "@/components/CreateRoomButton";
import { CheckCircleIcon, Icon, StarIcon } from "@/components/Icons";
import { Box, Button, Container, Heading, HStack, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxW="6xl" py={12}>
      {/* Hero Section */}
      <VStack spacing={8} textAlign="center" mb={16}>
        <Image 
          src="/logo-text.png" 
          alt="Planning Poker Online - Logo"
          maxH="120px"
          objectFit="contain"
          fallback={
            <Heading 
              as="h1" 
              size="2xl" 
              fontWeight="bold"
              bgGradient="linear(to-r, purple.600, blue.600)"
              bgClip="text"
            >
              Planning Poker Online
            </Heading>
          }
        />
        
        <Text fontSize="xl" color="gray.600" maxW="2xl">
          Ferramenta gratuita de Planning Poker para equipes ágeis. 
          Estime histórias de usuário com sua equipe de forma colaborativa e eficiente.
        </Text>
        
        <CreateRoomButton />
      </VStack>

      {/* Features Section */}
      <VStack spacing={12} mb={16}>
        <Heading as="h2" size="xl" textAlign="center">
          Por que usar nosso Planning Poker?
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
          <VStack spacing={4} textAlign="center" p={6} bg="purple.50" borderRadius="lg">
            <Icon as={StarIcon} w={12} h={12} color="purple.500" />
            <Heading as="h3" size="md">Colaboração em Tempo Real</Heading>
            <Text color="gray.600">
              Convide sua equipe para estimar juntos. Todos podem ver as cartas ao mesmo tempo.
            </Text>
          </VStack>
          
          <VStack spacing={4} textAlign="center" p={6} bg="blue.50" borderRadius="lg">
            <Icon as={StarIcon} w={12} h={12} color="blue.500" />
            <Heading as="h3" size="md">Fácil de Usar</Heading>
            <Text color="gray.600">
              Interface simples e intuitiva. Comece em segundos, sem cadastro necessário.
            </Text>
          </VStack>
          
          <VStack spacing={4} textAlign="center" p={6} bg="green.50" borderRadius="lg">
            <Icon as={CheckCircleIcon} w={12} h={12} color="green.500" />
            <Heading as="h3" size="md">Totalmente Gratuito</Heading>
            <Text color="gray.600">
              100% gratuito para equipes de qualquer tamanho. Sem limites ou restrições.
            </Text>
          </VStack>
        </SimpleGrid>
      </VStack>

      {/* How it Works */}
      <VStack spacing={8} mb={16}>
        <Heading as="h2" size="xl" textAlign="center">
          Como Funciona
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
          <VStack spacing={4} align="start">
            <HStack>
              <Box w={8} h={8} bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold">1</Box>
              <Heading as="h3" size="md">Crie uma Sala</Heading>
            </HStack>
            <Text color="gray.600">
              Clique em &quot;Começar&quot; e digite seu nome para criar uma nova sala de Planning Poker.
            </Text>
          </VStack>
          
          <VStack spacing={4} align="start">
            <HStack>
              <Box w={8} h={8} bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold">2</Box>
              <Heading as="h3" size="md">Convide sua Equipe</Heading>
            </HStack>
            <Text color="gray.600">
              Compartilhe o link da sala com os membros da sua equipe para que possam participar.
            </Text>
          </VStack>
          
          <VStack spacing={4} align="start">
            <HStack>
              <Box w={8} h={8} bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold">3</Box>
              <Heading as="h3" size="md">Escolha suas Cartas</Heading>
            </HStack>
            <Text color="gray.600">
              Cada membro seleciona uma carta com sua estimativa para a história em discussão.
            </Text>
          </VStack>
          
          <VStack spacing={4} align="start">
            <HStack>
              <Box w={8} h={8} bg="purple.500" color="white" borderRadius="full" display="flex" alignItems="center" justifyContent="center" fontWeight="bold">4</Box>
              <Heading as="h3" size="md">Revele e Discuta</Heading>
            </HStack>
            <Text color="gray.600">
              Revele todas as cartas simultaneamente e discuta as diferenças para chegar a um consenso.
            </Text>
          </VStack>
        </SimpleGrid>
      </VStack>

      {/* FAQ Section */}
      <VStack spacing={8}>
        <Heading as="h2" size="xl" textAlign="center">
          Perguntas Frequentes
        </Heading>
        
        <VStack spacing={6} w="full" maxW="4xl">
          <Box w="full" p={6} bg="gray.50" borderRadius="lg">
            <Heading as="h3" size="md" mb={3}>O que é Planning Poker?</Heading>
            <Text color="gray.700">
              Planning Poker é uma técnica de estimativa ágil onde a equipe usa cartas numeradas para estimar 
              o esforço necessário para completar histórias de usuário. É uma forma colaborativa e eficaz de 
              planejar sprints em metodologias ágeis como Scrum.
            </Text>
          </Box>
          
          <Box w="full" p={6} bg="gray.50" borderRadius="lg">
            <Heading as="h3" size="md" mb={3}>Como funciona a estimativa?</Heading>
            <Text color="gray.700">
              Cada membro da equipe escolhe uma carta com sua estimativa em pontos de história (usando a sequência 
              de Fibonacci). Após todos escolherem, as cartas são reveladas simultaneamente para evitar influência 
              entre os membros.
            </Text>
          </Box>
          
          <Box w="full" p={6} bg="gray.50" borderRadius="lg">
            <Heading as="h3" size="md" mb={3}>É necessário cadastro?</Heading>
            <Text color="gray.700">
              Não! Nossa ferramenta é totalmente gratuita e não requer cadastro. Basta digitar seu nome e 
              começar a usar imediatamente.
            </Text>
          </Box>
        </VStack>

        {/* Learn More Section */}
        <Box textAlign="center" mt={8}>
          <Text fontSize="lg" color="gray.600" mb={4}>
            Quer saber mais sobre Planning Poker?
          </Text>
          <Button 
            as={Link} 
            href="/o-que-e-planning-poker"
            colorScheme="purple"
            variant="outline"
            size="lg"
          >
            Guia Completo: O que é Planning Poker?
          </Button>
        </Box>
      </VStack>
    </Container>
  );
}