"use client";

import {
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Switch,
} from "@chakra-ui/react";
import { useState } from "react";

import { UsernameForm } from "@/components/UsernameForm";
import { useTranslations } from "@/i18n";

export interface CreateRoomFormValues {
  username: string;
  isWaitingGameAllowed: boolean;
}

interface ModalCreateRoomProps {
  onSubmit: (values: CreateRoomFormValues) => void | Promise<void>;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  submitLabel?: string;
}

export default function ModalCreateRoom({
  onSubmit,
  isLoading,
  isOpen,
  onClose,
  title = "Criar nova sala",
  submitLabel = "Criar sala",
}: ModalCreateRoomProps) {
  const t = useTranslations("createRoom");
  const [isWaitingGameAllowed, setIsWaitingGameAllowed] = useState(true);

  function handleSubmit({ username }: { username: string }) {
    return onSubmit({ username, isWaitingGameAllowed });
  }

  function handleClose() {
    setIsWaitingGameAllowed(true);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnEsc={!isLoading}
      closeOnOverlayClick={!isLoading}
      isCentered
      size={{ base: "full", sm: "md" }}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent mx={{ base: 0, sm: 4 }}>
        <ModalHeader pr={14}>{title}</ModalHeader>
        <ModalCloseButton
          aria-label={t("close")}
          isDisabled={isLoading}
          variant="ghost"
        />
        <ModalBody pb={7}>
          <UsernameForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitLabel={submitLabel}
          >
            <FormControl
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={4}
            >
              <FormLabel
                htmlFor="waiting-game-allowed"
                color="ink.100"
                mb={0}
                cursor={isLoading ? "not-allowed" : "pointer"}
              >
                {t("allowWaitingGame")}
              </FormLabel>
              <Switch
                id="waiting-game-allowed"
                colorScheme="purple"
                isChecked={isWaitingGameAllowed}
                isDisabled={isLoading}
                onChange={(event) =>
                  setIsWaitingGameAllowed(event.target.checked)
                }
                flexShrink={0}
              />
            </FormControl>
          </UsernameForm>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
