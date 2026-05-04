"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BLITZ_BASE_BOARD_OPTIONS,
  BLITZ_BOARD_SPOT_OPTIONS,
  BLITZ_BOARD_STRUCTURE,
  BLITZ_CALL_FAMILY_OPTIONS,
  BLITZ_CALL_MATRIX,
  BLITZ_CALL_OPTIONS,
  BLITZ_CALL_TYPE_LABELS,
  BLITZ_PATHWAY_OPTIONS,
  buildBlitzPathwayOverlay,
  buildBlitzTemplateOverlays,
  getBlitzBoardCallLabel,
  getBlitzCallFamilyId,
  getBlitzCallId,
  getBlitzCallLabel,
  getBlitzCallType,
  getBlitzPathwayLabel,
  getBlitzPathwayMetaFromOverlay,
  type BlitzBaseBoardId,
  type BlitzBoardSpot,
  type BlitzCallFamilyId,
  type BlitzCallId,
  type BlitzCallType,
  type BlitzPathwayId,
  type FrontMode,
} from "@/lib/blitz/blitzLogic";
import {
  buildBlitzBoardShell,
  buildBlitzDisplayOverlays,
  buildBlitzDraftOverlay,
  type BlitzRendererDeps,
} from "@/lib/blitz/blitzRenderer";

type RunFitEditorTool = "select" | "line" | "arrow" | "tag";
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
  endCap?: "arrow" | "square" | "circle";
  pathway?: {
    defenderId: string;
    pathwayId: BlitzPathwayId | string;
    layer?: "pressure" | "coverage" | "dl";
  };
};

type FieldTag = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "default" | "gold" | "cyan" | "sky";
};

type BlitzSavedBoard = {
  id: string;
  title: string;
  routeOverlays: RouteOverlay[];
  fieldTags: FieldTag[];
  baseBoardId: BlitzBaseBoardId;
  frontMode?: FrontMode;
  callId?: BlitzCallId;
  boardSpot?: BlitzBoardSpot;
};

type BlitzBoardProps = {
  isAdmin?: boolean;
  TrainingFieldComponent: React.ComponentType<any>;
  blitzRendererDeps: BlitzRendererDeps;
};

const BLITZ_BOARDS_STORAGE_KEY = "formation-recognition-blitz-boards-v1";

export function BlitzBoard({ isAdmin = false, TrainingFieldComponent, blitzRendererDeps }: BlitzBoardProps) {
  const [showBlitzAdminTools, setShowBlitzAdminTools] = useState(false);
  const [selectedBlitzBaseBoardId, setSelectedBlitzBaseBoardId] = useState<BlitzBaseBoardId>("double");
  const [selectedBlitzFrontMode, setSelectedBlitzFrontMode] = useState<FrontMode>("4-4");
  const [selectedBlitzBoardSpot, setSelectedBlitzBoardSpot] = useState<BlitzBoardSpot>("mof");
  const [selectedBlitzCallId, setSelectedBlitzCallId] = useState<BlitzCallId>("newton");
  const [selectedBlitzCallFamilyId, setSelectedBlitzCallFamilyId] = useState<BlitzCallFamilyId>("newton");
  const [selectedBlitzCallType, setSelectedBlitzCallType] = useState<BlitzCallType>("last_name");
  const [blitzTitle, setBlitzTitle] = useState("Newton vs Double");
  const [blitzEditorTool, setBlitzEditorTool] = useState<RunFitEditorTool>("arrow");
  const [blitzLineColor, setBlitzLineColor] = useState<RunFitArrowColor>("red");
  const [blitzLineEnd, setBlitzLineEnd] = useState<RunFitLineEnd>("arrow");
  const [blitzLineLabel, setBlitzLineLabel] = useState("BLITZ");
  const [blitzDraftPoints, setBlitzDraftPoints] = useState<{ x: number; y: number }[]>([]);
  const [blitzFieldTags, setBlitzFieldTags] = useState<FieldTag[]>([]);
  const [blitzRouteOverlays, setBlitzRouteOverlays] = useState<RouteOverlay[]>([]);
  const [blitzTagLabel, setBlitzTagLabel] = useState("NEWTON");
  const [blitzTagTone, setBlitzTagTone] = useState<FieldTag["tone"]>("gold");
  const [blitzSavedBoards, setBlitzSavedBoards] = useState<BlitzSavedBoard[]>([]);
  const [selectedBlitzBoardId, setSelectedBlitzBoardId] = useState("working");
  const [blitzSaveNotice, setBlitzSaveNotice] = useState<string | null>(null);
  const [blitzBoardsHydrated, setBlitzBoardsHydrated] = useState(false);
  const [selectedBlitzPathwayDefenderId, setSelectedBlitzPathwayDefenderId] = useState("M");
  const [selectedBlitzPathwayId, setSelectedBlitzPathwayId] = useState<BlitzPathwayId>("a_gap_blitz");

  const blitzPreview = useMemo(
    () => buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot, blitzRendererDeps),
    [blitzRendererDeps, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzFrontMode],
  );
  const blitzDraftOverlay = useMemo<RouteOverlay[]>(() => buildBlitzDraftOverlay({
    blitzDraftPoints,
    blitzLineLabel,
    blitzLineColor,
    blitzLineEnd,
    getRunFitArrowStroke: blitzRendererDeps.getRunFitArrowStroke,
  }), [blitzDraftPoints, blitzLineColor, blitzLineEnd, blitzLineLabel, blitzRendererDeps.getRunFitArrowStroke]);
  const blitzDisplayOverlays = useMemo(
    () => buildBlitzDisplayOverlays({
      blitzRouteOverlays,
      blitzDraftOverlay,
      blitzPreview,
      selectedBlitzFrontMode,
    }),
    [blitzDraftOverlay, blitzPreview, blitzRouteOverlays, selectedBlitzFrontMode],
  );
  const selectedBlitzCallOption = useMemo(() => (
    BLITZ_CALL_OPTIONS.find((option) => option.value === selectedBlitzCallId) ?? BLITZ_CALL_OPTIONS[0]
  ), [selectedBlitzCallId]);
  const selectedStructuredBlitzBoard = useMemo(() => (
    blitzSavedBoards.find((board) => (
      board.frontMode === selectedBlitzFrontMode
      && board.callId === selectedBlitzCallId
      && board.baseBoardId === selectedBlitzBaseBoardId
      && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
    ))
  ), [blitzSavedBoards, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BLITZ_BOARDS_STORAGE_KEY);
      if (!raw) {
        setBlitzTitle(blitzPreview.title);
        setBlitzRouteOverlays(blitzPreview.routeOverlays);
        setBlitzFieldTags(blitzPreview.fieldTags);
        setBlitzBoardsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        selectedBaseBoardId?: BlitzBaseBoardId;
        selectedFrontMode?: FrontMode;
        selectedBoardSpot?: BlitzBoardSpot;
        selectedCallId?: BlitzCallId;
        working?: { title?: string; routeOverlays?: RouteOverlay[]; fieldTags?: FieldTag[] };
        boards?: BlitzSavedBoard[];
      };

      const savedBaseId = BLITZ_BASE_BOARD_OPTIONS.some((option) => option.value === parsed.selectedBaseBoardId)
        ? parsed.selectedBaseBoardId as BlitzBaseBoardId
        : "double";
      const savedFrontMode: FrontMode = parsed.selectedFrontMode === "4-3" ? "4-3" : "4-4";
      const savedBoardSpot: BlitzBoardSpot = parsed.selectedBoardSpot === "hash" ? "hash" : "mof";
      const savedCallId: BlitzCallId = BLITZ_CALL_OPTIONS.some((option) => option.value === parsed.selectedCallId)
        ? parsed.selectedCallId as BlitzCallId
        : "newton";
      setSelectedBlitzBaseBoardId(savedBaseId);
      setSelectedBlitzFrontMode(savedFrontMode);
      setSelectedBlitzBoardSpot(savedBoardSpot);
      setSelectedBlitzCallId(savedCallId);
      setSelectedBlitzCallFamilyId(getBlitzCallFamilyId(savedCallId));
      setSelectedBlitzCallType(getBlitzCallType(savedCallId));
      const savedPreview = buildBlitzBoardShell(savedBaseId, savedFrontMode, savedBoardSpot, blitzRendererDeps);
      setBlitzTitle(parsed.working?.title || savedPreview.title);
      setBlitzRouteOverlays(parsed.working?.routeOverlays || savedPreview.routeOverlays);
      setBlitzFieldTags(parsed.working?.fieldTags || savedPreview.fieldTags);
      setBlitzSavedBoards(Array.isArray(parsed.boards) ? parsed.boards : []);
      setBlitzBoardsHydrated(true);
    } catch {
      setBlitzTitle(blitzPreview.title);
      setBlitzRouteOverlays(blitzPreview.routeOverlays);
      setBlitzFieldTags(blitzPreview.fieldTags);
      setBlitzBoardsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!blitzBoardsHydrated) return;
    try {
      window.localStorage.setItem(
        BLITZ_BOARDS_STORAGE_KEY,
        JSON.stringify({
          selectedBaseBoardId: selectedBlitzBaseBoardId,
          selectedFrontMode: selectedBlitzFrontMode,
          selectedBoardSpot: selectedBlitzBoardSpot,
          selectedCallId: selectedBlitzCallId,
          working: {
            title: blitzTitle,
            routeOverlays: blitzRouteOverlays,
            fieldTags: blitzFieldTags,
          },
          boards: blitzSavedBoards,
        }),
      );
    } catch {}
  }, [blitzBoardsHydrated, blitzFieldTags, blitzRouteOverlays, blitzSavedBoards, blitzTitle, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);

  const loadBlitzStructuredSelection = ({
    familyId = selectedBlitzCallFamilyId,
    callType = selectedBlitzCallType,
    baseBoardId = selectedBlitzBaseBoardId,
    frontMode = selectedBlitzFrontMode,
    boardSpot = selectedBlitzBoardSpot,
  }: {
    familyId?: BlitzCallFamilyId;
    callType?: BlitzCallType;
    baseBoardId?: BlitzBaseBoardId;
    frontMode?: FrontMode;
    boardSpot?: BlitzBoardSpot;
  }) => {
    const nextCallId = getBlitzCallId(familyId, callType);
    const selectedBoard = blitzSavedBoards.find((board) => (
      board.frontMode === frontMode
      && board.callId === nextCallId
      && board.baseBoardId === baseBoardId
      && (board.boardSpot ?? "mof") === boardSpot
    ));

    setSelectedBlitzCallFamilyId(familyId);
    setSelectedBlitzCallType(callType);
    setSelectedBlitzCallId(nextCallId);
    setSelectedBlitzBaseBoardId(baseBoardId);
    setSelectedBlitzFrontMode(frontMode);
    setSelectedBlitzBoardSpot(boardSpot);

    if (selectedBoard) {
      setSelectedBlitzBoardId(selectedBoard.id);
      setBlitzTitle(selectedBoard.title);
      setBlitzRouteOverlays(selectedBoard.routeOverlays);
      setBlitzFieldTags(selectedBoard.fieldTags);
      setBlitzDraftPoints([]);
      setBlitzSaveNotice(`Loaded ${selectedBoard.title}.`);
      return;
    }

    const nextPreview = buildBlitzBoardShell(baseBoardId, frontMode, boardSpot, blitzRendererDeps);
    const routeOverlays = buildBlitzTemplateOverlays({
      callId: nextCallId,
      defensePlayers: nextPreview.defensePlayers,
      offensePlayers: nextPreview.offensePlayers,
      runStrength: nextPreview.runStrength,
      passStrength: nextPreview.passStrength,
      losY: nextPreview.losY,
      wingY: nextPreview.wingY,
      frontMode,
      boardSpot,
    });
    const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId)?.label ?? "Formation";
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === boardSpot)?.label ?? "MOF";
    const callLabel = getBlitzBoardCallLabel(nextCallId, frontMode);
    setSelectedBlitzBoardId("working");
    setBlitzTitle(`${callLabel} ${frontMode} ${spotLabel} vs ${boardLabel}`);
    setBlitzRouteOverlays(routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Generated ${callLabel} ${frontMode} ${spotLabel} vs ${boardLabel}. Save it if you want to keep edits.`);
  };

  const loadBlitzFrontMode = (nextFrontMode: FrontMode) => {
    loadBlitzStructuredSelection({ frontMode: nextFrontMode });
  };

  const handleBlitzFieldClick = (x: number, y: number) => {
    if (!isAdmin) return;

    if (blitzEditorTool === "tag") {
      const cleanLabel = blitzTagLabel.trim();
      if (!cleanLabel) return;
      setBlitzFieldTags((prev) => [
        ...prev,
        {
          id: `blitz-tag-${Date.now()}-${prev.length}`,
          label: cleanLabel,
          x,
          y,
          tone: blitzTagTone,
        },
      ]);
      setBlitzSaveNotice("Placed tag on the board.");
      return;
    }

    setBlitzDraftPoints((prev) => [...prev, { x, y }]);
    setBlitzSaveNotice(null);
  };

  const commitBlitzLine = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return;
    const cleanLabel = blitzLineLabel.trim();
    setBlitzRouteOverlays((prev) => [
      ...prev,
      {
        id: `blitz-line-${Date.now()}-${prev.length}`,
        label: cleanLabel,
        color: blitzRendererDeps.getRunFitArrowStroke(blitzLineColor),
        path: points,
        labelX: cleanLabel ? points[points.length - 1]?.x ?? 50 : undefined,
        labelY: cleanLabel ? (points[points.length - 1]?.y ?? 50) - 3 : undefined,
        endCap: blitzLineEnd,
      },
    ]);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice("Line added to the board.");
  };

  const finishBlitzLine = () => {
    commitBlitzLine(blitzDraftPoints);
  };

  const handleBlitzFieldDoubleClick = (x: number, y: number) => {
    if (!isAdmin || blitzEditorTool !== "arrow") return;
    commitBlitzLine([...blitzDraftPoints, { x, y }]);
  };

  const addBlitzPathway = () => {
    if (!isAdmin) return;
    const defender = blitzPreview.defensePlayers.find((player) => player.id === selectedBlitzPathwayDefenderId);
    if (!defender) {
      setBlitzSaveNotice("Choose a defender that exists on this board.");
      return;
    }

    const overlay = buildBlitzPathwayOverlay({
      defender,
      offensePlayers: blitzPreview.offensePlayers,
      pathwayId: selectedBlitzPathwayId,
      runStrength: blitzPreview.runStrength,
      passStrength: blitzPreview.passStrength,
      losY: blitzPreview.losY,
      wingY: blitzPreview.wingY,
      frontMode: selectedBlitzFrontMode,
    });
    setBlitzRouteOverlays((prev) => prev
      .filter((existing) => getBlitzPathwayMetaFromOverlay(existing as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0])?.defenderId !== defender.id)
      .concat(overlay));
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Added ${getBlitzPathwayLabel(selectedBlitzPathwayId)} for ${defender.id}.`);
  };

  const applyBlitzCallTemplate = () => {
    if (!isAdmin) return;
    const overlays = buildBlitzTemplateOverlays({
      callId: selectedBlitzCallId,
      defensePlayers: blitzPreview.defensePlayers,
      offensePlayers: blitzPreview.offensePlayers,
      runStrength: blitzPreview.runStrength,
      passStrength: blitzPreview.passStrength,
      losY: blitzPreview.losY,
      wingY: blitzPreview.wingY,
      frontMode: selectedBlitzFrontMode,
      boardSpot: selectedBlitzBoardSpot,
    });
    const templateDefenderIds = new Set(overlays.map((overlay) => overlay.pathway?.defenderId).filter(Boolean));

    setBlitzRouteOverlays((prev) => [
      ...prev.filter((existing) => {
        const meta = getBlitzPathwayMetaFromOverlay(existing as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0]);
        return !meta || !templateDefenderIds.has(meta.defenderId);
      }),
      ...overlays,
    ]);
    setBlitzDraftPoints([]);
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === selectedBlitzBoardSpot)?.label ?? "MOF";
    const callLabel = getBlitzBoardCallLabel(selectedBlitzCallId, selectedBlitzFrontMode);
    setBlitzTitle(`${callLabel} ${selectedBlitzFrontMode} ${spotLabel} vs ${BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedBlitzBaseBoardId)?.label ?? "Formation"}`);
    setBlitzSaveNotice(`Applied ${callLabel} template.`);
  };

  const buildSavedBlitzBoard = (callId: BlitzCallId, boardOption: typeof BLITZ_BASE_BOARD_OPTIONS[number], index: number): BlitzSavedBoard => {
    const callLabel = getBlitzBoardCallLabel(callId, selectedBlitzFrontMode);
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === selectedBlitzBoardSpot)?.label ?? "MOF";
    const preview = buildBlitzBoardShell(boardOption.value, selectedBlitzFrontMode, selectedBlitzBoardSpot, blitzRendererDeps);
    const routeOverlays = buildBlitzTemplateOverlays({
      callId,
      defensePlayers: preview.defensePlayers,
      offensePlayers: preview.offensePlayers,
      runStrength: preview.runStrength,
      passStrength: preview.passStrength,
      losY: preview.losY,
      wingY: preview.wingY,
      frontMode: selectedBlitzFrontMode,
      boardSpot: selectedBlitzBoardSpot,
    });

    return {
      id: `blitz-${callId}-${selectedBlitzFrontMode}-${selectedBlitzBoardSpot}-${boardOption.value}-${Date.now()}-${index}`,
      title: `${callLabel} ${selectedBlitzFrontMode} ${spotLabel} vs ${boardOption.label}`,
      baseBoardId: boardOption.value,
      frontMode: selectedBlitzFrontMode,
      callId,
      boardSpot: selectedBlitzBoardSpot,
      routeOverlays,
      fieldTags: preview.fieldTags,
    };
  };

  const applyBlitzCallTemplateToAllBoards = () => {
    if (!isAdmin) return;
    const callLabel = getBlitzCallLabel(selectedBlitzCallId);
    const stampedBoards = BLITZ_BASE_BOARD_OPTIONS.map((boardOption, index) => (
      buildSavedBlitzBoard(selectedBlitzCallId, boardOption, index)
    ));

    const firstBoard = stampedBoards[0];
    setBlitzSavedBoards((prev) => [
      ...prev.filter((board) => !(
        board.callId === selectedBlitzCallId
        && board.frontMode === selectedBlitzFrontMode
        && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
      )),
      ...stampedBoards,
    ]);
    setSelectedBlitzBoardId(firstBoard.id);
    setSelectedBlitzBaseBoardId(firstBoard.baseBoardId);
    setSelectedBlitzBoardSpot(firstBoard.boardSpot ?? "mof");
    setBlitzTitle(firstBoard.title);
    setBlitzRouteOverlays(firstBoard.routeOverlays);
    setBlitzFieldTags(firstBoard.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Applied ${callLabel} to all ${selectedBlitzFrontMode} base boards.`);
  };

  const applyEveryBlitzTemplateToAllBoards = () => {
    if (!isAdmin) return;
    const stampedBoards = BLITZ_CALL_OPTIONS.flatMap((callOption, callIndex) => (
      BLITZ_BASE_BOARD_OPTIONS.map((boardOption, boardIndex) => (
        buildSavedBlitzBoard(callOption.value, boardOption, callIndex * BLITZ_BASE_BOARD_OPTIONS.length + boardIndex)
      ))
    ));

    const activeBoard = stampedBoards.find((board) => (
      board.callId === selectedBlitzCallId
      && board.baseBoardId === selectedBlitzBaseBoardId
      && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
    )) ?? stampedBoards[0];
    setBlitzSavedBoards((prev) => [
      ...prev.filter((board) => !(
        board.frontMode === selectedBlitzFrontMode
        && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
      )),
      ...stampedBoards,
    ]);
    setSelectedBlitzBoardId(activeBoard.id);
    setSelectedBlitzBaseBoardId(activeBoard.baseBoardId);
    setSelectedBlitzBoardSpot(activeBoard.boardSpot ?? "mof");
    setBlitzTitle(activeBoard.title);
    setBlitzRouteOverlays(activeBoard.routeOverlays);
    setBlitzFieldTags(activeBoard.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Applied all loaded blitzes to all ${selectedBlitzFrontMode} base boards.`);
  };

  const saveBlitzBoard = () => {
    const cleanTitle = blitzTitle.trim() || "Untitled Blitz";
    if (selectedBlitzBoardId !== "working") {
      setBlitzSavedBoards((prev) => prev.map((board) => (
        board.id === selectedBlitzBoardId
          ? { ...board, title: cleanTitle, baseBoardId: selectedBlitzBaseBoardId, frontMode: selectedBlitzFrontMode, callId: selectedBlitzCallId, boardSpot: selectedBlitzBoardSpot, routeOverlays: blitzRouteOverlays, fieldTags: blitzFieldTags }
          : board
      )));
      setBlitzSaveNotice(`Updated ${cleanTitle}.`);
      return;
    }

    const nextBoard: BlitzSavedBoard = {
      id: `blitz-${Date.now()}`,
      title: cleanTitle,
      baseBoardId: selectedBlitzBaseBoardId,
      frontMode: selectedBlitzFrontMode,
      callId: selectedBlitzCallId,
      boardSpot: selectedBlitzBoardSpot,
      routeOverlays: blitzRouteOverlays,
      fieldTags: blitzFieldTags,
    };
    setBlitzSavedBoards((prev) => [...prev, nextBoard]);
    setSelectedBlitzBoardId(nextBoard.id);
    setBlitzSaveNotice(`Saved ${cleanTitle}.`);
  };

  const deleteBlitzBoard = () => {
    if (selectedBlitzBoardId === "working") return;
    const deletedBoard = blitzSavedBoards.find((board) => board.id === selectedBlitzBoardId);
    setBlitzSavedBoards((prev) => prev.filter((board) => board.id !== selectedBlitzBoardId));
    const nextPreview = buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot, blitzRendererDeps);
    setSelectedBlitzBoardId("working");
    setBlitzTitle(nextPreview.title);
    setBlitzRouteOverlays(nextPreview.routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(deletedBoard ? `Deleted ${deletedBoard.title}.` : "Deleted saved board.");
  };

  const resetBlitzSample = () => {
    const nextPreview = buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot, blitzRendererDeps);
    setSelectedBlitzBoardId("working");
    setBlitzTitle(nextPreview.title);
    setBlitzRouteOverlays(nextPreview.routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice("Reset to the selected blitz board.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Blitz Mode</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{blitzTitle}</div>
            <div className="mt-1 text-sm text-slate-600">
              Pick a formation, defensive shell, and blitz call, then stamp premade pathways to build the answer key.
            </div>
          </div>
          <TrainingFieldComponent
            offensePlayers={blitzPreview.offensePlayers}
            defensePlayers={blitzPreview.defensePlayers}
            routeOverlays={blitzDisplayOverlays}
            routeOverlaysOnTop
            fieldTags={blitzFieldTags}
            enhancedLandmarks
            wideFieldMarks
            fieldHashXs={blitzPreview.hashXs}
            losReferenceY={blitzPreview.losY}
          />
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defense</div>
          <Select value={selectedBlitzFrontMode} onValueChange={(value: FrontMode) => loadBlitzFrontMode(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4-4">4-4</SelectItem>
              <SelectItem value="4-3">4-3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Spot</div>
          <Select value={selectedBlitzBoardSpot} onValueChange={(value: BlitzBoardSpot) => loadBlitzStructuredSelection({ boardSpot: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BLITZ_BOARD_SPOT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Blitz Boards</div>
          <div className="grid gap-2">
            <Select value={selectedBlitzCallFamilyId} onValueChange={(value: BlitzCallFamilyId) => loadBlitzStructuredSelection({ familyId: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                {BLITZ_CALL_FAMILY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBlitzCallType} onValueChange={(value: BlitzCallType) => loadBlitzStructuredSelection({ callType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(BLITZ_CALL_MATRIX[selectedBlitzCallFamilyId]) as [BlitzCallType, BlitzCallId][]).map(([callType, callId]) => (
                  <SelectItem key={callType} value={callType}>
                    {getBlitzCallLabel(callId)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBlitzBaseBoardId} onValueChange={(value: BlitzBaseBoardId) => loadBlitzStructuredSelection({ baseBoardId: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                {(["2x2", "3x1"] as const).map((structure) => (
                  <SelectGroup key={structure}>
                    <SelectLabel>{structure}</SelectLabel>
                    {BLITZ_BASE_BOARD_OPTIONS
                      .filter((option) => BLITZ_BOARD_STRUCTURE[option.value] === structure)
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-lg border bg-white p-2 text-xs leading-5 text-slate-600">
              {selectedStructuredBlitzBoard ? `Loaded: ${selectedStructuredBlitzBoard.title}` : "No saved board yet for this family / type / formation."}
            </div>
          </div>
        </div>
        {isAdmin ? (
          <>
            <Button
              variant={showBlitzAdminTools ? "default" : "outline"}
              className="w-full rounded-xl"
              onClick={() => setShowBlitzAdminTools((prev) => !prev)}
            >
              {showBlitzAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
            </Button>
            {showBlitzAdminTools ? (
              <>
                <div className="rounded-xl border bg-slate-50 p-3">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Title</div>
                  <Input value={blitzTitle} onChange={(e) => setBlitzTitle(e.target.value)} />
                </div>
                <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Blitz Call Template</div>
                    <div className="text-xs leading-5 text-amber-950/80">
                      Apply the full call, then tweak individual defenders below if needed.
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={selectedBlitzCallFamilyId} onValueChange={(value: BlitzCallFamilyId) => loadBlitzStructuredSelection({ familyId: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        {BLITZ_CALL_FAMILY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedBlitzCallType} onValueChange={(value: BlitzCallType) => loadBlitzStructuredSelection({ callType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(BLITZ_CALL_MATRIX[selectedBlitzCallFamilyId]) as [BlitzCallType, BlitzCallId][]).map(([callType, callId]) => (
                          <SelectItem key={callType} value={callType}>
                            {getBlitzCallLabel(callId)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-amber-200 bg-white/70 p-2 text-xs leading-5 text-amber-950">
                    <div className="font-semibold">{selectedBlitzCallOption.family} • {BLITZ_CALL_TYPE_LABELS[selectedBlitzCallType]}</div>
                    <div>{selectedBlitzCallOption.detail}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400" onClick={applyBlitzCallTemplate}>
                      Apply Current
                    </Button>
                    <Button variant="outline" className="rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-amber-100" onClick={applyBlitzCallTemplateToAllBoards}>
                      Apply Call
                    </Button>
                    <Button variant="outline" className="rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-amber-100" onClick={applyEveryBlitzTemplateToAllBoards}>
                      Apply All
                    </Button>
                  </div>
                </div>
                <div className="space-y-3 rounded-xl border border-red-100 bg-red-50/60 p-3">
                  <div>
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">Premade Pathway</div>
                    <div className="text-xs leading-5 text-red-900/80">
                      Stamp a structured assignment onto the board. These are the first gradeable pathway building blocks.
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defender</div>
                      <Select value={selectedBlitzPathwayDefenderId} onValueChange={setSelectedBlitzPathwayDefenderId}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          {blitzPreview.defensePlayers.map((defender) => (
                            <SelectItem key={defender.id} value={defender.id}>
                              {defender.id}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pathway</div>
                      <Select value={selectedBlitzPathwayId} onValueChange={(value: BlitzPathwayId) => setSelectedBlitzPathwayId(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          {BLITZ_PATHWAY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700" onClick={addBlitzPathway}>
                    Add Pathway
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="rounded-xl" onClick={saveBlitzBoard}>
                    Save Board
                  </Button>
                  <Button variant="outline" className="rounded-xl" onClick={resetBlitzSample}>
                    Reset Board
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setBlitzRouteOverlays((prev) => prev.slice(0, -1))}
                    disabled={!blitzRouteOverlays.length}
                  >
                    Undo Line
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                    onClick={deleteBlitzBoard}
                    disabled={selectedBlitzBoardId === "working"}
                  >
                    Delete Board
                  </Button>
                </div>
              </>
            ) : null}
          </>
        ) : (
          <div className="rounded-xl border bg-slate-50 p-3 text-sm leading-6 text-slate-700">
            Blitz Mode will let players study each defender&apos;s assignment once the answer keys are built.
          </div>
        )}
        {blitzSaveNotice ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
            {blitzSaveNotice}
          </div>
        ) : null}
      </div>
    </div>
  );
}
