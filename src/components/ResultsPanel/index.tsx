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
  activePendingCount: number;
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

export function ResultsPanel({
  participants,
  activePendingCount,
}: ResultsPanelProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const locale = useLocale();
  const t = useTranslations("results");
  const points = participants.map((participant) => participant.point);
  const votedParticipants = participants.filter(
    (participant) => participant.point !== null,
  );
  const numericPoints = votedParticipants
    .map((participant) => Number(participant.point))
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
  const hasOnlyNumericVotes =
    votedParticipants.length > 0 &&
    numericPoints.length === votedParticipants.length;
  const hasConsensus =
    activePendingCount === 0 &&
    hasOnlyNumericVotes &&
    new Set(numericPoints).size === 1;
  const hasNumericSpread = new Set(numericPoints).size > 1;
  const isSingleVote = votedParticipants.length === 1;

  if (hasConsensus && extremes.kind === "consensus") {
    return (
      <GlassPanel
        as="section"
        p={{ base: 5, md: 7 }}
        borderColor="rgba(74, 222, 128, 0.3)"
        aria-live="polite"
      >
        <VStack spacing={4} align="stretch">
          <Box>
            <Text textStyle="eyebrow" color="signal.green">
              {t("consensusEyebrow")}
            </Text>
            <Heading as="h2" textStyle="h3" mt={1}>
              {t("consensusSummary", { value: extremes.value })}
            </Heading>
            <Text color="ink.300" textStyle="body-sm" mt={2}>
              {t("consensusDescription")}
            </Text>
          </Box>
          <ParticipantTags participants={extremes.participants} />
          <Text color="ink.300" textStyle="caption">
            {t("averageSecondary", { average: averageLabel })}
          </Text>
        </VStack>
      </GlassPanel>
    );
  }

  if (isSingleVote) {
    const participant = votedParticipants[0];

    return (
      <GlassPanel
        as="section"
        p={{ base: 5, md: 7 }}
        aria-live="polite"
      >
        <HStack justify="space-between" align="center" spacing={5}>
          <Box minW={0}>
            <Text textStyle="eyebrow">{t("singleVoteEyebrow")}</Text>
            <Heading as="h2" textStyle="h4" mt={1}>
              {participant.username}
            </Heading>
            <Text color="ink.300" textStyle="body-sm" mt={1}>
              {average === null
                ? t("noNumericAverage")
                : t("averageSecondary", { average: averageLabel })}
            </Text>
            <Text color="ink.300" textStyle="caption" mt={1}>
              {t("singleDistribution", { value: participant.point ?? "—" })}
            </Text>
          </Box>
          <Text
            color="signal.cyan"
            textStyle="code-card"
            fontSize={{ base: "3xl", md: "4xl" }}
          >
            {participant.point}
          </Text>
        </HStack>
      </GlassPanel>
    );
  }

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
        p={{ base: 5, md: 7 }}
        borderColor="rgba(77, 227, 227, 0.28)"
      >
        <VStack spacing={2} align="flex-start">
          <Text textStyle="eyebrow" color="signal.cyan">
            {t("averageEyebrow")}
          </Text>
          <Heading
            as="p"
            textStyle={average === null ? "h4" : "result"}
            color={average === null ? "ink.100" : "white"}
          >
            {averageLabel}
          </Heading>
          <Text color="ink.300" textStyle="body-sm">
            {t(numericPoints.length === 1 ? "numericVoteCount" : "numericVotesCount", {
              count: numericPoints.length,
            })}
          </Text>
        </VStack>
      </GlassPanel>

      <GlassPanel p={{ base: 5, md: 7 }}>
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
                    {t(item.count === 1 ? "voteCount" : "votesCount", {
                      count: item.count,
                    })}
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

      {hasNumericSpread && extremes.kind === "spread" ? (
        <GlassPanel
          as="section"
          gridColumn={{ base: "1", lg: "1 / -1" }}
          p={{ base: 5, md: 7 }}
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
                {t("discussionDescription")}
              </Text>
            </Box>
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
          </VStack>
        </GlassPanel>
      ) : null}
    </Grid>
  );
}
