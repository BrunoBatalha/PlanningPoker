import {
  get,
  onValue,
  push,
  ref,
  type Unsubscribe,
  update,
} from "firebase/database";

import { database } from "../../../firebase";

export interface RoomSnapshot {
  isShowingAverage: boolean;
}

async function createRoom() {
  const roomRef = ref(database, "rooms");
  const response = await push(roomRef, { isShowingAverage: false });

  if (!response.key) {
    throw new Error("Não foi possível gerar a chave da sala.");
  }

  return response.key;
}

async function roomExists(roomKey: string): Promise<boolean> {
  const roomRef = ref(database, `rooms/${roomKey}`);
  const snapshot = await get(roomRef);
  return snapshot.exists();
}

async function showAverage(roomKey: string) {
  await update(ref(database, `rooms/${roomKey}`), {
    isShowingAverage: true,
  });
}

async function hideAverage(roomKey: string) {
  await update(ref(database, `rooms/${roomKey}`), {
    isShowingAverage: false,
  });
}

function onRoomUpdate(
  roomKey: string,
  callback: (room: RoomSnapshot | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const roomRef = ref(database, `rooms/${roomKey}`);

  return onValue(
    roomRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const data = snapshot.val() as Partial<RoomSnapshot>;
      callback({ isShowingAverage: Boolean(data.isShowingAverage) });
    },
    (error) => onError?.(error),
  );
}

export const roomService = {
  createRoom,
  roomExists,
  showAverage,
  hideAverage,
  onRoomUpdate,
  // Aliases preservados para chamadas legadas.
  showAvarage: showAverage,
  hiddenAvarage: hideAverage,
};
