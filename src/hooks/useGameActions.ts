import { useToast } from "@chakra-ui/react";
import * as realtimeDatabase from "firebase/database";
import { useCallback } from "react";
import { app } from "../../firebase";

interface User {
  username: string;
  point: string | null;
  key?: string;
}

interface CurrentUser {
  username: string;
  key: string;
}

export function useGameActions(roomKey: string, currentUser: CurrentUser | undefined, players: User[]) {
  const toast = useToast();

  const calculateAverage = useCallback((pointSelected: string | null) => {
    const total = players.reduce((acc: number, current: User) => {
      const value = Number(current.point);
      return isNaN(value) ? acc : acc + value;
    }, 0);
    const castToNumber = Number(pointSelected);
    const value = isNaN(castToNumber) ? 0 : castToNumber;
    const average = (total + value) / (players.length + 1);
    return average.toPrecision(3);
  }, [players]);

  const savePoint = useCallback(async (point: string | null) => {
    try {
      if (!currentUser) {
        throw new Error("Current user is not valid");
      }
      const database = realtimeDatabase.getDatabase(app);
      const pointRef = realtimeDatabase.ref(database, `rooms/${roomKey}/users/${currentUser.key}`);
      await realtimeDatabase.set(pointRef, {
        username: currentUser.username,
        point: point
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Não foi possível concluir a ação',
        description: "Entre em contato com o suporte.",
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      throw error;
    }
  }, [roomKey, currentUser, toast]);

  const saveIsShowingAverage = useCallback(async (isShowing: boolean) => {
    const database = realtimeDatabase.getDatabase(app);
    const ref = realtimeDatabase.ref(database, `rooms/${roomKey}`);
    await realtimeDatabase.update(ref, { isShowingAverage: isShowing });
  }, [roomKey]);

  const resetAllUsersPoints = useCallback(async () => {
    if (!currentUser) {
      throw new Error("Current user is not valid");
    }

    const updates = players.reduce((acc: { [k: string]: Partial<User> }, p) => {
      return {
        ...acc,
        [p.key!]: {
          username: p.username,
          point: null
        }
      };
    }, {});

    const finalUpdates = { ...updates, [currentUser.key]: { username: currentUser.username, point: null } };
    
    const database = realtimeDatabase.getDatabase(app);
    const ref = realtimeDatabase.ref(database, `rooms/${roomKey}/users`);
    await realtimeDatabase.update(ref, finalUpdates);
  }, [roomKey, currentUser, players]);

  return {
    calculateAverage,
    savePoint,
    saveIsShowingAverage,
    resetAllUsersPoints
  };
}
