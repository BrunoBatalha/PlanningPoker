'use client'

import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Heading,
  HStack,
  SimpleGrid,
  Tag,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  AppShell,
  ButtonShareRoom,
  FeedbackState,
  GlassPanel,
  ParticipantCard,
  ResultsPanel,
  RoundStatus,
  type RoundPhase,
  VotingCard,
} from "@/components";
import { roomService } from "@/services/RoomService";
import {
  type CurrentUser,
  type RoomUser,
  userService,
} from "@/services/UserService";

interface ParamsUrl {
  key: string;
}

type RoomPageState = "loading" | "ready" | "not-found" | "error";

const POINTS = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
  "?",
  "☕",
];

export default function Page({
  params: { key: roomKey },
}: {
  params: ParamsUrl;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pageState, setPageState] = useState<RoomPageState>("loading");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [participants, setParticipants] = useState<RoomUser[]>([]);
  const [pointSelected, setPointSelected] = useState<string | null>(null);
  const [isShowingAverage, setIsShowingAverage] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isRoundActionLoading, setIsRoundActionLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initializeRoom() {
      try {
        const existsRoom = await roomService.roomExists(roomKey);

        if (!isMounted) {
          return;
        }

        if (!existsRoom) {
          setPageState("not-found");
          return;
        }

        const storedUser = userService.getCurrentUser();

        if (!storedUser) {
          router.replace(`/room/join/${roomKey}`);
          return;
        }

        setCurrentUser(storedUser);
        setPageState("ready");
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setPageState("error");
        }
      }
    }

    initializeRoom();

    return () => {
      isMounted = false;
    };
  }, [roomKey, router]);

  useEffect(() => {
    if (!currentUser || pageState !== "ready") {
      return;
    }

    const unsubscribePlayers = userService.onPlayersUpdate(
      roomKey,
      (users) => {
        const roomCurrentUser = users.find(
          (participant) => participant.key === currentUser.key,
        );

        if (!roomCurrentUser) {
          router.replace(`/room/join/${roomKey}`);
          return;
        }

        setParticipants(users);
        setPointSelected(roomCurrentUser.point);
      },
      (error) => {
        console.error(error);
        setPageState("error");
      },
    );

    const unsubscribeRoom = roomService.onRoomUpdate(
      roomKey,
      (room) => {
        if (!room) {
          setPageState("not-found");
          return;
        }

        setIsShowingAverage(room.isShowingAverage);
      },
      (error) => {
        console.error(error);
        setPageState("error");
      },
    );

    return () => {
      unsubscribePlayers();
      unsubscribeRoom();
    };
  }, [currentUser, pageState, roomKey, router]);

  const voteCount = useMemo(
    () => participants.filter((participant) => participant.point !== null).length,
    [participants],
  );

  const roundPhase: RoundPhase = isShowingAverage
    ? "revealed"
    : voteCount > 0
      ? "secret"
      : "waiting";

  function showActionError(title: string) {
    toast({
      title,
      description: "Verifique sua conexão e tente novamente.",
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }

  async function handleSetPoint(point: string) {
    if (
      !currentUser ||
      pointSelected !== null ||
      isVoteLoading ||
      isShowingAverage
    ) {
      return;
    }

    const previousPoint = pointSelected;
    setPointSelected(point);
    setIsVoteLoading(true);

    try {
      await userService.savePoint(
        roomKey,
        currentUser.key,
        currentUser.username,
        point,
      );
    } catch (error) {
      console.error(error);
      setPointSelected(previousPoint);
      showActionError("Não foi possível registrar seu voto");
    } finally {
      setIsVoteLoading(false);
    }
  }

  async function undoPoint() {
    if (!currentUser || isVoteLoading || isShowingAverage) {
      return;
    }

    const previousPoint = pointSelected;
    setPointSelected(null);
    setIsVoteLoading(true);

    try {
      await userService.savePoint(
        roomKey,
        currentUser.key,
        currentUser.username,
        null,
      );
    } catch (error) {
      console.error(error);
      setPointSelected(previousPoint);
      showActionError("Não foi possível desfazer seu voto");
    } finally {
      setIsVoteLoading(false);
    }
  }

  async function revealCards() {
    setIsRoundActionLoading(true);

    try {
      await roomService.showAverage(roomKey);
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível revelar as cartas");
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  async function startNewRound() {
    setIsRoundActionLoading(true);

    try {
      await userService.resetPointsAllUsers(roomKey);
      await roomService.hideAverage(roomKey);
      setPointSelected(null);
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível iniciar uma nova rodada");
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  if (pageState !== "ready") {
    return (
      <AppShell display="grid" placeItems="center" py={8}>
        <Container maxW="lg" px={4}>
          {pageState === "loading" ? (
            <FeedbackState
              status="loading"
              title="Preparando a mesa"
              description="Estamos sincronizando a sala e os participantes."
            />
          ) : null}
          {pageState === "not-found" ? (
            <FeedbackState
              status="error"
              title="Sala não encontrada"
              description="Esta sala pode ter expirado ou o link não é válido."
              actionHref="/"
              actionLabel="Criar uma nova sala"
            />
          ) : null}
          {pageState === "error" ? (
            <FeedbackState
              status="error"
              title="A sala perdeu a conexão"
              description="Recarregue a página para tentar sincronizar novamente."
              actionHref={`/room/${roomKey}`}
              actionLabel="Recarregar sala"
            />
          ) : null}
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell pb={{ base: 6, md: 10 }}>
      <Container maxW="1440px" px={{ base: 3, sm: 4, md: 6 }} pt={4}>
        <GlassPanel
          as="header"
          strength="strong"
          px={{ base: 4, md: 5 }}
          py={3}
          mb={4}
        >
          <HStack spacing={3} flexWrap="wrap">
            <HStack spacing={3} minW={0} flex={{ base: "1 1 100%", sm: 1 }}>
              <Avatar
                name={currentUser?.username}
                size="sm"
                bg="brand.600"
                color="white"
              />
              <Box minW={0}>
                <Text color="ink.400" fontSize="xs">
                  Você está na sala
                </Text>
                <Text color="ink.100" fontWeight="800" noOfLines={1}>
                  {currentUser?.username}
                </Text>
              </Box>
              <Tag
                ml={{ base: "auto", sm: 2 }}
                colorScheme="purple"
                variant="subtle"
              >
                #{roomKey.slice(0, 6)}
              </Tag>
            </HStack>
            <HStack spacing={2} w={{ base: "full", sm: "auto" }}>
              <ButtonShareRoom size="sm" flex={{ base: 1, sm: "initial" }} />
              <Button
                leftIcon={<AddIcon />}
                variant="subtle"
                size="sm"
                onClick={() => router.push("/")}
                flex={{ base: 1, sm: "initial" }}
              >
                Nova sala
              </Button>
            </HStack>
          </HStack>
        </GlassPanel>

        <Grid
          templateColumns={{ base: "1fr", lg: "minmax(250px, 0.75fr) 2.25fr" }}
          gap={4}
          alignItems="start"
        >
          <GlassPanel
            as="aside"
            p={4}
            position={{ base: "static", lg: "sticky" }}
            top={4}
          >
            <HStack justify="space-between" mb={4}>
              <Box>
                <Text textStyle="eyebrow">Time</Text>
                <Heading as="h2" size="md" mt={1}>
                  Participantes
                </Heading>
              </Box>
              <Tag colorScheme="purple" variant="subtle">
                {participants.length}
              </Tag>
            </HStack>
            <VStack spacing={2.5} align="stretch">
              {participants.map((participant) => (
                <ParticipantCard
                  key={participant.key}
                  username={participant.username}
                  point={participant.point}
                  isCurrent={participant.key === currentUser?.key}
                  isRevealed={isShowingAverage}
                />
              ))}
            </VStack>
          </GlassPanel>

          <VStack spacing={4} align="stretch" minW={0}>
            <GlassPanel p={{ base: 5, md: 7 }}>
              <VStack spacing={6} align="stretch">
                <HStack
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  flexDir={{ base: "column", md: "row" }}
                  spacing={4}
                >
                  <RoundStatus
                    phase={roundPhase}
                    voteCount={voteCount}
                    participantCount={participants.length}
                  />
                  <Button
                    size="lg"
                    variant={isShowingAverage ? "premium" : "glass"}
                    colorScheme={isShowingAverage ? "cyan" : "purple"}
                    leftIcon={isShowingAverage ? <RepeatIcon /> : undefined}
                    onClick={
                      isShowingAverage ? startNewRound : revealCards
                    }
                    isLoading={isRoundActionLoading}
                    loadingText={
                      isShowingAverage ? "Iniciando" : "Revelando"
                    }
                    w={{ base: "full", md: "auto" }}
                  >
                    {isShowingAverage
                      ? "Iniciar nova rodada"
                      : "Revelar cartas"}
                  </Button>
                </HStack>

                {isShowingAverage ? (
                  <ResultsPanel
                    points={participants.map(
                      (participant) => participant.point,
                    )}
                  />
                ) : (
                  <Box
                    minH={{ base: 36, md: 48 }}
                    display="grid"
                    placeItems="center"
                    borderRadius="2xl"
                    border="1px dashed"
                    borderColor="whiteAlpha.200"
                    bg="rgba(4, 9, 23, 0.28)"
                    textAlign="center"
                    px={5}
                  >
                    <VStack spacing={2}>
                      <Heading as="p" size="md">
                        {voteCount === 0
                          ? "A mesa está aberta"
                          : "As cartas estão na mesa"}
                      </Heading>
                      <Text color="ink.300" fontSize="sm" maxW="md">
                        {voteCount === 0
                          ? "Cada participante escolhe sua estimativa sem influenciar o restante do time."
                          : "Os valores continuam secretos. Revele quando o time estiver pronto para conversar."}
                      </Text>
                    </VStack>
                  </Box>
                )}
              </VStack>
            </GlassPanel>

            <GlassPanel p={{ base: 5, md: 7 }}>
              <VStack spacing={5} align="stretch">
                <HStack
                  justify="space-between"
                  align={{ base: "flex-start", sm: "center" }}
                  flexDir={{ base: "column", sm: "row" }}
                  spacing={3}
                >
                  <Box>
                    <Text textStyle="eyebrow">Sua estimativa</Text>
                    <Heading as="h2" size="md" mt={1}>
                      Escolha uma carta
                    </Heading>
                  </Box>
                  {pointSelected && !isShowingAverage ? (
                    <HStack
                      justify="space-between"
                      w={{ base: "full", sm: "auto" }}
                      px={3}
                      py={2}
                      borderRadius="xl"
                      bg="rgba(112, 72, 245, 0.14)"
                      border="1px solid"
                      borderColor="brand.500"
                    >
                      <Text color="ink.200" fontSize="sm">
                        Voto guardado:{" "}
                        <Text as="span" color="white" fontWeight="900">
                          {pointSelected}
                        </Text>
                      </Text>
                      <Button
                        variant="ghost"
                        size="xs"
                        color="brand.200"
                        onClick={undoPoint}
                        isLoading={isVoteLoading}
                      >
                        Desfazer
                      </Button>
                    </HStack>
                  ) : null}
                </HStack>

                <Divider borderColor="whiteAlpha.100" />

                <SimpleGrid
                  columns={{ base: 4, sm: 7, xl: 13 }}
                  spacing={{ base: 2, md: 3 }}
                  role="group"
                  aria-label="Cartas de estimativa"
                >
                  {POINTS.map((value) => (
                    <VotingCard
                      key={value}
                      value={value}
                      isSelected={pointSelected === value}
                      isDisabled={
                        pointSelected !== null ||
                        isVoteLoading ||
                        isShowingAverage
                      }
                      onSelect={handleSetPoint}
                    />
                  ))}
                </SimpleGrid>

                {isShowingAverage ? (
                  <Text color="ink.400" fontSize="sm" textAlign="center">
                    A votação está encerrada. Inicie uma nova rodada para votar
                    novamente.
                  </Text>
                ) : null}
              </VStack>
            </GlassPanel>
          </VStack>
        </Grid>
      </Container>
    </AppShell>
  );
}
