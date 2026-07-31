"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import type { KeyboardEvent } from "react";

import { useTranslations } from "@/i18n";

export type RoundTitleSaveStatus = "idle" | "saving" | "saved" | "error";

interface RoundTitleFieldProps {
  value: string;
  status: RoundTitleSaveStatus;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function RoundTitleField({
  value,
  status,
  onChange,
  onSave,
}: RoundTitleFieldProps) {
  const t = useTranslations("roomTitle");

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.currentTarget.blur();
  }

  return (
    <FormControl isInvalid={status === "error"}>
      <FormLabel color="ink.100" textStyle="label" mb={2}>
        {t("label")}
      </FormLabel>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        placeholder={t("placeholder")}
        aria-describedby="round-title-help"
        isDisabled={status === "saving"}
        variant="filled"
        bg="whiteAlpha.100"
        borderColor="whiteAlpha.200"
        _hover={{ bg: "whiteAlpha.200" }}
        _focusVisible={{
          bg: "whiteAlpha.100",
          borderColor: "brand.400",
          boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)",
        }}
      />
      <FormHelperText
        id="round-title-help"
        color={status === "error" ? "red.200" : "ink.300"}
        textStyle="caption"
        aria-live="polite"
      >
        {t(status)}
      </FormHelperText>
    </FormControl>
  );
}
