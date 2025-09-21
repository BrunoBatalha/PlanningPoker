import { LinkIcon } from "@chakra-ui/icons";
import { Button, useClipboard, useToast } from "@chakra-ui/react";
import { useEffect } from "react";

export function ButtonShareRoom() {
    const toast = useToast()
    const { onCopy, setValue: setValueToClipboard } = useClipboard('')

    useEffect(() => {
        setValueToClipboard(window.location.href)
    }, [setValueToClipboard])

    function handleCopyLink() {
        onCopy()
        toast({
            title: 'Copiado! Compartilhe com seu time',
            description: window.location.href,
            status: 'info',
            duration: 2000,
            isClosable: true,
            position: 'top',
        })
    }
    return (
        <Button leftIcon={<LinkIcon />} variant='outline' onClick={handleCopyLink}>
            Compartilhar
        </Button>
    )
}