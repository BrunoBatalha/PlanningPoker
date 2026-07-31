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

import { useTranslations } from "@/i18n";

interface PartialRevealConfirmationDialogProps {
  isOpen: boolean;
  pendingCount: number;
  voteCount: number;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PartialRevealConfirmationDialog({
  isOpen,
  pendingCount,
  voteCount,
  isLoading,
  onCancel,
  onConfirm,
}: PartialRevealConfirmationDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("partialRevealDialog");
  const hasVotes = voteCount > 0;

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={isLoading ? () => undefined : onCancel}
      isCentered
      returnFocusOnClose
    >
      <AlertDialogOverlay bg="blackAlpha.700" backdropFilter="blur(6px)">
        <AlertDialogContent
          mx={4}
          maxH="calc(100dvh - 2rem)"
          overflowY="auto"
          bg="canvas.800"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="2xl"
          boxShadow="glassStrong"
        >
          <AlertDialogHeader color="ink.50" fontFamily="heading">
            {pendingCount > 0 ? t("title") : t("readyTitle")}
          </AlertDialogHeader>
          <AlertDialogBody>
            <VStack align="stretch" spacing={3} aria-live="polite">
              <Text color="ink.200">
                {pendingCount > 0
                  ? t(pendingCount === 1 ? "descriptionOne" : "descriptionMany", {
                      count: pendingCount,
                    })
                  : t("readyDescription")}
              </Text>
              <Text color="ink.300" textStyle="body-sm">
                {t("consequence")}
              </Text>
              {!hasVotes ? (
                <Text color="orange.200" textStyle="body-sm">
                  {t("noVotes")}
                </Text>
              ) : null}
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
                {t("cancel")}
              </Button>
              <Button
                colorScheme="purple"
                variant="premium"
                onClick={onConfirm}
                isDisabled={!hasVotes}
                isLoading={isLoading}
                loadingText={t("revealing")}
                w={{ base: "full", sm: "auto" }}
              >
                {t("confirm")}
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
