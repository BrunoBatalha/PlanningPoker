export const VOTING_POINTS = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
  "?",
  "☕",
] as const;

export const NUMERIC_ESTIMATION_POINTS = [
  "0",
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
] as const;

export type NumericEstimationPoint = (typeof NUMERIC_ESTIMATION_POINTS)[number];
export type RoundOutcome =
  | { kind: "estimated"; agreedEstimate: NumericEstimationPoint }
  | { kind: "no_consensus" }
  | { kind: "postponed" };
export type StoredRoundOutcome = RoundOutcome | { kind: "legacy" };

export interface RoundVoteSnapshot {
  key: string;
  username: string;
  point: string | null;
}

export function isNumericEstimationPoint(
  point: unknown,
): point is NumericEstimationPoint {
  return (
    typeof point === "string" &&
    (NUMERIC_ESTIMATION_POINTS as readonly string[]).includes(point)
  );
}

export function hasStrictNumericUnanimity(
  points: Array<string | null>,
): NumericEstimationPoint | null {
  if (points.length === 0 || !points.every(isNumericEstimationPoint)) {
    return null;
  }

  return points.every((point) => point === points[0]) ? points[0] : null;
}

export function getVoteDistribution(points: Array<string | null>) {
  return points
    .reduce<Array<{ value: string; count: number }>>((items, point) => {
      const value = point ?? "Não votou";
      const existing = items.find((item) => item.value === value);

      if (existing) {
        existing.count += 1;
      } else {
        items.push({ value, count: 1 });
      }

      return items;
    }, [])
    .sort((a, b) => {
      const aIndex = [...VOTING_POINTS, "Não votou"].indexOf(a.value);
      const bIndex = [...VOTING_POINTS, "Não votou"].indexOf(b.value);
      return (
        (aIndex === -1 ? VOTING_POINTS.length + 1 : aIndex) -
        (bIndex === -1 ? VOTING_POINTS.length + 1 : bIndex)
      );
    });
}

export function votesMatchSnapshot(
  currentVotes: RoundVoteSnapshot[],
  expectedVotes: RoundVoteSnapshot[],
): boolean {
  const normalize = (votes: RoundVoteSnapshot[]) =>
    [...votes]
      .sort((a, b) => a.key.localeCompare(b.key))
      .map(({ key, username, point }) => ({ key, username, point }));

  return JSON.stringify(normalize(currentVotes)) === JSON.stringify(normalize(expectedVotes));
}
