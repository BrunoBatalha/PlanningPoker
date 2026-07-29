"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRef } from "react";

interface RoundConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  averageLabel: string;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function RoundConfirmationDialog({
  isOpen,
  title,
  averageLabel,
  isLoading,
  onCancel,
  onConfirm,
}: RoundConfirmationDialogProps) {
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
            Encerrar esta rodada?
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack align="stretch" spacing={4}>
              <Text color="ink.300">
                Confirme os dados que serão registrados no histórico.
              </Text>
              <Box
                borderRadius="xl"
                border="1px solid"
                borderColor="whiteAlpha.200"
                bg="whiteAlpha.100"
                p={4}
              >
                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text textStyle="caption" color="ink.300">
                      Item
                    </Text>
                    <Text color="ink.50" fontWeight="700">
                      {title}
                    </Text>
                  </Box>
                  <Box>
                    <Text textStyle="caption" color="ink.300">
                      Média final
                    </Text>
                    <Text color="signal.cyan" fontWeight="800">
                      {averageLabel}
                    </Text>
                  </Box>
                </VStack>
              </Box>
              <Text color="orange.200" textStyle="body-sm">
                O registro será imutável. Em seguida, todos os votos serão
                limpos para a próxima rodada.
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
                loadingText="Confirmando"
                w={{ base: "full", sm: "auto" }}
              >
                Confirmar e iniciar nova rodada
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
