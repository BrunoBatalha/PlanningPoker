import {
  onDisconnect,
  onValue,
  push,
  ref,
  runTransaction,
  serverTimestamp,
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

export const PRESENCE_GRACE_PERIOD_MS = 120_000;

export type PresenceStatus =
  | "online"
  | "reconnecting"
  | "offline"
  | "unknown";

export interface RoomUserPresence {
  connectionCount: number;
  lastDisconnectedAt: number | null;
}

export type PresenceSnapshot = Record<string, RoomUserPresence>;

export interface PresenceConnectionController {
  disconnect: () => Promise<void>;
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

interface StoredPresence {
  connections?: Record<string, boolean>;
  lastDisconnectedAt?: number;
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

export function getPresenceStatus(
  presence: RoomUserPresence | undefined,
  now = Date.now(),
): PresenceStatus {
  if (!presence) {
    return "unknown";
  }

  if (presence.connectionCount > 0) {
    return "online";
  }

  if (presence.lastDisconnectedAt === null) {
    return "unknown";
  }

  return now - presence.lastDisconnectedAt < PRESENCE_GRACE_PERIOD_MS
    ? "reconnecting"
    : "offline";
}

function connectPresence(
  roomId: string,
  userId: string,
  onError?: (error: Error) => void,
): PresenceConnectionController {
  const connectedRef = ref(database, ".info/connected");
  const userPresenceRef = ref(database, `rooms/${roomId}/presence/${userId}`);
  const connectionRef = push(
    ref(database, `rooms/${roomId}/presence/${userId}/connections`),
  );

  if (!connectionRef.key) {
    throw new Error("Não foi possível gerar a conexão do participante.");
  }

  let isStopped = false;
  let isRegistered = false;
  const disconnectOperation = onDisconnect(userPresenceRef);
  const connectionPath = `connections/${connectionRef.key}`;

  const unsubscribe = onValue(
    connectedRef,
    async (snapshot) => {
      if (!snapshot.val() || isStopped) {
        return;
      }

      try {
        await disconnectOperation.update({
          [connectionPath]: null,
          lastDisconnectedAt: serverTimestamp(),
        });

        if (isStopped) {
          return;
        }

        await update(userPresenceRef, {
          [connectionPath]: true,
        });
        isRegistered = true;
      } catch (error) {
        onError?.(error as Error);
      }
    },
    (error) => onError?.(error),
  );

  return {
    async disconnect() {
      if (isStopped) {
        return;
      }

      isStopped = true;
      unsubscribe();

      if (!isRegistered) {
        return;
      }

      try {
        await update(userPresenceRef, {
          [connectionPath]: null,
          lastDisconnectedAt: serverTimestamp(),
        });
        await disconnectOperation.cancel();
        isRegistered = false;
      } catch (error) {
        onError?.(error as Error);
      }
    },
  };
}

function onPresenceUpdate(
  roomId: string,
  callback: (presence: PresenceSnapshot) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const presenceRef = ref(database, `rooms/${roomId}/presence`);

  return onValue(
    presenceRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback({});
        return;
      }

      const storedPresence = snapshot.val() as Record<string, StoredPresence>;
      const presence = Object.fromEntries(
        Object.entries(storedPresence).map(([userId, value]) => [
          userId,
          {
            connectionCount: Object.values(value.connections ?? {}).filter(
              Boolean,
            ).length,
            lastDisconnectedAt:
              typeof value.lastDisconnectedAt === "number"
                ? value.lastDisconnectedAt
                : null,
          },
        ]),
      );

      callback(presence);
    },
    (error) => onError?.(error),
  );
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
  connectPresence,
  onPresenceUpdate,
  savePoint,
  reviseRevealedPoint,
  resetPointsAllUsers,
  onPlayersUpdate,
};
