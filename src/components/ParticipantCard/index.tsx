'use client'

import {
  Avatar,
  Box,
  HStack,
  Tag,
  Text,
  usePrefersReducedMotion,
  VStack,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

import type { PostRevealVoteStatus } from "@/services/UserService";

interface ParticipantCardProps {
  username: string;
  point: string | null;
  postRevealVoteStatus: PostRevealVoteStatus | null;
  isRevealed: boolean;
  isCurrent?: boolean;
}

export function ParticipantCard({
  username,
  point,
  postRevealVoteStatus,
  isRevealed,
  isCurrent = false,
}: ParticipantCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const status = isRevealed
    ? point
      ? "Revelado"
      : "Não votou"
    : point
      ? "Votou"
      : "Pensando";

  return (
    <HStack
      spacing={3}
      p={3}
      borderRadius="2xl"
      bg={isCurrent ? "rgba(112, 72, 245, 0.12)" : "whiteAlpha.50"}
      border="1px solid"
      borderColor={isCurrent ? "brand.400" : "whiteAlpha.100"}
      minW={0}
    >
      <Avatar
        name={username}
        size="sm"
        bg="brand.600"
        color="white"
        flexShrink={0}
      />
      <VStack
        spacing={1}
        align="flex-start"
        minW={0}
        flex={1}
        aria-live="polite"
      >
        <HStack spacing={2} minW={0} flexWrap="wrap">
          <Text
            textStyle="body-sm"
            fontWeight="700"
            color="ink.100"
            noOfLines={1}
          >
            {username}
          </Text>
          {isCurrent ? (
            <Tag size="sm" variant="subtle" colorScheme="purple">
              Você
            </Tag>
          ) : null}
        </HStack>
        <HStack spacing={2} flexWrap="wrap">
          <Text
            textStyle="caption"
            color={
              status === "Não votou"
                ? "signal.amber"
                : point
                  ? "signal.green"
                  : "ink.300"
            }
            fontWeight="600"
          >
            {status}
          </Text>
          {isRevealed &&
          point &&
          postRevealVoteStatus === "added" ? (
            <Tag size="sm" variant="subtle" colorScheme="blue">
              Votou após revelação
            </Tag>
          ) : null}
          {isRevealed &&
          point &&
          postRevealVoteStatus === "changed" ? (
            <Tag size="sm" variant="subtle" colorScheme="orange">
              Voto alterado
            </Tag>
          ) : null}
        </HStack>
      </VStack>
      <AnimatePresence mode="wait">
        {isRevealed && point ? (
          <Box
            key={point}
            as={motion.div}
            initial={
              prefersReducedMotion ? false : { rotateY: 90, opacity: 0 }
            }
            animate={{
              rotateY: 0,
              opacity: 1,
              transition: { duration: 0.28 },
            }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            display="grid"
            placeItems="center"
            w={10}
            h={12}
            borderRadius="lg"
            bg="rgba(77, 227, 227, 0.1)"
            border="1px solid"
            borderColor="rgba(77, 227, 227, 0.35)"
            color="signal.cyan"
            textStyle="code-card"
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="800"
            flexShrink={0}
          >
            {point}
          </Box>
        ) : null}
      </AnimatePresence>
    </HStack>
  );
}
