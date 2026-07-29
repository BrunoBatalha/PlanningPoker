export interface GameDimensions {
  width: number;
  height: number;
}

export interface GameInput {
  direction: -1 | 0 | 1;
  pointerX: number | null;
}

export interface GameParticle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  size: number;
}

export interface GameState {
  dimensions: GameDimensions;
  paddle: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  card: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    rotation: number;
  };
  particles: GameParticle[];
  score: number;
  impactStrength: number;
  phase: "playing" | "game-over";
  reducedMotion: boolean;
}

export interface GameStepResult {
  state: GameState;
  scored: boolean;
  missed: boolean;
}

const CARD_WIDTH = 34;
const CARD_HEIGHT = 46;
const PADDLE_HEIGHT = 12;
const MAX_DELTA_SECONDS = 0.032;
const MAX_SUBSTEP_SECONDS = 1 / 120;
const KEYBOARD_SPEED = 430;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getPaddleWidth(width: number) {
  return clamp(width * 0.19, 76, 124);
}

function getInitialSpeed(reducedMotion: boolean) {
  return reducedMotion ? 132 : 190;
}

function getMaximumSpeed(reducedMotion: boolean) {
  return reducedMotion ? 260 : 430;
}

function getSpeedIncrease(reducedMotion: boolean) {
  return reducedMotion ? 1.055 : 1.085;
}

function createImpactParticles(
  x: number,
  y: number,
  score: number,
): GameParticle[] {
  const direction = score % 2 === 0 ? 1 : -1;

  return [
    { x, y, velocityX: -92, velocityY: -54, life: 1, size: 2.5 },
    { x, y, velocityX: 92, velocityY: -54, life: 1, size: 2.5 },
    {
      x,
      y,
      velocityX: 52 * direction,
      velocityY: -94,
      life: 1,
      size: 3,
    },
    {
      x,
      y,
      velocityX: -48 * direction,
      velocityY: -78,
      life: 1,
      size: 2,
    },
    { x, y, velocityX: 0, velocityY: -112, life: 1, size: 2.5 },
  ];
}

export function createInitialGameState(
  dimensions: GameDimensions,
  reducedMotion: boolean,
  horizontalDirection: -1 | 1,
): GameState {
  const paddleWidth = getPaddleWidth(dimensions.width);
  const speed = getInitialSpeed(reducedMotion);

  return {
    dimensions,
    paddle: {
      x: (dimensions.width - paddleWidth) / 2,
      y: dimensions.height - 30,
      width: paddleWidth,
      height: PADDLE_HEIGHT,
    },
    card: {
      x: (dimensions.width - CARD_WIDTH) / 2,
      y: Math.max(28, dimensions.height * 0.18),
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      velocityX: speed * 0.58 * horizontalDirection,
      velocityY: speed * 0.82,
      rotation: 0,
    },
    particles: [],
    score: 0,
    impactStrength: 0,
    phase: "playing",
    reducedMotion,
  };
}

export function resizeGameState(
  state: GameState,
  dimensions: GameDimensions,
): GameState {
  const previousWidth = Math.max(state.dimensions.width, 1);
  const previousHeight = Math.max(state.dimensions.height, 1);
  const paddleWidth = getPaddleWidth(dimensions.width);
  const cardX = (state.card.x / previousWidth) * dimensions.width;
  const cardY = (state.card.y / previousHeight) * dimensions.height;
  const paddleCenter =
    ((state.paddle.x + state.paddle.width / 2) / previousWidth) *
    dimensions.width;

  return {
    ...state,
    dimensions,
    paddle: {
      x: clamp(
        paddleCenter - paddleWidth / 2,
        0,
        Math.max(0, dimensions.width - paddleWidth),
      ),
      y: dimensions.height - 30,
      width: paddleWidth,
      height: PADDLE_HEIGHT,
    },
    card: {
      ...state.card,
      x: clamp(cardX, 0, Math.max(0, dimensions.width - state.card.width)),
      y: clamp(cardY, 0, Math.max(0, dimensions.height - state.card.height)),
    },
    particles: [],
  };
}

export function advanceGame(
  currentState: GameState,
  input: GameInput,
  deltaSeconds: number,
): GameStepResult {
  if (currentState.phase === "game-over") {
    return { state: currentState, scored: false, missed: false };
  }

  const totalDelta = clamp(deltaSeconds, 0, MAX_DELTA_SECONDS);
  const substepCount = Math.max(
    1,
    Math.ceil(totalDelta / MAX_SUBSTEP_SECONDS),
  );
  const stepDelta = totalDelta / substepCount;
  const state: GameState = {
    ...currentState,
    paddle: { ...currentState.paddle },
    card: { ...currentState.card },
    particles: currentState.particles.map((particle) => ({ ...particle })),
  };
  let scored = false;
  let missed = false;

  for (let step = 0; step < substepCount; step += 1) {
    if (input.direction !== 0) {
      state.paddle.x += input.direction * KEYBOARD_SPEED * stepDelta;
    } else if (input.pointerX !== null) {
      const targetX = input.pointerX - state.paddle.width / 2;
      const smoothing = 1 - Math.exp(-24 * stepDelta);
      state.paddle.x += (targetX - state.paddle.x) * smoothing;
    }

    state.paddle.x = clamp(
      state.paddle.x,
      0,
      Math.max(0, state.dimensions.width - state.paddle.width),
    );

    const previousBottom = state.card.y + state.card.height;
    state.card.x += state.card.velocityX * stepDelta;
    state.card.y += state.card.velocityY * stepDelta;

    if (!state.reducedMotion) {
      state.card.rotation += state.card.velocityX * stepDelta * 0.08;
    }

    if (state.card.x <= 0 && state.card.velocityX < 0) {
      state.card.x = 0;
      state.card.velocityX *= -1;
      state.impactStrength = Math.max(state.impactStrength, 0.45);
    } else if (
      state.card.x + state.card.width >= state.dimensions.width &&
      state.card.velocityX > 0
    ) {
      state.card.x = state.dimensions.width - state.card.width;
      state.card.velocityX *= -1;
      state.impactStrength = Math.max(state.impactStrength, 0.45);
    }

    if (state.card.y <= 0 && state.card.velocityY < 0) {
      state.card.y = 0;
      state.card.velocityY *= -1;
      state.impactStrength = Math.max(state.impactStrength, 0.45);
    }

    const cardBottom = state.card.y + state.card.height;
    const overlapsPaddle =
      state.card.x + state.card.width >= state.paddle.x &&
      state.card.x <= state.paddle.x + state.paddle.width;
    const crossedPaddle =
      previousBottom <= state.paddle.y && cardBottom >= state.paddle.y;

    if (state.card.velocityY > 0 && overlapsPaddle && crossedPaddle) {
      state.card.y = state.paddle.y - state.card.height;

      const cardCenter = state.card.x + state.card.width / 2;
      const paddleCenter = state.paddle.x + state.paddle.width / 2;
      const impactOffset = clamp(
        (cardCenter - paddleCenter) / (state.paddle.width / 2),
        -1,
        1,
      );
      const currentSpeed = Math.hypot(
        state.card.velocityX,
        state.card.velocityY,
      );
      const nextSpeed = Math.min(
        currentSpeed * getSpeedIncrease(state.reducedMotion),
        getMaximumSpeed(state.reducedMotion),
      );
      const angle = impactOffset * (Math.PI / 3);

      state.card.velocityX = Math.sin(angle) * nextSpeed;
      state.card.velocityY = -Math.cos(angle) * nextSpeed;
      state.score += 1;
      state.impactStrength = 1;
      scored = true;

      if (!state.reducedMotion) {
        state.particles.push(
          ...createImpactParticles(
            cardCenter,
            state.paddle.y,
            state.score,
          ),
        );
      }
    }

    if (state.card.y > state.dimensions.height + 4) {
      state.phase = "game-over";
      missed = true;
      break;
    }

    state.impactStrength = Math.max(
      0,
      state.impactStrength - stepDelta * 3.8,
    );
    state.particles = state.particles
      .map((particle) => ({
        ...particle,
        x: particle.x + particle.velocityX * stepDelta,
        y: particle.y + particle.velocityY * stepDelta,
        velocityY: particle.velocityY + 130 * stepDelta,
        life: particle.life - stepDelta * 2.4,
      }))
      .filter((particle) => particle.life > 0);
  }

  return { state, scored, missed };
}
