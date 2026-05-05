"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";
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
  getBlitzBoundarySide,
  getBlitzDlMovementLabel,
  getBlitzPathwayLabel,
  getBlitzPathwayMetaFromOverlay,
  getBlitzOriginX,
  type BlitzBaseBoardId,
  type BlitzBoardSpot,
  type BlitzCallFamilyId,
  type BlitzCallId,
  type BlitzCallType,
  type BlitzPathwayLayer,
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
type BlitzViewMode = "study" | "quiz";
type BlitzQuizSubmode = "create";
type BlitzQuizAnswerLabel =
  | "Step"
  | "Gap"
  | "C-Read"
  | "Stick"
  | "COP"
  | "Drop Hook"
  | "Drop C/F"
  | "Str Hook"
  | "Wk Hook"
  | "3 Up"
  | "Str C/F"
  | "Wk C/F"
  | "Hole"
  | "Wall Flat Str"
  | "Wall Flat Wk"
  | "Edge Blitz"
  | "A Gap Blitz"
  | "B Gap Blitz"
  | "C-Read Blitz"
  | "Deep Third Str"
  | "Deep Third Wk"
  | "MOF"
  | "Deep Half Str"
  | "Deep Half Wk"
  | "Tampa Pole"
  | "Eyes"
  | "Str Eyes"
  | "Wk Eyes"
  | "Eyes 1/3"
  | "Eyes MOF"
  | "Match 1/3"
  | "Deep 1/3"
  | "MCD";

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
    layer?: BlitzPathwayLayer;
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

type ScoreSummary = {
  awarded: number;
  total: number;
  blockedByReveal?: boolean;
  alreadyScored?: boolean;
};

type BlitzBoardProps = {
  isAdmin?: boolean;
  TrainingFieldComponent: React.ComponentType<any>;
  blitzRendererDeps: BlitzRendererDeps;
  scoreBlitzAttempt?: (accuracy: number, isCorrect: boolean, attemptKey: string) => void;
  markBlitzAttemptRevealed?: (attemptKey: string) => void;
  lastBlitzScoreSummary?: ScoreSummary;
  onBlitzRepAdvanced?: () => void;
};

const BLITZ_BOARDS_STORAGE_KEY = "formation-recognition-blitz-boards-v1";
const ADMIN_ONLY_BLITZ_FAMILIES = new Set<BlitzCallFamilyId>(["carr", "allen"]);
const BLITZ_QUIZ_DL_OPTIONS: BlitzQuizAnswerLabel[] = ["Step", "Gap", "C-Read", "Stick", "COP", "Drop Hook", "Drop C/F"];
const BLITZ_QUIZ_LB_OPTIONS: BlitzQuizAnswerLabel[] = ["Str Hook", "Wk Hook", "3 Up", "Str C/F", "Wk C/F", "Hole", "Wall Flat Str", "Wall Flat Wk", "Str Eyes", "Wk Eyes", "Edge Blitz", "A Gap Blitz", "B Gap Blitz", "C-Read Blitz"];
const BLITZ_QUIZ_DB_OPTIONS: BlitzQuizAnswerLabel[] = ["Str C/F", "Wk C/F", "MCD", "Wall Flat Str", "Wall Flat Wk", "Deep Third Str", "Deep Third Wk", "Match 1/3", "Deep 1/3", "MOF", "Deep Half Str", "Deep Half Wk", "Tampa Pole", "3 Up", "Eyes", "Str Eyes", "Wk Eyes", "Eyes 1/3", "Eyes MOF", "Edge Blitz", "B Gap Blitz"];

export function BlitzBoard({
  isAdmin = false,
  TrainingFieldComponent,
  blitzRendererDeps,
  scoreBlitzAttempt,
  markBlitzAttemptRevealed,
  lastBlitzScoreSummary,
  onBlitzRepAdvanced,
}: BlitzBoardProps) {
  const [blitzViewMode, setBlitzViewMode] = useState<BlitzViewMode>("study");
  const [blitzQuizSubmode] = useState<BlitzQuizSubmode>("create");
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
  const [selectedBlitzQuizDefenderId, setSelectedBlitzQuizDefenderId] = useState("M");
  const [blitzQuizAnswers, setBlitzQuizAnswers] = useState<Record<string, BlitzQuizAnswerLabel | "">>({});
  const [blitzQuizChecked, setBlitzQuizChecked] = useState(false);
  const publicRandomizedOnEntryRef = useRef(false);

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
  const answerKeyOverlays = useMemo(() => buildBlitzTemplateOverlays({
    callId: selectedBlitzCallId,
    baseBoardId: selectedBlitzBaseBoardId,
    defensePlayers: blitzPreview.defensePlayers,
    offensePlayers: blitzPreview.offensePlayers,
    runStrength: blitzPreview.runStrength,
    passStrength: blitzPreview.passStrength,
    losY: blitzPreview.losY,
    wingY: blitzPreview.wingY,
    frontMode: selectedBlitzFrontMode,
    boardSpot: selectedBlitzBoardSpot,
  }), [blitzPreview, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);
  const selectedBlitzCallOption = useMemo(() => (
    BLITZ_CALL_OPTIONS.find((option) => option.value === selectedBlitzCallId) ?? BLITZ_CALL_OPTIONS[0]
  ), [selectedBlitzCallId]);
  const visibleBlitzCallFamilyOptions = useMemo(() => (
    BLITZ_CALL_FAMILY_OPTIONS.filter((option) => isAdmin || !ADMIN_ONLY_BLITZ_FAMILIES.has(option.value))
  ), [isAdmin]);
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
    if (!isAdmin && ADMIN_ONLY_BLITZ_FAMILIES.has(familyId)) familyId = "newton";
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
      baseBoardId,
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

  const getBlitzQuizOptionsForDefender = (defenderId: string): BlitzQuizAnswerLabel[] => {
    if (["SDE", "WDE", "N", "T"].includes(defenderId)) return BLITZ_QUIZ_DL_OPTIONS;
    if (["M", "W"].includes(defenderId)) return BLITZ_QUIZ_LB_OPTIONS;
    return BLITZ_QUIZ_DB_OPTIONS;
  };

  const isBlitzQuizAnswerValidForDefender = (defenderId: string, answer: BlitzQuizAnswerLabel | "") => (
    Boolean(answer) && getBlitzQuizOptionsForDefender(defenderId).includes(answer as BlitzQuizAnswerLabel)
  );

  const getSidePathway = (strongPathway: BlitzPathwayId, weakPathway: BlitzPathwayId, side: "strong" | "weak") => (
    side === "strong" ? strongPathway : weakPathway
  );

  const getBlitzQuizPathwayForAnswer = (defender: { id: string; x: number }, answer: BlitzQuizAnswerLabel): BlitzPathwayId => {
    const originX = getBlitzOriginX(blitzPreview.offensePlayers);
    const defenderSide = defender.x < originX ? "left" : "right";
    const boundarySide = getBlitzBoundarySide(blitzPreview.offensePlayers);
    const fieldSide = boundarySide ? boundarySide === "left" ? "right" : "left" : null;
    const strongCoverageSide = fieldSide ?? blitzPreview.passStrength;
    const towardCenter = defenderSide === "left" ? "one_gap_slant_right" : "one_gap_slant_left";
    const awayFromCenter = defenderSide === "left" ? "one_gap_slant_left" : "one_gap_slant_right";
    const strongDeepThird = blitzPreview.passStrength === "left" ? "deep_third_left" : "deep_third_right";
    const weakDeepThird = blitzPreview.passStrength === "left" ? "deep_third_right" : "deep_third_left";
    const strongDeepHalf = blitzPreview.passStrength === "left" ? "deep_half_left" : "deep_half_right";
    const weakDeepHalf = blitzPreview.passStrength === "left" ? "deep_half_right" : "deep_half_left";
    const defenderDeepThird = defenderSide === "left" ? "deep_third_left" : "deep_third_right";
    const defenderMatchThird = defenderSide === "left" ? "match_third_left" : "match_third_right";
    const defenderDeepAreaThird = defenderSide === "left" ? "deep_area_third_left" : "deep_area_third_right";
    const edgeBlitzPathway = defender.id === "W" || defender.id === "BS" ? "weak_edge_pressure" : "edge_pressure";
    const dlMovementMapping = (): Partial<Record<BlitzQuizAnswerLabel, BlitzPathwayId>> => {
      if (defender.id === "N") {
        return {
          Step: awayFromCenter,
          "C-Read": towardCenter,
        };
      }
      if (defender.id === "T") {
        return {
          Step: towardCenter,
          Gap: awayFromCenter,
        };
      }
      if (defender.id === "SDE" || defender.id === "WDE") {
        return {
          Stick: towardCenter,
          COP: "cop_rush",
        };
      }
      return {};
    };
    const mapping: Partial<Record<BlitzQuizAnswerLabel, BlitzPathwayId>> = {
      ...dlMovementMapping(),
      COP: "cop_rush",
      "Drop Hook": "drop_hook",
      "Drop C/F": "drop_curl_flat",
      "Str Hook": "strong_hook",
      "Wk Hook": "weak_hook",
      "3 Up": "weak_hook",
      "Str C/F": "curl_flat",
      "Wk C/F": "weak_curl_flat",
      MCD: strongCoverageSide === defenderSide ? "mcd" : "weak_mcd",
      Hole: "hole",
      "Wall Flat Str": "wall_flat",
      "Wall Flat Wk": "weak_wall_flat",
      "Edge Blitz": edgeBlitzPathway,
      "A Gap Blitz": "a_gap_blitz",
      "B Gap Blitz": "b_gap_blitz",
      "C-Read Blitz": "c_read_blitz",
      "Deep Third Str": getSidePathway(strongDeepThird, weakDeepThird, "strong"),
      "Deep Third Wk": getSidePathway(strongDeepThird, weakDeepThird, "weak"),
      MOF: "mof",
      "Deep Half Str": getSidePathway(strongDeepHalf, weakDeepHalf, "strong"),
      "Deep Half Wk": getSidePathway(strongDeepHalf, weakDeepHalf, "weak"),
      "Tampa Pole": "tampa_pole",
      Eyes: "eyes",
      "Str Eyes": "strong_eyes",
      "Wk Eyes": "weak_eyes",
      "Eyes 1/3": defenderDeepThird,
      "Eyes MOF": "deep_third_middle",
      "Match 1/3": defenderMatchThird,
      "Deep 1/3": defenderDeepAreaThird,
    };
    return mapping[answer] ?? "strong_hook";
  };

  const getBlitzQuizAnswerLabel = (overlay: RouteOverlay): BlitzQuizAnswerLabel | "" => {
    const meta = getBlitzPathwayMetaFromOverlay(overlay as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0]);
    if (!meta) return "";
    const defender = blitzPreview.defensePlayers.find((player) => player.id === meta.defenderId);
    if (!defender) return "";

    if (meta.layer === "dl") {
      const dlLabel = getBlitzDlMovementLabel(defender, blitzPreview.offensePlayers, meta.pathwayId as BlitzPathwayId, meta.layer);
      if (dlLabel === "Step") return "Step";
      if (dlLabel === "Gap") return "Gap";
      if (dlLabel === "C-Read") return "C-Read";
      if (dlLabel === "Stick") return "Stick";
      if (dlLabel === "COP") return "COP";
    }

    if (meta.pathwayId === "drop_hook") return "Drop Hook";
    if (meta.pathwayId === "drop_curl_flat") return "Drop C/F";
    if (meta.pathwayId === "strong_hook") return "Str Hook";
    if (meta.pathwayId === "weak_hook") return overlay.label === "3 Up" ? "3 Up" : "Wk Hook";
    if (meta.pathwayId === "curl_flat") return "Str C/F";
    if (meta.pathwayId === "weak_curl_flat") return "Wk C/F";
    if (meta.pathwayId === "mcd" || meta.pathwayId === "weak_mcd") return "MCD";
    if (meta.pathwayId === "hole") return "Hole";
    if (meta.pathwayId === "wall_flat") return "Wall Flat Str";
    if (meta.pathwayId === "weak_wall_flat") return "Wall Flat Wk";
    if (meta.pathwayId === "edge_pressure" || meta.pathwayId === "strong_edge_pressure" || meta.pathwayId === "weak_edge_pressure") return "Edge Blitz";
    if (meta.pathwayId === "a_gap_blitz" || meta.pathwayId === "weak_a_gap_blitz") return "A Gap Blitz";
    if (meta.pathwayId === "b_gap_blitz" || meta.pathwayId === "boundary_b_gap_blitz" || meta.pathwayId === "field_b_gap_blitz") return "B Gap Blitz";
    if (meta.pathwayId === "c_read_blitz") return "C-Read Blitz";
    if (meta.pathwayId === "mof") return "MOF";
    if (meta.pathwayId === "deep_third_middle") return ["FS", "BS"].includes(meta.defenderId) ? "Eyes MOF" : "MOF";
    if (meta.pathwayId === "tampa_pole") return "Tampa Pole";
    if (meta.pathwayId === "eyes") return "Eyes";
    if (meta.pathwayId === "strong_eyes") return "Str Eyes";
    if (meta.pathwayId === "weak_eyes") return "Wk Eyes";
    if (meta.pathwayId === "match_third_left" || meta.pathwayId === "match_third_right") return "Match 1/3";
    if (meta.pathwayId === "deep_area_third_left" || meta.pathwayId === "deep_area_third_right") return "Deep 1/3";
    if (meta.pathwayId === "deep_third_left" || meta.pathwayId === "deep_third_right") {
      if (["FC", "BC"].includes(meta.defenderId)) return "Eyes 1/3";
      const isStrong = meta.pathwayId === (blitzPreview.passStrength === "left" ? "deep_third_left" : "deep_third_right");
      return isStrong ? "Deep Third Str" : "Deep Third Wk";
    }
    if (meta.pathwayId === "deep_half_left" || meta.pathwayId === "deep_half_right") {
      const isStrong = meta.pathwayId === (blitzPreview.passStrength === "left" ? "deep_half_left" : "deep_half_right");
      return isStrong ? "Deep Half Str" : "Deep Half Wk";
    }
    if (meta.pathwayId === "cop_rush") return "COP";
    return "";
  };

  const blitzQuizAnswerKey = useMemo(() => {
    const entries = answerKeyOverlays.flatMap((overlay) => {
      const meta = getBlitzPathwayMetaFromOverlay(overlay as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0]);
      const label = getBlitzQuizAnswerLabel(overlay as RouteOverlay);
      return meta && label ? [[meta.defenderId, label] as const] : [];
    });
    return Object.fromEntries(entries) as Record<string, BlitzQuizAnswerLabel>;
  }, [answerKeyOverlays, blitzPreview.defensePlayers, blitzPreview.offensePlayers, blitzPreview.passStrength]);

  const blitzQuizPreviewOverlays = useMemo(() => (
    Object.entries(blitzQuizAnswers).flatMap(([defenderId, answer]) => {
      if (!isBlitzQuizAnswerValidForDefender(defenderId, answer)) return [];
      const validAnswer = answer as BlitzQuizAnswerLabel;
      const defender = blitzPreview.defensePlayers.find((player) => player.id === defenderId);
      if (!defender) return [];
      return buildBlitzPathwayOverlay({
        id: `blitz-quiz-preview-${defenderId}`,
        defender,
        offensePlayers: blitzPreview.offensePlayers,
        defensePlayers: blitzPreview.defensePlayers,
        pathwayId: getBlitzQuizPathwayForAnswer(defender, validAnswer),
        runStrength: blitzPreview.runStrength,
        passStrength: blitzPreview.passStrength,
        losY: blitzPreview.losY,
        wingY: blitzPreview.wingY,
        frontMode: selectedBlitzFrontMode,
        layer: ["SDE", "WDE", "N", "T"].includes(defenderId) && ["Step", "Gap", "C-Read", "Stick", "COP"].includes(validAnswer) ? "dl" : ["Edge Blitz", "A Gap Blitz", "B Gap Blitz", "C-Read Blitz"].includes(validAnswer) ? "pressure" : "coverage",
      }) as RouteOverlay;
    })
  ), [blitzPreview, blitzQuizAnswers, selectedBlitzFrontMode]);

  const blitzQuizWrongOverlays = useMemo(() => {
    if (!blitzQuizChecked) return [];
    return answerKeyOverlays.filter((overlay) => {
      const meta = getBlitzPathwayMetaFromOverlay(overlay as Parameters<typeof getBlitzPathwayMetaFromOverlay>[0]);
      if (!meta) return false;
      return blitzQuizAnswers[meta.defenderId] !== blitzQuizAnswerKey[meta.defenderId];
    }) as RouteOverlay[];
  }, [answerKeyOverlays, blitzQuizAnswerKey, blitzQuizAnswers, blitzQuizChecked]);

  const blitzQuizDisplayOverlays = useMemo(() => (
    blitzViewMode === "quiz" ? [...blitzQuizPreviewOverlays, ...blitzQuizWrongOverlays] : blitzDisplayOverlays
  ), [blitzDisplayOverlays, blitzQuizPreviewOverlays, blitzQuizWrongOverlays, blitzViewMode]);

  const blitzQuizDefenderIds = useMemo(() => (
    blitzPreview.defensePlayers.map((player) => player.id)
  ), [blitzPreview.defensePlayers]);

  const blitzQuizCorrectCount = useMemo(() => (
    blitzQuizDefenderIds.filter((id) => blitzQuizAnswers[id] && blitzQuizAnswers[id] === blitzQuizAnswerKey[id]).length
  ), [blitzQuizAnswerKey, blitzQuizAnswers, blitzQuizDefenderIds]);
  const blitzQuizIsCorrect = blitzQuizDefenderIds.length > 0 && blitzQuizCorrectCount === blitzQuizDefenderIds.length;

  const blitzQuizAssignedCount = useMemo(() => (
    blitzQuizDefenderIds.filter((id) => Boolean(blitzQuizAnswers[id])).length
  ), [blitzQuizAnswers, blitzQuizDefenderIds]);
  const allBlitzQuizAssigned = blitzQuizDefenderIds.length > 0 && blitzQuizAssignedCount === blitzQuizDefenderIds.length;
  const selectedBlitzQuizDefender = blitzPreview.defensePlayers.find((player) => player.id === selectedBlitzQuizDefenderId) ?? blitzPreview.defensePlayers[0];
  const selectedBlitzQuizAnswer =
    selectedBlitzQuizDefender && isBlitzQuizAnswerValidForDefender(selectedBlitzQuizDefender.id, blitzQuizAnswers[selectedBlitzQuizDefender.id] || "")
      ? blitzQuizAnswers[selectedBlitzQuizDefender.id]
      : "unassigned";
  const incorrectBlitzQuizDefenderIds = useMemo(() => (
    blitzQuizChecked
      ? blitzQuizDefenderIds.filter((id) => blitzQuizAnswers[id] !== blitzQuizAnswerKey[id])
      : []
  ), [blitzQuizAnswerKey, blitzQuizAnswers, blitzQuizChecked, blitzQuizDefenderIds]);

  const resetBlitzQuiz = (nextSelectedId = selectedBlitzQuizDefenderId) => {
    setBlitzQuizAnswers({});
    setBlitzQuizChecked(false);
    setSelectedBlitzQuizDefenderId(nextSelectedId);
  };

  const getBlitzQuizAttemptKey = () => (
    `blitz::${selectedBlitzFrontMode}::${selectedBlitzBoardSpot}::${selectedBlitzCallId}::${selectedBlitzBaseBoardId}`
  );

  const checkBlitzQuizAnswers = () => {
    if (!allBlitzQuizAssigned) return;
    setBlitzQuizChecked(true);
    scoreBlitzAttempt?.(
      blitzQuizCorrectCount / Math.max(1, blitzQuizDefenderIds.length),
      blitzQuizIsCorrect,
      getBlitzQuizAttemptKey(),
    );
  };

  const revealBlitzQuizAnswers = () => {
    markBlitzAttemptRevealed?.(getBlitzQuizAttemptKey());
    setBlitzQuizAnswers(blitzQuizAnswerKey);
    setBlitzQuizChecked(true);
  };

  const randomizeBlitzQuizRep = () => {
    onBlitzRepAdvanced?.();
    const firstDefenderId = blitzPreview.defensePlayers[0]?.id ?? "M";
    resetBlitzQuiz(firstDefenderId);
    randomizePublicBlitzRep();
  };

  const randomizePublicBlitzRep = () => {
    const pickRandom = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];
    const familyOption = pickRandom(visibleBlitzCallFamilyOptions);
    const familyId = familyOption?.value ?? "newton";
    const callTypes = Object.keys(BLITZ_CALL_MATRIX[familyId]) as BlitzCallType[];
    loadBlitzStructuredSelection({
      familyId,
      callType: pickRandom(callTypes) ?? "last_name",
      baseBoardId: pickRandom(BLITZ_BASE_BOARD_OPTIONS)?.value ?? "double",
      frontMode: pickRandom(["4-4", "4-3"] as FrontMode[]) ?? "4-4",
      boardSpot: pickRandom(BLITZ_BOARD_SPOT_OPTIONS)?.value ?? "mof",
    });
  };

  const assignBlitzQuizAnswer = (defenderId: string, answer: BlitzQuizAnswerLabel) => {
    if (!isBlitzQuizAnswerValidForDefender(defenderId, answer)) return;
    setBlitzQuizAnswers((prev) => ({ ...prev, [defenderId]: answer }));
    setBlitzQuizChecked(false);
  };

  useEffect(() => {
    if (!blitzQuizDefenderIds.length) return;
    if (!blitzQuizDefenderIds.includes(selectedBlitzQuizDefenderId)) {
      setSelectedBlitzQuizDefenderId(blitzQuizDefenderIds[0]);
    }
  }, [blitzQuizDefenderIds, selectedBlitzQuizDefenderId]);

  useEffect(() => {
    setBlitzQuizAnswers({});
    setBlitzQuizChecked(false);
  }, [selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);

  useEffect(() => {
    if (!blitzBoardsHydrated || blitzViewMode !== "quiz") return;
    randomizeBlitzQuizRep();
  }, [blitzBoardsHydrated, blitzViewMode]);

  useEffect(() => {
    if (!blitzBoardsHydrated || isAdmin || !ADMIN_ONLY_BLITZ_FAMILIES.has(selectedBlitzCallFamilyId)) return;
    loadBlitzStructuredSelection({ familyId: "newton" });
  }, [blitzBoardsHydrated, isAdmin, selectedBlitzCallFamilyId]);

  useEffect(() => {
    if (!blitzBoardsHydrated || isAdmin || publicRandomizedOnEntryRef.current) return;
    publicRandomizedOnEntryRef.current = true;
    randomizePublicBlitzRep();
  }, [blitzBoardsHydrated, isAdmin]);

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
      defensePlayers: blitzPreview.defensePlayers,
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
      baseBoardId: selectedBlitzBaseBoardId,
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
      baseBoardId: boardOption.value,
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
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {blitzViewMode === "quiz" ? `${getBlitzBoardCallLabel(selectedBlitzCallId, selectedBlitzFrontMode)} vs ${BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedBlitzBaseBoardId)?.label ?? "Formation"}` : blitzTitle}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {blitzViewMode === "quiz"
                ? "Click each defender, choose his assignment, then check the blitz."
                : "Pick a formation, defensive shell, and blitz call, then study the answer key."}
            </div>
          </div>
          <TrainingFieldComponent
            offensePlayers={blitzPreview.offensePlayers}
            defensePlayers={blitzPreview.defensePlayers}
            routeOverlays={blitzQuizDisplayOverlays}
            routeOverlaysOnTop
            fieldTags={blitzFieldTags}
            enhancedLandmarks
            wideFieldMarks
            fieldHashXs={blitzPreview.hashXs}
            losReferenceY={blitzPreview.losY}
            incorrectDefenseIds={incorrectBlitzQuizDefenderIds}
            onDefenseClick={blitzViewMode === "quiz" ? setSelectedBlitzQuizDefenderId : undefined}
          />
        </div>
      </div>
      <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={blitzViewMode === "study" ? "default" : "outline"}
            className="rounded-xl"
            onClick={() => setBlitzViewMode("study")}
          >
            Study
          </Button>
          <Button
            variant={blitzViewMode === "quiz" ? "default" : "outline"}
            className="rounded-xl"
            onClick={() => setBlitzViewMode("quiz")}
          >
            Quiz
          </Button>
        </div>
        {blitzViewMode === "quiz" ? (
          <>
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {blitzQuizSubmode === "create" ? "Create the Blitz" : "Quiz"}
              </div>
              <div className="text-lg font-bold text-slate-900">{getBlitzBoardCallLabel(selectedBlitzCallId, selectedBlitzFrontMode)}</div>
              <div className="mt-1 text-xs text-slate-500">
                {selectedBlitzFrontMode} {selectedBlitzBoardSpot.toUpperCase()} vs {BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedBlitzBaseBoardId)?.label ?? "Formation"}
              </div>
            </div>
            <div className="rounded-xl border bg-white p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defender</div>
              <Select value={selectedBlitzQuizDefender?.id ?? "M"} onValueChange={setSelectedBlitzQuizDefenderId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  {blitzPreview.defensePlayers.map((defender) => (
                    <SelectItem key={defender.id} value={defender.id}>
                      {defender.id}{blitzQuizAnswers[defender.id] ? ` - ${blitzQuizAnswers[defender.id]}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBlitzQuizDefender ? (
              <div className="rounded-xl border bg-white p-3">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Assignment</div>
                <Select
                  value={selectedBlitzQuizAnswer}
                  onValueChange={(value) => {
                    if (value === "unassigned") return;
                    assignBlitzQuizAnswer(selectedBlitzQuizDefender.id, value as BlitzQuizAnswerLabel);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    <SelectItem value="unassigned">Choose pathway</SelectItem>
                    {getBlitzQuizOptionsForDefender(selectedBlitzQuizDefender.id).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            <div className="grid grid-cols-3 gap-2">
              {blitzPreview.defensePlayers.map((defender) => {
                const isWrong = blitzQuizChecked && blitzQuizAnswers[defender.id] !== blitzQuizAnswerKey[defender.id];
                const isCorrect = blitzQuizChecked && blitzQuizAnswers[defender.id] === blitzQuizAnswerKey[defender.id];
                return (
                  <button
                    key={defender.id}
                    type="button"
                    onClick={() => setSelectedBlitzQuizDefenderId(defender.id)}
                    className={`rounded-xl border px-2 py-2 text-sm font-bold transition ${
                      selectedBlitzQuizDefenderId === defender.id
                        ? "border-slate-950 bg-slate-950 text-white"
                        : isCorrect
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : isWrong
                            ? "border-red-300 bg-red-50 text-red-800"
                            : blitzQuizAnswers[defender.id]
                              ? "border-sky-200 bg-sky-50 text-sky-800"
                              : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {defender.id}
                  </button>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                className="rounded-xl"
                disabled={!allBlitzQuizAssigned}
                onClick={checkBlitzQuizAnswers}
              >
                Check
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={blitzQuizChecked ? () => setBlitzQuizChecked(false) : revealBlitzQuizAnswers}
              >
                {blitzQuizChecked ? "Hide Answers" : "Show Answers"}
              </Button>
              <Button variant="outline" className="col-span-2 rounded-xl" onClick={randomizeBlitzQuizRep}>
                Random Rep
              </Button>
            </div>
            <div className="rounded-xl border border-dashed bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              {blitzQuizChecked ? (
                <div className="space-y-3">
                  <div className="font-bold text-slate-900">
                    Score: {blitzQuizCorrectCount}/{blitzQuizDefenderIds.length}
                  </div>
                  <div>Wrong defenders are highlighted in red. Correct answer pathways are shown on the board.</div>
                  {lastBlitzScoreSummary ? (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                      <span className="font-semibold">Points earned:</span> {lastBlitzScoreSummary.awarded}
                      <div>
                        <span className="font-semibold">Blitz total:</span> {lastBlitzScoreSummary.total}
                      </div>
                      {lastBlitzScoreSummary.blockedByReveal ? (
                        <div className="mt-2 font-semibold text-amber-800">No points awarded because answers were revealed first.</div>
                      ) : null}
                      {lastBlitzScoreSummary.alreadyScored ? (
                        <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                      ) : null}
                    </div>
                  ) : null}
                  {blitzQuizIsCorrect ? (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" /> Correct Blitz
                    </div>
                  ) : null}
                </div>
              ) : (
                <div>
                  Assigned {blitzQuizAssignedCount}/{blitzQuizDefenderIds.length}. Click defender circles or use the defender menu.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
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
                    {visibleBlitzCallFamilyOptions.map((option) => (
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
                            {visibleBlitzCallFamilyOptions.map((option) => (
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
            ) : null}
            {isAdmin && blitzSaveNotice ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                {blitzSaveNotice}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
