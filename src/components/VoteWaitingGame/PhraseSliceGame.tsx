"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Text,
  usePrefersReducedMotion,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "@/i18n";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  advanceSliceGame,
  createSliceGameState,
  getComboMultiplier,
  type PhraseCatalog,
  RECENT_PHRASE_LIMIT,
  type RevealedJoke,
  resizeSliceGameState,
  type SliceDimensions,
  type SliceGameState,
  type SwipePoint,
  type SwipeSegment,
} from "./sliceEngine";
import {
  type BladeParticle,
  measurePhraseDefinitions,
  renderSliceGame,
} from "./sliceRenderer";

interface PhraseSliceGameProps {
  instanceKey: string;
}

const LIFE_INDICES = [0, 1, 2] as const;
const HISTORY_OPACITIES = [1, 0.65, 0.35] as const;
const RECENT_PHRASES_STORAGE_KEY = "battle-poker:slice:recent";

function getRecentPhrasesStorageKey(locale: string) {
  let playerKey = "anonymous-session";

  try {
    const currentUser = window.sessionStorage.getItem("currentUser");
    const parsed: unknown = currentUser ? JSON.parse(currentUser) : null;
    if (
      parsed &&
      typeof parsed === "object" &&
      "key" in parsed &&
      typeof parsed.key === "string"
    ) {
      playerKey = parsed.key;
    }
  } catch {
    // Fall back to an anonymous session key.
  }

  return `${RECENT_PHRASES_STORAGE_KEY}:${locale}:${playerKey}`;
}

function loadRecentPhraseIds(locale: string) {
  try {
    const value = window.sessionStorage.getItem(
      getRecentPhrasesStorageKey(locale),
    );
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed)
      ? parsed
          .filter((entry): entry is string => typeof entry === "string")
          .slice(-RECENT_PHRASE_LIMIT)
      : [];
  } catch {
    return [];
  }
}

function saveRecentPhraseIds(locale: string, phraseIds: string[]) {
  try {
    window.sessionStorage.setItem(
      getRecentPhrasesStorageKey(locale),
      JSON.stringify(phraseIds.slice(-RECENT_PHRASE_LIMIT)),
    );
  } catch {
    // The game remains usable when session storage is unavailable.
  }
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("button, a, input, textarea, select"))
  );
}

interface JokeHistoryPanelProps {
  history: RevealedJoke[];
  title: string;
  emptyLabel: string;
  compact?: boolean;
  reducedMotion: boolean;
}

function JokeHistoryPanel({
  history,
  title,
  emptyLabel,
  compact = false,
  reducedMotion,
}: JokeHistoryPanelProps) {
  const visibleHistory = compact ? history.slice(0, 1) : history;

  if (compact && visibleHistory.length === 0) {
    return null;
  }

  return (
    <VStack
      as="aside"
      align="stretch"
      spacing={compact ? 0 : 3}
      aria-label={title}
      h={compact ? "auto" : "full"}
      p={compact ? 3 : 5}
      pt={compact ? 3 : 16}
      bg={compact ? "rgba(5, 8, 22, 0.86)" : "rgba(7, 12, 28, 0.96)"}
      borderLeft={compact ? "none" : "1px solid"}
      borderTop={compact ? "1px solid" : "none"}
      borderColor="whiteAlpha.200"
      backdropFilter="blur(10px)"
    >
      {!compact ? (
        <Box>
          <Text textStyle="eyebrow" color="brand.200">
            {title}
          </Text>
          <Box mt={2} h="1px" bg="whiteAlpha.200" />
        </Box>
      ) : null}

      {visibleHistory.length === 0 ? (
        <Text color="ink.400" textStyle="caption" lineHeight="tall">
          {emptyLabel}
        </Text>
      ) : (
        visibleHistory.map((joke, index) => (
          <Box
            key={`${joke.id}:${index}`}
            as={motion.div}
            initial={
              reducedMotion ? false : { opacity: 0, x: compact ? 0 : 8 }
            }
            animate={{
              opacity: compact ? 1 : HISTORY_OPACITIES[index] ?? 0.35,
              x: 0,
              transition: { duration: reducedMotion ? 0 : 0.18 },
            }}
            px={compact ? 0 : 3}
            py={compact ? 0 : 2.5}
            borderRadius="xl"
            bg={compact ? "transparent" : "whiteAlpha.50"}
            border={compact ? "none" : "1px solid"}
            borderColor="whiteAlpha.100"
          >
            <Text
              color="signal.cyan"
              fontSize={compact ? "sm" : "md"}
              fontWeight="800"
              lineHeight="short"
              noOfLines={compact ? 1 : 2}
            >
              {joke.text}
            </Text>
          </Box>
        ))
      )}
    </VStack>
  );
}

export function PhraseSliceGame({
  instanceKey,
}: PhraseSliceGameProps) {
  const t = useTranslations("waitingGame");
  const locale = useLocale();
  const prefersReducedMotion = Boolean(usePrefersReducedMotion());
  const catalogRef = useRef(
    t.raw("slice.phrases") as PhraseCatalog,
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const gameRef = useRef<SliceGameState | null>(null);
  const segmentQueueRef = useRef<SwipeSegment[]>([]);
  const trailRef = useRef<SwipePoint[]>([]);
  const bladeParticlesRef = useRef<BladeParticle[]>([]);
  const lastPointerRef = useRef<SwipePoint | null>(null);
  const isGameOverRef = useRef(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [jokeHistory, setJokeHistory] = useState<RevealedJoke[]>([]);
  const [phase, setPhase] = useState<"playing" | "game-over">("playing");
  const [restartVersion, setRestartVersion] = useState(0);

  catalogRef.current = t.raw("slice.phrases") as PhraseCatalog;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    let isDisposed = false;
    let lastTimestamp: number | null = null;

    const stopLoop = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTimestamp = null;
    };

    const measureCanvas = (): SliceDimensions | null => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(
        1,
        Math.round(canvas.clientWidth || bounds.width),
      );
      const height = Math.max(
        1,
        Math.round(canvas.clientHeight || bounds.height),
      );

      if (width <= 1 || height <= 1) {
        return null;
      }

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      return { width, height };
    };

    const initializeGame = (dimensions: SliceDimensions) => {
      const definitions = measurePhraseDefinitions(
        catalogRef.current,
        dimensions.width,
      );
      gameRef.current = createSliceGameState(
        dimensions,
        definitions,
        prefersReducedMotion,
        Math.random,
        loadRecentPhraseIds(locale),
      );
      segmentQueueRef.current = [];
      trailRef.current = [];
      bladeParticlesRef.current = [];
      lastPointerRef.current = null;
      isGameOverRef.current = false;
      setScore(0);
      setCombo(0);
      setLives(3);
      setJokeHistory([]);
      setPhase("playing");
      renderSliceGame(context, gameRef.current, [], [], performance.now());
    };

    const animate = (timestamp: number) => {
      frameRef.current = null;

      if (isDisposed || document.visibilityState === "hidden") {
        lastTimestamp = null;
        return;
      }

      const game = gameRef.current;
      if (!game) {
        return;
      }

      const deltaSeconds =
        lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      const segments = segmentQueueRef.current.splice(0);
      const result = advanceSliceGame(game, segments, deltaSeconds);

      gameRef.current = result.state;
      trailRef.current = trailRef.current.filter(
        (point) => timestamp - point.timestamp <= 100,
      );
      bladeParticlesRef.current = bladeParticlesRef.current.filter(
        (particle) => timestamp - particle.timestamp <= 280,
      );
      renderSliceGame(
        context,
        result.state,
        trailRef.current,
        bladeParticlesRef.current,
        timestamp,
      );

      if (result.scoreChanged) {
        setScore(result.state.score);
      }
      if (result.comboChanged) {
        setCombo(result.state.combo);
      }
      if (result.livesChanged) {
        setLives(result.state.lives);
      }
      if (result.armedCount > 0) {
        lastPointerRef.current = null;
      }
      if (result.revealedJokes.length > 0) {
        setJokeHistory((currentHistory) => [
          ...result.revealedJokes.slice().reverse(),
          ...currentHistory,
        ].slice(0, 3));
      }
      if (result.spawnedPhraseId) {
        saveRecentPhraseIds(locale, result.state.recentPhraseIds);
      }

      if (result.state.lives <= 0) {
        isGameOverRef.current = true;
        segmentQueueRef.current = [];
        lastPointerRef.current = null;
        setPhase("game-over");
        return;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (
        isDisposed ||
        document.visibilityState === "hidden" ||
        isGameOverRef.current ||
        frameRef.current !== null
      ) {
        return;
      }

      lastTimestamp = null;
      frameRef.current = window.requestAnimationFrame(animate);
    };

    const dimensions = measureCanvas();
    if (dimensions) {
      initializeGame(dimensions);
      startLoop();
    }

    const resizeObserver = new ResizeObserver(() => {
      const nextDimensions = measureCanvas();
      if (!nextDimensions) {
        return;
      }

      const definitions = measurePhraseDefinitions(
        catalogRef.current,
        nextDimensions.width,
      );

      if (gameRef.current) {
        gameRef.current = resizeSliceGameState(
          gameRef.current,
          nextDimensions,
          definitions,
        );
        renderSliceGame(
          context,
          gameRef.current,
          trailRef.current,
          bladeParticlesRef.current,
          performance.now(),
        );
      } else {
        initializeGame(nextDimensions);
        startLoop();
      }
    });
    resizeObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopLoop();
        segmentQueueRef.current = [];
        trailRef.current = [];
        bladeParticlesRef.current = [];
        lastPointerRef.current = null;
        return;
      }

      startLoop();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isDisposed = true;
      stopLoop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      segmentQueueRef.current = [];
      trailRef.current = [];
      bladeParticlesRef.current = [];
      lastPointerRef.current = null;
      isGameOverRef.current = false;
      gameRef.current = null;
    };
  }, [instanceKey, locale, prefersReducedMotion, restartVersion]);

  function restartGame() {
    setRestartVersion((version) => version + 1);
  }

  function registerPointerSample(
    nativeEvent: PointerEvent,
    bounds: DOMRect,
  ) {
    const currentTimestamp = performance.now();
    const eventTimestamp = nativeEvent.timeStamp;
    const normalizedTimestamp =
      Number.isFinite(eventTimestamp) &&
      Math.abs(currentTimestamp - eventTimestamp) < 60_000
        ? eventTimestamp
        : currentTimestamp;
    const sample: SwipePoint = {
      x: nativeEvent.clientX - bounds.left,
      y: nativeEvent.clientY - bounds.top,
      timestamp: normalizedTimestamp,
    };
    const previous = lastPointerRef.current;
    lastPointerRef.current = sample;
    trailRef.current.push(sample);
    trailRef.current = trailRef.current
      .filter((point) => sample.timestamp - point.timestamp <= 100)
      .slice(-16);

    if (!previous) {
      return;
    }

    const elapsedMilliseconds = sample.timestamp - previous.timestamp;
    const distance = Math.hypot(
      sample.x - previous.x,
      sample.y - previous.y,
    );
    const speed =
      elapsedMilliseconds > 0
        ? distance / (elapsedMilliseconds / 1000)
        : 0;

    if (elapsedMilliseconds > 100 || distance < 2) {
      return;
    }

    const particleCount = prefersReducedMotion
      ? 1
      : Math.min(8, Math.max(2, Math.ceil(distance / 7)));

    for (let index = 0; index < particleCount; index += 1) {
      const progress = (index + 1) / (particleCount + 1);
      const spread =
        (Math.random() - 0.5) * (prefersReducedMotion ? 2 : 10);
      bladeParticlesRef.current.push({
        x: previous.x + (sample.x - previous.x) * progress + spread,
        y: previous.y + (sample.y - previous.y) * progress - spread,
        velocityX: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 52,
        velocityY: prefersReducedMotion ? 0 : -24 - Math.random() * 46,
        size: 2.2 + Math.random() * 2.4,
        timestamp: currentTimestamp,
      });
    }

    bladeParticlesRef.current = bladeParticlesRef.current.slice(
      prefersReducedMotion ? -30 : -110,
    );

    segmentQueueRef.current.push({
      from: previous,
      to: sample,
      speed,
    });
    segmentQueueRef.current = segmentQueueRef.current.slice(-24);
  }

  function handlePointerMove(
    event: ReactPointerEvent<HTMLDivElement>,
  ) {
    if (isGameOverRef.current) {
      return;
    }

    if (isInteractiveTarget(event.target)) {
      lastPointerRef.current = null;
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nativeEvent = event.nativeEvent;
    const coalescedEvents =
      typeof nativeEvent.getCoalescedEvents === "function"
        ? nativeEvent.getCoalescedEvents()
        : [];
    const samples =
      coalescedEvents.length > 0 ? coalescedEvents : [nativeEvent];

    samples.forEach((sample) => registerPointerSample(sample, bounds));
  }

  function resetPointer() {
    lastPointerRef.current = null;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isInteractiveTarget(event.target)) {
      event.currentTarget.focus();
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (
      phase !== "game-over" ||
      isInteractiveTarget(event.target) ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }

    event.preventDefault();
    restartGame();
  }

  const multiplier = getComboMultiplier(combo);
  const latestJoke = jokeHistory[0];

  return (
    <Grid
      position="absolute"
      inset={0}
      templateColumns={{ base: "1fr", lg: "minmax(0, 1fr) 260px" }}
      minW={0}
      minH={0}
    >
      <Box
        position="relative"
        minW={0}
        minH={0}
        overflow="hidden"
        tabIndex={0}
        role="region"
        aria-label={t("slice.ariaLabel")}
        sx={{ touchAction: "none" }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "brand.300",
          outlineOffset: "-3px",
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
        onKeyDown={handleKeyDown}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ display: "block", width: "100%", height: "100%" }}
        />

        <HStack
          position="absolute"
          top={{ base: 10, sm: 0 }}
          left={0}
          right={0}
          justify="space-between"
          align="flex-start"
          p={{ base: 3, md: 4 }}
          pr={{ base: 3, sm: 16, md: 4 }}
          pointerEvents="none"
        >
          <Box display={{ base: "none", md: "block" }} maxW="34%">
            <Text textStyle="eyebrow" color="brand.200">
              {t("eyebrow")}
            </Text>
            <Text mt={0.5} color="ink.300" textStyle="caption">
              {t("slice.instructions")}
            </Text>
          </Box>
          <HStack ml="auto" spacing={{ base: 1.5, md: 2 }}>
            <Box
              px={{ base: 2, md: 2.5 }}
              py={1.5}
              borderRadius="full"
              bg="rgba(5, 8, 22, 0.68)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              textAlign="center"
              aria-label={t("slice.livesAnnouncement", { lives })}
            >
              <Text
                textStyle="caption"
                color="ink.300"
                display={{ base: "none", sm: "block" }}
              >
                {t("slice.lives")}
              </Text>
              <HStack spacing={1} mt={{ base: 0, sm: 0.5 }}>
                {LIFE_INDICES.map((lifeIndex) => (
                  <Box
                    key={lifeIndex}
                    w="9px"
                    h="12px"
                    borderRadius="2px"
                    bg={lifeIndex < lives ? "signal.cyan" : "whiteAlpha.100"}
                    border="1px solid"
                    borderColor={
                      lifeIndex < lives
                        ? "rgba(77, 227, 227, 0.8)"
                        : "whiteAlpha.200"
                    }
                  />
                ))}
              </HStack>
            </Box>
            {combo > 0 ? (
              <Box
                px={{ base: 2, md: 2.5 }}
                py={1.5}
                borderRadius="full"
                bg="rgba(77, 227, 227, 0.1)"
                border="1px solid"
                borderColor="rgba(77, 227, 227, 0.3)"
                textAlign="center"
              >
                <Text textStyle="caption" color="signal.cyan">
                  {t("slice.combo", { combo, multiplier })}
                </Text>
              </Box>
            ) : null}
            <Box
              px={{ base: 2.5, md: 3 }}
              py={1.5}
              borderRadius="full"
              bg="rgba(5, 8, 22, 0.68)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              textAlign="center"
            >
              <Text textStyle="caption" color="ink.300">
                {t("score")}
              </Text>
              <Text
                color="white"
                fontFamily="heading"
                fontWeight="800"
                lineHeight="1"
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {score}
              </Text>
            </Box>
          </HStack>
        </HStack>

        <Box
          display={{ base: "block", lg: "none" }}
          position="absolute"
          left={3}
          right={3}
          bottom={3}
          borderRadius="xl"
          overflow="hidden"
          pointerEvents="none"
        >
          <JokeHistoryPanel
            history={jokeHistory}
            title={t("slice.history.title")}
            emptyLabel={t("slice.history.empty")}
            compact
            reducedMotion={prefersReducedMotion}
          />
        </Box>

        <VisuallyHidden>
          {t("slice.scoreAnnouncement", {
            score,
            combo,
            multiplier,
            lives,
          })}
        </VisuallyHidden>
        <VisuallyHidden aria-live="polite" aria-atomic="true">
          {latestJoke
            ? t("slice.history.latestAnnouncement", {
                joke: latestJoke.text,
              })
            : ""}
        </VisuallyHidden>

        <AnimatePresence>
          {phase === "game-over" ? (
            <Box
              as={motion.div}
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }
              }
              animate={{
                opacity: 1,
                scale: 1,
                transition: { duration: prefersReducedMotion ? 0 : 0.18 },
              }}
              position="absolute"
              inset={0}
              display="grid"
              placeItems="center"
              bg="rgba(5, 8, 22, 0.76)"
              backdropFilter="blur(6px)"
            >
              <VStack
                spacing={3}
                px={6}
                py={5}
                borderRadius="2xl"
                bg="rgba(16, 26, 53, 0.94)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="glass"
              >
                <Box textAlign="center">
                  <Text color="white" textStyle="h4">
                    {t("slice.gameOver")}
                  </Text>
                  <Text mt={1} color="ink.300" textStyle="body-sm">
                    {t("slice.finalScore", { score })}
                  </Text>
                </Box>
                <Button
                  type="button"
                  size="sm"
                  variant="premium"
                  onClick={restartGame}
                >
                  {t("slice.restart")}
                </Button>
                <Text color="ink.400" textStyle="caption">
                  {t("slice.restartHint")}
                </Text>
              </VStack>
            </Box>
          ) : null}
        </AnimatePresence>
      </Box>

      <Box display={{ base: "none", lg: "block" }} minW={0} minH={0}>
        <JokeHistoryPanel
          history={jokeHistory}
          title={t("slice.history.title")}
          emptyLabel={t("slice.history.empty")}
          reducedMotion={prefersReducedMotion}
        />
      </Box>
    </Grid>
  );
}
