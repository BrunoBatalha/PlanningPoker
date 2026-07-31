"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { FiMessageSquare } from "react-icons/fi";

import { useLocale, useTranslations } from "@/i18n";
import {
  SUGGESTION_MAX_LENGTH,
  suggestionService,
} from "@/services/SuggestionService";

const OPEN_SUGGESTION_EVENT = "battle-poker:open-suggestion";

export function openSuggestionDialog() {
  window.dispatchEvent(new Event(OPEN_SUGGESTION_EVENT));
}

export function SuggestionButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("suggestion");
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const normalizedMessage = message.trim();
  const isEmpty = normalizedMessage.length === 0;
  const isTooLong = normalizedMessage.length > SUGGESTION_MAX_LENGTH;
  const isInvalid = hasSubmitted && (isEmpty || isTooLong);
  const isRoomPage = /^\/(?:en\/)?room\/[^/]+\/?$/.test(pathname);

  useEffect(() => {
    window.addEventListener(OPEN_SUGGESTION_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SUGGESTION_EVENT, onOpen);
  }, [onOpen]);

  function handleClose() {
    if (isSubmitting) {
      return;
    }

    setHasSubmitted(false);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (isEmpty || isTooLong) {
      textareaRef.current?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      await suggestionService.createSuggestion({
        message: normalizedMessage,
        path: pathname,
        locale,
      });

      setMessage("");
      setHasSubmitted(false);
      onClose();
      toast({
        title: t("successTitle"),
        description: t("successDescription"),
        status: "success",
        duration: 3500,
        position: "top",
        isClosable: true,
      });
    } catch {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        status: "error",
        duration: 4500,
        position: "top",
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {!isRoomPage ? (
        <Tooltip label={t("buttonLabel")} placement="left" hasArrow>
        <IconButton
          aria-label={t("buttonLabel")}
          icon={<Icon as={FiMessageSquare} boxSize={5} />}
          onClick={onOpen}
          position="fixed"
          right={{ base: 4, md: 6 }}
          bottom={{
            base: "calc(env(safe-area-inset-bottom, 0px) + 16px)",
            md: 6,
          }}
          boxSize={12}
          minW={12}
          borderRadius="full"
          color="canvas.950"
          bgGradient="linear(to-br, signal.cyan, signal.green)"
          boxShadow="0 14px 34px rgba(15, 118, 110, 0.38)"
          zIndex={20}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 18px 38px rgba(15, 118, 110, 0.48)",
          }}
          _active={{ transform: "translateY(0)" }}
        />
        </Tooltip>
      ) : null}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        initialFocusRef={textareaRef}
        isCentered
        closeOnEsc={!isSubmitting}
        closeOnOverlayClick={!isSubmitting}
      >
        <ModalOverlay />
        <ModalContent mx={4} as="form" onSubmit={handleSubmit}>
          <ModalHeader>{t("title")}</ModalHeader>
          <ModalCloseButton isDisabled={isSubmitting} />
          <ModalBody>
            <Text color="ink.300" textStyle="body-sm" mb={5}>
              {t("description")}
            </Text>
            <FormControl isRequired isInvalid={isInvalid}>
              <FormLabel color="ink.100">{t("label")}</FormLabel>
              <Textarea
                ref={textareaRef}
                name="suggestion"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t("placeholder")}
                maxLength={SUGGESTION_MAX_LENGTH}
                minH={36}
                resize="vertical"
                isDisabled={isSubmitting}
                bg="rgba(8, 13, 30, 0.62)"
                borderColor="whiteAlpha.200"
                _placeholder={{ color: "ink.400" }}
                _hover={{ borderColor: "whiteAlpha.300" }}
                _focusVisible={{
                  borderColor: "brand.300",
                  boxShadow: "0 0 0 3px rgba(124, 92, 255, 0.2)",
                }}
              />
              {isInvalid ? (
                <FormErrorMessage textStyle="body-sm">
                  {isTooLong ? t("tooLong") : t("required")}
                </FormErrorMessage>
              ) : (
                <FormHelperText color="ink.300" textStyle="body-sm">
                  {t("help", { count: message.length, max: SUGGESTION_MAX_LENGTH })}
                </FormHelperText>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <HStack
              spacing={3}
              w="full"
              flexDir={{ base: "column-reverse", sm: "row" }}
              justify="flex-end"
            >
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                isDisabled={isSubmitting}
                w={{ base: "full", sm: "auto" }}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="premium"
                isDisabled={isEmpty || isTooLong || isSubmitting}
                isLoading={isSubmitting}
                loadingText={t("submitting")}
                w={{ base: "full", sm: "auto" }}
              >
                {t("submit")}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
