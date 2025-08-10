import { AddIcon, LinkIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, Tag, useClipboard, useToast } from "@chakra-ui/react";
import { useEffect } from "react";

interface UserPanelProps {
  currentUser: { username: string; key: string } | undefined;
  onNewRoom: () => void;
}

export function UserPanel({ currentUser, onNewRoom }: UserPanelProps) {
  const { setValue: setValueToClipboard, onCopy } = useClipboard('');
  const toast = useToast();

  useEffect(() => {
    setValueToClipboard(window.location.href);
  }, [setValueToClipboard]);

  const handleCopyLink = () => {
    onCopy();
    toast({
      title: 'Copiado! Compartilhe com seu time',
      description: window.location.href,
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Flex flexDir='column' position='absolute' top='4' left='4' gap='2'>
      <Tag variant='subtle'>
        <Avatar
          src={`https://api.multiavatar.com/${currentUser?.key ?? ''}.svg`}
          size='xs'
          name={currentUser?.username}
          ml={-1}
          mr={2}
        />
        {currentUser?.username}
      </Tag>

      <Button leftIcon={<LinkIcon />} variant='outline' onClick={handleCopyLink}>
        Compartilhar
      </Button>
      
      <Button leftIcon={<AddIcon />} variant='outline' onClick={onNewRoom}>
        Nova sala
      </Button>
    </Flex>
  );
}
