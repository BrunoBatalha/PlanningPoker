import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface GameCenterProps {
  currentStory: { name: string } | null;
  isShowAverage: boolean;
  average: string;
  onRevealCards: () => void;
  onNewRound: () => void;
}

export function GameCenter({ 
  currentStory, 
  isShowAverage, 
  average, 
  onRevealCards, 
  onNewRound 
}: GameCenterProps) {
  return (
    <Flex flex='2' alignItems='center' justifyContent='center'>
      {!isShowAverage && (
        <Box textAlign='center'>
          {currentStory?.name && (
            <Text mb='2' color='gray.600'>
              Estória atual: <b>{currentStory.name}</b>
            </Text>
          )}
          <Button size='lg' onClick={onRevealCards}>
            REVELAR CARTAS
          </Button>
        </Box>
      )}
      
      {isShowAverage && (
        <Box>
          {currentStory?.name && (
            <Text mb='2' textAlign='center' color='gray.600'>
              Estória: <b>{currentStory.name}</b>
            </Text>
          )}
          <Text fontSize='6xl' textAlign='center' fontWeight='bold' color='purple.600'>
            {average}
          </Text>
          <Button mt='4' w='full' onClick={onNewRound}>
            Nova rodada
          </Button>
        </Box>
      )}
    </Flex>
  );
}
