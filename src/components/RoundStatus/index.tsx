"use client";

import { Box, HStack, Text, VStack } from "@chakra-ui/react";

import { useTranslations } from "@/i18n";

export type RoundPhase = "waiting" | "secret" | "ready" | "revealed";

interface RoundStatusProps {
  phase: RoundPhase;
  voteCount: number;
  activeCount: number;
  pendingCount: number;
}

export function RoundStatus({
  phase,
  voteCount,
  activeCount,
  pendingCount,
}: RoundStatusProps) {
  const t = useTranslations("roundStatus");
  const color =
    phase === "waiting"
      ? "signal.blue"
      : phase === "secret"
        ? "signal.indigo"
        : phase === "ready"
          ? "signal.green"
          : "signal.cyan";

  return (
    <HStack
      spacing={3}
      align="flex-start"
      role="status"
      aria-live="polite"
      minW={0}
    >
      <Box
        mt={1.5}
        boxSize={2.5}
        flexShrink={0}
        borderRadius="full"
        bg={color}
      />
      <VStack spacing={1} align="flex-start" minW={0}>
        <Text color="ink.50" textStyle="label" fontWeight="700">
          {t(`${phase}.label`)}
        </Text>
        <Text color="ink.200" textStyle="body-sm">
          {t(`${phase}.description`, { pending: pendingCount })}
        </Text>
        <Text color="ink.300" textStyle="caption">
          {t("counts", {
            votes: voteCount,
            active: activeCount,
            pending: pendingCount,
          })}
        </Text>
      </VStack>
    </HStack>
  );
}
