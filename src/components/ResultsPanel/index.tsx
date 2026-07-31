'use client'

import {
  Box,
  Flex,
  Grid,
  HStack,
  Heading,
  Progress,
  SimpleGrid,
  Tag,
  TagLabel,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { GlassPanel } from "@/components/GlassPanel";
import {
  getRoundVoteExtremes,
  getVoteDistribution,
  type VoteExtremeParticipant,
} from "@/domain/estimation";
import { useLocale, useTranslations } from "@/i18n";
import { calculateRoundAverage } from "@/services/RoomService";
import type { RoomUser } from "@/services/UserService";

interface ResultsPanelProps {
  participants: RoomUser[];
}

interface ExtremeCardProps {
  label: string;
  value: number;
  participants: VoteExtremeParticipant[];
  accentColor: string;
}

function ParticipantTags({
  participants,
}: {
  participants: VoteExtremeParticipant[];
}) {
  return (
    <Flex flexWrap="wrap" gap={2}>
      {participants.map((participant) => (
        <Tag
          key={participant.key}
          size="md"
          variant="subtle"
          colorScheme="gray"
          maxW="full"
        >
          <TagLabel whiteSpace="normal" overflowWrap="anywhere">
            {participant.username}
          </TagLabel>
        </Tag>
      ))}
    </Flex>
  );
}

function ExtremeCard({
  label,
  value,
  participants,
  accentColor,
}: ExtremeCardProps) {
  return (
    <Box
      p={{ base: 4, md: 5 }}
      borderRadius="2xl"
      border="1px solid"
      borderColor="whiteAlpha.200"
      bg="whiteAlpha.50"
      minW={0}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="baseline" spacing={4}>
          <Text textStyle="label" color="ink.200" fontWeight="700">
            {label}
          </Text>
          <Text
            color={accentColor}
            textStyle="code-card"
            fontSize={{ base: "2xl", md: "3xl" }}
            flexShrink={0}
          >
            {value}
          </Text>
        </HStack>
        <ParticipantTags participants={participants} />
      </VStack>
    </Box>
  );
}

export function ResultsPanel({ participants }: ResultsPanelProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = useLocale();
  const t = useTranslations("results");
  const points = participants.map((participant) => participant.point);
  const numericPoints = points
    .filter((point): point is string => point !== null)
    .map(Number)
    .filter(Number.isFinite);
  const average = calculateRoundAverage(points);
  const averageLabel =
    average === null
      ? t("noNumericAverage")
      : new Intl.NumberFormat(locale, {
          maximumFractionDigits: 2,
        }).format(average);
  const distribution = getVoteDistribution(points);
  const extremes = getRoundVoteExtremes(participants);
  const total = Math.max(points.length, 1);

  return (
    <Grid
      as={motion.div}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
      templateColumns={{ base: "1fr", lg: "0.75fr 1.25fr" }}
      gap={4}
      w="full"
    >
      <GlassPanel
        p={{ base: 6, md: 8 }}
        borderColor="rgba(77, 227, 227, 0.28)"
        boxShadow="glowCyan"
      >
        <VStack spacing={2} align="flex-start">
          <Text textStyle="eyebrow" color="signal.cyan">
            {t("averageEyebrow")}
          </Text>
          {average !== null ? (
            <Heading as="p" textStyle="result" color="white">
              {averageLabel}
            </Heading>
          ) : (
            <Heading as="p" textStyle="h4" color="ink.100">
              {averageLabel}
            </Heading>
          )}
          <Text color="ink.300" textStyle="body-sm">
            {numericPoints.length}{" "}
            {numericPoints.length === 1
              ? t("numericVote")
              : t("numericVotes")}
          </Text>
        </VStack>
      </GlassPanel>

      <GlassPanel p={{ base: 6, md: 8 }}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text textStyle="eyebrow">{t("distributionEyebrow")}</Text>
            <Heading as="h2" textStyle="h4" mt={1}>
              {t("distributionTitle")}
            </Heading>
          </Box>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {distribution.map((item) => (
              <Box key={item.value}>
                <HStack justify="space-between" mb={1.5}>
                  <Text color="ink.100" textStyle="body-sm" fontWeight="700">
                    {item.value === "Não votou" ? t("didNotVote") : item.value}
                  </Text>
                  <Text color="ink.300" textStyle="caption">
                    {item.count}{" "}
                    {item.count === 1 ? t("vote") : t("votes")}
                  </Text>
                </HStack>
                <Progress
                  value={(item.count / total) * 100}
                  size="xs"
                  borderRadius="full"
                  colorScheme={item.value === "Não votou" ? "orange" : "cyan"}
                  bg="whiteAlpha.100"
                />
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </GlassPanel>

      {extremes.kind !== "none" ? (
        <GlassPanel
          as="section"
          gridColumn={{ base: "1", lg: "1 / -1" }}
          p={{ base: 6, md: 8 }}
          borderColor="rgba(163, 141, 255, 0.28)"
          aria-labelledby="discussion-points-title"
        >
          <VStack spacing={5} align="stretch" aria-live="polite">
            <Box>
              <Text textStyle="eyebrow">{t("discussionEyebrow")}</Text>
              <Heading id="discussion-points-title" as="h2" textStyle="h4" mt={1}>
                {t("discussionTitle")}
              </Heading>
              <Text color="ink.300" textStyle="body-sm" mt={2} maxW="2xl">
                {extremes.kind === "consensus"
                  ? t("consensusDescription")
                  : t("discussionDescription")}
              </Text>
            </Box>

            {extremes.kind === "consensus" ? (
              <Box
                p={{ base: 4, md: 5 }}
                borderRadius="2xl"
                border="1px solid"
                borderColor="rgba(74, 222, 128, 0.3)"
                bg="rgba(74, 222, 128, 0.07)"
              >
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="baseline" spacing={4}>
                    <Text textStyle="label" color="ink.100" fontWeight="700">
                      {t("consensusLabel")}
                    </Text>
                    <Text
                      color="signal.green"
                      textStyle="code-card"
                      fontSize={{ base: "2xl", md: "3xl" }}
                      flexShrink={0}
                    >
                      {extremes.value}
                    </Text>
                  </HStack>
                  <ParticipantTags participants={extremes.participants} />
                </VStack>
              </Box>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                <ExtremeCard
                  label={t("minimumLabel")}
                  value={extremes.minimum.value}
                  participants={extremes.minimum.participants}
                  accentColor="signal.indigo"
                />
                <ExtremeCard
                  label={t("maximumLabel")}
                  value={extremes.maximum.value}
                  participants={extremes.maximum.participants}
                  accentColor="signal.cyan"
                />
              </SimpleGrid>
            )}
          </VStack>
        </GlassPanel>
      ) : null}
    </Grid>
  );
}
