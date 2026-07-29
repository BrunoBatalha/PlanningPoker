'use client'

import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, type ButtonProps, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ModalCreateUsername from "@/components/ModalCreateUsername";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";

interface CreateRoomButtonProps extends Omit<ButtonProps, "onSubmit"> {
  label?: string;
}

export default function CreateRoomButton({
  label = "Criar sala grátis",
  ...buttonProps
}: CreateRoomButtonProps) {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleSubmit({ username }: { username: string }) {
    setIsLoading(true);

    try {
      const roomKey = await roomService.createRoom();
      const userKey = await userService.addUserToRoom(roomKey, username);
      userService.setCurrentUser({ key: userKey, username });
      router.push(`/room/${roomKey}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Não foi possível criar a sala",
        description: "Verifique sua conexão e tente novamente.",
        status: "error",
        duration: 4000,
        position: "top",
        isClosable: true,
      });
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
        {label}
      </Button>
      <ModalCreateUsername
        isOpen={isModalOpen}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
