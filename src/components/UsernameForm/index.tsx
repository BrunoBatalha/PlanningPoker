'use client'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useRef, useState } from "react";

interface UsernameFormProps {
  onSubmit: (values: { username: string }) => void | Promise<void>;
  isLoading: boolean;
  submitLabel?: string;
}

export function UsernameForm({
  onSubmit,
  isLoading,
  submitLabel = "Continuar",
}: UsernameFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const normalizedUsername = username.trim();
  const isInvalid = hasSubmitted && !normalizedUsername;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setHasSubmitted(true);

    if (!normalizedUsername) {
      inputRef.current?.focus();
      return;
    }

    onSubmit({ username: normalizedUsername });
  }

  return (
    <VStack as="form" spacing={5} align="stretch" onSubmit={handleSubmit}>
      <FormControl isRequired isInvalid={isInvalid}>
        <FormLabel color="ink.100">Como seu time chama você?</FormLabel>
        <Input
          ref={inputRef}
          autoFocus
          autoComplete="name"
          name="username"
          placeholder="Ex.: Pedro"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          isDisabled={isLoading}
          aria-describedby="username-helper"
        />
        {isInvalid ? (
          <FormErrorMessage textStyle="body-sm">
            Digite seu nome para continuar.
          </FormErrorMessage>
        ) : (
          <FormHelperText
            id="username-helper"
            color="ink.300"
            textStyle="body-sm"
          >
            Sem cadastro. O nome será usado apenas nesta sala.
          </FormHelperText>
        )}
      </FormControl>
      <Button
        type="submit"
        size="lg"
        variant="premium"
        isDisabled={!normalizedUsername || isLoading}
        isLoading={isLoading}
        loadingText="Entrando"
        w="full"
      >
        {submitLabel}
      </Button>
    </VStack>
  );
}
