import type { GameState } from "./engine";

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

function drawField(context: CanvasRenderingContext2D, state: GameState) {
  const { width, height } = state.dimensions;
  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, "rgba(8, 13, 29, 0.98)");
  background.addColorStop(0.55, "rgba(17, 26, 53, 0.96)");
  background.addColorStop(1, "rgba(11, 18, 40, 0.98)");
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const ambientGlow = context.createRadialGradient(
    width * 0.52,
    height * 0.44,
    0,
    width * 0.52,
    height * 0.44,
    Math.max(width, height) * 0.65,
  );
  ambientGlow.addColorStop(0, "rgba(112, 72, 245, 0.13)");
  ambientGlow.addColorStop(0.55, "rgba(77, 227, 227, 0.035)");
  ambientGlow.addColorStop(1, "rgba(5, 8, 22, 0)");
  context.fillStyle = ambientGlow;
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

function drawPaddle(context: CanvasRenderingContext2D, state: GameState) {
  const { paddle, impactStrength } = state;
  const glow = 14 + impactStrength * 18;

  context.save();
  context.shadowColor = `rgba(77, 227, 227, ${0.32 + impactStrength * 0.28})`;
  context.shadowBlur = glow;

  const gradient = context.createLinearGradient(
    paddle.x,
    paddle.y,
    paddle.x + paddle.width,
    paddle.y,
  );
  gradient.addColorStop(0, "#7048F5");
  gradient.addColorStop(0.5, "#A38DFF");
  gradient.addColorStop(1, "#4DE3E3");

  roundedRectangle(
    context,
    paddle.x,
    paddle.y,
    paddle.width,
    paddle.height,
    paddle.height / 2,
  );
  context.fillStyle = gradient;
  context.fill();
  context.restore();
}

function drawCard(context: CanvasRenderingContext2D, state: GameState) {
  const { card, impactStrength, reducedMotion } = state;
  const centerX = card.x + card.width / 2;
  const centerY = card.y + card.height / 2;
  const scale = reducedMotion ? 1 : 1 + impactStrength * 0.045;

  context.save();
  context.translate(centerX, centerY);
  context.rotate(reducedMotion ? 0 : card.rotation);
  context.scale(scale, scale);
  context.shadowColor = `rgba(112, 72, 245, ${0.36 + impactStrength * 0.22})`;
  context.shadowBlur = 18 + impactStrength * 12;

  const gradient = context.createLinearGradient(
    -card.width / 2,
    -card.height / 2,
    card.width / 2,
    card.height / 2,
  );
  gradient.addColorStop(0, "#A38DFF");
  gradient.addColorStop(0.45, "#7048F5");
  gradient.addColorStop(1, "#4C2AAF");

  roundedRectangle(
    context,
    -card.width / 2,
    -card.height / 2,
    card.width,
    card.height,
    7,
  );
  context.fillStyle = gradient;
  context.fill();
  context.lineWidth = 1.5;
  context.strokeStyle = "rgba(255, 255, 255, 0.58)";
  context.stroke();

  roundedRectangle(
    context,
    -card.width / 2 + 4,
    -card.height / 2 + 4,
    card.width - 8,
    card.height - 8,
    5,
  );
  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.lineWidth = 1;
  context.stroke();

  context.rotate(Math.PI / 4);
  context.fillStyle = "rgba(255, 255, 255, 0.82)";
  roundedRectangle(context, -5, -5, 10, 10, 2.5);
  context.fill();
  context.restore();
}

function drawParticles(context: CanvasRenderingContext2D, state: GameState) {
  context.save();
  for (const particle of state.particles) {
    context.globalAlpha = Math.max(0, particle.life);
    context.fillStyle = particle.velocityX >= 0 ? "#4DE3E3" : "#A38DFF";
    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

export function renderGame(
  context: CanvasRenderingContext2D,
  state: GameState,
) {
  context.clearRect(0, 0, state.dimensions.width, state.dimensions.height);
  drawField(context, state);
  drawParticles(context, state);
  drawPaddle(context, state);
  drawCard(context, state);
}
