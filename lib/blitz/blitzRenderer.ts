import {
  BLITZ_BASE_BOARD_OPTIONS,
  buildBlitzPathwayOverlay,
  getBlitzHash,
  getBlitzOriginX,
  getBlitzPathwayMetaFromOverlay,
  type BlitzBaseBoardId,
  type BlitzBoardSpot,
  type BlitzPathwayId,
  type FrontMode,
  type PlayerDot,
  type Side,
} from "./blitzLogic";

type FieldTag = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "default" | "gold" | "cyan" | "sky";
};

type FormationMeta = {
  runStrength: Side;
  passStrength: Side;
  players: PlayerDot[];
};

type Landmark = {
  id: string;
  x: number;
  y: number;
  label?: string;
  layer: string;
};

type RunFitArrowColor = "gold" | "cyan" | "sky" | "white" | "red";
type RunFitLineEnd = "square" | "circle" | "arrow";

type RouteOverlay = {
  id: string;
  label: string;
  color: string;
  path: { x: number; y: number }[];
  labelX?: number;
  labelY?: number;
  strokeWidth?: number;
  dashed?: boolean;
  endCap?: RunFitLineEnd;
  pathway?: {
    defenderId: string;
    pathwayId: any;
    layer?: "pressure" | "coverage" | "dl";
  };
};

export type BlitzBoardShell = {
  id: BlitzBaseBoardId;
  title: string;
  subtitle: string;
  boardSpot: BlitzBoardSpot;
  hashXs?: number[];
  runStrength: Side;
  passStrength: Side;
  losY: number;
  wingY: number;
  offensePlayers: PlayerDot[];
  defensePlayers: PlayerDot[];
  routeOverlays: RouteOverlay[];
  fieldTags: FieldTag[];
};

export type BlitzRendererDeps = {
  LOS_Y: number;
  WING_Y: number;
  DL_Y: number;
  clamp: (value: number, min: number, max: number) => number;
  buildFoothillFormation: (call: string, wide?: boolean) => FormationMeta;
  flipCallSide: (call: string) => string;
  getAlignmentLandmarks: (formation: FormationMeta) => Landmark[];
  getAlignmentAnswerKey: (formation: FormationMeta, landmarks: Landmark[], frontMode?: FrontMode) => Record<string, { x: number; y: number }>;
  getDefensePlayersFromAnswerKey: (answerKey: Record<string, { x: number; y: number }>) => PlayerDot[];
  getFormationLineXs: (formation: FormationMeta) => number[];
  getRunFitArrowStroke: (color: RunFitArrowColor) => string;
};

export function buildBlitzBoardShell(
  baseBoardId: BlitzBaseBoardId,
  frontMode: FrontMode = "4-4",
  boardSpot: BlitzBoardSpot = "mof",
  deps: BlitzRendererDeps,
): BlitzBoardShell {
  const boardOption = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId) ?? BLITZ_BASE_BOARD_OPTIONS[0];
  const call = boardOption.call;
  const baseFormation = deps.buildFoothillFormation(call, true);
  const fieldCall = boardSpot === "hash" && baseFormation.passStrength !== "left" ? deps.flipCallSide(call) : call;
  const fieldFormation = fieldCall === call ? baseFormation : deps.buildFoothillFormation(fieldCall, true);
  const ballX = boardSpot === "hash" ? getBlitzHash("right") : 50;
  const horizontalShift = ballX - 50;
  const shiftX = (player: PlayerDot) => ({ ...player, x: deps.clamp(player.x + horizontalShift, 3, 97) });
  const alignmentLandmarks = deps.getAlignmentLandmarks(fieldFormation);
  const answerKey = deps.getAlignmentAnswerKey(fieldFormation, alignmentLandmarks, frontMode);
  const ySurface = fieldFormation.players.find((player) => player.id === "Y");
  const verticalShift = -4;
  const blitzLosY = deps.LOS_Y + verticalShift;
  const blitzWingY = deps.WING_Y + verticalShift;
  const shiftY = (player: PlayerDot) => ({ ...player, y: deps.clamp(player.y + verticalShift, 3, 97) });
  const shiftBoard = (player: PlayerDot) => shiftY(shiftX(player));
  const lineXs = deps.getFormationLineXs(fieldFormation);
  const yTackleX = ySurface ? (ySurface.x < 50 ? lineXs[0] : lineXs[4]) : null;
  const yAttachedToSurface = Boolean(ySurface && yTackleX !== null && Math.abs(ySurface.y - deps.LOS_Y) < 1.25 && Math.abs(ySurface.x - yTackleX) <= 8);
  const defensePlayers = deps.getDefensePlayersFromAnswerKey(answerKey).map((defender) => (
    defender.id === "SDE" && ySurface && yAttachedToSurface
      ? { ...defender, x: ySurface.x, y: deps.DL_Y }
      : defender
  )).map(shiftBoard);

  return {
    id: baseBoardId,
    title: `Newton ${frontMode} vs ${boardOption.label}${boardSpot === "hash" ? " on Hash" : ""}`,
    subtitle: `Default Newton ${frontMode} install board against ${boardOption.label}${boardSpot === "hash" ? " with the ball on the right hash" : ""}.`,
    boardSpot,
    hashXs: boardSpot === "hash" ? [getBlitzHash("left"), getBlitzHash("right")] : undefined,
    runStrength: fieldFormation.runStrength,
    passStrength: fieldFormation.passStrength,
    losY: blitzLosY,
    wingY: blitzWingY,
    offensePlayers: fieldFormation.players.map(shiftBoard),
    defensePlayers,
    routeOverlays: [] as RouteOverlay[],
    fieldTags: [] as FieldTag[],
  };
}

export function buildRunFitBoardShell(baseBoardId: BlitzBaseBoardId, deps: BlitzRendererDeps) {
  const shell = buildBlitzBoardShell(baseBoardId, "4-4", "mof", deps);
  const originX = getBlitzOriginX(shell.offensePlayers);
  const widenFromBall = (x: number) => deps.clamp(originX + (x - originX) * 1.1, 3, 97);
  const deepenFromLos = (y: number) => (
    Math.abs(y - shell.losY) < 1.25
      ? y
      : deps.clamp(shell.losY + (y - shell.losY) * 1.1, 3, 97)
  );
  const expandPlayer = (player: PlayerDot) => ({
    ...player,
    x: widenFromBall(player.x),
    y: deepenFromLos(player.y),
  });

  return {
    ...shell,
    offensePlayers: shell.offensePlayers.map(expandPlayer),
    defensePlayers: shell.defensePlayers.map((player) => ({
      ...expandPlayer(player),
      y: deps.clamp(deepenFromLos(player.y) + 4.5, 3, 97),
    })),
  };
}

export function buildBlitzDraftOverlay({
  blitzDraftPoints,
  blitzLineLabel,
  blitzLineColor,
  blitzLineEnd,
  getRunFitArrowStroke,
}: {
  blitzDraftPoints: { x: number; y: number }[];
  blitzLineLabel: string;
  blitzLineColor: RunFitArrowColor;
  blitzLineEnd: RunFitLineEnd;
  getRunFitArrowStroke: (color: RunFitArrowColor) => string;
}): RouteOverlay[] {
  if (blitzDraftPoints.length < 2) return [];
  return [{
    id: "blitz-draft",
    label: blitzLineLabel.trim() || "Draft",
    color: getRunFitArrowStroke(blitzLineColor),
    path: blitzDraftPoints,
    labelX: blitzDraftPoints[blitzDraftPoints.length - 1]?.x ?? 50,
    labelY: (blitzDraftPoints[blitzDraftPoints.length - 1]?.y ?? 50) - 3,
    endCap: blitzLineEnd,
  }];
}

export function buildBlitzDisplayOverlays({
  blitzRouteOverlays,
  blitzDraftOverlay,
  blitzPreview,
  selectedBlitzFrontMode,
}: {
  blitzRouteOverlays: RouteOverlay[];
  blitzDraftOverlay: RouteOverlay[];
  blitzPreview: Pick<BlitzBoardShell, "defensePlayers" | "offensePlayers" | "runStrength" | "passStrength" | "losY" | "wingY">;
  selectedBlitzFrontMode: FrontMode;
}): RouteOverlay[] {
  return [
    ...blitzRouteOverlays.map((overlay) => {
      const pathway = getBlitzPathwayMetaFromOverlay(overlay as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0]);
      if (!pathway) return overlay;
      const defender = blitzPreview.defensePlayers.find((player) => player.id === pathway.defenderId);
      if (!defender) return overlay;
      return buildBlitzPathwayOverlay({
        id: overlay.id,
        defender,
        offensePlayers: blitzPreview.offensePlayers,
        pathwayId: pathway.pathwayId as BlitzPathwayId,
        runStrength: blitzPreview.runStrength,
        passStrength: blitzPreview.passStrength,
        losY: blitzPreview.losY,
        wingY: blitzPreview.wingY,
        frontMode: selectedBlitzFrontMode,
        layer: pathway.layer,
      });
    }),
    ...blitzDraftOverlay,
  ];
}
