import { Box, HStack, Text, VStack } from "@chakra-ui/react";

export type RoundPhase = "waiting" | "secret" | "revealed";

interface RoundStatusProps {
  phase: RoundPhase;
  voteCount: number;
  participantCount: number;
}

const phaseContent: Record<
  RoundPhase,
  { label: string; description: string; color: string; glow: string }
> = {
  waiting: {
    label: "Aguardando votos",
    description: "Escolha uma carta quando estiver pronto.",
    color: "signal.blue",
    glow: "rgba(96, 165, 250, 0.2)",
  },
  secret: {
    label: "Votos secretos",
    description: "As escolhas ficam ocultas até a revelação.",
    color: "signal.indigo",
    glow: "rgba(155, 138, 251, 0.22)",
  },
  revealed: {
    label: "Resultado revelado",
    description: "Compare as estimativas e converse sobre as diferenças.",
    color: "signal.cyan",
    glow: "rgba(77, 227, 227, 0.2)",
  },
};

export function RoundStatus({
  phase,
  voteCount,
  participantCount,
}: RoundStatusProps) {
  const content = phaseContent[phase];

  return (
    <HStack
      spacing={3}
      align="flex-start"
      role="status"
      aria-live="polite"
    >
      <Box
        mt={1.5}
        boxSize={2.5}
        flexShrink={0}
        borderRadius="full"
        bg={content.color}
        boxShadow={`0 0 18px ${content.glow}`}
      />
      <VStack spacing={0.5} align="flex-start">
        <Text color="ink.50" textStyle="label" fontWeight="700">
          {content.label}
        </Text>
        <Text color="ink.300" textStyle="body-sm">
          {content.description} {voteCount} de {participantCount} votaram.
        </Text>
      </VStack>
    </HStack>
  );
}
