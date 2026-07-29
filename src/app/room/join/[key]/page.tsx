'use client'

import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiLayers } from "react-icons/fi";

import {
  AppShell,
  FeedbackState,
  GlassPanel,
  UsernameForm,
} from "@/components";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";

interface ParamsUrl {
  key: string;
}

type JoinPageState = "loading" | "ready" | "not-found" | "error";

export default function Page({ params }: { params: ParamsUrl }) {
  const router = useRouter();
  const toast = useToast();
  const [pageState, setPageState] = useState<JoinPageState>("loading");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function validateRoom() {
      try {
        const exists = await roomService.roomExists(params.key);

        if (isMounted) {
          setPageState(exists ? "ready" : "not-found");
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setPageState("error");
        }
      }
    }

    validateRoom();

    return () => {
      isMounted = false;
    };
  }, [params.key]);

  async function handleSubmit({ username }: { username: string }) {
    setIsJoining(true);

    try {
      const stillExists = await roomService.roomExists(params.key);

      if (!stillExists) {
        setPageState("not-found");
        setIsJoining(false);
        return;
      }

      const userKey = await userService.addUserToRoom(params.key, username);
      userService.setCurrentUser({ key: userKey, username });
      router.replace(`/room/${params.key}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Não foi possível entrar na sala",
        description: "Verifique sua conexão e tente novamente.",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
      setIsJoining(false);
    }
  }

  return (
    <AppShell display="grid" placeItems="center" py={{ base: 6, md: 12 }}>
      <Container maxW="lg" px={{ base: 4, md: 6 }}>
        {pageState === "loading" ? (
          <FeedbackState
            status="loading"
            title="Abrindo a sala"
            description="Estamos verificando o convite do seu time."
          />
        ) : null}

        {pageState === "not-found" ? (
          <FeedbackState
            status="error"
            title="Sala não encontrada"
            description="Este convite pode ter expirado ou a sala não existe mais."
            actionHref="/"
            actionLabel="Criar uma nova sala"
          />
        ) : null}

        {pageState === "error" ? (
          <FeedbackState
            status="error"
            title="Não foi possível abrir a sala"
            description="Verifique sua conexão e recarregue a página."
            actionHref="/"
            actionLabel="Voltar ao início"
          />
        ) : null}

        {pageState === "ready" ? (
          <GlassPanel strength="strong" p={{ base: 6, sm: 8, md: 10 }}>
            <VStack spacing={7} align="stretch">
              <Box>
                <Button
                  as={Link}
                  href="/"
                  leftIcon={<ArrowBackIcon />}
                  variant="ghost"
                  size="sm"
                  color="ink.300"
                  px={0}
                  mb={7}
                >
                  Voltar ao início
                </Button>
                <Box
                  display="grid"
                  placeItems="center"
                  boxSize={14}
                  borderRadius="2xl"
                  bgGradient="linear(to-br, brand.400, violet.500)"
                  boxShadow="glowBrand"
                  mb={5}
                >
                  <Icon as={FiLayers} boxSize={7} color="white" />
                </Box>
                <Text textStyle="eyebrow">Convite para o time</Text>
                <Heading as="h1" size="xl" mt={2}>
                  Entre na sala
                </Heading>
                <Text color="ink.300" mt={3}>
                  Digite seu nome e participe da próxima estimativa em tempo
                  real.
                </Text>
              </Box>
              <UsernameForm
                onSubmit={handleSubmit}
                isLoading={isJoining}
                submitLabel="Entrar na sala"
              />
            </VStack>
          </GlassPanel>
        ) : null}
      </Container>
    </AppShell>
  );
}
