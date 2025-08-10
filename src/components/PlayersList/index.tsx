import { Flex } from "@chakra-ui/react";
import { CardOtherPlayer } from "../CardOtherPlayer";

interface User {
  username: string;
  point: string | null;
  key?: string;
}

interface PlayersListProps {
  players: User[];
  isShowAverage: boolean;
  position: 'left' | 'right';
}

export function PlayersList({ players, isShowAverage, position }: PlayersListProps) {
  const playersToShow = players.length > 1 
    ? position === 'left' 
      ? players.slice(0, Math.ceil(players.length / 2))
      : players.slice(Math.ceil(players.length / 2))
    : position === 'left' 
      ? players 
      : [];

  const alignItems = position === 'right' ? 'flex-end' : 'flex-start';

  return (
    <Flex 
      flex='1' 
      flexDir='column' 
      gap='4' 
      flexWrap='wrap' 
      justifyContent='center' 
      alignItems={alignItems}
    >
      {playersToShow.map((player, index) => (
        <CardOtherPlayer
          key={`${player.key}-${index}`}
          point={player.point}
          username={player.username}
          showPoint={isShowAverage}
        />
      ))}
    </Flex>
  );
}
