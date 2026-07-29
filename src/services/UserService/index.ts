import {
  onValue,
  push,
  ref,
  runTransaction,
  type Unsubscribe,
  update,
} from "firebase/database";

import { database } from "../../../firebase";

export interface CurrentUser {
  username: string;
  key: string;
}

export interface RoomUser {
  username: string;
  point: string | null;
  postRevealVoteStatus: PostRevealVoteStatus | null;
  key: string;
}

export type PostRevealVoteStatus = "added" | "changed";

export type VoteMutationResult =
  | { status: "committed" }
  | { status: "unchanged" }
  | { status: "stale" };

interface StoredRoomUser {
  username: string;
  point?: string | null;
  postRevealVoteStatus?: PostRevealVoteStatus;
  [key: string]: unknown;
}

type UsersSnapshot = Record<string, StoredRoomUser>;

interface StoredRoom {
  isShowingAverage?: boolean;
  currentRoundId?: string;
  users?: UsersSnapshot;
  [key: string]: unknown;
}

function normalizePostRevealVoteStatus(
  status: unknown,
): PostRevealVoteStatus | null {
  return status === "added" || status === "changed" ? status : null;
}

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
  _username: string,
  point: string | null,
) {
  const pointRef = ref(database, `rooms/${roomId}/users/${userId}`);
  await update(pointRef, { point });
}

async function reviseRevealedPoint(
  roomId: string,
  expectedRoundId: string,
  currentUser: CurrentUser,
  point: string,
): Promise<VoteMutationResult> {
  const roomRef = ref(database, `rooms/${roomId}`);
  let mutationStatus: VoteMutationResult["status"] = "stale";

  const transaction = await runTransaction(
    roomRef,
    (currentData: StoredRoom | null) => {
      const user = currentData?.users?.[currentUser.key];

      if (
        !currentData ||
        !currentData.isShowingAverage ||
        currentData.currentRoundId !== expectedRoundId ||
        !user ||
        user.username !== currentUser.username
      ) {
        mutationStatus = "stale";
        return;
      }

      const previousPoint = user.point ?? null;

      if (previousPoint === point) {
        mutationStatus = "unchanged";
        return currentData;
      }

      mutationStatus = "committed";

      return {
        ...currentData,
        users: {
          ...currentData.users,
          [currentUser.key]: {
            ...user,
            point,
            postRevealVoteStatus:
              previousPoint === null ? "added" : "changed",
          },
        },
      };
    },
  );

  if (!transaction.committed) {
    return { status: "stale" };
  }

  return { status: mutationStatus };
}

async function resetPointsAllUsers(roomId: string) {
  const usersRef = ref(database, `rooms/${roomId}/users`);

  await runTransaction(usersRef, (currentData: UsersSnapshot | null) => {
    if (!currentData) {
      return currentData;
    }

    Object.values(currentData).forEach((user) => {
      user.point = null;
      delete user.postRevealVoteStatus;
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
          postRevealVoteStatus: normalizePostRevealVoteStatus(
            value.postRevealVoteStatus,
          ),
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
  reviseRevealedPoint,
  resetPointsAllUsers,
  onPlayersUpdate,
};
