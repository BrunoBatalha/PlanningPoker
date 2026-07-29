import {
  get,
  onValue,
  push,
  ref,
  runTransaction,
  serverTimestamp,
  set,
  type Unsubscribe,
  update,
} from "firebase/database";

import { database } from "../../../firebase";

export interface RoomSnapshot {
  isShowingAverage: boolean;
  currentRoundId: string;
  currentRoundTitle: string;
  currentRoundFallbackId: string;
}

export interface RoundHistoryVote {
  key: string;
  username: string;
  point: string | null;
}

export interface RoundHistoryItem {
  id: string;
  title: string;
  average: number | null;
  confirmedAt: number;
  votes: RoundHistoryVote[];
}

export type RoundMutationResult =
  | { status: "committed" }
  | { status: "stale" };

interface StoredRoomUser {
  username: string;
  point: string | null;
}

interface StoredHistoryItem {
  title: string;
  average: number | null;
  confirmedAt: number;
  votes?: Record<string, StoredRoomUser>;
}

interface StoredRoom {
  isShowingAverage?: boolean;
  currentRoundId?: string;
  currentRoundTitle?: string;
  currentRoundFallbackId?: string;
  users?: Record<string, StoredRoomUser>;
  history?: Record<string, StoredHistoryItem>;
}

interface ConfirmRoundInput {
  roundId: string;
  title: string;
  average: number | null;
  fallbackId: string;
}

const FALLBACK_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateFallbackId(previousId?: string): string {
  let generatedId = "";

  do {
    generatedId = Array.from({ length: 4 }, () => {
      const index = Math.floor(Math.random() * FALLBACK_CHARACTERS.length);
      return FALLBACK_CHARACTERS[index];
    }).join("");
  } while (generatedId === previousId);

  return generatedId;
}

function generateRoundId(roomKey: string): string {
  const roundRef = push(ref(database, `rooms/${roomKey}/history`));

  if (!roundRef.key) {
    throw new Error("Não foi possível gerar a chave da rodada.");
  }

  return roundRef.key;
}

export function getEffectiveRoundTitle(
  title: string,
  fallbackId: string,
): string {
  const normalizedTitle = title.trim();
  return normalizedTitle || `Story #${fallbackId}`;
}

export function calculateRoundAverage(
  points: Array<string | null>,
): number | null {
  const numericPoints = points
    .filter((point): point is string => point !== null)
    .map(Number)
    .filter(Number.isFinite);

  if (numericPoints.length === 0) {
    return null;
  }

  return (
    numericPoints.reduce((total, point) => total + point, 0) /
    numericPoints.length
  );
}

export function formatRoundAverage(average: number | null): string {
  if (average === null) {
    return "Sem média numérica";
  }

  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2,
  }).format(average);
}

async function createRoom() {
  const roomRef = push(ref(database, "rooms"));

  if (!roomRef.key) {
    throw new Error("Não foi possível gerar a chave da sala.");
  }

  await set(roomRef, {
    isShowingAverage: false,
    currentRoundId: generateRoundId(roomRef.key),
    currentRoundTitle: "",
    currentRoundFallbackId: generateFallbackId(),
  });

  return roomRef.key;
}

async function roomExists(roomKey: string): Promise<boolean> {
  const roomRef = ref(database, `rooms/${roomKey}`);
  const snapshot = await get(roomRef);
  return snapshot.exists();
}

async function initializeCurrentRound(roomKey: string) {
  const roomRef = ref(database, `rooms/${roomKey}`);
  const generatedRoundId = generateRoundId(roomKey);
  const generatedFallbackId = generateFallbackId();

  await runTransaction(roomRef, (currentData: StoredRoom | null) => {
    if (!currentData) {
      return;
    }

    const hasRoundId =
      typeof currentData.currentRoundId === "string" &&
      currentData.currentRoundId.length > 0;
    const hasFallbackId =
      typeof currentData.currentRoundFallbackId === "string" &&
      currentData.currentRoundFallbackId.length > 0;
    const hasTitle = typeof currentData.currentRoundTitle === "string";

    if (hasRoundId && hasFallbackId && hasTitle) {
      return;
    }

    return {
      ...currentData,
      currentRoundId: hasRoundId
        ? currentData.currentRoundId
        : generatedRoundId,
      currentRoundFallbackId: hasFallbackId
        ? currentData.currentRoundFallbackId
        : generatedFallbackId,
      currentRoundTitle: hasTitle ? currentData.currentRoundTitle : "",
    };
  });
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

async function saveCurrentRoundTitle(
  roomKey: string,
  expectedRoundId: string,
  title: string,
): Promise<RoundMutationResult> {
  const roomRef = ref(database, `rooms/${roomKey}`);
  const normalizedTitle = title.trim();
  const transaction = await runTransaction(
    roomRef,
    (currentData: StoredRoom | null) => {
      if (!currentData || currentData.currentRoundId !== expectedRoundId) {
        return;
      }

      return {
        ...currentData,
        currentRoundTitle: normalizedTitle,
      };
    },
  );

  return transaction.committed
    ? { status: "committed" }
    : { status: "stale" };
}

function averagesMatch(
  currentAverage: number | null,
  expectedAverage: number | null,
): boolean {
  if (currentAverage === null || expectedAverage === null) {
    return currentAverage === expectedAverage;
  }

  return Math.abs(currentAverage - expectedAverage) < Number.EPSILON * 10;
}

async function confirmAndStartNextRound(
  roomKey: string,
  expected: ConfirmRoundInput,
): Promise<RoundMutationResult> {
  const roomRef = ref(database, `rooms/${roomKey}`);
  const nextRoundId = generateRoundId(roomKey);
  const nextFallbackId = generateFallbackId(expected.fallbackId);
  const transaction = await runTransaction(
    roomRef,
    (currentData: StoredRoom | null) => {
      if (
        !currentData ||
        currentData.currentRoundId !== expected.roundId ||
        currentData.history?.[expected.roundId]
      ) {
        return;
      }

      const users = currentData.users ?? {};
      const currentTitle = getEffectiveRoundTitle(
        currentData.currentRoundTitle ?? "",
        currentData.currentRoundFallbackId ?? "",
      );
      const currentAverage = calculateRoundAverage(
        Object.values(users).map((user) => user.point ?? null),
      );

      if (
        currentTitle !== expected.title ||
        !averagesMatch(currentAverage, expected.average)
      ) {
        return;
      }

      const votes = Object.fromEntries(
        Object.entries(users).map(([userId, user]) => [
          userId,
          {
            username: user.username,
            point: user.point ?? null,
          },
        ]),
      );
      const resetUsers = Object.fromEntries(
        Object.entries(users).map(([userId, user]) => [
          userId,
          {
            ...user,
            point: null,
          },
        ]),
      );

      return {
        ...currentData,
        isShowingAverage: false,
        currentRoundId: nextRoundId,
        currentRoundTitle: "",
        currentRoundFallbackId: nextFallbackId,
        users: resetUsers,
        history: {
          ...(currentData.history ?? {}),
          [expected.roundId]: {
            title: currentTitle,
            average: currentAverage,
            confirmedAt: serverTimestamp(),
            votes,
          },
        },
      };
    },
  );

  return transaction.committed
    ? { status: "committed" }
    : { status: "stale" };
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

      const data = snapshot.val() as StoredRoom;
      callback({
        isShowingAverage: Boolean(data.isShowingAverage),
        currentRoundId: data.currentRoundId ?? "",
        currentRoundTitle: data.currentRoundTitle ?? "",
        currentRoundFallbackId: data.currentRoundFallbackId ?? "",
      });
    },
    (error) => onError?.(error),
  );
}

function onHistoryUpdate(
  roomKey: string,
  callback: (history: RoundHistoryItem[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const historyRef = ref(database, `rooms/${roomKey}/history`);

  return onValue(
    historyRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback([]);
        return;
      }

      const historyRaw = snapshot.val() as Record<string, StoredHistoryItem>;
      const history = Object.entries(historyRaw)
        .map<RoundHistoryItem>(([id, item]) => ({
          id,
          title: item.title,
          average: item.average ?? null,
          confirmedAt:
            typeof item.confirmedAt === "number" ? item.confirmedAt : 0,
          votes: Object.entries(item.votes ?? {})
            .map<RoundHistoryVote>(([key, vote]) => ({
              key,
              username: vote.username,
              point: vote.point ?? null,
            }))
            .sort((a, b) =>
              a.username.localeCompare(b.username, "pt-BR", {
                sensitivity: "base",
              }),
            ),
        }))
        .sort((a, b) => b.confirmedAt - a.confirmedAt);

      callback(history);
    },
    (error) => onError?.(error),
  );
}

export const roomService = {
  createRoom,
  roomExists,
  initializeCurrentRound,
  showAverage,
  hideAverage,
  saveCurrentRoundTitle,
  confirmAndStartNextRound,
  onRoomUpdate,
  onHistoryUpdate,
  // Aliases preservados para chamadas legadas.
  showAvarage: showAverage,
  hiddenAvarage: hideAverage,
};
