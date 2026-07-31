import {
  PHRASE_CATEGORIES,
  type PhraseCatalog,
  type PhraseDefinition,
  type PhraseFragment,
  type PhraseTarget,
  type SliceGameState,
  type SwipePoint,
  type Vector,
} from "./sliceEngine";

const CARD_PALETTES = [
  ["#7048F5", "#4C2AAF"],
  ["#9347F5", "#5E35D9"],
  ["#4F46E5", "#7048F5"],
  ["#0F766E", "#4C2AAF"],
  ["#2563EB", "#5E35D9"],
] as const;

export interface BladeParticle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  size: number;
  timestamp: number;
}

function roundedRectangle(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.lineTo(x + width - safeRadius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  context.lineTo(x + width, y + height - safeRadius);
  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - safeRadius,
    y + height,
  );
  context.lineTo(x + safeRadius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  context.lineTo(x, y + safeRadius);
  context.quadraticCurveTo(x, y, x + safeRadius, y);
  context.closePath();
}

function getFont(fontSize: number) {
  return `700 ${fontSize}px "Manrope Variable", "Inter Variable", sans-serif`;
}

function getBestLineSplit(
  context: CanvasRenderingContext2D,
  text: string,
): string[] {
  const words = text.split(/\s+/);
  if (words.length < 2) {
    return [text];
  }

  let bestLines = [text];
  let bestWidth = Number.POSITIVE_INFINITY;

  for (let index = 1; index < words.length; index += 1) {
    const firstLine = words.slice(0, index).join(" ");
    const secondLine = words.slice(index).join(" ");
    const width = Math.max(
      context.measureText(firstLine).width,
      context.measureText(secondLine).width,
    );

    if (width < bestWidth) {
      bestWidth = width;
      bestLines = [firstLine, secondLine];
    }
  }

  return bestLines;
}

function measurePhrase(
  context: CanvasRenderingContext2D,
  id: string,
  text: string,
  categoryIndex: number,
  maximumCardWidth: number,
  compact: boolean,
): PhraseDefinition {
  const horizontalPadding = compact ? 22 : 28;
  let fontSize = compact ? 12 : 14;
  let lines = [text];

  while (fontSize >= 11) {
    context.font = getFont(fontSize);
    const singleLineWidth = context.measureText(text).width;
    lines =
      singleLineWidth + horizontalPadding <= maximumCardWidth
        ? [text]
        : getBestLineSplit(context, text);
    const widestLine = Math.max(
      ...lines.map((line) => context.measureText(line).width),
    );

    if (widestLine + horizontalPadding <= maximumCardWidth) {
      break;
    }

    fontSize -= 1;
  }

  context.font = getFont(fontSize);
  const widestLine = Math.max(
    ...lines.map((line) => context.measureText(line).width),
  );
  const lineHeight = fontSize * 1.25;
  const height = Math.max(
    compact ? 42 : 46,
    lines.length * lineHeight + (compact ? 18 : 22),
  );

  return {
    id,
    text,
    lines: lines.slice(0, 2),
    categoryIndex,
    width: Math.min(
      maximumCardWidth,
      Math.max(compact ? 94 : 110, widestLine + horizontalPadding),
    ),
    height,
    fontSize,
  };
}

export function measurePhraseDefinitions(
  context: CanvasRenderingContext2D,
  catalog: PhraseCatalog,
  canvasWidth: number,
): PhraseDefinition[][] {
  const compact = canvasWidth < 480;
  const maximumCardWidth = Math.min(
    compact ? 220 : 270,
    canvasWidth * 0.7,
  );

  return PHRASE_CATEGORIES.map((category, categoryIndex) =>
    catalog[category].map((text, phraseIndex) =>
      measurePhrase(
        context,
        `${category}:${phraseIndex}`,
        text,
        categoryIndex,
        maximumCardWidth,
        compact,
      ),
    ),
  );
}

function drawField(context: CanvasRenderingContext2D, state: SliceGameState) {
  const { width, height } = state.dimensions;
  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "rgba(8, 13, 29, 0.99)");
  background.addColorStop(0.5, "rgba(18, 27, 56, 0.97)");
  background.addColorStop(1, "rgba(8, 16, 36, 0.99)");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const glow = context.createRadialGradient(
    width * 0.5,
    height * 0.58,
    0,
    width * 0.5,
    height * 0.58,
    Math.max(width, height) * 0.68,
  );
  glow.addColorStop(0, "rgba(112, 72, 245, 0.16)");
  glow.addColorStop(0.52, "rgba(77, 227, 227, 0.045)");
  glow.addColorStop(1, "rgba(5, 8, 22, 0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.save();
  context.strokeStyle = "rgba(255, 255, 255, 0.035)";
  context.lineWidth = 1;
  for (let x = 24; x < width; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = 24; y < height; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  context.restore();
}

function drawPhraseCard(
  context: CanvasRenderingContext2D,
  phrase: PhraseDefinition,
) {
  const palette = CARD_PALETTES[phrase.categoryIndex % CARD_PALETTES.length];
  const gradient = context.createLinearGradient(
    -phrase.width / 2,
    -phrase.height / 2,
    phrase.width / 2,
    phrase.height / 2,
  );
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(1, palette[1]);

  context.save();
  context.shadowColor = "rgba(112, 72, 245, 0.42)";
  context.shadowBlur = 18;
  roundedRectangle(
    context,
    -phrase.width / 2,
    -phrase.height / 2,
    phrase.width,
    phrase.height,
    12,
  );
  context.fillStyle = gradient;
  context.fill();
  context.lineWidth = 1.2;
  context.strokeStyle = "rgba(255, 255, 255, 0.5)";
  context.stroke();
  context.restore();

  roundedRectangle(
    context,
    -phrase.width / 2 + 4,
    -phrase.height / 2 + 4,
    phrase.width - 8,
    phrase.height - 8,
    9,
  );
  context.strokeStyle = "rgba(255, 255, 255, 0.13)";
  context.lineWidth = 1;
  context.stroke();

  context.font = getFont(phrase.fontSize);
  context.fillStyle = "#F8FAFF";
  context.textAlign = "center";
  context.textBaseline = "middle";
  const lineHeight = phrase.fontSize * 1.25;
  const firstLineY = -((phrase.lines.length - 1) * lineHeight) / 2;
  phrase.lines.forEach((line, index) => {
    context.fillText(line, 0, firstLineY + index * lineHeight);
  });
}

function drawTarget(
  context: CanvasRenderingContext2D,
  target: PhraseTarget,
) {
  context.save();
  context.translate(target.position.x, target.position.y);
  context.rotate(target.rotation);
  drawPhraseCard(context, target.phrase);
  context.restore();
}

function drawPolygonPath(
  context: CanvasRenderingContext2D,
  polygon: Vector[],
) {
  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for (let index = 1; index < polygon.length; index += 1) {
    context.lineTo(polygon[index].x, polygon[index].y);
  }
  context.closePath();
}

function drawFragment(
  context: CanvasRenderingContext2D,
  fragment: PhraseFragment,
) {
  context.save();
  context.globalAlpha = Math.min(1, fragment.life * 1.8);
  context.translate(fragment.position.x, fragment.position.y);
  context.rotate(fragment.rotation);
  drawPolygonPath(context, fragment.polygon);
  context.clip();
  drawPhraseCard(context, fragment.phrase);

  if (fragment.cutGlow > 0) {
    context.globalAlpha =
      Math.min(1, fragment.life * 1.8) * fragment.cutGlow;
    context.beginPath();
    context.moveTo(fragment.cutEdge.from.x, fragment.cutEdge.from.y);
    context.lineTo(fragment.cutEdge.to.x, fragment.cutEdge.to.y);
    context.strokeStyle = "#F8FAFF";
    context.lineWidth = 2.5 + fragment.cutGlow * 2;
    context.shadowColor = "#4DE3E3";
    context.shadowBlur = 18 * fragment.cutGlow;
    context.stroke();
  }

  context.restore();
}

function drawImpacts(
  context: CanvasRenderingContext2D,
  state: SliceGameState,
) {
  context.save();
  context.lineCap = "round";

  for (const impact of state.impacts) {
    const strength =
      Math.max(0, Math.min(1, impact.life)) *
      (0.7 + impact.intensity * 0.3);
    const flash = context.createRadialGradient(
      impact.point.x,
      impact.point.y,
      0,
      impact.point.x,
      impact.point.y,
      54 + 34 * strength,
    );
    flash.addColorStop(0, `rgba(255, 255, 255, ${0.42 * strength})`);
    flash.addColorStop(0.3, `rgba(77, 227, 227, ${0.2 * strength})`);
    flash.addColorStop(1, "rgba(77, 227, 227, 0)");
    context.fillStyle = flash;
    context.fillRect(
      impact.point.x - 90,
      impact.point.y - 90,
      180,
      180,
    );

    context.beginPath();
    context.moveTo(impact.from.x, impact.from.y);
    context.lineTo(impact.to.x, impact.to.y);
    context.strokeStyle = `rgba(77, 227, 227, ${0.65 * strength})`;
    context.lineWidth = 8 + 8 * strength;
    context.shadowColor = "#4DE3E3";
    context.shadowBlur = 28 * strength;
    context.stroke();

    context.beginPath();
    context.moveTo(impact.from.x, impact.from.y);
    context.lineTo(impact.to.x, impact.to.y);
    context.strokeStyle = `rgba(255, 255, 255, ${0.98 * strength})`;
    context.lineWidth = 1.5 + 2 * strength;
    context.shadowColor = "#FFFFFF";
    context.shadowBlur = 10 * strength;
    context.stroke();
  }

  context.restore();
}

function drawParticles(
  context: CanvasRenderingContext2D,
  state: SliceGameState,
) {
  context.save();
  for (const particle of state.particles) {
    const palette = CARD_PALETTES[particle.colorIndex % CARD_PALETTES.length];
    context.globalAlpha = Math.max(0, particle.life);
    context.fillStyle =
      particle.velocity.x >= 0 ? "#4DE3E3" : palette[0];
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawTrail(
  context: CanvasRenderingContext2D,
  trail: SwipePoint[],
  now: number,
) {
  if (trail.length < 2) {
    return;
  }

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";

  for (let index = 1; index < trail.length; index += 1) {
    const from = trail[index - 1];
    const to = trail[index];
    const age = Math.max(0, now - to.timestamp);
    const opacity = Math.max(0, 1 - age / 100);
    if (opacity <= 0) {
      continue;
    }

    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.strokeStyle = `rgba(77, 227, 227, ${opacity * 0.82})`;
    context.lineWidth = 2 + opacity * 3;
    context.shadowColor = "rgba(77, 227, 227, 0.72)";
    context.shadowBlur = 9;
    context.stroke();
  }

  context.restore();
}

function drawBladeParticles(
  context: CanvasRenderingContext2D,
  particles: BladeParticle[],
  now: number,
) {
  context.save();

  for (const particle of particles) {
    const age = Math.max(0, now - particle.timestamp);
    const progress = Math.min(1, age / 280);
    const opacity = 1 - progress;

    if (opacity <= 0) {
      continue;
    }

    const elapsedSeconds = age / 1000;
    const x = particle.x + particle.velocityX * elapsedSeconds;
    const y =
      particle.y +
      particle.velocityY * elapsedSeconds +
      90 * elapsedSeconds * elapsedSeconds;

    context.globalAlpha = opacity;
    context.fillStyle = particle.size > 3 ? "#FFFFFF" : "#4DE3E3";
    context.shadowColor = "#4DE3E3";
    context.shadowBlur = 13 * opacity;
    context.beginPath();
    context.arc(x, y, particle.size * (0.65 + opacity * 0.35), 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

export function renderSliceGame(
  context: CanvasRenderingContext2D,
  state: SliceGameState,
  trail: SwipePoint[],
  bladeParticles: BladeParticle[],
  now: number,
) {
  context.clearRect(0, 0, state.dimensions.width, state.dimensions.height);
  const strongestImpact = state.impacts.reduce(
    (maximum, impact) =>
      Math.max(maximum, impact.life * impact.intensity),
    0,
  );
  const shakeStrength = state.reducedMotion ? 0 : strongestImpact * 2;
  const shakePhase = (1 - strongestImpact) * 42;

  drawField(context, state);
  context.save();
  context.translate(
    Math.sin(shakePhase) * shakeStrength,
    Math.cos(shakePhase * 1.17) * shakeStrength,
  );
  state.fragments.forEach((fragment) => drawFragment(context, fragment));
  state.targets.forEach((target) => drawTarget(context, target));
  drawParticles(context, state);
  drawImpacts(context, state);
  context.restore();

  if (!state.reducedMotion) {
    drawTrail(context, trail, now);
  }
  drawBladeParticles(context, bladeParticles, now);
}
