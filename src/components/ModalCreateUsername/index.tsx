'use client'
import { Input, Button, FormControl, FormLabel, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface Props {
    onSubmit: ({ username }: { username: string }) => void
    isLoading: boolean
}

export default function ModalCreateUsername({ onSubmit, isLoading }: Props) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const { isOpen, onOpen } = useDisclosure()
    const [username, setUsername] = useState<string>()

    useEffect(() => {
        onOpen()
    }, [onOpen])

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={() => { }}
            closeOnEsc={false}
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <ModalContent as='form' onSubmit={(e) => {
                e.preventDefault()
                onSubmit({ username: username ?? '' })
            }}>
                <ModalHeader>Entrar na sala</ModalHeader>
                <ModalBody pb={6}>
                    <FormControl isRequired>
                        <FormLabel>Nome de usuário</FormLabel>
                        <Input variant='flushed' placeholder='Ex.: Pedro' onChange={e => setUsername(e.target.value)} isDisabled={isLoading} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button isDisabled={!username || isLoading} type='submit' isLoading={isLoading}>Continuar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}