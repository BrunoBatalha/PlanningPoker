'use client'

import { Box, Button, usePrefersReducedMotion } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { useTranslations } from "@/i18n";

interface VotingCardProps {
  value: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onSelect: (value: string) => void;
}

export function VotingCard({
  value,
  isSelected,
  isDisabled = false,
  onSelect,
}: VotingCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const t = useTranslations("votingCard");
  const accessibleValue =
    value === "?" ? t("question") : value === "☕" ? t("pause") : value;

  return (
    <Box
      as={motion.div}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              y: isSelected ? -5 : 0,
              scale: isSelected ? 1.035 : 1,
              transition: { duration: 0.18, ease: "easeOut" },
            }
      }
    >
      <Button
        type="button"
        variant="votingCard"
        textStyle="code-card"
        sx={{ fontVariantNumeric: "tabular-nums" }}
        w="full"
        minW={0}
        isDisabled={isDisabled}
        aria-pressed={isSelected}
        aria-label={t("vote", { value: accessibleValue })}
        onClick={() => onSelect(value)}
        color={isSelected ? "white" : "ink.100"}
        borderColor={isSelected ? "brand.300" : undefined}
        bg={isSelected ? "rgba(112, 72, 245, 0.3)" : undefined}
        boxShadow={
          isSelected
            ? "0 0 0 1px rgba(163, 141, 255, 0.42), 0 18px 42px rgba(93, 58, 218, 0.34)"
            : undefined
        }
      >
        {value}
      </Button>
    </Box>
  );
}
