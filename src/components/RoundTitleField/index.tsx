"use client";

import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import type { KeyboardEvent } from "react";

interface RoundTitleFieldProps {
  value: string;
  fallbackTitle: string;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
}

export function RoundTitleField({
  value,
  fallbackTitle,
  isSaving,
  onChange,
  onSave,
}: RoundTitleFieldProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    event.currentTarget.blur();
  }

  return (
    <FormControl>
      <FormLabel color="ink.100" textStyle="label" mb={2}>
        Item da rodada
      </FormLabel>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onSave}
        onKeyDown={handleKeyDown}
        placeholder={fallbackTitle}
        aria-describedby="round-title-help"
        isDisabled={isSaving}
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
      <FormHelperText id="round-title-help" color="ink.300" textStyle="caption">
        {isSaving
          ? "Salvando para todos..."
          : `Opcional. Sem um nome, usaremos ${fallbackTitle}.`}
      </FormHelperText>
    </FormControl>
  );
}
