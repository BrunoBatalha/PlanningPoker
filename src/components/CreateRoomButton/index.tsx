"use client";

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, type ButtonProps, useToast } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { CreateRoomFormValues } from "@/components/ModalCreateRoom";
import { useTranslations } from "@/i18n";

const ModalCreateRoom = dynamic(() => import("@/components/ModalCreateRoom"), {
  ssr: false,
});

interface CreateRoomButtonProps extends Omit<ButtonProps, "onSubmit"> {
  label?: string;
}

export default function CreateRoomButton({
  label,
  ...buttonProps
}: CreateRoomButtonProps) {
  const t = useTranslations("createRoom");
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleSubmit({
    username,
    isWaitingGameAllowed,
  }: CreateRoomFormValues) {
    setIsLoading(true);
    try {
      const [{ roomService }, { userService }] = await Promise.all([
        import("@/services/RoomService"),
        import("@/services/UserService"),
      ]);
      const roomKey = await roomService.createRoom({ isWaitingGameAllowed });
      const userKey = await userService.addUserToRoom(roomKey, username);
      userService.setCurrentUser({ key: userKey, username });
      router.push(`/room/${roomKey}`);
    } catch (error) {
      console.error(error);
      toast({ title: t("error"), description: t("retry"), status: "error", duration: 4000, position: "top", isClosable: true });
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button
        size="lg"
        variant="premium"
        rightIcon={<ArrowForwardIcon />}
        onClick={() => setIsModalOpen(true)}
        {...buttonProps}
      >
        {label ?? t("defaultLabel")}
      </Button>
      {isModalOpen ? (
        <ModalCreateRoom
          isOpen
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onClose={() => setIsModalOpen(false)}
          title={t("title")}
          submitLabel={t("submit")}
        />
      ) : null}
    </>
  );
}
