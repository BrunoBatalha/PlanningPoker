export const PHRASE_CATEGORIES = [
  "deadlines",
  "bugs",
  "scope",
  "meetings",
  "deploy",
  "legacy",
  "testing",
  "git",
  "ai",
  "devLife",
] as const;

export type PhraseCategory = (typeof PHRASE_CATEGORIES)[number];
export type PhraseCatalog = Record<PhraseCategory, string[]>;

export interface Vector {
  x: number;
  y: number;
}

export interface SliceDimensions {
  width: number;
  height: number;
}

export interface PhraseDefinition {
  id: string;
  text: string;
  lines: string[];
  categoryIndex: number;
  width: number;
  height: number;
  fontSize: number;
}

export interface SwipePoint extends Vector {
  timestamp: number;
}

export interface SwipeSegment {
  from: SwipePoint;
  to: SwipePoint;
  speed: number;
}

export interface PhraseTarget {
  phrase: PhraseDefinition;
  position: Vector;
  velocity: Vector;
  rotation: number;
  angularVelocity: number;
  hasEntered: boolean;
}

export interface PhraseFragment {
  phrase: PhraseDefinition;
  polygon: Vector[];
  cutEdge: {
    from: Vector;
    to: Vector;
  };
  cutGlow: number;
  position: Vector;
  velocity: Vector;
  rotation: number;
  angularVelocity: number;
  life: number;
}

export interface SliceImpact {
  from: Vector;
  to: Vector;
  point: Vector;
  intensity: number;
  life: number;
}

export interface SliceParticle extends Vector {
  velocity: Vector;
  life: number;
  size: number;
  colorIndex: number;
}

export interface SliceGameState {
  dimensions: SliceDimensions;
  definitions: PhraseDefinition[][];
  deck: PhraseDefinition[];
  deckIndex: number;
  targets: PhraseTarget[];
  fragments: PhraseFragment[];
  particles: SliceParticle[];
  impacts: SliceImpact[];
  score: number;
  combo: number;
  successfulCuts: number;
  spawnCooldown: number;
  hitStopRemaining: number;
  reducedMotion: boolean;
}

export interface SliceStepResult {
  state: SliceGameState;
  scoreChanged: boolean;
  comboChanged: boolean;
  slicedCount: number;
  missedCount: number;
}

type RandomSource = () => number;

const MAX_DELTA_SECONDS = 0.032;
const MAX_SUBSTEP_SECONDS = 1 / 120;
const BASE_SPAWN_INTERVAL = 1.05;
const MIN_SPAWN_INTERVAL = 0.5;
const SPAWN_REDUCTION_PER_CUT = 0.025;
const HIT_STOP_SECONDS = 0.045;
const IMPACT_LIFETIME_SECONDS = 0.12;
const CUT_GLOW_LIFETIME_SECONDS = 0.28;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function shuffle<T>(items: T[], random: RandomSource): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export function buildBalancedPhraseDeck(
  definitions: PhraseDefinition[][],
  random: RandomSource = Math.random,
): PhraseDefinition[] {
  const categoryQueues = definitions.map((category) =>
    shuffle(category, random),
  );
  const maximumCategorySize = Math.max(
    0,
    ...categoryQueues.map((category) => category.length),
  );
  const deck: PhraseDefinition[] = [];

  for (let round = 0; round < maximumCategorySize; round += 1) {
    const categoryOrder = shuffle(
      categoryQueues.map((_, index) => index),
      random,
    );

    for (const categoryIndex of categoryOrder) {
      const phrase = categoryQueues[categoryIndex][round];
      if (phrase) {
        deck.push(phrase);
      }
    }
  }

  return deck;
}

export function getComboMultiplier(combo: number) {
  if (combo <= 0) {
    return 1;
  }

  return Math.min(5, Math.floor((combo - 1) / 3) + 1);
}

function getSpawnInterval(state: SliceGameState, random: RandomSource) {
  const baseInterval = Math.max(
    MIN_SPAWN_INTERVAL,
    BASE_SPAWN_INTERVAL -
      state.successfulCuts * SPAWN_REDUCTION_PER_CUT,
  );
  const reducedMotionFactor = state.reducedMotion ? 1.28 : 1;
  const variation = 0.92 + random() * 0.16;
  return baseInterval * reducedMotionFactor * variation;
}

function nextPhrase(
  state: SliceGameState,
  random: RandomSource,
): {
  phrase: PhraseDefinition | null;
  deck: PhraseDefinition[];
  deckIndex: number;
} {
  let deck = state.deck;
  let deckIndex = state.deckIndex;

  if (deck.length === 0 || deckIndex >= deck.length) {
    deck = buildBalancedPhraseDeck(state.definitions, random);
    deckIndex = 0;
  }

  const phrase = deck[deckIndex] ?? null;
  return { phrase, deck, deckIndex: deckIndex + (phrase ? 1 : 0) };
}

function spawnTarget(
  state: SliceGameState,
  random: RandomSource,
): SliceGameState {
  const next = nextPhrase(state, random);
  if (!next.phrase) {
    return {
      ...state,
      spawnCooldown: getSpawnInterval(state, random),
    };
  }

  const { width, height } = state.dimensions;
  const halfWidth = next.phrase.width / 2;
  const difficulty = Math.min(state.successfulCuts / 22, 1);
  const horizontalRange = width * (0.12 + difficulty * 0.08);
  const verticalFactor = 2.05 + difficulty * 0.25;
  const motionFactor = state.reducedMotion ? 0.78 : 1;
  const margin = Math.min(20, width * 0.04);
  const minimumX = halfWidth + margin;
  const maximumX = Math.max(minimumX, width - halfWidth - margin);

  return {
    ...state,
    deck: next.deck,
    deckIndex: next.deckIndex,
    spawnCooldown: getSpawnInterval(state, random),
    targets: [
      ...state.targets,
      {
        phrase: next.phrase,
        position: {
          x: minimumX + random() * (maximumX - minimumX),
          y: height + next.phrase.height / 2 + 4,
        },
        velocity: {
          x: (random() * 2 - 1) * horizontalRange * motionFactor,
          y: -height * verticalFactor * motionFactor,
        },
        rotation: state.reducedMotion ? 0 : (random() * 2 - 1) * 0.16,
        angularVelocity: state.reducedMotion
          ? 0
          : (random() * 2 - 1) * 0.75,
        hasEntered: false,
      },
    ],
  };
}

export function createSliceGameState(
  dimensions: SliceDimensions,
  definitions: PhraseDefinition[][],
  reducedMotion: boolean,
  random: RandomSource = Math.random,
): SliceGameState {
  return {
    dimensions,
    definitions,
    deck: buildBalancedPhraseDeck(definitions, random),
    deckIndex: 0,
    targets: [],
    fragments: [],
    particles: [],
    impacts: [],
    score: 0,
    combo: 0,
    successfulCuts: 0,
    spawnCooldown: 0.25,
    hitStopRemaining: 0,
    reducedMotion,
  };
}

function rotatePoint(point: Vector, angle: number): Vector {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  };
}

function toTargetLocal(point: Vector, target: PhraseTarget): Vector {
  return rotatePoint(
    {
      x: point.x - target.position.x,
      y: point.y - target.position.y,
    },
    -target.rotation,
  );
}

function clipSegmentToRectangle(
  from: Vector,
  to: Vector,
  halfWidth: number,
  halfHeight: number,
): {
  point: Vector;
  from: Vector;
  to: Vector;
  direction: Vector;
} | null {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  let start = 0;
  let end = 1;

  const tests: Array<[number, number]> = [
    [-deltaX, from.x + halfWidth],
    [deltaX, halfWidth - from.x],
    [-deltaY, from.y + halfHeight],
    [deltaY, halfHeight - from.y],
  ];

  for (const [direction, distance] of tests) {
    if (Math.abs(direction) < 0.000001) {
      if (distance < 0) {
        return null;
      }
      continue;
    }

    const ratio = distance / direction;
    if (direction < 0) {
      start = Math.max(start, ratio);
    } else {
      end = Math.min(end, ratio);
    }

    if (start > end) {
      return null;
    }
  }

  const middle = (start + end) / 2;
  const length = Math.hypot(deltaX, deltaY);
  if (length < 0.000001) {
    return null;
  }

  return {
    point: {
      x: from.x + deltaX * middle,
      y: from.y + deltaY * middle,
    },
    from: {
      x: from.x + deltaX * start,
      y: from.y + deltaY * start,
    },
    to: {
      x: from.x + deltaX * end,
      y: from.y + deltaY * end,
    },
    direction: {
      x: deltaX / length,
      y: deltaY / length,
    },
  };
}

function signedDistance(point: Vector, origin: Vector, normal: Vector) {
  return (
    (point.x - origin.x) * normal.x +
    (point.y - origin.y) * normal.y
  );
}

function clipPolygonToHalfPlane(
  polygon: Vector[],
  origin: Vector,
  normal: Vector,
  side: -1 | 1,
): Vector[] {
  const result: Vector[] = [];

  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const currentDistance =
      signedDistance(current, origin, normal) * side;
    const nextDistance = signedDistance(next, origin, normal) * side;
    const currentInside = currentDistance >= -0.0001;
    const nextInside = nextDistance >= -0.0001;

    if (currentInside) {
      result.push(current);
    }

    if (currentInside !== nextInside) {
      const ratio =
        currentDistance / (currentDistance - nextDistance);
      result.push({
        x: current.x + (next.x - current.x) * ratio,
        y: current.y + (next.y - current.y) * ratio,
      });
    }
  }

  return result;
}

function createSliceParticles(
  from: Vector,
  to: Vector,
  normal: Vector,
  colorIndex: number,
  reducedMotion: boolean,
  intensity: number,
): SliceParticle[] {
  const particles: SliceParticle[] = [];
  const particleCount = reducedMotion ? 4 : 14;

  for (let index = 0; index < particleCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const progress = (index + 0.5) / particleCount;
    const spread =
      (index - (particleCount - 1) / 2) * (reducedMotion ? 2 : 7);
    particles.push({
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress,
      velocity: {
        x:
          normal.x *
            side *
            (reducedMotion ? 28 : (88 + index * 3) * intensity) -
          normal.y * spread,
        y:
          normal.y *
            side *
            (reducedMotion ? 28 : (88 + index * 3) * intensity) +
          normal.x * spread,
      },
      life: 1,
      size: (reducedMotion ? 1.6 : 2.1) + (index % 3) * 0.8,
      colorIndex,
    });
  }

  return particles;
}

function sliceTarget(
  target: PhraseTarget,
  segment: SwipeSegment,
  reducedMotion: boolean,
): {
  fragments: PhraseFragment[];
  particles: SliceParticle[];
  impact: SliceImpact;
} | null {
  const localFrom = toTargetLocal(segment.from, target);
  const localTo = toTargetLocal(segment.to, target);
  const intersection = clipSegmentToRectangle(
    localFrom,
    localTo,
    target.phrase.width / 2,
    target.phrase.height / 2,
  );

  if (!intersection) {
    return null;
  }

  const normal = {
    x: -intersection.direction.y,
    y: intersection.direction.x,
  };
  const impactIntensity = reducedMotion
    ? 0.45
    : clamp(segment.speed / 1100, 0.45, 1);
  const rectangle: Vector[] = [
    { x: -target.phrase.width / 2, y: -target.phrase.height / 2 },
    { x: target.phrase.width / 2, y: -target.phrase.height / 2 },
    { x: target.phrase.width / 2, y: target.phrase.height / 2 },
    { x: -target.phrase.width / 2, y: target.phrase.height / 2 },
  ];
  const firstPolygon = clipPolygonToHalfPlane(
    rectangle,
    intersection.point,
    normal,
    1,
  );
  const secondPolygon = clipPolygonToHalfPlane(
    rectangle,
    intersection.point,
    normal,
    -1,
  );

  if (firstPolygon.length < 3 || secondPolygon.length < 3) {
    return null;
  }

  const worldNormal = rotatePoint(normal, target.rotation);
  const separationSpeed = reducedMotion ? 40 : 105 + impactIntensity * 80;
  const angularSpeed = reducedMotion ? 0 : 2.35;
  const fragments: PhraseFragment[] = [
    {
      phrase: target.phrase,
      polygon: firstPolygon,
      cutEdge: { from: intersection.from, to: intersection.to },
      cutGlow: 1,
      position: { ...target.position },
      velocity: {
        x: target.velocity.x + worldNormal.x * separationSpeed,
        y: target.velocity.y + worldNormal.y * separationSpeed,
      },
      rotation: target.rotation,
      angularVelocity: target.angularVelocity + angularSpeed,
      life: 1,
    },
    {
      phrase: target.phrase,
      polygon: secondPolygon,
      cutEdge: { from: intersection.from, to: intersection.to },
      cutGlow: 1,
      position: { ...target.position },
      velocity: {
        x: target.velocity.x - worldNormal.x * separationSpeed,
        y: target.velocity.y - worldNormal.y * separationSpeed,
      },
      rotation: target.rotation,
      angularVelocity: target.angularVelocity - angularSpeed,
      life: 1,
    },
  ];
  const toWorldPoint = (point: Vector) => {
    const rotatedPoint = rotatePoint(point, target.rotation);
    return {
      x: target.position.x + rotatedPoint.x,
      y: target.position.y + rotatedPoint.y,
    };
  };
  const worldCutPoint = toWorldPoint(intersection.point);
  const worldCutFrom = toWorldPoint(intersection.from);
  const worldCutTo = toWorldPoint(intersection.to);

  return {
    fragments,
    particles: createSliceParticles(
      worldCutFrom,
      worldCutTo,
      worldNormal,
      target.phrase.categoryIndex,
      reducedMotion,
      impactIntensity,
    ),
    impact: {
      from: worldCutFrom,
      to: worldCutTo,
      point: worldCutPoint,
      intensity: impactIntensity,
      life: 1,
    },
  };
}

function updateMovingObjects(
  state: SliceGameState,
  deltaSeconds: number,
): {
  targets: PhraseTarget[];
  fragments: PhraseFragment[];
  particles: SliceParticle[];
  missedCount: number;
} {
  const gravity =
    state.dimensions.height * 3.5 * (state.reducedMotion ? 0.78 : 1);
  let missedCount = 0;

  const targets = state.targets
    .map<PhraseTarget>((target) => {
      const velocityY = target.velocity.y + gravity * deltaSeconds;
      const position = {
        x: target.position.x + target.velocity.x * deltaSeconds,
        y: target.position.y + velocityY * deltaSeconds,
      };
      const top = position.y - target.phrase.height / 2;
      const hasEntered =
        target.hasEntered || top < state.dimensions.height - 2;

      return {
        ...target,
        position,
        velocity: { x: target.velocity.x, y: velocityY },
        rotation: state.reducedMotion
          ? 0
          : target.rotation + target.angularVelocity * deltaSeconds,
        hasEntered,
      };
    })
    .filter((target) => {
      const top = target.position.y - target.phrase.height / 2;
      const isMissed =
        target.hasEntered &&
        target.velocity.y > 0 &&
        top > state.dimensions.height + 4;

      if (isMissed) {
        missedCount += 1;
      }

      return !isMissed;
    });

  const fragments = state.fragments
    .map<PhraseFragment>((fragment) => {
      const velocityY = fragment.velocity.y + gravity * deltaSeconds;
      return {
        ...fragment,
        position: {
          x: fragment.position.x + fragment.velocity.x * deltaSeconds,
          y: fragment.position.y + velocityY * deltaSeconds,
        },
        velocity: { x: fragment.velocity.x, y: velocityY },
        rotation: state.reducedMotion
          ? fragment.rotation
          : fragment.rotation + fragment.angularVelocity * deltaSeconds,
        cutGlow: Math.max(
          0,
          fragment.cutGlow -
            deltaSeconds / CUT_GLOW_LIFETIME_SECONDS,
        ),
        life: fragment.life - deltaSeconds * (state.reducedMotion ? 1.5 : 0.7),
      };
    })
    .filter(
      (fragment) =>
        fragment.life > 0 &&
        fragment.position.y < state.dimensions.height + 140,
    );

  const particles = state.particles
    .map<SliceParticle>((particle) => ({
      ...particle,
      x: particle.x + particle.velocity.x * deltaSeconds,
      y: particle.y + particle.velocity.y * deltaSeconds,
      velocity: {
        x: particle.velocity.x * 0.985,
        y: particle.velocity.y + gravity * 0.32 * deltaSeconds,
      },
      life: particle.life - deltaSeconds * 2.5,
    }))
    .filter((particle) => particle.life > 0);

  return { targets, fragments, particles, missedCount };
}

export function advanceSliceGame(
  currentState: SliceGameState,
  segments: SwipeSegment[],
  deltaSeconds: number,
  random: RandomSource = Math.random,
): SliceStepResult {
  const totalDelta = clamp(deltaSeconds, 0, MAX_DELTA_SECONDS);
  const activeDelta = currentState.reducedMotion
    ? totalDelta
    : Math.max(0, totalDelta - currentState.hitStopRemaining);
  const substepCount = Math.max(
    1,
    Math.ceil(activeDelta / MAX_SUBSTEP_SECONDS),
  );
  const stepDelta = activeDelta / substepCount;
  let state: SliceGameState = {
    ...currentState,
    targets: [...currentState.targets],
    fragments: [...currentState.fragments],
    particles: [...currentState.particles],
    impacts: currentState.impacts
      .map((impact) => ({
        ...impact,
        life:
          impact.life -
          totalDelta / IMPACT_LIFETIME_SECONDS,
      }))
      .filter((impact) => impact.life > 0),
    hitStopRemaining: Math.max(
      0,
      currentState.hitStopRemaining - totalDelta,
    ),
  };
  let missedCount = 0;

  if (activeDelta > 0) {
    for (let step = 0; step < substepCount; step += 1) {
      const updated = updateMovingObjects(state, stepDelta);
      missedCount += updated.missedCount;
      state = {
        ...state,
        targets: updated.targets,
        fragments: updated.fragments,
        particles: updated.particles,
        spawnCooldown: state.spawnCooldown - stepDelta,
      };
    }
  }

  let slicedCount = 0;
  const remainingTargets: PhraseTarget[] = [];
  const newFragments = [...state.fragments];
  const newParticles = [...state.particles];
  const newImpacts = [...state.impacts];

  for (const target of state.targets) {
    let sliceResult: ReturnType<typeof sliceTarget> = null;

    for (const segment of segments) {
      sliceResult = sliceTarget(target, segment, state.reducedMotion);
      if (sliceResult) {
        break;
      }
    }

    if (sliceResult) {
      slicedCount += 1;
      newFragments.push(...sliceResult.fragments);
      newParticles.push(...sliceResult.particles);
      newImpacts.push(sliceResult.impact);
    } else {
      remainingTargets.push(target);
    }
  }

  let score = state.score;
  let combo = missedCount > 0 ? 0 : state.combo;
  let successfulCuts = state.successfulCuts;

  for (let index = 0; index < slicedCount; index += 1) {
    combo += 1;
    score += 10 * getComboMultiplier(combo);
    successfulCuts += 1;
  }

  state = {
    ...state,
    targets: remainingTargets,
    fragments: newFragments,
    particles: newParticles,
    impacts: newImpacts,
    score,
    combo,
    successfulCuts,
    hitStopRemaining:
      slicedCount > 0 && !state.reducedMotion
        ? HIT_STOP_SECONDS
        : state.hitStopRemaining,
  };

  const maximumTargets = state.dimensions.width < 480 ? 2 : 3;
  if (
    state.spawnCooldown <= 0 &&
    state.targets.length < maximumTargets
  ) {
    state = spawnTarget(state, random);
  }

  return {
    state,
    scoreChanged: score !== currentState.score,
    comboChanged: combo !== currentState.combo,
    slicedCount,
    missedCount,
  };
}

export function resizeSliceGameState(
  state: SliceGameState,
  dimensions: SliceDimensions,
  definitions: PhraseDefinition[][],
): SliceGameState {
  const previousWidth = Math.max(state.dimensions.width, 1);
  const previousHeight = Math.max(state.dimensions.height, 1);
  const scaleX = dimensions.width / previousWidth;
  const scaleY = dimensions.height / previousHeight;
  const definitionMap = new Map(
    definitions.flat().map((definition) => [definition.id, definition]),
  );
  const scalePosition = (position: Vector): Vector => ({
    x: position.x * scaleX,
    y: position.y * scaleY,
  });

  return {
    ...state,
    dimensions,
    definitions,
    deck: state.deck.map(
      (phrase) => definitionMap.get(phrase.id) ?? phrase,
    ),
    targets: state.targets.map((target) => ({
      ...target,
      phrase: definitionMap.get(target.phrase.id) ?? target.phrase,
      position: scalePosition(target.position),
      velocity: {
        x: target.velocity.x * scaleX,
        y: target.velocity.y * scaleY,
      },
    })),
    fragments: [],
    particles: [],
    impacts: [],
    hitStopRemaining: 0,
  };
}
