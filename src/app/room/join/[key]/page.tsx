'use client'
import { useToast } from "@chakra-ui/react";
import * as realtimeDatabase from "firebase/database";
import { app } from "../../../../../firebase";
import { useRouter } from "next/navigation";
import ModalCreateUsername from "@/components/ModalCreateUsername";
import { useState } from "react";

interface ParamsUrl {
    key: string
}

export default function Page({ params }: { params: ParamsUrl }) {
    const router = useRouter()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit({ username }: { username: string }) {
        setIsLoading(true)
        
        try {
            const database = realtimeDatabase.getDatabase(app)
            const roomKey = params.key
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

    return (<ModalCreateUsername onSubmit={(values) => handleSubmit(values)} isLoading={isLoading}/>);
}