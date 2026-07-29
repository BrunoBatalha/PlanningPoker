"use client";

import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";

import { GlassPanel } from "@/components/GlassPanel";
import { formatRoundAverage } from "@/services/RoomService";
import type { RoundHistoryItem } from "@/services/RoomService";

interface RoundHistoryProps {
  history: RoundHistoryItem[];
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function RoundHistory({ history }: RoundHistoryProps) {
  return (
    <GlassPanel as="section" p={{ base: 5, md: 7 }}>
      <VStack align="stretch" spacing={5}>
        <Box>
          <Text textStyle="eyebrow">Decisões anteriores</Text>
          <Heading as="h2" textStyle="h4" mt={1}>
            Histórico da sala
          </Heading>
        </Box>

        {history.length === 0 ? (
          <Box
            borderRadius="2xl"
            border="1px dashed"
            borderColor="whiteAlpha.200"
            bg="rgba(4, 9, 23, 0.28)"
            p={{ base: 5, md: 6 }}
            textAlign="center"
          >
            <ChevronDownIcon boxSize={6} color="ink.400" mb={2} />
            <Text color="ink.200" fontWeight="700">
              Nenhuma rodada confirmada
            </Text>
            <Text color="ink.300" textStyle="body-sm" mt={1}>
              As estimativas aparecerão aqui depois que o grupo iniciar uma
              nova rodada.
            </Text>
          </Box>
        ) : (
          <Accordion allowMultiple reduceMotion>
            {history.map((round) => (
              <AccordionItem
                key={round.id}
                borderColor="whiteAlpha.200"
                _first={{ borderTopWidth: "1px" }}
              >
                <AccordionButton
                  px={{ base: 2, md: 3 }}
                  py={4}
                  borderRadius="lg"
                  _hover={{ bg: "whiteAlpha.100" }}
                  _expanded={{ bg: "whiteAlpha.100" }}
                >
                  <HStack
                    flex="1"
                    minW={0}
                    spacing={3}
                    justify="space-between"
                    textAlign="left"
                  >
                    <Text
                      color="ink.50"
                      fontWeight="700"
                      noOfLines={2}
                      minW={0}
                    >
                      {round.title}
                    </Text>
                    <Tag
                      flexShrink={0}
                      colorScheme={round.average === null ? "orange" : "cyan"}
                      variant="subtle"
                    >
                      {formatRoundAverage(round.average)}
                    </Tag>
                  </HStack>
                  <AccordionIcon ml={2} />
                </AccordionButton>
                <AccordionPanel px={{ base: 2, md: 3 }} pb={5}>
                  <VStack align="stretch" spacing={4}>
                    <Text color="ink.300" textStyle="caption">
                      Confirmada em{" "}
                      {round.confirmedAt > 0
                        ? dateFormatter.format(round.confirmedAt)
                        : "data indisponível"}
                    </Text>
                    <Divider borderColor="whiteAlpha.100" />
                    {round.votes.length === 0 ? (
                      <Text color="ink.300" textStyle="body-sm">
                        Esta rodada foi confirmada sem participantes.
                      </Text>
                    ) : (
                      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
                        {round.votes.map((vote) => (
                          <HStack
                            key={vote.key}
                            justify="space-between"
                            borderRadius="lg"
                            bg="whiteAlpha.50"
                            px={3}
                            py={2}
                          >
                            <Text color="ink.200" textStyle="body-sm">
                              {vote.username}
                            </Text>
                            <Text color="ink.50" fontWeight="800">
                              {vote.point ?? "Não votou"}
                            </Text>
                          </HStack>
                        ))}
                      </SimpleGrid>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </VStack>
    </GlassPanel>
  );
}
