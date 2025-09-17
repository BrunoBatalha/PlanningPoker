import { onValue, push, ref, runTransaction, set } from "firebase/database";
import { database } from "../../../firebase";

interface CurrentUser {
    username: string,
    key: string
}

interface User {
    username: string,
    point: string | null
    key?: string
}

interface ListPlayers {
    [id: string]: Omit<User, 'key'>
};

async function addUserToRoom(roomId: string, username: string) {
    const userRef = ref(database, `rooms/${roomId}/users`);
    const response = await push(userRef, { username, point: null });
    return response.key;
}

function getCurrentUser() {
    const storageUser = window.sessionStorage.getItem('currentUser')
    const currentUser = JSON.parse(storageUser ?? '{}') as CurrentUser
    if (!storageUser || !currentUser.key || !currentUser.username) {
        return null
    }
    return currentUser
}

async function savePoint(roomId: string, userId: string, username: string, point: string) {
    const pointRef = ref(database, `rooms/${roomId}/users/${userId}`);
    await set(pointRef, {
        username: username,
        point: point
    })
}

async function resetPointsAllUsers(roomId: string) {
    const usersRef = ref(database, `rooms/${roomId}/users`);

    await runTransaction(usersRef, (currentData: { [id: string]: User }) => {
        if (currentData) {
            Object.keys(currentData).forEach(userKey => {
                if (currentData[userKey]) {
                    currentData[userKey].point = null;
                }
            });
        }
        return currentData;
    });
}

async function onPlayersUpdate(roomId:string, callback: (users: User[]) => void) {
    const usersRef = ref(database, `rooms/${roomId}/users`);
    onValue(usersRef, (snapshot) => {
        if (!snapshot.exists()) {
            return;
        }

        const playersRaw = snapshot.val() as ListPlayers;
        const keyValue = Object.entries(playersRaw) as [string, User][]
        const playerList = keyValue.map<User>(([key, value]) => ({ key, ...value } as User))

        callback(playerList)
    });
}

export const userService = {
    addUserToRoom,
    getCurrentUser,
    savePoint,
    resetPointsAllUsers,
    onPlayersUpdate
}