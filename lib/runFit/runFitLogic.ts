import {
  BLITZ_BASE_BOARD_OPTIONS,
  buildBlitzPathwayOverlay,
  getBlitzGapTargetX,
  getBlitzOriginX,
  type BlitzBaseBoardId,
  type BlitzBoardSpot,
  type BlitzCallId,
  type BlitzPathwayId,
  type FrontMode,
} from "@/lib/blitz/blitzLogic";
import { buildRunFitBoardShell, type BlitzRendererDeps } from "@/lib/blitz/blitzRenderer";
import {
  FIXED_OL_IDS,
  LOS_Y,
  clamp,
  getMidpoint,
  getOppositeSide,
  type PlayerDot,
  type Side,
} from "@/lib/formation/formationLogic";

export type RouteOverlay = {
  id: string;
  label: string;
  color: string;
  path: { x: number; y: number }[];
  labelX?: number;
  labelY?: number;
  strokeWidth?: number;
  dashed?: boolean;
  endCap?: "arrow" | "square" | "circle";
  pathway?: {
    defenderId: string;
    pathwayId: BlitzPathwayId | RunFitPathwayId;
    layer?: "pressure" | "coverage" | "dl" | "cover2";
  };
};

export type FieldTag = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "default" | "gold" | "cyan" | "sky";
};

export type RunFitEditorTool = "select" | "line" | "arrow" | "tag";
export type RunFitArrowColor = "gold" | "cyan" | "sky" | "white" | "red";
export type RunFitLineEnd = "square" | "circle" | "arrow";
export type RunFitLineStyle = "solid" | "dashed";
export type RunFitSavedPathway = {
  id: string;
  name: string;
  positionId: string;
  label: string;
  color: RunFitArrowColor;
  endCap: RunFitLineEnd;
  strokeWidth?: number;
  dashed?: boolean;
  offsets: { x: number; y: number }[];
};
export type RunFitPathwayId =
  | "a_gap_fit"
  | "b_gap_fit"
  | "c_gap_fit"
  | "d_gap_fit"
  | "strong_a_gap_fit"
  | "strong_b_gap_fit"
  | "strong_c_gap_fit"
  | "strong_d_gap_fit"
  | "weak_a_gap_fit"
  | "weak_b_gap_fit"
  | "weak_c_gap_fit"
  | "weak_d_gap_fit"
  | "box_fit"
  | "spill_fit"
  | "under_box_fit"
  | "over_spill_fit";
export type RunFitSavedBoard = {
  id: string;
  title: string;
  routeOverlays: RouteOverlay[];
  fieldTags: FieldTag[];
  baseBoardId?: BlitzBaseBoardId;
};
export type BlitzSavedBoard = RunFitSavedBoard & {
  baseBoardId: BlitzBaseBoardId;
  frontMode?: FrontMode;
  callId?: BlitzCallId;
  boardSpot?: BlitzBoardSpot;
};

export const RUN_FIT_BOARDS_STORAGE_KEY = "formation-recognition-run-fit-boards-v3";
export const RUN_FIT_PATHWAY_OPTIONS: { value: RunFitPathwayId; label: string }[] = [
  { value: "a_gap_fit", label: "A-Gap Fit" },
  { value: "b_gap_fit", label: "B-Gap Fit" },
  { value: "c_gap_fit", label: "C-Gap Fit" },
  { value: "d_gap_fit", label: "D-Gap Fit" },
  { value: "strong_a_gap_fit", label: "Strong A-Gap Fit" },
  { value: "strong_b_gap_fit", label: "Strong B-Gap Fit" },
  { value: "strong_c_gap_fit", label: "Strong C-Gap Fit" },
  { value: "strong_d_gap_fit", label: "Strong D-Gap Fit" },
  { value: "weak_a_gap_fit", label: "Weak A-Gap Fit" },
  { value: "weak_b_gap_fit", label: "Weak B-Gap Fit" },
  { value: "weak_c_gap_fit", label: "Weak C-Gap Fit" },
  { value: "weak_d_gap_fit", label: "Weak D-Gap Fit" },
  { value: "box_fit", label: "Box" },
  { value: "spill_fit", label: "Spill" },
  { value: "under_box_fit", label: "Under Box" },
  { value: "over_spill_fit", label: "Over Spill" },
];

export function getRunFitArrowStroke(color: RunFitArrowColor) {
  if (color === "gold") return "#f4cf63";
  if (color === "cyan") return "#78dfd0";
  if (color === "sky") return "#89c6ff";
  if (color === "red") return "#ef4444";
  return "#ffffff";
}

export function getRunFitLineStrokeWidth(weight: string) {
  if (weight === "thin") return 0.55;
  if (weight === "thick") return 0.95;
  if (weight === "heavy") return 1.2;
  return 0.7;
}

export function buildRunFitPreview(selectedRunFitBaseBoardId: BlitzBaseBoardId, blitzRendererDeps: BlitzRendererDeps) {
  const shell = buildRunFitBoardShell(selectedRunFitBaseBoardId, blitzRendererDeps);
  const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedRunFitBaseBoardId)?.label ?? "Formation";
  return {
    ...shell,
    title: `Run Fit 4-4 vs ${boardLabel}`,
    notes: [] as { title: string; body: string }[],
  };
}

export function buildRunFitDraftOverlay({
  runFitDraftPoints,
  runFitArrowLabel,
  runFitArrowColor,
  runFitLineWeight,
  runFitLineStyle,
  runFitLineEnd,
}: {
  runFitDraftPoints: { x: number; y: number }[];
  runFitArrowLabel: string;
  runFitArrowColor: RunFitArrowColor;
  runFitLineWeight: string;
  runFitLineStyle: RunFitLineStyle;
  runFitLineEnd: RunFitLineEnd;
}): RouteOverlay[] {
  if (runFitDraftPoints.length < 2) return [];
  return [{
    id: "run-fit-draft",
    label: runFitArrowLabel.trim() || "Draft",
    color: getRunFitArrowStroke(runFitArrowColor),
    path: runFitDraftPoints,
    labelX: runFitDraftPoints[runFitDraftPoints.length - 1]?.x ?? 50,
    labelY: (runFitDraftPoints[runFitDraftPoints.length - 1]?.y ?? 50) - 3,
    strokeWidth: getRunFitLineStrokeWidth(runFitLineWeight),
    dashed: runFitLineStyle === "dashed",
    endCap: runFitLineEnd,
  }];
}

export function getRunFitStorageFallback(runFitPreview: any) {
  return {
    title: runFitPreview.title,
    routeOverlays: runFitPreview.routeOverlays,
    fieldTags: runFitPreview.fieldTags,
    boards: [] as RunFitSavedBoard[],
    savedPathways: [] as RunFitSavedPathway[],
  };
}

export function parseRunFitStorage(raw: string | null, runFitPreview: any) {
  if (!raw) return getRunFitStorageFallback(runFitPreview);

  const parsed = JSON.parse(raw) as {
    working?: { title?: string; routeOverlays?: RouteOverlay[]; fieldTags?: FieldTag[] };
    boards?: RunFitSavedBoard[];
    savedPathways?: RunFitSavedPathway[];
  };

  return {
    title: parsed.working?.title || runFitPreview.title,
    routeOverlays: parsed.working?.routeOverlays || runFitPreview.routeOverlays,
    fieldTags: parsed.working?.fieldTags || runFitPreview.fieldTags,
    boards: Array.isArray(parsed.boards) ? parsed.boards : [],
    savedPathways: Array.isArray(parsed.savedPathways) ? parsed.savedPathways : [],
  };
}

export function stringifyRunFitStorage({
  runFitTitle,
  runFitRouteOverlays,
  runFitFieldTags,
  runFitSavedBoards,
  runFitSavedPathways,
}: {
  runFitTitle: string;
  runFitRouteOverlays: RouteOverlay[];
  runFitFieldTags: FieldTag[];
  runFitSavedBoards: RunFitSavedBoard[];
  runFitSavedPathways: RunFitSavedPathway[];
}) {
  return JSON.stringify({
    working: {
      title: runFitTitle,
      routeOverlays: runFitRouteOverlays,
      fieldTags: runFitFieldTags,
    },
    boards: runFitSavedBoards,
    savedPathways: runFitSavedPathways,
  });
}

export function createRunFitActions(args: any) {
  const {
    currentUser,
    runFitRouteOverlays,
    runFitFieldTags,
    selectedRunFitOverlayId,
    selectedRunFitTagId,
    setSelectedRunFitOverlayId,
    setSelectedRunFitTagId,
    setRunFitEditorTool,
    setRunFitSaveNotice,
    setRunFitRouteOverlays,
    setRunFitFieldTags,
    runFitEditorTool,
    runFitTagLabel,
    runFitTagTone,
    runFitArrowLabel,
    runFitArrowColor,
    runFitLineWeight,
    runFitLineStyle,
    runFitLineEnd,
    runFitDraftPoints,
    setRunFitDraftPoints,
    runFitPreview,
    selectedRunFitPathwayDefenderId,
    selectedRunFitOverlay,
    runFitSavedPathwayName,
    setRunFitSavedPathways,
    setSelectedRunFitSavedPathwayId,
    runFitSavedPathways,
    selectedRunFitSavedPathwayId,
    blitzRendererDeps,
    setSelectedRunFitBaseBoardId,
    setSelectedRunFitBoardId,
    setRunFitTitle,
    selectedRunFitPathwayId,
    runFitSavedBoards,
    selectedRunFitBaseBoardId,
    runFitTitle,
    selectedRunFitBoardId,
    setRunFitSavedBoards,
  } = args;

  const selectedRunFitTag = runFitFieldTags.find((tag: FieldTag) => tag.id === selectedRunFitTagId) ?? null;
  const clearRunFitSelection = () => {
    setSelectedRunFitOverlayId(null);
    setSelectedRunFitTagId(null);
  };
  const selectRunFitOverlay = (id: string) => {
    setRunFitEditorTool("select");
    setSelectedRunFitOverlayId(id);
    setSelectedRunFitTagId(null);
    setRunFitSaveNotice("Selected line.");
  };
  const selectRunFitTag = (id: string) => {
    setRunFitEditorTool("select");
    setSelectedRunFitTagId(id);
    setSelectedRunFitOverlayId(null);
    setRunFitSaveNotice("Selected tag.");
  };
  const updateSelectedRunFitOverlay = (patch: Partial<RouteOverlay>) => {
    if (!selectedRunFitOverlayId) return;
    setRunFitRouteOverlays((prev: RouteOverlay[]) => prev.map((overlay) => (
      overlay.id === selectedRunFitOverlayId ? { ...overlay, ...patch } : overlay
    )));
  };
  const updateSelectedRunFitTag = (patch: Partial<FieldTag>) => {
    if (!selectedRunFitTagId) return;
    setRunFitFieldTags((prev: FieldTag[]) => prev.map((tag) => (
      tag.id === selectedRunFitTagId ? { ...tag, ...patch } : tag
    )));
  };
  const nudgeSelectedRunFitObject = (dx: number, dy: number) => {
    if (selectedRunFitOverlayId) {
      setRunFitRouteOverlays((prev: RouteOverlay[]) => prev.map((overlay) => (
        overlay.id === selectedRunFitOverlayId
          ? {
              ...overlay,
              path: overlay.path.map((point) => ({ x: clamp(point.x + dx, 2, 98), y: clamp(point.y + dy, 2, 98) })),
              labelX: overlay.labelX === undefined ? undefined : clamp(overlay.labelX + dx, 2, 98),
              labelY: overlay.labelY === undefined ? undefined : clamp(overlay.labelY + dy, 2, 98),
            }
          : overlay
      )));
    }
    if (selectedRunFitTagId) {
      setRunFitFieldTags((prev: FieldTag[]) => prev.map((tag) => (
        tag.id === selectedRunFitTagId ? { ...tag, x: clamp(tag.x + dx, 2, 98), y: clamp(tag.y + dy, 2, 98) } : tag
      )));
    }
  };
  const moveRunFitRouteOverlay = (id: string, dx: number, dy: number) => {
    setRunFitRouteOverlays((prev: RouteOverlay[]) => prev.map((overlay) => (
      overlay.id === id
        ? {
            ...overlay,
            path: overlay.path.map((point) => ({ x: clamp(point.x + dx, 2, 98), y: clamp(point.y + dy, 2, 98) })),
            labelX: overlay.labelX === undefined ? undefined : clamp(overlay.labelX + dx, 2, 98),
            labelY: overlay.labelY === undefined ? undefined : clamp(overlay.labelY + dy, 2, 98),
          }
        : overlay
    )));
  };
  const moveRunFitRouteOverlayPoint = (id: string, pointIndex: number, x: number, y: number) => {
    setRunFitRouteOverlays((prev: RouteOverlay[]) => prev.map((overlay) => {
      if (overlay.id !== id) return overlay;
      const nextPath = overlay.path.map((point, idx) => (
        idx === pointIndex ? { x: clamp(x, 2, 98), y: clamp(y, 2, 98) } : point
      ));
      const movedLastPoint = pointIndex === overlay.path.length - 1;

      return {
        ...overlay,
        path: nextPath,
        labelX: movedLastPoint && overlay.labelX !== undefined ? nextPath[pointIndex]?.x : overlay.labelX,
        labelY: movedLastPoint && overlay.labelY !== undefined ? clamp((nextPath[pointIndex]?.y ?? y) - 3, 2, 98) : overlay.labelY,
      };
    }));
  };
  const duplicateSelectedRunFitObject = () => {
    if (selectedRunFitOverlay) {
      const duplicate: RouteOverlay = {
        ...selectedRunFitOverlay,
        id: `run-fit-copy-${Date.now()}`,
        path: selectedRunFitOverlay.path.map((point: { x: number; y: number }) => ({ x: clamp(point.x + 2, 2, 98), y: clamp(point.y + 2, 2, 98) })),
        labelX: selectedRunFitOverlay.labelX === undefined ? undefined : clamp(selectedRunFitOverlay.labelX + 2, 2, 98),
        labelY: selectedRunFitOverlay.labelY === undefined ? undefined : clamp(selectedRunFitOverlay.labelY + 2, 2, 98),
      };
      setRunFitRouteOverlays((prev: RouteOverlay[]) => [...prev, duplicate]);
      setSelectedRunFitOverlayId(duplicate.id);
      return;
    }
    if (selectedRunFitTag) {
      const duplicate: FieldTag = {
        ...selectedRunFitTag,
        id: `tag-copy-${Date.now()}`,
        x: clamp(selectedRunFitTag.x + 2, 2, 98),
        y: clamp(selectedRunFitTag.y + 2, 2, 98),
      };
      setRunFitFieldTags((prev: FieldTag[]) => [...prev, duplicate]);
      setSelectedRunFitTagId(duplicate.id);
    }
  };
  const deleteSelectedRunFitObject = () => {
    if (selectedRunFitOverlayId) {
      setRunFitRouteOverlays((prev: RouteOverlay[]) => prev.filter((overlay) => overlay.id !== selectedRunFitOverlayId));
    }
    if (selectedRunFitTagId) {
      setRunFitFieldTags((prev: FieldTag[]) => prev.filter((tag) => tag.id !== selectedRunFitTagId));
    }
    clearRunFitSelection();
  };
  const bringSelectedRunFitLineForward = () => {
    if (!selectedRunFitOverlayId) return;
    setRunFitRouteOverlays((prev: RouteOverlay[]) => {
      const selected = prev.find((overlay) => overlay.id === selectedRunFitOverlayId);
      if (!selected) return prev;
      return [...prev.filter((overlay) => overlay.id !== selectedRunFitOverlayId), selected];
    });
  };
  const sendSelectedRunFitLineBackward = () => {
    if (!selectedRunFitOverlayId) return;
    setRunFitRouteOverlays((prev: RouteOverlay[]) => {
      const selected = prev.find((overlay) => overlay.id === selectedRunFitOverlayId);
      if (!selected) return prev;
      return [selected, ...prev.filter((overlay) => overlay.id !== selectedRunFitOverlayId)];
    });
  };

  const handleRunFitFieldClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin) return;

    if (runFitEditorTool === "select") {
      clearRunFitSelection();
      return;
    }

    if (runFitEditorTool === "tag") {
      const cleanLabel = runFitTagLabel.trim();
      if (!cleanLabel) return;
      setRunFitFieldTags((prev: FieldTag[]) => [
        ...prev,
        {
          id: `tag-${Date.now()}-${prev.length}`,
          label: cleanLabel,
          x,
          y,
          tone: runFitTagTone,
        },
      ]);
      setRunFitSaveNotice("Placed tag on the board.");
      return;
    }

    if (runFitEditorTool !== "line") return;
    setRunFitDraftPoints((prev: { x: number; y: number }[]) => [...prev, { x, y }]);
    setRunFitSaveNotice(null);
  };

  const commitRunFitLine = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return;
    const cleanLabel = runFitArrowLabel.trim();
    setRunFitRouteOverlays((prev: RouteOverlay[]) => [
      ...prev,
      {
        id: `run-fit-arrow-${Date.now()}-${prev.length}`,
        label: cleanLabel,
        color: getRunFitArrowStroke(runFitArrowColor),
        path: points,
        labelX: cleanLabel ? points[points.length - 1]?.x ?? 50 : undefined,
        labelY: cleanLabel ? (points[points.length - 1]?.y ?? 50) - 3 : undefined,
        strokeWidth: getRunFitLineStrokeWidth(runFitLineWeight),
        dashed: runFitLineStyle === "dashed",
        endCap: runFitLineEnd,
      },
    ]);
    setRunFitDraftPoints([]);
    setRunFitEditorTool("select");
    setRunFitSaveNotice("Line added to the board.");
  };

  const finishRunFitArrow = () => {
    commitRunFitLine(runFitDraftPoints);
  };

  const handleRunFitFieldDoubleClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin || runFitEditorTool !== "line") return;
    commitRunFitLine([...runFitDraftPoints, { x, y }]);
  };

  const saveRunFitDraftAsPathway = () => {
    if (!currentUser?.isAdmin) return;
    const defender = runFitPreview.defensePlayers.find((player: PlayerDot) => player.id === selectedRunFitPathwayDefenderId);
    const sourcePath = runFitDraftPoints.length >= 2 ? runFitDraftPoints : selectedRunFitOverlay?.path ?? [];
    if (!defender || sourcePath.length < 2) {
      setRunFitSaveNotice("Draw or select a line with at least two points, then choose the position this pathway belongs to.");
      return;
    }

    const cleanName = runFitSavedPathwayName.trim() || selectedRunFitOverlay?.label || runFitArrowLabel.trim() || `${defender.id} Pathway`;
    const savedPathway: RunFitSavedPathway = {
      id: `run-fit-saved-pathway-${Date.now()}`,
      name: cleanName,
      positionId: defender.id,
      label: selectedRunFitOverlay?.label ?? runFitArrowLabel.trim(),
      color: selectedRunFitOverlay
        ? (Object.entries({
            gold: getRunFitArrowStroke("gold"),
            cyan: getRunFitArrowStroke("cyan"),
            sky: getRunFitArrowStroke("sky"),
            white: getRunFitArrowStroke("white"),
            red: getRunFitArrowStroke("red"),
          }).find(([, stroke]) => stroke === selectedRunFitOverlay.color)?.[0] as RunFitArrowColor | undefined) ?? runFitArrowColor
        : runFitArrowColor,
      endCap: selectedRunFitOverlay?.endCap ?? runFitLineEnd,
      strokeWidth: selectedRunFitOverlay?.strokeWidth ?? getRunFitLineStrokeWidth(runFitLineWeight),
      dashed: selectedRunFitOverlay?.dashed ?? runFitLineStyle === "dashed",
      offsets: sourcePath.map((point: { x: number; y: number }) => ({
        x: point.x - defender.x,
        y: point.y - defender.y,
      })),
    };

    setRunFitSavedPathways((prev: RunFitSavedPathway[]) => [...prev, savedPathway]);
    setSelectedRunFitSavedPathwayId(savedPathway.id);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Saved ${cleanName} as a reusable ${defender.id} pathway.`);
  };

  const stampSavedRunFitPathway = () => {
    if (!currentUser?.isAdmin) return;
    const savedPathway = runFitSavedPathways.find((pathway: RunFitSavedPathway) => pathway.id === selectedRunFitSavedPathwayId);
    const defender = runFitPreview.defensePlayers.find((player: PlayerDot) => player.id === selectedRunFitPathwayDefenderId);
    if (!savedPathway || !defender) {
      setRunFitSaveNotice("Choose a saved pathway and defender first.");
      return;
    }

    const path = savedPathway.offsets.map((offset: { x: number; y: number }) => ({
      x: clamp(defender.x + offset.x, 2, 98),
      y: clamp(defender.y + offset.y, 2, 98),
    }));

    setRunFitRouteOverlays((prev: RouteOverlay[]) => [
      ...prev.filter((existing) => existing.pathway?.defenderId !== defender.id),
      {
        id: `run-fit-custom-${savedPathway.id}-${defender.id}-${Date.now()}`,
        label: savedPathway.label,
        color: getRunFitArrowStroke(savedPathway.color),
        path,
        labelX: savedPathway.label ? path[path.length - 1]?.x : undefined,
        labelY: savedPathway.label ? (path[path.length - 1]?.y ?? LOS_Y) - 3 : undefined,
        strokeWidth: savedPathway.strokeWidth,
        dashed: savedPathway.dashed,
        endCap: savedPathway.endCap,
      },
    ]);
    setRunFitSaveNotice(`Added ${savedPathway.name} for ${defender.id}.`);
  };

  const deleteSavedRunFitPathway = () => {
    if (!currentUser?.isAdmin || !selectedRunFitSavedPathwayId) return;
    const deletedPathway = runFitSavedPathways.find((pathway: RunFitSavedPathway) => pathway.id === selectedRunFitSavedPathwayId);
    setRunFitSavedPathways((prev: RunFitSavedPathway[]) => prev.filter((pathway) => pathway.id !== selectedRunFitSavedPathwayId));
    setSelectedRunFitSavedPathwayId("");
    setRunFitSaveNotice(deletedPathway ? `Deleted saved pathway ${deletedPathway.name}.` : "Deleted saved pathway.");
  };

  const loadRunFitBaseBoard = (baseBoardId: BlitzBaseBoardId) => {
    const shell = buildRunFitBoardShell(baseBoardId, blitzRendererDeps);
    const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId)?.label ?? "Formation";
    setSelectedRunFitBaseBoardId(baseBoardId);
    setSelectedRunFitBoardId("working");
    setRunFitTitle(`Run Fit 4-4 vs ${boardLabel}`);
    setRunFitRouteOverlays(shell.routeOverlays);
    setRunFitFieldTags(shell.fieldTags);
    setRunFitDraftPoints([]);
    clearRunFitSelection();
    setRunFitSaveNotice(`Loaded Run Fit 4-4 vs ${boardLabel}.`);
  };

  const addRunFitPathway = () => {
    if (!currentUser?.isAdmin) return;
    const defender = runFitPreview.defensePlayers.find((player: PlayerDot) => player.id === selectedRunFitPathwayDefenderId);
    if (!defender) {
      setRunFitSaveNotice("Choose a defender that exists on this board.");
      return;
    }

    const originX = getBlitzOriginX(runFitPreview.offensePlayers);
    const side: Side = defender.x < originX ? "left" : "right";
    const strongSide = runFitPreview.runStrength;
    const weakSide = getOppositeSide(strongSide);
    const qbDepth = runFitPreview.offensePlayers.find((player: PlayerDot) => player.id === "QB")?.y ?? runFitPreview.losY - 12;
    const capToQbDepth = (path: { x: number; y: number }[]) => path.map((point) => ({
      ...point,
      y: point.y < qbDepth ? qbDepth : point.y,
    }));
    const getRunFitSurface = (targetSide: Side) => {
      const byId = Object.fromEntries(runFitPreview.offensePlayers.map((player: PlayerDot) => [player.id, player])) as Record<string, PlayerDot | undefined>;
      const tackle = targetSide === "left" ? byId.LT : byId.RT;
      const tackleX = tackle?.x ?? getBlitzGapTargetX(runFitPreview.offensePlayers, "C", targetSide);
      const sidePlayers = runFitPreview.offensePlayers.filter((player: PlayerDot) => (
        ![...FIXED_OL_IDS, "QB", "RB", "R", "F", "FB"].includes(player.id as any)
        && (targetSide === "left" ? player.x < originX : player.x > originX)
      ));
      const tightLineSurface = sidePlayers
        .filter((player: PlayerDot) => Math.abs(player.y - runFitPreview.losY) < 1.25 && Math.abs(player.x - tackleX) <= 9)
        .sort((a: PlayerDot, b: PlayerDot) => targetSide === "left" ? a.x - b.x : b.x - a.x)[0] ?? tackle;
      const tightWingSurface = sidePlayers
        .filter((player: PlayerDot) => Math.abs(player.y - runFitPreview.wingY) < 1.75)
        .filter((player: PlayerDot) => Math.abs(player.x - (tightLineSurface?.x ?? tackleX)) <= 12)
        .sort((a: PlayerDot, b: PlayerDot) => targetSide === "left" ? a.x - b.x : b.x - a.x)[0];
      const edgeSurface = tightWingSurface ?? tightLineSurface;

      return { edgeSurface, tackleX };
    };
    const getRunFitDGapX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const outside = targetSide === "left" ? -1 : 1;
      return clamp((edgeSurface?.x ?? tackleX) + outside * 3.4, 3, 97);
    };
    const getRunFitInsideEdgeX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const inside = targetSide === "left" ? 1 : -1;
      return clamp((edgeSurface?.x ?? tackleX) + inside * 2.2, 3, 97);
    };
    const getRunFitOutsideEdgeX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const outside = targetSide === "left" ? -1 : 1;
      return clamp((edgeSurface?.x ?? tackleX) + outside * 2.6, 3, 97);
    };
    const makeGapFitPath = (gap: "A" | "B" | "C", targetSide: Side) => capToQbDepth([
      { x: defender.x, y: defender.y },
      {
        x: getMidpoint(defender.x, getBlitzGapTargetX(runFitPreview.offensePlayers, gap, targetSide)),
        y: getMidpoint(defender.y, runFitPreview.losY),
      },
      { x: getBlitzGapTargetX(runFitPreview.offensePlayers, gap, targetSide), y: runFitPreview.losY - 4 },
    ]);
    const makeDGapFitPath = (targetSide: Side) => {
      const targetX = getRunFitDGapX(targetSide);
      return capToQbDepth([
        { x: defender.x, y: defender.y },
        {
          x: getMidpoint(defender.x, targetX),
          y: getMidpoint(defender.y, runFitPreview.losY),
        },
        { x: targetX, y: runFitPreview.losY - 4 },
      ]);
    };
    const makeBoxSpillPath = (targetSide: Side) => {
      const targetX = getRunFitInsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        {
          x: getMidpoint(defender.x, targetX),
          y: getMidpoint(defender.y, qbDepth),
        },
        { x: targetX, y: qbDepth },
      ];
    };
    const makeFitOffBoxPath = (targetSide: Side) => {
      const boxX = getRunFitInsideEdgeX(targetSide);
      const insideX = clamp(boxX + (targetSide === "left" ? 3 : -3), 3, 97);
      const overEdgeX = getRunFitOutsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        { x: overEdgeX, y: getMidpoint(defender.y, runFitPreview.losY) },
        { x: insideX, y: qbDepth },
      ];
    };
    const makeFitOffSpillPath = (targetSide: Side) => {
      const spillX = getRunFitInsideEdgeX(targetSide);
      const outsideX = clamp(spillX + (targetSide === "left" ? -3 : 3), 3, 97);
      const overEdgeX = getRunFitOutsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        { x: overEdgeX, y: getMidpoint(defender.y, runFitPreview.losY) },
        { x: outsideX, y: qbDepth },
      ];
    };
    const fitPathwayMap: Partial<Record<RunFitPathwayId, BlitzPathwayId>> = {
      a_gap_fit: "a_gap_blitz",
      b_gap_fit: "b_gap_blitz",
      c_gap_fit: "c_gap_blitz",
    };
    const buildFromBlitzPathway = (pathwayId: BlitzPathwayId) => capToQbDepth(buildBlitzPathwayOverlay({
      defender,
      offensePlayers: runFitPreview.offensePlayers,
      pathwayId,
      runStrength: runFitPreview.runStrength,
      passStrength: runFitPreview.passStrength,
      losY: runFitPreview.losY,
      wingY: runFitPreview.wingY,
      frontMode: "4-4",
      layer: "pressure",
    }).path);
    const pathwayConfig: Record<RunFitPathwayId, { label: string; color: RunFitArrowColor; path: { x: number; y: number }[]; endCap: RunFitLineEnd }> = {
      a_gap_fit: {
        label: "A Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.a_gap_fit!),
        endCap: "circle",
      },
      b_gap_fit: {
        label: "B Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.b_gap_fit!),
        endCap: "circle",
      },
      c_gap_fit: {
        label: "C Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.c_gap_fit!),
        endCap: "circle",
      },
      d_gap_fit: {
        label: "D Fit",
        color: "gold",
        path: makeDGapFitPath(side),
        endCap: "circle",
      },
      strong_a_gap_fit: {
        label: "Str A",
        color: "gold",
        path: makeGapFitPath("A", strongSide),
        endCap: "circle",
      },
      strong_b_gap_fit: {
        label: "Str B",
        color: "gold",
        path: makeGapFitPath("B", strongSide),
        endCap: "circle",
      },
      strong_c_gap_fit: {
        label: "Str C",
        color: "gold",
        path: makeGapFitPath("C", strongSide),
        endCap: "circle",
      },
      strong_d_gap_fit: {
        label: "Str D",
        color: "gold",
        path: makeDGapFitPath(strongSide),
        endCap: "circle",
      },
      weak_a_gap_fit: {
        label: "Wk A",
        color: "gold",
        path: makeGapFitPath("A", weakSide),
        endCap: "circle",
      },
      weak_b_gap_fit: {
        label: "Wk B",
        color: "gold",
        path: makeGapFitPath("B", weakSide),
        endCap: "circle",
      },
      weak_c_gap_fit: {
        label: "Wk C",
        color: "gold",
        path: makeGapFitPath("C", weakSide),
        endCap: "circle",
      },
      weak_d_gap_fit: {
        label: "Wk D",
        color: "gold",
        path: makeDGapFitPath(weakSide),
        endCap: "circle",
      },
      box_fit: {
        label: "Box",
        color: "gold",
        path: makeBoxSpillPath(side),
        endCap: "circle",
      },
      spill_fit: {
        label: "Spill",
        color: "gold",
        path: makeBoxSpillPath(side),
        endCap: "circle",
      },
      under_box_fit: {
        label: "Under Box",
        color: "gold",
        path: makeFitOffBoxPath(side),
        endCap: "circle",
      },
      over_spill_fit: {
        label: "Over Spill",
        color: "gold",
        path: makeFitOffSpillPath(side),
        endCap: "circle",
      },
    };
    const config = pathwayConfig[selectedRunFitPathwayId];
    setRunFitRouteOverlays((prev: RouteOverlay[]) => [
      ...prev.filter((existing) => existing.pathway?.defenderId !== defender.id),
      {
        id: `run-fit-pathway-${selectedRunFitPathwayId}-${defender.id}-${Date.now()}`,
        label: config.label,
        color: getRunFitArrowStroke(config.color),
        path: config.path,
        labelX: config.path[config.path.length - 1]?.x,
        labelY: (config.path[config.path.length - 1]?.y ?? LOS_Y) - 3,
        endCap: config.endCap,
        pathway: {
          defenderId: defender.id,
          pathwayId: selectedRunFitPathwayId,
        },
      },
    ]);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Added ${RUN_FIT_PATHWAY_OPTIONS.find((option) => option.value === selectedRunFitPathwayId)?.label ?? "run fit"} for ${defender.id}.`);
  };

  const loadRunFitBoard = (boardId: string) => {
    if (boardId === "working") {
      setSelectedRunFitBoardId("working");
      return;
    }
    const selectedBoard = runFitSavedBoards.find((board: RunFitSavedBoard) => board.id === boardId);
    if (!selectedBoard) return;
    setSelectedRunFitBoardId(boardId);
    setSelectedRunFitBaseBoardId(selectedBoard.baseBoardId ?? "double");
    setRunFitTitle(selectedBoard.title);
    setRunFitRouteOverlays(selectedBoard.routeOverlays);
    setRunFitFieldTags(selectedBoard.fieldTags);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Loaded ${selectedBoard.title}.`);
  };

  const saveRunFitBoard = () => {
    const cleanTitle = runFitTitle.trim() || "Untitled Run Fit";
    if (selectedRunFitBoardId !== "working") {
      setRunFitSavedBoards((prev: RunFitSavedBoard[]) => prev.map((board) => (
        board.id === selectedRunFitBoardId
          ? { ...board, title: cleanTitle, baseBoardId: selectedRunFitBaseBoardId, routeOverlays: runFitRouteOverlays, fieldTags: runFitFieldTags }
          : board
      )));
      setRunFitSaveNotice(`Updated ${cleanTitle}.`);
      return;
    }

    const nextBoard: RunFitSavedBoard = {
      id: `run-fit-${Date.now()}`,
      title: cleanTitle,
      routeOverlays: runFitRouteOverlays,
      fieldTags: runFitFieldTags,
      baseBoardId: selectedRunFitBaseBoardId,
    };
    setRunFitSavedBoards((prev: RunFitSavedBoard[]) => [...prev, nextBoard]);
    setSelectedRunFitBoardId(nextBoard.id);
    setRunFitSaveNotice(`Saved ${cleanTitle}.`);
  };

  const resetRunFitSample = () => {
    setSelectedRunFitBoardId("working");
    setRunFitTitle(runFitPreview.title);
    setRunFitRouteOverlays(runFitPreview.routeOverlays);
    setRunFitFieldTags(runFitPreview.fieldTags);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice("Reset to the sample board.");
  };

  return {
    selectedRunFitTag,
    clearRunFitSelection,
    selectRunFitOverlay,
    selectRunFitTag,
    updateSelectedRunFitOverlay,
    updateSelectedRunFitTag,
    nudgeSelectedRunFitObject,
    moveRunFitRouteOverlay,
    moveRunFitRouteOverlayPoint,
    duplicateSelectedRunFitObject,
    deleteSelectedRunFitObject,
    bringSelectedRunFitLineForward,
    sendSelectedRunFitLineBackward,
    handleRunFitFieldClick,
    commitRunFitLine,
    finishRunFitArrow,
    handleRunFitFieldDoubleClick,
    saveRunFitDraftAsPathway,
    stampSavedRunFitPathway,
    deleteSavedRunFitPathway,
    loadRunFitBaseBoard,
    addRunFitPathway,
    loadRunFitBoard,
    saveRunFitBoard,
    resetRunFitSample,
  };
}
