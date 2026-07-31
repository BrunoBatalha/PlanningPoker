'use client'

import {
  Box,
  Grid,
  HStack,
  Heading,
  Progress,
  SimpleGrid,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

import { GlassPanel } from "@/components/GlassPanel";
import { getVoteDistribution } from "@/domain/estimation";
import {
  calculateRoundAverage,
  formatRoundAverage,
} from "@/services/RoomService";

interface ResultsPanelProps {
  points: Array<string | null>;
}

export function ResultsPanel({ points }: ResultsPanelProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const numericPoints = points
    .filter((point): point is string => point !== null)
    .map(Number)
    .filter(Number.isFinite);
  const average = calculateRoundAverage(points);
  const averageLabel = formatRoundAverage(average);
  const distribution = getVoteDistribution(points);
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
            Média da rodada
          </Text>
          {average !== null ? (
            <Heading
              as="p"
              textStyle="result"
              color="white"
            >
              {averageLabel}
            </Heading>
          ) : (
            <Heading as="p" textStyle="h4" color="ink.100">
              {averageLabel}
            </Heading>
          )}
          <Text color="ink.300" textStyle="body-sm">
            {numericPoints.length}{" "}
            {numericPoints.length === 1 ? "voto numérico" : "votos numéricos"}
          </Text>
        </VStack>
      </GlassPanel>

      <GlassPanel p={{ base: 6, md: 8 }}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text textStyle="eyebrow">Distribuição</Text>
            <Heading as="h2" textStyle="h4" mt={1}>
              Como o time votou
            </Heading>
          </Box>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            {distribution.map((item) => (
              <Box key={item.value}>
                <HStack justify="space-between" mb={1.5}>
                  <Text color="ink.100" textStyle="body-sm" fontWeight="700">
                    {item.value}
                  </Text>
                  <Text color="ink.300" textStyle="caption">
                    {item.count} {item.count === 1 ? "voto" : "votos"}
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
    </Grid>
  );
}
