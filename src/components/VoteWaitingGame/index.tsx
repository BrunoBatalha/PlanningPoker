"use client";

import {
  Box,
  Button,
  HStack,
  Text,
  usePrefersReducedMotion,
  VisuallyHidden,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  advanceGame,
  createInitialGameState,
  type GameDimensions,
  type GameState,
  resizeGameState,
} from "./engine";
import { renderGame } from "./renderer";

interface VoteWaitingGameProps {
  isActive: boolean;
  sessionId: string;
}

type PressedKeys = {
  left: boolean;
  right: boolean;
};

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest(
      'button, input, textarea, select, a, [contenteditable="true"]',
    ),
  );
}

function isLeftKey(key: string) {
  return key === "ArrowLeft" || key.toLowerCase() === "a";
}

function isRightKey(key: string) {
  return key === "ArrowRight" || key.toLowerCase() === "d";
}

export function VoteWaitingGame({
  isActive,
  sessionId,
}: VoteWaitingGameProps) {
  const prefersReducedMotion = Boolean(usePrefersReducedMotion());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const gameRef = useRef<GameState | null>(null);
  const pointerXRef = useRef<number | null>(null);
  const pressedKeysRef = useRef<PressedKeys>({ left: false, right: false });
  const activeRef = useRef(isActive);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<"playing" | "game-over">("playing");
  const [restartVersion, setRestartVersion] = useState(0);

  activeRef.current = isActive;

  useEffect(() => {
    if (!isActive) {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      pressedKeysRef.current = { left: false, right: false };
      pointerXRef.current = null;
      gameRef.current = null;
      setScore(0);
      setPhase("playing");
      return;
    }

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

    const measureCanvas = (): GameDimensions | null => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));

      if (width <= 1 || height <= 1) {
        return null;
      }

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      return { width, height };
    };

    const initializeGame = (dimensions: GameDimensions) => {
      const direction: -1 | 1 = Math.random() < 0.5 ? -1 : 1;
      gameRef.current = createInitialGameState(
        dimensions,
        prefersReducedMotion,
        direction,
      );
      setScore(0);
      setPhase("playing");
      renderGame(context, gameRef.current);
    };

    const animate = (timestamp: number) => {
      frameRef.current = null;

      if (
        isDisposed ||
        !activeRef.current ||
        document.visibilityState === "hidden"
      ) {
        lastTimestamp = null;
        return;
      }

      const game = gameRef.current;
      if (!game || game.phase === "game-over") {
        return;
      }

      const deltaSeconds =
        lastTimestamp === null ? 0 : (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      const direction: -1 | 0 | 1 = pressedKeysRef.current.left
        ? -1
        : pressedKeysRef.current.right
          ? 1
          : 0;
      const result = advanceGame(
        game,
        { direction, pointerX: pointerXRef.current },
        deltaSeconds,
      );

      gameRef.current = result.state;
      renderGame(context, result.state);

      if (result.scored) {
        setScore(result.state.score);
      }

      if (result.missed) {
        setPhase("game-over");
        return;
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (
        isDisposed ||
        !activeRef.current ||
        document.visibilityState === "hidden" ||
        gameRef.current?.phase === "game-over" ||
        frameRef.current !== null
      ) {
        return;
      }

      lastTimestamp = null;
      frameRef.current = window.requestAnimationFrame(animate);
    };

    const initialDimensions = measureCanvas();
    if (initialDimensions) {
      initializeGame(initialDimensions);
      startLoop();
    }

    const resizeObserver = new ResizeObserver(() => {
      const dimensions = measureCanvas();
      if (!dimensions) {
        return;
      }

      if (gameRef.current) {
        gameRef.current = resizeGameState(gameRef.current, dimensions);
        renderGame(context, gameRef.current);
      } else {
        initializeGame(dimensions);
        startLoop();
      }
    });
    resizeObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopLoop();
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
      pressedKeysRef.current = { left: false, right: false };
      pointerXRef.current = null;
    };
  }, [isActive, prefersReducedMotion, restartVersion, sessionId]);

  function restartGame() {
    if (!isActive) {
      return;
    }

    setRestartVersion((version) => version + 1);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isActive || phase === "game-over") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    pointerXRef.current = event.clientX - bounds.left;
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!isInteractiveTarget(event.target)) {
      event.currentTarget.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isActive || isInteractiveTarget(event.target)) {
      return;
    }

    if (
      phase === "game-over" &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      restartGame();
      return;
    }

    if (isLeftKey(event.key)) {
      event.preventDefault();
      pressedKeysRef.current.left = true;
    } else if (isRightKey(event.key)) {
      event.preventDefault();
      pressedKeysRef.current.right = true;
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (isInteractiveTarget(event.target)) {
      return;
    }

    if (isLeftKey(event.key)) {
      event.preventDefault();
      pressedKeysRef.current.left = false;
    } else if (isRightKey(event.key)) {
      event.preventDefault();
      pressedKeysRef.current.right = false;
    }
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    pressedKeysRef.current = { left: false, right: false };
  }

  return (
    <AnimatePresence initial={false}>
      {isActive ? (
        <Box
          key={sessionId}
          as={motion.div}
          initial={
            prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.99 }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: prefersReducedMotion ? 0 : 0.22 },
          }}
          exit={{
            opacity: 0,
            transition: { duration: prefersReducedMotion ? 0 : 0.14 },
          }}
          position="absolute"
          inset={0}
          overflow="hidden"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(163, 141, 255, 0.3)"
          bg="canvas.900"
          boxShadow="inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 34px rgba(112, 72, 245, 0.13)"
          tabIndex={0}
          role="region"
          aria-label="Microjogo da espera"
          _focusVisible={{
            outline: "2px solid",
            outlineColor: "brand.300",
            outlineOffset: "3px",
          }}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onBlur={handleBlur}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ display: "block", width: "100%", height: "100%" }}
          />

          <HStack
            position="absolute"
            top={0}
            left={0}
            right={0}
            justify="space-between"
            align="flex-start"
            p={{ base: 3, md: 4 }}
            pointerEvents="none"
          >
            <Box>
              <Text textStyle="eyebrow" color="brand.200">
                Enquanto o time vota
              </Text>
              <Text
                mt={0.5}
                color="ink.300"
                textStyle="caption"
                display={{ base: "none", sm: "block" }}
              >
                Mova o mouse ou use ← → / A D
              </Text>
            </Box>
            <Box
              px={3}
              py={1.5}
              borderRadius="full"
              bg="rgba(5, 8, 22, 0.68)"
              border="1px solid"
              borderColor="whiteAlpha.200"
              textAlign="center"
            >
              <Text textStyle="caption" color="ink.300">
                Pontos
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

          <VisuallyHidden>
            Pontuação atual: {score}. O jogo é individual, temporário e não
            altera sua votação.
          </VisuallyHidden>

          <AnimatePresence>
            {phase === "game-over" ? (
              <Box
                as={motion.div}
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: prefersReducedMotion ? 0 : 0.18,
                  },
                }}
                position="absolute"
                inset={0}
                display="grid"
                placeItems="center"
                bg="rgba(5, 8, 22, 0.72)"
                backdropFilter="blur(5px)"
              >
                <VStack
                  spacing={3}
                  px={6}
                  py={5}
                  borderRadius="2xl"
                  bg="rgba(16, 26, 53, 0.9)"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  boxShadow="glass"
                >
                  <Box textAlign="center">
                    <Text color="white" textStyle="h4">
                      A carta caiu
                    </Text>
                    <Text mt={1} color="ink.300" textStyle="body-sm">
                      Você fez {score} {score === 1 ? "ponto" : "pontos"}.
                    </Text>
                  </Box>
                  <Button
                    type="button"
                    size="sm"
                    variant="premium"
                    onClick={restartGame}
                  >
                    Jogar de novo
                  </Button>
                  <Text color="ink.400" textStyle="caption">
                    Enter ou Espaço também reinicia
                  </Text>
                </VStack>
              </Box>
            ) : null}
          </AnimatePresence>
        </Box>
      ) : null}
    </AnimatePresence>
  );
}
