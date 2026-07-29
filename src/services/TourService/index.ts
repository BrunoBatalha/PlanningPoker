export type TourId = "room";

export const TOUR_VERSIONS = {
  room: 1,
} as const satisfies Record<TourId, number>;

const STORAGE_PREFIX = "battle-poker:tutorial";
const fallbackSeenVersions = new Map<TourId, number>();

function getStorageKey(tourId: TourId) {
  return `${STORAGE_PREFIX}:${tourId}`;
}

export function hasSeenTour(tourId: TourId, version: number): boolean {
  const fallbackVersion = fallbackSeenVersions.get(tourId) ?? 0;

  if (typeof window === "undefined") {
    return fallbackVersion >= version;
  }

  try {
    const storedValue = window.localStorage.getItem(getStorageKey(tourId));
    const storedVersion = storedValue ? Number.parseInt(storedValue, 10) : 0;

    if (!Number.isFinite(storedVersion)) {
      return fallbackVersion >= version;
    }

    return Math.max(fallbackVersion, storedVersion) >= version;
  } catch {
    return fallbackVersion >= version;
  }
}

export function markTourSeen(tourId: TourId, version: number): void {
  fallbackSeenVersions.set(tourId, version);

  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(getStorageKey(tourId), String(version));
  } catch {
    // The in-memory fallback keeps the tutorial dismissed for this session.
  }
}
