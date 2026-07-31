"use client";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useTranslations } from "@/i18n";
export type RoundPhase = "waiting" | "secret" | "revealed";
interface RoundStatusProps { phase: RoundPhase; voteCount: number; participantCount: number; }
export function RoundStatus({ phase, voteCount, participantCount }: RoundStatusProps) { const t = useTranslations("roundStatus"); const color = phase === "waiting" ? "signal.blue" : phase === "secret" ? "signal.indigo" : "signal.cyan"; return <HStack spacing={3} align="flex-start" role="status" aria-live="polite"><Box mt={1.5} boxSize={2.5} flexShrink={0} borderRadius="full" bg={color} /><VStack spacing={0.5} align="flex-start"><Text color="ink.50" textStyle="label" fontWeight="700">{t(`${phase}.label`)}</Text><Text color="ink.300" textStyle="body-sm">{t(`${phase}.description`)} {t("count", { votes: voteCount, participants: participantCount })}</Text></VStack></HStack>; }
