"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

interface RedoRoundConfirmationDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RedoRoundConfirmationDialog({
  isOpen,
  isLoading,
  onCancel,
  onConfirm,
}: RedoRoundConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={isLoading ? () => undefined : onCancel}
      isCentered
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(6px)">
        <AlertDialogContent
          mx={4}
          bg="canvas.800"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="glassStrong"
        >
          <AlertDialogHeader color="ink.50" fontFamily="heading">
            Refazer esta rodada?
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack align="stretch" spacing={3}>
              <Text color="ink.300">
                Todos os votos e marcações serão removidos.
              </Text>
              <Text color="orange.200" textStyle="body-sm">
                O item, os participantes e o histórico serão mantidos.
              </Text>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack
              spacing={3}
              w="full"
              flexDir={{ base: "column-reverse", sm: "row" }}
              justify="flex-end"
            >
              <Button
                ref={cancelRef}
                variant="ghost"
                onClick={onCancel}
                isDisabled={isLoading}
                w={{ base: "full", sm: "auto" }}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="cyan"
                variant="premium"
                onClick={onConfirm}
                isLoading={isLoading}
                loadingText="Refazendo"
                w={{ base: "full", sm: "auto" }}
              >
                Refazer rodada
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
