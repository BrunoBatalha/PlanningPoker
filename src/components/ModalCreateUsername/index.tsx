'use client'
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface Props {
    onSubmit: ({ username }: { username: string }) => void
    isLoading: boolean
    onClose?: () => void
}

export default function ModalCreateUsername({ onSubmit, isLoading, onClose }: Props) {
    const initialRef = useRef(null)
    const finalRef = useRef(null)
    const { isOpen, onOpen, onClose: closeModal } = useDisclosure()
    const [username, setUsername] = useState<string>()

    useEffect(() => {
        onOpen()
    }, [onOpen])

    const handleClose = () => {
        closeModal()
        onClose?.()
    }

    return (
        <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isOpen}
            onClose={handleClose}
            closeOnEsc={!!onClose}
            closeOnOverlayClick={!!onClose}
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