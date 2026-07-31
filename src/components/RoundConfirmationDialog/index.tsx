"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import {
  getVoteDistribution,
  NUMERIC_ESTIMATION_POINTS,
  type RoundOutcome,
  type RoundVoteSnapshot,
} from "@/domain/estimation";

interface RoundConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  averageLabel: string;
  votes: RoundVoteSnapshot[];
  suggestedOutcome: RoundOutcome | null;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: (outcome: RoundOutcome) => void;
}

type OutcomeSelection = string;

function toOutcome(selection: OutcomeSelection): RoundOutcome | null {
  if ((NUMERIC_ESTIMATION_POINTS as readonly string[]).includes(selection)) {
    return {
      kind: "estimated",
      agreedEstimate: selection as (typeof NUMERIC_ESTIMATION_POINTS)[number],
    };
  }

  if (selection === "no_consensus" || selection === "postponed") {
    return { kind: selection };
  }

  return null;
}

function selectionFromOutcome(outcome: RoundOutcome | null): OutcomeSelection {
  if (!outcome) {
    return "";
  }

  return outcome.kind === "estimated" ? outcome.agreedEstimate : outcome.kind;
}

export function RoundConfirmationDialog({
  isOpen,
  title,
  averageLabel,
  votes,
  suggestedOutcome,
  isLoading,
  onCancel,
  onConfirm,
}: RoundConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [selection, setSelection] = useState<OutcomeSelection>("");
  const distribution = getVoteDistribution(votes.map((vote) => vote.point));
  const outcome = toOutcome(selection);

  useEffect(() => {
    if (isOpen) {
      setSelection(selectionFromOutcome(suggestedOutcome));
    }
  }, [isOpen, suggestedOutcome]);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={isLoading ? () => undefined : onCancel}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(6px)">
        <AlertDialogContent
          mx={4}
          maxH="calc(100dvh - 2rem)"
          overflowY="auto"
          bg="canvas.800"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="glassStrong"
        >
          <AlertDialogHeader color="ink.50" fontFamily="heading">
            Encerrar esta rodada?
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack align="stretch" spacing={4}>
              <Text color="ink.300">
                Registre a decisão do time antes de iniciar a próxima rodada.
              </Text>
              <Box borderRadius="xl" border="1px solid" borderColor="whiteAlpha.200" bg="whiteAlpha.100" p={4}>
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text textStyle="caption" color="ink.300">Item</Text>
                    <Text color="ink.50" fontWeight="700">{title}</Text>
                  </Box>
                  <Box>
                    <Text textStyle="caption" color="ink.300">Média dos votos</Text>
                    <Text color="signal.cyan" fontWeight="800">{averageLabel}</Text>
                  </Box>
                  <HStack spacing={2} flexWrap="wrap" aria-label="Resumo dos votos">
                    {distribution.map((item) => (
                      <Text key={item.value} color="ink.200" textStyle="body-sm">
                        {item.value}: {item.count}
                      </Text>
                    ))}
                  </HStack>
                </VStack>
              </Box>

              <Box>
                <Text id="agreed-estimate-label" color="ink.50" fontWeight="700" mb={2}>
                  Estimativa acordada
                </Text>
                <Text color="ink.300" textStyle="body-sm" mb={3}>
                  A média ajuda na discussão, mas não define o consenso.
                </Text>
                <RadioGroup
                  value={selection}
                  onChange={setSelection}
                  isDisabled={isLoading}
                  aria-labelledby="agreed-estimate-label"
                >
                  <SimpleGrid columns={{ base: 4, sm: 6 }} spacing={2}>
                    {NUMERIC_ESTIMATION_POINTS.map((point) => (
                      <Radio key={point} value={point} variant="votingCard" minH={12} justifyContent="center">
                        {point}
                      </Radio>
                    ))}
                  </SimpleGrid>
                  <Stack direction={{ base: "column", sm: "row" }} spacing={2} mt={3}>
                    <Radio value="no_consensus" flex={1} minH={12} px={3} borderWidth="1px" borderRadius="lg" borderColor="whiteAlpha.300">
                      Sem consenso
                    </Radio>
                    <Radio value="postponed" flex={1} minH={12} px={3} borderWidth="1px" borderRadius="lg" borderColor="whiteAlpha.300">
                      Adiar história
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Box>
              {!outcome ? (
                <Text color="orange.200" textStyle="body-sm">
                  Escolha uma estimativa ou informe como a história foi encerrada.
                </Text>
              ) : null}
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack spacing={3} w="full" flexDir={{ base: "column-reverse", sm: "row" }} justify="flex-end">
              <Button ref={cancelRef} variant="ghost" onClick={onCancel} isDisabled={isLoading} w={{ base: "full", sm: "auto" }}>
                Cancelar
              </Button>
              <Button colorScheme="cyan" variant="premium" onClick={() => outcome && onConfirm(outcome)} isDisabled={!outcome} isLoading={isLoading} loadingText="Confirmando" w={{ base: "full", sm: "auto" }}>
                Confirmar e iniciar nova rodada
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
