'use client'
import ModalCreateUsername from "@/components/ModalCreateUsername";
import { Button, useToast } from "@chakra-ui/react";
import * as realtimeDatabase from "firebase/database";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { app } from "../../../firebase";

export default function CreateRoomButton() {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleSubmit({ username }: { username: string }) {
    setIsLoading(true)
    try {
      const database = realtimeDatabase.getDatabase(app)
      const roomsRef = realtimeDatabase.ref(database, `rooms`);
      const responseSaveRoom = await realtimeDatabase.push(roomsRef, { isShowingAverage: false })
      const roomKey = responseSaveRoom.key
      const userRef = realtimeDatabase.ref(database, `rooms/${roomKey}/users`)
      const responseSaveUser = await realtimeDatabase.push(userRef, { username, point: null })
      if (!responseSaveUser.key) {
        throw new Error("Response after save user not have key");
      }
      window.sessionStorage.setItem('currentUser', JSON.stringify({ key: responseSaveUser.key, username: username }))
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

  return (
    <>
      <Button 
        size="lg" 
        colorScheme="purple" 
        onClick={() => setIsModalOpen(true)}
        px={8}
        py={6}
        fontSize="xl"
      >
        Começar
      </Button>
      
      {isModalOpen && (
        <ModalCreateUsername 
          onSubmit={(values) => handleSubmit(values)} 
          isLoading={isLoading}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
