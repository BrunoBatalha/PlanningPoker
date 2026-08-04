"use client";

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
import { useLocale, useTranslations } from "@/i18n";
import { getLocaleDefinition } from "@/lib/locale-routing";
import { formatRoundAverage } from "@/services/RoomService";
import type { RoundHistoryItem } from "@/services/RoomService";

interface RoundHistoryProps {
  history: RoundHistoryItem[];
}

function getOutcomeLabel(
  round: RoundHistoryItem,
  t: ReturnType<typeof useTranslations>,
): string {
  switch (round.outcome.kind) {
    case "estimated":
      return t("finalEstimate", { value: round.outcome.agreedEstimate });
    case "no_consensus":
      return t("noConsensus");
    case "postponed":
      return t("postponed");
    default:
      return t("legacy");
  }
}

export function RoundHistory({ history }: RoundHistoryProps) {
  const locale = useLocale();
  const t = useTranslations("roomHistory");
  const dateFormatter = new Intl.DateTimeFormat(getLocaleDefinition(locale).languageTag, {
    dateStyle: "short",
    timeStyle: "short",
  });

  if (history.length === 0) {
    return (
      <Box
        as="section"
        px={{ base: 2, md: 3 }}
        py={3}
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
      >
        <Text color="ink.300" textStyle="body-sm">
          {t("empty")}
        </Text>
      </Box>
    );
  }

  return (
    <GlassPanel as="section" p={{ base: 5, md: 7 }}>
      <VStack align="stretch" spacing={5}>
        <Box>
          <Text textStyle="eyebrow">{t("eyebrow")}</Text>
          <Heading as="h2" textStyle="h4" mt={1}>
            {t("title")}
          </Heading>
        </Box>

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
                    <Tag flexShrink={0} colorScheme="cyan" variant="subtle">
                      {getOutcomeLabel(round, t)}
                    </Tag>
                  </HStack>
                  <AccordionIcon ml={2} />
                </AccordionButton>
                <AccordionPanel px={{ base: 2, md: 3 }} pb={5}>
                  <VStack align="stretch" spacing={4}>
                    <Text color="ink.300" textStyle="caption">
                      {t("confirmedAt")}{" "}
                      {round.confirmedAt > 0
                        ? dateFormatter.format(round.confirmedAt)
                        : t("dateUnavailable")}
                    </Text>
                    <Text color="ink.300" textStyle="body-sm">
                      {t("average", {
                        average: formatRoundAverage(round.average, locale),
                      })}
                    </Text>
                    <Divider borderColor="whiteAlpha.100" />
                    {round.votes.length === 0 ? (
                      <Text color="ink.300" textStyle="body-sm">
                        {t("noParticipants")}
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
                              {vote.point ?? t("didNotVote")}
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
      </VStack>
    </GlassPanel>
  );
}
