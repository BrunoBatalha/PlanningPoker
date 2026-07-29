'use client'

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { UsernameForm } from "@/components/UsernameForm";

interface ModalCreateUsernameProps {
  onSubmit: (values: { username: string }) => void | Promise<void>;
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  submitLabel?: string;
}

export default function ModalCreateUsername({
  onSubmit,
  isLoading,
  isOpen,
  onClose,
  title = "Criar nova sala",
  submitLabel = "Criar sala",
}: ModalCreateUsernameProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
          aria-label="Fechar"
          isDisabled={isLoading}
          variant="ghost"
        />
        <ModalBody pb={7}>
          <UsernameForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            submitLabel={submitLabel}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
