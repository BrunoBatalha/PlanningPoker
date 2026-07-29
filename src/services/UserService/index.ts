import {
  onValue,
  push,
  ref,
  runTransaction,
  set,
  type Unsubscribe,
} from "firebase/database";

import { database } from "../../../firebase";

export interface CurrentUser {
  username: string;
  key: string;
}

export interface RoomUser {
  username: string;
  point: string | null;
  key: string;
}

type StoredRoomUser = Omit<RoomUser, "key">;
type UsersSnapshot = Record<string, StoredRoomUser>;

async function addUserToRoom(roomId: string, username: string) {
  const userRef = ref(database, `rooms/${roomId}/users`);
  const response = await push(userRef, { username, point: null });

  if (!response.key) {
    throw new Error("Não foi possível gerar a chave do participante.");
  }

  return response.key;
}

function getCurrentUser(): CurrentUser | null {
  try {
    const storageUser = window.sessionStorage.getItem("currentUser");

    if (!storageUser) {
      return null;
    }

    const currentUser = JSON.parse(storageUser) as Partial<CurrentUser>;

    if (!currentUser.key || !currentUser.username) {
      return null;
    }

    return {
      key: currentUser.key,
      username: currentUser.username,
    };
  } catch {
    window.sessionStorage.removeItem("currentUser");
    return null;
  }
}

function setCurrentUser(currentUser: CurrentUser) {
  window.sessionStorage.setItem("currentUser", JSON.stringify(currentUser));
}

async function savePoint(
  roomId: string,
  userId: string,
  username: string,
  point: string | null,
) {
  const pointRef = ref(database, `rooms/${roomId}/users/${userId}`);
  await set(pointRef, { username, point });
}

async function resetPointsAllUsers(roomId: string) {
  const usersRef = ref(database, `rooms/${roomId}/users`);

  await runTransaction(usersRef, (currentData: UsersSnapshot | null) => {
    if (!currentData) {
      return currentData;
    }

    Object.values(currentData).forEach((user) => {
      user.point = null;
    });

    return currentData;
  });
}

function onPlayersUpdate(
  roomId: string,
  callback: (users: RoomUser[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const usersRef = ref(database, `rooms/${roomId}/users`);

  return onValue(
    usersRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const playersRaw = snapshot.val() as UsersSnapshot;
      const playerList = Object.entries(playersRaw).map<RoomUser>(
        ([key, value]) => ({
          key,
          username: value.username,
          point: value.point ?? null,
        }),
      );

      callback(playerList);
    },
    (error) => onError?.(error),
  );
}

export const userService = {
  addUserToRoom,
  getCurrentUser,
  setCurrentUser,
  savePoint,
  resetPointsAllUsers,
  onPlayersUpdate,
};
