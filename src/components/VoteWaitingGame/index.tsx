"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTranslations } from "@/i18n";
import { useState } from "react";

import { PongGame } from "./PongGame";
import { PhraseSliceGame } from "./PhraseSliceGame";

interface VoteWaitingGameProps {
  isActive: boolean;
  sessionId: string;
}

type WaitingGameKind = "pong" | "slice";

interface GameSelection {
  kind: WaitingGameKind;
  sessionId: string;
  version: number;
}

export function VoteWaitingGame({
  isActive,
  sessionId,
}: VoteWaitingGameProps) {
  const t = useTranslations("waitingGame");
  const prefersReducedMotion = Boolean(usePrefersReducedMotion());
  const [selection, setSelection] = useState<GameSelection | null>(null);
  const selectedKind =
    isActive && selection?.sessionId === sessionId ? selection.kind : null;

  function selectGame(kind: WaitingGameKind) {
    if (selectedKind === kind) {
      return;
    }

    setSelection((currentSelection) => ({
      kind,
      sessionId,
      version: (currentSelection?.version ?? 0) + 1,
    }));
  }

  function closeGame() {
    setSelection(null);
  }

  const instanceKey = `${sessionId}:${selectedKind}:${selection?.version ?? 0}`;
  const selectedGameLabel = selectedKind
    ? t(`games.${selectedKind}`)
    : "";

  return (
    <>
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
          position="absolute"
          inset={0}
          overflow="hidden"
          borderRadius="2xl"
          border="1px solid"
          borderColor="rgba(163, 141, 255, 0.3)"
          bg="canvas.900"
          boxShadow="inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 34px rgba(112, 72, 245, 0.13)"
        >
          <VStack
            position="absolute"
            inset={0}
            justify="center"
            spacing={{ base: 3, md: 4 }}
            px={{ base: 4, md: 8 }}
            bg="linear-gradient(145deg, rgba(8, 13, 29, 0.98), rgba(17, 26, 53, 0.96))"
          >
            <Box textAlign="center">
              <Text textStyle="eyebrow">{t("selector.eyebrow")}</Text>
              <Heading as="h3" textStyle="h4" mt={1}>
                {t("selector.title")}
              </Heading>
              <Text
                color="ink.300"
                textStyle="body-sm"
                mt={1}
                maxW="lg"
                display={{ base: "none", sm: "block" }}
              >
                {t("selector.description")}
              </Text>
            </Box>
            <SimpleGrid
              columns={{ base: 1, sm: 2 }}
              spacing={{ base: 2, md: 3 }}
              w="full"
              maxW="lg"
            >
              <Button
                type="button"
                h="auto"
                minH={{ base: 12, md: 16 }}
                py={{ base: 2, md: 3 }}
                variant="glass"
                onClick={() => selectGame("pong")}
                aria-label={t("modal.open", { game: t("games.pong") })}
                whiteSpace="normal"
              >
                <VStack spacing={0.5}>
                  <Text fontWeight="800">{t("games.pong")}</Text>
                  <Text textStyle="caption" color="ink.300">
                    {t("selector.pongDescription")}
                  </Text>
                </VStack>
              </Button>
              <Button
                type="button"
                h="auto"
                minH={{ base: 12, md: 16 }}
                py={{ base: 2, md: 3 }}
                variant="premium"
                onClick={() => selectGame("slice")}
                aria-label={t("modal.open", { game: t("games.slice") })}
                whiteSpace="normal"
              >
                <VStack spacing={0.5}>
                  <Text fontWeight="800">{t("games.slice")}</Text>
                  <Text textStyle="caption" color="whiteAlpha.800">
                    {t("selector.sliceDescription")}
                  </Text>
                </VStack>
              </Button>
            </SimpleGrid>
          </VStack>
        </Box>
      ) : null}

      <Modal
        isOpen={selectedKind !== null}
        onClose={closeGame}
        closeOnOverlayClick={false}
        motionPreset={prefersReducedMotion ? "none" : "scale"}
        isCentered
        returnFocusOnClose
      >
        <ModalOverlay />
        <ModalContent
          aria-label={t("modal.ariaLabel", { game: selectedGameLabel })}
          w={{ base: "100vw", md: "min(900px, calc(100vw - 48px))" }}
          h={{ base: "100dvh", md: "min(650px, calc(100dvh - 48px))" }}
          maxW="none"
          maxH="none"
          m={{ base: 0, md: 6 }}
          borderRadius={{ base: 0, md: "3xl" }}
          overflow="hidden"
        >
          <ModalCloseButton
            aria-label={t("modal.close")}
            top={{ base: 3, md: 4 }}
            right={{ base: 3, md: 4 }}
            zIndex={40}
            bg="rgba(5, 8, 22, 0.72)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.200" }}
          />
          <ModalBody p={0} position="relative" minH={0} overflow="hidden">
            {selectedKind === "pong" ? (
              <PongGame key={instanceKey} instanceKey={instanceKey} />
            ) : null}
            {selectedKind === "slice" ? (
              <PhraseSliceGame key={instanceKey} instanceKey={instanceKey} />
            ) : null}

            {selectedKind ? (
              <ButtonGroup
                position="absolute"
                top={{ base: 3, md: 4 }}
                left={{ base: 3, md: "50%" }}
                transform={{ base: "none", md: "translateX(-50%)" }}
                size="xs"
                isAttached
                zIndex={30}
                aria-label={t("selector.ariaLabel")}
                boxShadow="0 8px 24px rgba(2, 6, 23, 0.36)"
              >
                <Button
                  type="button"
                  variant={selectedKind === "pong" ? "premium" : "glass"}
                  onClick={() => selectGame("pong")}
                  aria-pressed={selectedKind === "pong"}
                >
                  {t("games.pong")}
                </Button>
                <Button
                  type="button"
                  variant={selectedKind === "slice" ? "premium" : "glass"}
                  onClick={() => selectGame("slice")}
                  aria-pressed={selectedKind === "slice"}
                >
                  {t("games.slice")}
                </Button>
              </ButtonGroup>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
