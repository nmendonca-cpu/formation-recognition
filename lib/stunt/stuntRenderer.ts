import {
  STUNT_PLAYERS,
  type StuntAssignment,
  type StuntDefinition,
  type StuntMovement,
  type StuntOrder,
  type StuntLoadFront,
  type StuntPlayerId,
  type StuntQuizAnswer,
  type StuntVisualPath,
} from "./stuntLogic";

export type StuntBoardPlayer = {
  id: string;
  label: string;
  x: number;
  y: number;
  group: "ol" | "dl";
};

export type StuntPathRender = {
  playerId: StuntPlayerId;
  d: string;
  order: StuntOrder;
  movement: StuntMovement;
  subLabel?: string;
  teachingLabel?: string;
  showOrder?: boolean;
  box?: boolean;
  dashed?: boolean;
  labelX: number;
  labelY: number;
  endX: number;
  endY: number;
};

const DL_Y = 55;
const OL_Y = 33;
const PLAYER_RADIUS = 5.2;

type StuntSurfaceConfig = {
  teSide?: "none" | "left" | "right";
  loadFront?: boolean | StuntLoadFront;
};

const DL_POSITIONS: Record<StuntPlayerId, { x: number; y: number }> = {
  LE: { x: 20, y: DL_Y },
  N: { x: 43, y: DL_Y },
  T: { x: 67, y: DL_Y },
  RE: { x: 80, y: DL_Y },
};

const OL_PLAYERS: StuntBoardPlayer[] = [
  { id: "LT", label: "LT", x: 24, y: OL_Y, group: "ol" },
  { id: "LG", label: "LG", x: 37, y: OL_Y, group: "ol" },
  { id: "C", label: "C", x: 50, y: OL_Y, group: "ol" },
  { id: "RG", label: "RG", x: 63, y: OL_Y, group: "ol" },
  { id: "RT", label: "RT", x: 76, y: OL_Y, group: "ol" },
];

function normalizeLoadFront(loadFront?: boolean | StuntLoadFront): StuntLoadFront {
  if (loadFront === true) return "strong";
  if (loadFront === "strong" || loadFront === "weak") return loadFront;
  return "none";
}

function normalizeSurface(surface?: StuntSurfaceConfig | "none" | "left" | "right"): { teSide: "none" | "left" | "right"; loadFront: StuntLoadFront } {
  if (!surface) return { teSide: "none", loadFront: "none" };
  if (typeof surface === "string") return { teSide: surface, loadFront: "none" };
  return {
    teSide: surface.teSide ?? "none",
    loadFront: normalizeLoadFront(surface.loadFront),
  };
}

function getStuntDlPositions(surface?: StuntSurfaceConfig | "none" | "left" | "right"): Record<StuntPlayerId, { x: number; y: number }> {
  const normalized = normalizeSurface(surface);
  return {
    ...DL_POSITIONS,
    LE: {
      x: normalized.loadFront === "weak" ? 12 : DL_POSITIONS.LE.x,
      y: DL_Y,
    },
    N: {
      x: normalized.loadFront === "strong" ? 56 : normalized.loadFront === "weak" ? 44 : DL_POSITIONS.N.x,
      y: DL_Y,
    },
    T: {
      x: normalized.loadFront === "weak" ? 33 : DL_POSITIONS.T.x,
      y: DL_Y,
    },
    RE: {
      x: normalized.teSide === "right" ? 88 : DL_POSITIONS.RE.x,
      y: DL_Y,
    },
  };
}

export function getStuntBoardPlayers(surface?: StuntSurfaceConfig | "none" | "left" | "right"): StuntBoardPlayer[] {
  const dlPositions = getStuntDlPositions(surface);
  return [
    ...OL_PLAYERS,
    ...STUNT_PLAYERS.map((player) => ({
      id: player.id,
      label: player.label,
      x: dlPositions[player.id].x,
      y: dlPositions[player.id].y,
      group: "dl" as const,
    })),
  ];
}

export function getStuntBoardSurfacePlayers(surface?: StuntSurfaceConfig | "none" | "left" | "right"): StuntBoardPlayer[] {
  const normalized = normalizeSurface(surface);
  const players = getStuntBoardPlayers(normalized);
  if (normalized.teSide === "none") return players;
  return [
    ...players,
    {
      id: "TE",
      label: "TE",
      x: normalized.teSide === "left" ? 12 : 88,
      y: OL_Y,
      group: "ol" as const,
    },
  ];
}

function getInsideDirection(playerId: StuntPlayerId) {
  return DL_POSITIONS[playerId].x < 50 ? 1 : -1;
}

function getTargetDirection(assignment: Pick<StuntAssignment, "playerId" | "movement" | "targetGap" | "side">) {
  if (assignment.targetGap.toLowerCase().includes("center")) {
    return assignment.playerId === "N" ? 1 : -1;
  }
  if (assignment.targetGap.toLowerCase().includes("outside") || assignment.targetGap.toLowerCase().includes("box")) {
    return -getInsideDirection(assignment.playerId);
  }
  if (assignment.side === "field") return assignment.playerId === "LE" || assignment.playerId === "N" ? 1 : -1;
  if (assignment.side === "boundary") return assignment.playerId === "LE" || assignment.playerId === "N" ? -1 : 1;
  return getInsideDirection(assignment.playerId);
}

function moveFromCircle(x: number, y: number, targetX: number, targetY: number) {
  const dx = targetX - x;
  const dy = targetY - y;
  const distance = Math.hypot(dx, dy) || 1;
  return {
    x: x + (dx / distance) * PLAYER_RADIUS,
    y: y + (dy / distance) * PLAYER_RADIUS,
  };
}

function getVisualShape(visual: StuntVisualPath | undefined, fallbackDirection: number) {
  const dir = visual?.endsWith("Left") ? -1 : visual?.endsWith("Right") ? 1 : fallbackDirection;

  switch (visual) {
    case "stepVertical":
      return { kind: "line" as const, endDx: 0, endDy: -20 };
    case "loopLeft":
    case "loopRight":
      return { kind: "curve" as const, endDx: dir * 15, endDy: -25, c1Dx: dir * 2, c1Dy: -6, c2Dx: dir * 17, c2Dy: -5 };
    case "loopWideLeft":
    case "loopWideRight":
      return { kind: "curve" as const, endDx: dir * 22, endDy: -26, c1Dx: dir * 4, c1Dy: -2, c2Dx: dir * 25, c2Dy: -8 };
    case "flashLoopLeft":
    case "flashLoopRight":
      return { kind: "brokenCurve" as const, endDx: dir * 18, endDy: -24, midDx: dir * 8, midDy: -2, c2Dx: dir * 16, c2Dy: -4 };
    case "surfLeft":
    case "surfRight":
      return { kind: "bend" as const, endDx: dir * 9, endDy: -8, midDx: dir * 6, midDy: -1 };
    case "chaseLeft":
    case "chaseRight":
      return { kind: "bend" as const, endDx: dir * 11, endDy: -10, midDx: dir * 6, midDy: -3 };
    case "pickLeft":
    case "pickRight":
      return { kind: "bend" as const, endDx: dir * 11, endDy: -9, midDx: dir * 7, midDy: 1 };
    case "copLeft":
    case "copRight":
      return { kind: "bend" as const, endDx: dir * 7, endDy: -13, midDx: dir * 5, midDy: -1 };
    case "stepLeft":
    case "stepRight":
    default:
      return { kind: "line" as const, endDx: dir * 10, endDy: -18 };
  }
}

function makeAssignmentPath(assignment: StuntAssignment): StuntPathRender {
  const start = DL_POSITIONS[assignment.playerId];
  const dir = getTargetDirection(assignment);
  const shape = getVisualShape(assignment.visual, dir);
  const endX = start.x + shape.endDx;
  const endY = start.y + shape.endDy;
  const circleStart = moveFromCircle(start.x, start.y, endX, endY);

  let d = `M ${circleStart.x} ${circleStart.y} L ${endX} ${endY}`;
  if (shape.kind === "curve") {
    const controlOneX = start.x + shape.c1Dx;
    const controlOneY = start.y + shape.c1Dy;
    const controlTwoX = start.x + shape.c2Dx;
    const controlTwoY = start.y + shape.c2Dy;
    d = `M ${circleStart.x} ${circleStart.y} C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${endX} ${endY}`;
  } else if (shape.kind === "brokenCurve") {
    const midX = start.x + shape.midDx;
    const midY = start.y + shape.midDy;
    const controlTwoX = start.x + shape.c2Dx;
    const controlTwoY = start.y + shape.c2Dy;
    d = `M ${circleStart.x} ${circleStart.y} L ${midX} ${midY} Q ${controlTwoX} ${controlTwoY}, ${endX} ${endY}`;
  } else if (shape.kind === "bend") {
    const bendX = start.x + shape.midDx;
    const bendY = start.y + shape.midDy;
    d = `M ${circleStart.x} ${circleStart.y} L ${bendX} ${bendY} L ${endX} ${endY}`;
  }

  return {
    playerId: assignment.playerId,
    d,
    order: assignment.order,
    movement: assignment.movement,
    subLabel: assignment.subLabel,
    teachingLabel: assignment.teachingLabel,
    showOrder: assignment.showOrder,
    box: assignment.box,
    dashed: assignment.dashed,
    labelX: (circleStart.x + endX) / 2,
    labelY: Math.min(circleStart.y, endY) - 4,
    endX,
    endY,
  };
}

function answerToAssignment(playerId: StuntPlayerId, answer: StuntQuizAnswer): StuntAssignment | null {
  if (!answer.movement || !answer.order) return null;
  return {
    playerId,
    movement: answer.movement,
    order: answer.order,
    targetGap: answer.movement === "Loop" ? "C gap" : answer.movement === "COP" ? "Contain" : "B gap",
    visual: answer.movement === "Loop"
      ? (getInsideDirection(playerId) === 1 ? "loopRight" : "loopLeft")
      : answer.movement === "Surf"
        ? (getInsideDirection(playerId) === 1 ? "surfRight" : "surfLeft")
        : answer.movement === "Chase"
          ? (getInsideDirection(playerId) === 1 ? "chaseRight" : "chaseLeft")
          : answer.movement === "Flash & Loop"
            ? (getInsideDirection(playerId) === 1 ? "flashLoopRight" : "flashLoopLeft")
            : answer.movement === "Pick & Penetrate"
              ? (getInsideDirection(playerId) === 1 ? "pickRight" : "pickLeft")
              : answer.movement === "COP"
                ? (getInsideDirection(playerId) === 1 ? "copRight" : "copLeft")
                : (getInsideDirection(playerId) === 1 ? "stepRight" : "stepLeft"),
  };
}

export function buildStuntPathRenders(assignments: StuntAssignment[]) {
  return assignments.map(makeAssignmentPath);
}

export function buildStuntPreviewPaths(answers: Partial<Record<StuntPlayerId, StuntQuizAnswer>>) {
  return (Object.entries(answers) as [StuntPlayerId, StuntQuizAnswer][])
    .map(([playerId, answer]) => answerToAssignment(playerId, answer))
    .filter((assignment): assignment is StuntAssignment => Boolean(assignment))
    .map(makeAssignmentPath);
}

export function buildStuntCorrectionPaths(
  stunt: StuntDefinition,
  wrongPlayers: StuntPlayerId[],
) {
  return stunt.assignments
    .filter((assignment) => wrongPlayers.includes(assignment.playerId))
    .map(makeAssignmentPath);
}
