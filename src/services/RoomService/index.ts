import { get, push, ref, update } from "firebase/database";
import { database } from "../../../firebase";

export const roomService = {
    createRoom: async () => {
        const roomRef = ref(database, `rooms`);
        const response = await push(roomRef, { isShowingAverage: false });
        const roomKey = response.key;
        return roomKey
    },
    roomExists: async (roomKey: string): Promise<boolean> => {
        const roomRef = ref(database, `rooms/${roomKey}`);
        const snapshot = await get(roomRef);
        return snapshot.exists();
    },
    showAvarage: async (roomKey: string) => {
        const refD = ref(database, `rooms/${roomKey}`);
        await update(refD, { isShowingAverage: true })
    },
    hiddenAvarage: async (roomKey: string) => {
        const refD = ref(database, `rooms/${roomKey}`);
        await update(refD, { isShowingAverage: false })
    },
}