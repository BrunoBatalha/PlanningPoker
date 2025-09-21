'use client'
import ModalCreateUsername from "@/components/ModalCreateUsername";
import { roomService } from "@/services/RoomService";
import { userService } from "@/services/UserService";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit({ username }: { username: string }) {
    setIsLoading(true)
    try {
      const roomKey = await roomService.createRoom()
      const userKey = await userService.addUserToRoom(roomKey!, username)
      window.sessionStorage.setItem('currentUser', JSON.stringify({ key: userKey, username: username }))
      router.push(`/room/${roomKey}`);
    } catch (error) {
      toast({
        title: 'Não foi possível concluir a ação',
        description: "Entre em contato com o suporte.",
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true,
      })
      setIsLoading(false)
    }
  }

  return (<ModalCreateUsername onSubmit={(values) => handleSubmit(values)} isLoading={isLoading} />);
}