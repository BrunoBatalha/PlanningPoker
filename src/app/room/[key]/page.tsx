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
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  AppShell,
  ButtonShareRoom,
  FeedbackState,
  GlassPanel,
  ParticipantCard,
  RedoRoundConfirmationDialog,
  ResultsPanel,
  RoundConfirmationDialog,
  RoundHistory,
  RoundStatus,
  RoundTitleField,
  RoomTour,
  type RoundPhase,
  VoteWaitingGame,
  VotingCard,
} from "@/components";
import {
  hasStrictNumericUnanimity,
  VOTING_POINTS,
  type RoundOutcome,
  type RoundVoteSnapshot,
} from "@/domain/estimation";
import {
  calculateRoundAverage,
  formatRoundAverage,
  getEffectiveRoundTitle,
  type RoundHistoryItem,
  roomService,
} from "@/services/RoomService";
import {
  type CurrentUser,
  type RoomUser,
  userService,
} from "@/services/UserService";

interface ParamsUrl {
  key: string;
}

type RoomPageState = "loading" | "ready" | "not-found" | "error";

interface RoundConfirmationSnapshot {
  roundId: string;
  title: string;
  average: number | null;
  fallbackId: string;
  votes: RoundVoteSnapshot[];
  suggestedOutcome: RoundOutcome | null;
}

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
  const [gameRoundId, setGameRoundId] = useState<string | null>(null);
  const [isShowingAverage, setIsShowingAverage] = useState(false);
  const [currentRoundId, setCurrentRoundId] = useState("");
  const [currentRoundTitle, setCurrentRoundTitle] = useState("");
  const [currentRoundFallbackId, setCurrentRoundFallbackId] = useState("");
  const [roundTitleDraft, setRoundTitleDraft] = useState("");
  const [history, setHistory] = useState<RoundHistoryItem[]>([]);
  const [confirmation, setConfirmation] =
    useState<RoundConfirmationSnapshot | null>(null);
  const [redoConfirmationRoundId, setRedoConfirmationRoundId] = useState<
    string | null
  >(null);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [isTitleSaving, setIsTitleSaving] = useState(false);
  const [isRoundActionLoading, setIsRoundActionLoading] = useState(false);
  const currentRoundIdRef = useRef("");
  const currentUserPointRef = useRef<string | null>(null);
  const isShowingAverageRef = useRef(false);
  const roundTitleDraftRef = useRef("");
  const isRoundTitleDirtyRef = useRef(false);

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

        await roomService.initializeCurrentRound(roomKey);

        if (!isMounted) {
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
        currentUserPointRef.current = roomCurrentUser.point;

        if (
          roomCurrentUser.point !== null &&
          currentRoundIdRef.current &&
          !isShowingAverageRef.current
        ) {
          setGameRoundId(
            (activeRoundId) => activeRoundId ?? currentRoundIdRef.current,
          );
        }
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

        const previousRoundId = currentRoundIdRef.current;
        const isInitialRound = previousRoundId === "";
        isShowingAverageRef.current = room.isShowingAverage;
        setIsShowingAverage(room.isShowingAverage);
        setCurrentRoundId(room.currentRoundId);
        setCurrentRoundTitle(room.currentRoundTitle);
        setCurrentRoundFallbackId(room.currentRoundFallbackId);

        if (previousRoundId !== room.currentRoundId) {
          currentRoundIdRef.current = room.currentRoundId;
          setGameRoundId(
            isInitialRound &&
              currentUserPointRef.current !== null &&
              !room.isShowingAverage
              ? room.currentRoundId
              : null,
          );
          roundTitleDraftRef.current = room.currentRoundTitle;
          isRoundTitleDirtyRef.current = false;
          setRoundTitleDraft(room.currentRoundTitle);
          setConfirmation(null);
          setRedoConfirmationRoundId(null);
        } else if (!isRoundTitleDirtyRef.current) {
          roundTitleDraftRef.current = room.currentRoundTitle;
          setRoundTitleDraft(room.currentRoundTitle);
        }

        if (room.isShowingAverage) {
          setGameRoundId(null);
        }
      },
      (error) => {
        console.error(error);
        setPageState("error");
      },
    );

    const unsubscribeHistory = roomService.onHistoryUpdate(
      roomKey,
      setHistory,
      (error) => {
        console.error(error);
        setPageState("error");
      },
    );

    return () => {
      unsubscribePlayers();
      unsubscribeRoom();
      unsubscribeHistory();
    };
  }, [currentUser, pageState, roomKey, router]);

  const voteCount = useMemo(
    () => participants.filter((participant) => participant.point !== null).length,
    [participants],
  );
  const currentAverage = useMemo(
    () =>
      calculateRoundAverage(
        participants.map((participant) => participant.point),
      ),
    [participants],
  );
  const effectiveRoundTitle = getEffectiveRoundTitle(
    currentRoundTitle,
    currentRoundFallbackId,
  );
  const fallbackRoundTitle = `Story #${currentRoundFallbackId}`;
  const isWaitingGameActive =
    gameRoundId === currentRoundId &&
    currentRoundId !== "" &&
    !isShowingAverage;

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

  function showStaleRoundWarning() {
    toast({
      title: "A rodada foi alterada",
      description:
        "Os dados mudaram em outra aba. Revise as informações antes de confirmar novamente.",
      status: "warning",
      duration: 5000,
      position: "top",
      isClosable: true,
    });
  }

  function handleRoundTitleChange(value: string) {
    roundTitleDraftRef.current = value;
    isRoundTitleDirtyRef.current = true;
    setRoundTitleDraft(value);
  }

  async function saveRoundTitleDraft(): Promise<string | null> {
    if (!currentRoundId) {
      return null;
    }

    const normalizedTitle = roundTitleDraftRef.current.trim();

    if (
      !isRoundTitleDirtyRef.current &&
      normalizedTitle === currentRoundTitle
    ) {
      return normalizedTitle;
    }

    setIsTitleSaving(true);

    try {
      const result = await roomService.saveCurrentRoundTitle(
        roomKey,
        currentRoundId,
        normalizedTitle,
      );

      if (result.status === "stale") {
        isRoundTitleDirtyRef.current = false;
        showStaleRoundWarning();
        return null;
      }

      isRoundTitleDirtyRef.current = false;
      roundTitleDraftRef.current = normalizedTitle;
      setRoundTitleDraft(normalizedTitle);
      setCurrentRoundTitle(normalizedTitle);
      return normalizedTitle;
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível salvar o item da rodada");
      return null;
    } finally {
      setIsTitleSaving(false);
    }
  }

  async function handleSetPoint(point: string) {
    if (
      !currentUser ||
      isVoteLoading ||
      (!isShowingAverage && pointSelected !== null) ||
      (isShowingAverage && pointSelected === point)
    ) {
      return;
    }

    const previousPoint = pointSelected;
    setPointSelected(point);
    setIsVoteLoading(true);

    try {
      if (isShowingAverage) {
        const result = await userService.reviseRevealedPoint(
          roomKey,
          currentRoundId,
          currentUser,
          point,
        );

        if (result.status === "stale") {
          setPointSelected(previousPoint);
          showStaleRoundWarning();
        }
      } else {
        await userService.savePoint(
          roomKey,
          currentUser.key,
          currentUser.username,
          point,
        );

        if (currentRoundIdRef.current && !isShowingAverageRef.current) {
          setGameRoundId(currentRoundIdRef.current);
        }
      }
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

  async function prepareNewRound() {
    setIsRoundActionLoading(true);

    try {
      const savedTitle = await saveRoundTitleDraft();

      if (savedTitle === null) {
        return;
      }

      setConfirmation({
        roundId: currentRoundId,
        title: getEffectiveRoundTitle(savedTitle, currentRoundFallbackId),
        average: currentAverage,
        fallbackId: currentRoundFallbackId,
        votes: participants.map(({ key, username, point }) => ({
          key,
          username,
          point,
        })),
        suggestedOutcome: (() => {
          const unanimousPoint = hasStrictNumericUnanimity(
            participants.map((participant) => participant.point),
          );

          return unanimousPoint
            ? { kind: "estimated", agreedEstimate: unanimousPoint }
            : null;
        })(),
      });
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível preparar a nova rodada");
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  async function confirmNewRound(outcome: RoundOutcome) {
    if (!confirmation) {
      return;
    }

    setIsRoundActionLoading(true);

    try {
      const result = await roomService.confirmAndStartNextRound(
        roomKey,
        { ...confirmation, outcome },
      );

      if (result.status === "stale") {
        setConfirmation(null);
        showStaleRoundWarning();
      } else if (result.status === "invalid_outcome") {
        showActionError("Escolha um resultado válido para a rodada");
      } else {
        setConfirmation(null);
      }
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível iniciar uma nova rodada");
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  async function prepareRedoRound() {
    setIsRoundActionLoading(true);

    try {
      const savedTitle = await saveRoundTitleDraft();

      if (savedTitle === null) {
        return;
      }

      setRedoConfirmationRoundId(currentRoundId);
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível preparar a rodada");
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  async function confirmRedoRound() {
    if (!redoConfirmationRoundId) {
      return;
    }

    setIsRoundActionLoading(true);

    try {
      const result = await roomService.redoRound(
        roomKey,
        redoConfirmationRoundId,
      );

      setRedoConfirmationRoundId(null);

      if (result.status === "stale") {
        showStaleRoundWarning();
      }
    } catch (error) {
      console.error(error);
      showActionError("Não foi possível refazer a rodada");
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
      <VisuallyHidden as="h1">Sala de Planning Poker</VisuallyHidden>
      <Container maxW="1440px" px={{ base: 3, sm: 4, md: 6 }} pt={4}>
        <GlassPanel
          as="header"
          data-tour="room-header"
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
                <Text color="ink.300" textStyle="caption">
                  Você está na sala
                </Text>
                <Text
                  color="ink.100"
                  textStyle="label"
                  fontWeight="700"
                  noOfLines={1}
                >
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
            data-tour="room-participants"
            p={4}
            position={{ base: "static", lg: "sticky" }}
            top={4}
          >
            <HStack justify="space-between" mb={4}>
              <Box>
                <Text textStyle="eyebrow">Time</Text>
                <Heading as="h2" textStyle="h4" mt={1}>
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
                  postRevealVoteStatus={participant.postRevealVoteStatus}
                  isCurrent={participant.key === currentUser?.key}
                  isRevealed={isShowingAverage}
                />
              ))}
            </VStack>
          </GlassPanel>

          <VStack spacing={4} align="stretch" minW={0}>
            <GlassPanel p={{ base: 5, md: 7 }}>
              <VStack spacing={6} align="stretch">
                <Box data-tour="room-round-title">
                  <Text textStyle="eyebrow">Rodada atual</Text>
                  <Heading as="h2" textStyle="h3" mt={1} mb={5}>
                    {effectiveRoundTitle}
                  </Heading>
                  <RoundTitleField
                    value={roundTitleDraft}
                    fallbackTitle={fallbackRoundTitle}
                    isSaving={isTitleSaving}
                    onChange={handleRoundTitleChange}
                    onSave={() => void saveRoundTitleDraft()}
                  />
                </Box>

                <Divider borderColor="whiteAlpha.100" />

                <HStack
                  data-tour="room-round-actions"
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
                  {isShowingAverage ? (
                    <HStack
                      spacing={3}
                      w={{ base: "full", md: "auto" }}
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Button
                        size="lg"
                        variant="glass"
                        leftIcon={<RepeatIcon />}
                        onClick={prepareRedoRound}
                        isLoading={isRoundActionLoading}
                        loadingText="Preparando"
                        w={{ base: "full", sm: "auto" }}
                      >
                        Refazer rodada
                      </Button>
                      <Button
                        size="lg"
                        variant="premium"
                        colorScheme="cyan"
                        onClick={prepareNewRound}
                        isLoading={isRoundActionLoading}
                        loadingText="Iniciando"
                        w={{ base: "full", sm: "auto" }}
                      >
                        Iniciar nova rodada
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      size="lg"
                      variant="glass"
                      colorScheme="purple"
                      onClick={revealCards}
                      isLoading={isRoundActionLoading}
                      loadingText="Revelando"
                      w={{ base: "full", md: "auto" }}
                    >
                      Revelar cartas
                    </Button>
                  )}
                </HStack>

                <Box
                  data-tour="room-round-results"
                  position="relative"
                  minH={
                    isWaitingGameActive
                      ? "clamp(220px, 28vw, 300px)"
                      : undefined
                  }
                >
                  <VoteWaitingGame
                    isActive={isWaitingGameActive}
                    sessionId={currentRoundId}
                  />
                  {isShowingAverage ? (
                    <ResultsPanel
                      points={participants.map(
                        (participant) => participant.point,
                      )}
                    />
                  ) : !isWaitingGameActive ? (
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
                        <Heading as="p" textStyle="h4">
                          {voteCount === 0
                            ? "A mesa está aberta"
                            : "As cartas estão na mesa"}
                        </Heading>
                        <Text color="ink.300" textStyle="body-sm" maxW="md">
                          {voteCount === 0
                            ? "Cada participante escolhe sua estimativa sem influenciar o restante do time."
                            : "Os valores continuam secretos. Revele quando o time estiver pronto para conversar."}
                        </Text>
                      </VStack>
                    </Box>
                  ) : null}
                </Box>
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
                    <Heading as="h2" textStyle="h4" mt={1}>
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
                      <Text color="ink.200" textStyle="body-sm">
                        Voto guardado:{" "}
                        <Text
                          as="span"
                          color="white"
                          fontFamily="heading"
                          fontWeight="800"
                          sx={{ fontVariantNumeric: "tabular-nums" }}
                        >
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
                  data-tour="room-voting-cards"
                  columns={{ base: 4, sm: 7, xl: 13 }}
                  spacing={{ base: 2, md: 3 }}
                  role="group"
                  aria-label="Cartas de estimativa"
                >
                  {VOTING_POINTS.map((value) => (
                    <VotingCard
                      key={value}
                      value={value}
                      isSelected={pointSelected === value}
                      isDisabled={
                        isVoteLoading ||
                        (isShowingAverage
                          ? pointSelected === value
                          : pointSelected !== null)
                      }
                      onSelect={handleSetPoint}
                    />
                  ))}
                </SimpleGrid>

                {isShowingAverage ? (
                  <Text
                    color="ink.300"
                    textStyle="body-sm"
                    textAlign="center"
                  >
                    {pointSelected
                      ? "Seu voto está visível. Escolha outra carta para alterá-lo."
                      : "Você ainda não votou. Escolha uma carta para registrar seu voto após a revelação."}
                  </Text>
                ) : null}
              </VStack>
            </GlassPanel>

            <Box data-tour="room-history">
              <RoundHistory history={history} />
            </Box>
          </VStack>
        </Grid>
      </Container>
      <RoundConfirmationDialog
        isOpen={confirmation !== null}
        title={confirmation?.title ?? ""}
        averageLabel={formatRoundAverage(confirmation?.average ?? null)}
        votes={confirmation?.votes ?? []}
        suggestedOutcome={confirmation?.suggestedOutcome ?? null}
        isLoading={isRoundActionLoading}
        onCancel={() => setConfirmation(null)}
        onConfirm={(outcome) => void confirmNewRound(outcome)}
      />
      <RedoRoundConfirmationDialog
        isOpen={redoConfirmationRoundId !== null}
        isLoading={isRoundActionLoading}
        onCancel={() => setRedoConfirmationRoundId(null)}
        onConfirm={() => void confirmRedoRound()}
      />
      <RoomTour />
    </AppShell>
  );
}
