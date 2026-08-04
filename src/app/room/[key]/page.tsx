'use client'

import { ArrowBackIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  PartialRevealConfirmationDialog,
  RedoRoundConfirmationDialog,
  ResultsPanel,
  RoundConfirmationDialog,
  RoundHistory,
  RoundStatus,
  RoundTitleField,
  type RoundTitleSaveStatus,
  RoomTour,
  type RoundPhase,
  VoteWaitingGame,
  VotingCard,
} from "@/components";
import {
  getRoundVoteExtremes,
  hasStrictNumericUnanimity,
  VOTING_POINTS,
  type RoundOutcome,
  type RoundVoteSnapshot,
  type VoteExtremumStatus,
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
  getPresenceStatus,
  PRESENCE_GRACE_PERIOD_MS,
  type PresenceConnectionController,
  type PresenceSnapshot,
  type PresenceStatus,
  type RoomUser,
  userService,
} from "@/services/UserService";
import { LanguageSwitcher, useLocale, useTranslations } from "@/i18n";
import { getLocalizedHref } from "@/lib/locale-routing";

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

type RoomParticipant = RoomUser & { presenceStatus: PresenceStatus };

export default function Page({
  params: { key: roomKey },
}: {
  params: ParamsUrl;
}) {
  const locale = useLocale();
  const t = useTranslations("room");
  const router = useRouter();
  const toast = useToast();
  const [pageState, setPageState] = useState<RoomPageState>("loading");
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [participants, setParticipants] = useState<RoomUser[]>([]);
  const [presence, setPresence] = useState<PresenceSnapshot>({});
  const [presenceNow, setPresenceNow] = useState(() => Date.now());
  const [pointSelected, setPointSelected] = useState<string | null>(null);
  const [gameRoundId, setGameRoundId] = useState<string | null>(null);
  const [isShowingAverage, setIsShowingAverage] = useState(false);
  const [isWaitingGameAllowed, setIsWaitingGameAllowed] = useState(true);
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
  const [isPartialRevealOpen, setIsPartialRevealOpen] = useState(false);
  const [isVoteLoading, setIsVoteLoading] = useState(false);
  const [titleSaveStatus, setTitleSaveStatus] =
    useState<RoundTitleSaveStatus>("idle");
  const [isRoundActionLoading, setIsRoundActionLoading] = useState(false);
  const [isLeavingRoom, setIsLeavingRoom] = useState(false);
  const currentRoundIdRef = useRef("");
  const currentUserPointRef = useRef<string | null>(null);
  const isShowingAverageRef = useRef(false);
  const roundTitleDraftRef = useRef("");
  const isRoundTitleDirtyRef = useRef(false);
  const presenceConnectionRef = useRef<PresenceConnectionController | null>(
    null,
  );

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
  }, [roomKey, router, locale]);

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

    const presenceConnection = userService.connectPresence(
      roomKey,
      currentUser.key,
      (error) => console.error(error),
    );
    presenceConnectionRef.current = presenceConnection;

    const unsubscribePresence = userService.onPresenceUpdate(
      roomKey,
      (nextPresence) => {
        setPresence(nextPresence);
        setPresenceNow(Date.now());
      },
      (error) => console.error(error),
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
        setIsWaitingGameAllowed(room.isWaitingGameAllowed);
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
          setIsPartialRevealOpen(false);
        } else if (!isRoundTitleDirtyRef.current) {
          roundTitleDraftRef.current = room.currentRoundTitle;
          setRoundTitleDraft(room.currentRoundTitle);
        }

        if (room.isShowingAverage || !room.isWaitingGameAllowed) {
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
      unsubscribePresence();
      unsubscribeRoom();
      unsubscribeHistory();
      if (presenceConnectionRef.current === presenceConnection) {
        presenceConnectionRef.current = null;
      }
      void presenceConnection.disconnect();
    };
  }, [currentUser, pageState, roomKey, router, locale]);

  useEffect(() => {
    const nextExpiry = Object.values(presence)
      .filter(
        (entry) =>
          entry.connectionCount === 0 && entry.lastDisconnectedAt !== null,
      )
      .map(
        (entry) =>
          (entry.lastDisconnectedAt as number) +
          PRESENCE_GRACE_PERIOD_MS -
          presenceNow,
      )
      .filter((remaining) => remaining > 0)
      .sort((a, b) => a - b)[0];

    if (nextExpiry === undefined) {
      return;
    }

    const timeoutId = window.setTimeout(
      () => setPresenceNow(Date.now()),
      nextExpiry + 50,
    );

    return () => window.clearTimeout(timeoutId);
  }, [presence, presenceNow]);

  const voteCount = useMemo(
    () => participants.filter((participant) => participant.point !== null).length,
    [participants],
  );
  const participantsWithPresence = useMemo<RoomParticipant[]>(
    () =>
      participants.map((participant) => ({
        ...participant,
        presenceStatus:
          participant.key === currentUser?.key
            ? "online"
            : getPresenceStatus(presence[participant.key], presenceNow),
      })),
    [currentUser?.key, participants, presence, presenceNow],
  );
  const activeParticipants = useMemo(
    () =>
      participantsWithPresence.filter(
        (participant) =>
          participant.presenceStatus === "online" ||
          participant.presenceStatus === "reconnecting",
      ),
    [participantsWithPresence],
  );
  const activePendingCount = useMemo(
    () =>
      activeParticipants.filter((participant) => participant.point === null)
        .length,
    [activeParticipants],
  );
  const inactiveCount = participantsWithPresence.length - activeParticipants.length;
  const currentAverage = useMemo(
    () =>
      calculateRoundAverage(
        participants.map((participant) => participant.point),
      ),
    [participants],
  );
  const participantExtremumStatuses = useMemo(() => {
    const statuses = new Map<string, VoteExtremumStatus>();

    if (!isShowingAverage) {
      return statuses;
    }

    const extremes = getRoundVoteExtremes(participants);

    if (extremes.kind === "consensus") {
      extremes.participants.forEach((participant) => {
        statuses.set(participant.key, "consensus");
      });
    } else if (extremes.kind === "spread") {
      extremes.minimum.participants.forEach((participant) => {
        statuses.set(participant.key, "minimum");
      });
      extremes.maximum.participants.forEach((participant) => {
        statuses.set(participant.key, "maximum");
      });
    }

    return statuses;
  }, [isShowingAverage, participants]);
  const effectiveRoundTitle = getEffectiveRoundTitle(
    currentRoundTitle,
    currentRoundFallbackId,
  );
  const isWaitingGameActive =
    isWaitingGameAllowed &&
    gameRoundId === currentRoundId &&
    currentRoundId !== "" &&
    !isShowingAverage &&
    pointSelected !== null &&
    activePendingCount > 0;

  const roundPhase: RoundPhase = isShowingAverage
    ? "revealed"
    : pointSelected === null
      ? "waiting"
      : activePendingCount > 0
        ? "secret"
        : "ready";

  function renderParticipantCards() {
    return participantsWithPresence.map((participant) => (
      <ParticipantCard
        key={participant.key}
        username={participant.username}
        point={participant.point}
        postRevealVoteStatus={participant.postRevealVoteStatus}
        extremumStatus={
          participantExtremumStatuses.get(participant.key) ?? null
        }
        isCurrent={participant.key === currentUser?.key}
        isRevealed={isShowingAverage}
        presenceStatus={participant.presenceStatus}
      />
    ));
  }

  function renderVotingPanel() {
    const title = isShowingAverage
      ? t("voting.reviseTitle")
      : pointSelected
        ? t("voting.registeredTitle")
        : t("voting.chooseTitle");
    const description = isShowingAverage
      ? pointSelected
        ? t("voting.revealedWithVote")
        : t("voting.revealedWithoutVote")
      : pointSelected
        ? t("voting.registeredDescription", { pending: activePendingCount })
        : t("voting.secretDescription");

    return (
      <GlassPanel p={{ base: 5, md: 7 }}>
        <VStack spacing={5} align="stretch">
          <HStack
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            flexDir={{ base: "column", sm: "row" }}
            spacing={3}
          >
            <Box>
              <Text textStyle="eyebrow">{t("voting.eyebrow")}</Text>
              <Heading as="h2" textStyle="h4" mt={1}>
                {title}
              </Heading>
              <Text color="ink.300" textStyle="body-sm" mt={2} maxW="2xl">
                {description}
              </Text>
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
                aria-live="polite"
              >
                <Text color="ink.200" textStyle="body-sm">
                  {t("voting.registered", { point: pointSelected })}
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  minH={11}
                  color="brand.200"
                  onClick={undoPoint}
                  isLoading={isVoteLoading}
                >
                  {t("voting.remove")}
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
            aria-label={t("voting.cardsAria")}
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

          <HStack
            spacing={{ base: 3, md: 5 }}
            flexWrap="wrap"
            color="ink.300"
            textStyle="caption"
            aria-label={t("voting.specialAria")}
          >
            <Text>
              <Text as="span" color="ink.100" fontWeight="800">
                ?
              </Text>{" "}
              — {t("voting.questionCard")}
            </Text>
            <Text>
              <Text as="span" color="ink.100" fontWeight="800">
                ☕
              </Text>{" "}
              — {t("voting.pauseCard")}
            </Text>
          </HStack>
        </VStack>
      </GlassPanel>
    );
  }

  function showActionError(title: string) {
    toast({
      title,
      description: t("notifications.retryDescription"),
      status: "error",
      duration: 4000,
      position: "top",
      isClosable: true,
    });
  }

  function showStaleRoundWarning() {
    toast({
      title: t("notifications.staleTitle"),
      description: t("notifications.staleDescription"),
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
    setTitleSaveStatus("idle");
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

    setTitleSaveStatus("saving");

    try {
      const result = await roomService.saveCurrentRoundTitle(
        roomKey,
        currentRoundId,
        normalizedTitle,
      );

      if (result.status === "stale") {
        isRoundTitleDirtyRef.current = false;
        setTitleSaveStatus("error");
        showStaleRoundWarning();
        return null;
      }

      isRoundTitleDirtyRef.current = false;
      roundTitleDraftRef.current = normalizedTitle;
      setRoundTitleDraft(normalizedTitle);
      setCurrentRoundTitle(normalizedTitle);
      setTitleSaveStatus("saved");
      return normalizedTitle;
    } catch (error) {
      console.error(error);
      setTitleSaveStatus("error");
      showActionError(t("notifications.saveTitleError"));
      return null;
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
      showActionError(t("notifications.saveVoteError"));
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
      showActionError(t("notifications.undoVoteError"));
    } finally {
      setIsVoteLoading(false);
    }
  }

  async function revealCards() {
    if (voteCount === 0) {
      return;
    }

    setIsRoundActionLoading(true);

    try {
      const result = await roomService.revealRound(roomKey, currentRoundId);

      if (result.status === "stale") {
        showStaleRoundWarning();
      } else if (result.status === "no_votes") {
        showActionError(t("notifications.noVotesError"));
      } else {
        setIsPartialRevealOpen(false);
      }
    } catch (error) {
      console.error(error);
      showActionError(t("notifications.revealError"));
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  function prepareReveal() {
    if (voteCount === 0 || isRoundActionLoading) {
      return;
    }

    if (activePendingCount > 0) {
      setIsPartialRevealOpen(true);
      return;
    }

    void revealCards();
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
          if (activePendingCount > 0) {
            return null;
          }

          const unanimousPoint = hasStrictNumericUnanimity(
            participants
              .filter((participant) => participant.point !== null)
              .map((participant) => participant.point),
          );

          return unanimousPoint
            ? { kind: "estimated", agreedEstimate: unanimousPoint }
            : null;
        })(),
      });
    } catch (error) {
      console.error(error);
      showActionError(t("notifications.prepareNewRoundError"));
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
        showActionError(t("notifications.invalidOutcomeError"));
      } else {
        setConfirmation(null);
        toast({
          title: t("notifications.confirmedTitle"),
          description: t("notifications.confirmedDescription"),
          status: "success",
          duration: 3500,
          position: "top",
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      showActionError(t("notifications.startNewRoundError"));
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
      showActionError(t("notifications.prepareRedoError"));
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
      showActionError(t("notifications.redoError"));
    } finally {
      setIsRoundActionLoading(false);
    }
  }

  async function leaveRoom() {
    if (isLeavingRoom) {
      return;
    }

    setIsLeavingRoom(true);

    try {
      await presenceConnectionRef.current?.disconnect();
    } finally {
      router.push(getLocalizedHref(locale, "home"));
    }
  }

  if (pageState !== "ready") {
    return (
      <AppShell display="grid" placeItems="center" py={8}>
        <Container maxW="lg" px={4}>
          {pageState === "loading" ? (
            <FeedbackState
              status="loading"
              title={t("feedback.loadingTitle")}
              description={t("feedback.loadingDescription")}
            />
          ) : null}
          {pageState === "not-found" ? (
            <FeedbackState
              status="error"
              title={t("feedback.notFoundTitle")}
              description={t("feedback.notFoundDescription")}
              actionHref={getLocalizedHref(locale, "home")}
              actionLabel={t("feedback.notFoundAction")}
            />
          ) : null}
          {pageState === "error" ? (
            <FeedbackState
              status="error"
              title={t("feedback.connectionTitle")}
              description={t("feedback.connectionDescription")}
              actionHref={`/room/${roomKey}`}
              actionLabel={t("feedback.connectionAction")}
            />
          ) : null}
        </Container>
      </AppShell>
    );
  }

  return (
    <AppShell pb={{ base: 6, md: 10 }}>
      <VisuallyHidden as="h1">{t("header.accessibleHeading")}</VisuallyHidden>
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
                  {t("header.inRoom")}
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
              <LanguageSwitcher />
              <Button
                leftIcon={<ArrowBackIcon />}
                variant="subtle"
                size="sm"
                onClick={() => void leaveRoom()}
                isLoading={isLeavingRoom}
                loadingText={t("header.leaving")}
                flex={{ base: 1, sm: "initial" }}
              >
                {t("header.leave")}
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
            p={{ base: 3, lg: 4 }}
            position={{ base: "static", lg: "sticky" }}
            top={4}
          >
            <Accordion display={{ base: "block", lg: "none" }} allowToggle>
              <AccordionItem border="0">
                <AccordionButton px={1} py={1} borderRadius="lg">
                  <Box flex="1" textAlign="left">
                    <Text textStyle="eyebrow">{t("participants.eyebrow")}</Text>
                    <Text color="ink.100" textStyle="label" fontWeight="700">
                      {t("participants.mobileSummary", {
                        active: activeParticipants.length,
                        total: participants.length,
                      })}
                    </Text>
                    <Text color="ink.300" textStyle="caption">
                      {t("participants.votesSummary", {
                        votes: voteCount,
                        pending: activePendingCount,
                      })}
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={0} pt={3} pb={0}>
                  <VStack
                    spacing={2.5}
                    align="stretch"
                    maxH="42dvh"
                    overflowY="auto"
                  >
                    {renderParticipantCards()}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Box display={{ base: "none", lg: "block" }}>
              <HStack justify="space-between" mb={4}>
                <Box>
                  <Text textStyle="eyebrow">{t("participants.eyebrow")}</Text>
                  <Heading as="h2" textStyle="h4" mt={1}>
                    {t("participants.title")}
                  </Heading>
                </Box>
                <Tag colorScheme="purple" variant="subtle">
                  {participants.length}
                </Tag>
              </HStack>
              <HStack spacing={2} mb={4} flexWrap="wrap">
                <Tag colorScheme="green" variant="subtle">
                  {t("participants.active", {
                    count: activeParticipants.length,
                  })}
                </Tag>
                {inactiveCount > 0 ? (
                  <Tag colorScheme="gray" variant="subtle">
                    {t("participants.inactive", { count: inactiveCount })}
                  </Tag>
                ) : null}
              </HStack>
              <VStack spacing={2.5} align="stretch">
                {renderParticipantCards()}
              </VStack>
            </Box>
          </GlassPanel>

          <VStack spacing={4} align="stretch" minW={0}>
            <GlassPanel p={{ base: 5, md: 7 }}>
              <VStack spacing={6} align="stretch">
                <Box data-tour="room-round-title">
                  <Text textStyle="eyebrow">{t("round.eyebrow")}</Text>
                  <Heading as="h2" textStyle="h3" mt={1} mb={5}>
                    {effectiveRoundTitle}
                  </Heading>
                  <RoundTitleField
                    value={roundTitleDraft}
                    status={titleSaveStatus}
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
                    activeCount={activeParticipants.length}
                    pendingCount={activePendingCount}
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
                        {t("actions.redo")}
                      </Button>
                      <Button
                        size="lg"
                        variant="premium"
                        colorScheme="cyan"
                        onClick={prepareNewRound}
                        isLoading={isRoundActionLoading}
                        loadingText={t("actions.confirming")}
                        w={{ base: "full", sm: "auto" }}
                      >
                        {t("actions.confirm")}
                      </Button>
                    </HStack>
                  ) : (
                    <VStack
                      align={{ base: "stretch", md: "flex-end" }}
                      spacing={1.5}
                      w={{ base: "full", md: "auto" }}
                    >
                      <Button
                        size="lg"
                        variant={voteCount > 0 ? "premium" : "glass"}
                        colorScheme="purple"
                        onClick={prepareReveal}
                        isDisabled={voteCount === 0}
                        isLoading={isRoundActionLoading}
                        loadingText={t("actions.revealing")}
                        w={{ base: "full", md: "auto" }}
                        aria-describedby="reveal-availability"
                      >
                        {t("actions.reveal")}
                      </Button>
                      {voteCount === 0 ? (
                        <Text
                          id="reveal-availability"
                          color="ink.300"
                          textStyle="caption"
                        >
                          {t("actions.revealUnavailable")}
                        </Text>
                      ) : null}
                    </VStack>
                  )}
                </HStack>
                <Text color="ink.300" textStyle="caption">
                  {t("actions.anyParticipant")}
                </Text>
              </VStack>
            </GlassPanel>

            {!isShowingAverage ? renderVotingPanel() : null}

            {isWaitingGameAllowed && isWaitingGameActive ? (
              <Box
                data-tour="room-round-results"
                position="relative"
                minH={{ base: 52, md: 56 }}
              >
                <VoteWaitingGame
                  isActive={isWaitingGameActive}
                  sessionId={currentRoundId}
                />
              </Box>
            ) : null}

            {isShowingAverage ? (
              <VStack
                data-tour="room-round-results"
                spacing={4}
                align="stretch"
              >
                <GlassPanel p={{ base: 5, md: 6 }} strength="strong">
                  <Text textStyle="eyebrow" color="signal.cyan">
                    {t("results.eyebrow")}
                  </Text>
                  <Heading as="h2" textStyle="h4" mt={1}>
                    {t("results.title")}
                  </Heading>
                  <Text color="ink.200" textStyle="body-sm" mt={2} maxW="3xl">
                    {t("results.description")}
                  </Text>
                </GlassPanel>
                <ResultsPanel
                  participants={participants}
                  activePendingCount={activePendingCount}
                />
                {renderVotingPanel()}
              </VStack>
            ) : null}

            <Box data-tour="room-history">
              <RoundHistory history={history} />
            </Box>
          </VStack>
        </Grid>
      </Container>
      <RoundConfirmationDialog
        isOpen={confirmation !== null}
        title={confirmation?.title ?? ""}
        averageLabel={formatRoundAverage(confirmation?.average ?? null, locale)}
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
      <PartialRevealConfirmationDialog
        isOpen={isPartialRevealOpen}
        pendingCount={activePendingCount}
        voteCount={voteCount}
        isLoading={isRoundActionLoading}
        onCancel={() => setIsPartialRevealOpen(false)}
        onConfirm={() => void revealCards()}
      />
      <RoomTour />
    </AppShell>
  );
}
