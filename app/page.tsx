"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock3, Trophy, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { BlitzBoard } from "@/components/blitz/BlitzBoard";
import { FilmPlayer } from "@/components/film/FilmPlayer";
import { FormationBoard } from "@/components/formation/FormationBoard";
import { PassConceptBoard } from "@/components/passConcept/PassConceptBoard";
import { RunFitBoard } from "@/components/runFit/RunFitBoard";
import { StuntBoard } from "@/components/stunt/StuntBoard";
import { createClient } from "@/lib/supabase/client";
import { type BlitzBaseBoardId } from "@/lib/blitz/blitzLogic";
import { type BlitzRendererDeps } from "@/lib/blitz/blitzRenderer";
import {
  DEFAULT_FILM_CLIPS,
  DEFAULT_FILM_DRAFT,
  DEFAULT_FILM_EDIT_DRAFT,
  DEFAULT_FILM_QUIZ_ANSWERS,
  FILM_BUCKET,
  RESET_FILM_DRAFT_AFTER_SAVE,
  buildFilmClipFallbackInsertPayload,
  buildFilmClipFallbackUpdatePayload,
  buildFilmClipFromDraft,
  buildFilmClipGroups,
  buildFilmClipInsertPayload,
  buildFilmClipUpdatePayload,
  deriveFilmClipBucket,
  formatFileSize,
  getActiveFilmClips,
  getFilmDuplicateCandidate,
  getFilmEditDraftFromClip,
  getFilmFormationKeyOptions,
  getFilmQuizState,
  getFilmTeamTagOptions,
  getFilmTeamTagSelectOptions,
  getSafeFilmFormationFilter,
  getSafeFilmTeamFilter,
  getSelectedFilmClip,
  loadFilmClipsFromSupabase,
  loadStoredFilmClips,
  parseTrimSeconds,
  persistStoredFilmClips,
  slugifyFilePart,
  type FilmAdminPanelMode,
  type FilmClip,
  type FilmClipEditDraft,
  type FilmClipDraft,
  type FilmQuizAnswers,
  type FilmSaveStatus,
  type FilmSubmode,
  type FilmViewMode,
} from "@/lib/film/filmLogic";
import {
  THREE_BY_ONE_CONCEPTS,
  TWO_BY_TWO_CONCEPTS,
  buildPassConceptQuizRoutePreview,
  buildThreeByOnePassConceptPreview,
  buildTwoByTwoPassConceptPreview,
  getAvailablePassConceptNames,
  getPassConceptIdentifyResult,
  getPassConceptRouteResult,
  getPassConceptScore,
  type PassConceptBoardKind,
  type PassConceptFamilyFilter,
  type PassConceptPlayerId,
  type PassConceptQuizMode,
  type PassConceptViewMode,
  type YardReferenceLine,
} from "@/lib/passConcept/passConceptLogic";
import {
  RUN_FIT_BOARDS_STORAGE_KEY,
  buildRunFitDraftOverlay,
  buildRunFitPreview,
  createRunFitActions,
  getRunFitArrowStroke,
  parseRunFitStorage,
  stringifyRunFitStorage,
  type FieldTag,
  type RouteOverlay,
  type RunFitArrowColor,
  type RunFitEditorTool,
  type RunFitLineEnd,
  type RunFitLineStyle,
  type RunFitPathwayId,
  type RunFitSavedBoard,
  type RunFitSavedPathway,
} from "@/lib/runFit/runFitLogic";
import {
  getAlignmentAnswerKey,
  getAlignmentLandmarks,
  getCheckResult,
  getDefensePlayersFromAnswerKey,
  nearestLandmark,
} from "@/lib/alignment/alignmentLogic";
import {
  ALL_FORMATIONS,
  DEFENDER_TOKENS,
  DL_Y,
  FIELD_LABELS,
  FIXED_OL_IDS,
  LB_Y,
  LOS_Y,
  OFFENSE_TOKENS,
  PERSONNEL_OPTIONS,
  PLAYBOOK_OPTIONS,
  WING_Y,
  buildFoothillFormation,
  buildProFormation,
  buildWingTFormation,
  clamp,
  flipCallSide,
  getFormationLineXs,
  getHash,
  getLineXs,
  getOffenseAnswerKeyFromFormation,
  getOffenseBuildLandmarks,
} from "@/lib/formation/formationLogic";

type AppMode = "study" | "alignment" | "offense_build" | "film" | "quiz" | "editor" | "account" | "leaderboard" | "concept" | "run_fit" | "blitz" | "stunt";
type AppSection = "offense" | "defense" | "admin";
type ScoreMode = "quiz" | "offense_build" | "alignment" | "film" | "concept" | "blitz" | "stunt";
type LeaderboardMode = ScoreMode;
type LeaderboardSection = "offense" | "defense";
type AccountDirectorySort = "points_desc" | "points_asc" | "time_desc" | "time_asc" | "name_asc";
type FrontMode = "4-3" | "4-4";
type AlignmentViewMode = "study" | "quiz";
type OffenseBuildViewMode = "study" | "quiz";
type FormationTrainerViewMode = "study" | "quiz";
type Side = "left" | "right";
type PlaybookKey = "Foothill" | "Pro" | "Wing T";
type Family = "Spread" | "I" | "12p" | "Wing T";
type LandmarkLayer = "dl" | "lb" | "cb" | "db" | "offense";

type PlayerDot = {
  id: string;
  x: number;
  y: number;
};

type FormationMeta = {
  playbook: PlaybookKey;
  family: Family;
  name: string;
  personnel: string;
  runStrength: Side;
  passStrength: Side;
  backfield: string;
  players: PlayerDot[];
};

type QuizAnswers = {
  formation: string;
  runStrength: string;
  passStrength: string;
};

type Landmark = {
  id: string;
  x: number;
  y: number;
  label?: string;
  layer: LandmarkLayer;
};

type ModeScoreStats = {
  points: number;
  attempts: number;
  correct: number;
  bestTimeMs: number | null;
};

type UserStats = {
  totalPoints: number;
  secondsUsed: number;
  quiz: ModeScoreStats;
  offense_build: ModeScoreStats;
  alignment: ModeScoreStats;
  film: ModeScoreStats;
  concept: ModeScoreStats;
  blitz: ModeScoreStats;
  stunt: ModeScoreStats;
};

type UserRecord = {
  id: string;
  email: string;
  name: string;
  teamCode: string;
  isAdmin: boolean;
  avatarUrl?: string | null;
  stats: UserStats;
};

type LeaderboardEntry = {
  id: string;
  name: string;
  teamCode: string;
  avatarUrl?: string | null;
  email?: string | null;
  isAdmin?: boolean;
  stats: UserStats;
};

type ScoreSummary = {
  awarded: number;
  total: number;
  blockedByReveal?: boolean;
  alreadyScored?: boolean;
};

type CustomLandmarkDraft = {
  label: string;
  layer: "dl" | "lb" | "cb" | "db";
  side: Side;
  x: string;
  y: string;
};

const APP_SECTION_OPTIONS: { value: AppSection; label: string }[] = [
  { value: "offense", label: "Offense" },
  { value: "defense", label: "Defense" },
  { value: "admin", label: "Admin" },
];

const MODE_OPTIONS: { value: AppMode; label: string; title: string; section: AppSection; hiddenFromNav?: boolean }[] = [
  { value: "study", label: "Formation Trainer", title: "FORMATION TRAINER", section: "defense" },
  { value: "offense_build", label: "Formation Trainer", title: "OFFENSIVE FORMATION", section: "offense" },
  { value: "concept", label: "Pass Concept", title: "PASS CONCEPT MODE", section: "offense" },
  { value: "alignment", label: "Alignment Mode", title: "DEFENSIVE ALIGNMENT", section: "defense" },
  { value: "film", label: "Film Mode", title: "FILM MODE", section: "defense" },
  { value: "run_fit", label: "Run Fit", title: "RUN FIT MODE", section: "defense" },
  { value: "blitz", label: "Blitz Mode", title: "BLITZ MODE", section: "defense" },
  { value: "stunt", label: "Stunt Mode", title: "STUNT MODE", section: "defense" },
  { value: "editor", label: "Formation Editor", title: "FORMATION EDITOR", section: "admin" },
  { value: "account", label: "Account", title: "ACCOUNT", section: "admin", hiddenFromNav: true },
  { value: "leaderboard", label: "Leaderboard", title: "LEADERBOARD", section: "admin", hiddenFromNav: true },
];
const VIEW_STATE_STORAGE_KEY = "formation-recognition-view-state";
const DEMO_SESSION_STORAGE_KEY = "formation-recognition-demo-session";
const DEMO_USER_ID = "demo-user";
const AVATAR_BUCKET = "profile-pics";
const DEFAULT_MODE_STATS: ModeScoreStats = {
  points: 0,
  attempts: 0,
  correct: 0,
  bestTimeMs: null,
};

const DEFAULT_STATS: UserStats = {
  totalPoints: 0,
  secondsUsed: 0,
  quiz: { ...DEFAULT_MODE_STATS },
  offense_build: { ...DEFAULT_MODE_STATS },
  alignment: { ...DEFAULT_MODE_STATS },
  film: { ...DEFAULT_MODE_STATS },
  concept: { ...DEFAULT_MODE_STATS },
  blitz: { ...DEFAULT_MODE_STATS },
  stunt: { ...DEFAULT_MODE_STATS },
};

const ADMIN_EMAILS = [
  "nmendonca@pleasantonusd.net",
  "mendoncanick@gmail.com",
];
const DEMO_USER: UserRecord = {
  id: DEMO_USER_ID,
  email: "demo",
  name: "Demo",
  teamCode: "Foothill",
  isAdmin: false,
  avatarUrl: null,
  stats: {
    ...DEFAULT_STATS,
    quiz: { ...DEFAULT_MODE_STATS },
    offense_build: { ...DEFAULT_MODE_STATS },
    alignment: { ...DEFAULT_MODE_STATS },
    film: { ...DEFAULT_MODE_STATS },
    concept: { ...DEFAULT_MODE_STATS },
    blitz: { ...DEFAULT_MODE_STATS },
    stunt: { ...DEFAULT_MODE_STATS },
  },
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function normalizeStrength(value: string) {
  const v = normalize(value);
  if (v === "l") return "left";
  if (v === "r") return "right";
  return v;
}

function getQuizFormationFamily(name: string) {
  const isEmpty = name.includes("Empty");
  const base = name
    .split(" ")
    .filter((part) => !["Left", "Right", "King", "Queen", "Empty"].includes(part))
    .join(" ")
    .trim();
  return isEmpty ? `${base} Empty` : base;
}

function getModeTitle(mode: AppMode) {
  return MODE_OPTIONS.find((m) => m.value === mode)?.title ?? "FORMATION TRAINER";
}

function getSectionForMode(mode: AppMode): AppSection {
  return MODE_OPTIONS.find((m) => m.value === mode)?.section ?? "offense";
}

const blitzRendererDeps: BlitzRendererDeps = {
  LOS_Y,
  WING_Y,
  DL_Y,
  clamp,
  buildFoothillFormation,
  flipCallSide,
  getAlignmentLandmarks,
  getAlignmentAnswerKey,
  getDefensePlayersFromAnswerKey,
  getFormationLineXs,
  getRunFitArrowStroke,
};

function Circle({ player, color = "bg-orange-600", text = "text-white", border = "border-white/30", className = "" }: {
  player: PlayerDot;
  color?: string;
  text?: string;
  border?: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold shadow ${color} ${text} ${border} ${className}`}
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      {player.id}
    </div>
  );
}

function AvatarBadge({
  name,
  avatarUrl,
  className = "h-12 w-12",
  textClassName = "text-sm",
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  textClassName?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${name} avatar`}
        className={`rounded-full border border-slate-300 object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 font-black text-slate-700 ${className} ${textClassName}`}>
      {initials}
    </div>
  );
}

function TrainingField({
  enhancedLandmarks = false,
  offensePlayers,
  routeOverlays = [],
  routeOverlaysOnTop = false,
  compactAnnotations = false,
  fieldTags = [],
  onFieldClick,
  onFieldDoubleClick,
  yardReferenceLines = [],
  yardReferenceScale = 1.6,
  subtleHashMarks = false,
  wideFieldMarks = false,
  fieldHashXs,
  losReferenceY = LOS_Y,
  offenseLandmarks = [],
  defensePlayers = [],
  defenseLandmarks = [],
  offenseGhosts = [],
  defenseGhosts = [],
  editableDefenseGhosts = false,
  incorrectOffenseIds = [],
  incorrectDefenseIds = [],
  overlayLabel,
  flipOffense = false,
  flipHorizontalPerspective = false,
  editableOffense = false,
  editableDefense = false,
  offenseGhostOffset = 0,
  dimOffenseOnAnswers = false,
  lockedOffenseIds = FIXED_OL_IDS as unknown as string[],
  onMoveOffense,
  onMoveDefense,
  onMoveDefenseGhost,
  onDefenseClick,
  selectedRouteOverlayId,
  selectedFieldTagId,
  onRouteOverlayClick,
  onMoveRouteOverlay,
  onMoveRouteOverlayPoint,
  onFieldTagClick,
}: {
  enhancedLandmarks?: boolean;
  offensePlayers: PlayerDot[];
  routeOverlays?: RouteOverlay[];
  routeOverlaysOnTop?: boolean;
  compactAnnotations?: boolean;
  fieldTags?: FieldTag[];
  yardReferenceLines?: YardReferenceLine[];
  yardReferenceScale?: number;
  subtleHashMarks?: boolean;
  wideFieldMarks?: boolean;
  fieldHashXs?: number[];
  losReferenceY?: number;
  offenseLandmarks?: Landmark[];
  defensePlayers?: PlayerDot[];
  defenseLandmarks?: Landmark[];
  offenseGhosts?: PlayerDot[];
  defenseGhosts?: PlayerDot[];
  editableDefenseGhosts?: boolean;
  incorrectOffenseIds?: string[];
  incorrectDefenseIds?: string[];
  overlayLabel?: string;
  flipOffense?: boolean;
  flipHorizontalPerspective?: boolean;
  editableOffense?: boolean;
  editableDefense?: boolean;
  offenseGhostOffset?: number;
  dimOffenseOnAnswers?: boolean;
  lockedOffenseIds?: string[];
  onMoveOffense?: (id: string, x: number, y: number) => void;
  onMoveDefense?: (id: string, x: number, y: number) => void;
  onMoveDefenseGhost?: (id: string, x: number, y: number) => void;
  onDefenseClick?: (id: string) => void;
  onFieldClick?: (x: number, y: number) => void;
  onFieldDoubleClick?: (x: number, y: number) => void;
  selectedRouteOverlayId?: string | null;
  selectedFieldTagId?: string | null;
  onRouteOverlayClick?: (id: string) => void;
  onMoveRouteOverlay?: (id: string, dx: number, dy: number) => void;
  onMoveRouteOverlayPoint?: (id: string, pointIndex: number, x: number, y: number) => void;
  onFieldTagClick?: (id: string) => void;
}) {
  const [drag, setDrag] = useState<{ id: string; type: "offense" | "defense" | "defense_ghost" | "route_overlay" | "route_point"; pointIndex?: number; lastX?: number; lastY?: number } | null>(null);
  const maybeFlipX = (x: number, enabled: boolean) => (enabled ? 100 - x : x);
  const maybeFlipY = (y: number, enabled: boolean) => (enabled ? 100 - y : y);
  const fieldWide = editableDefense || wideFieldMarks;
  const hashXs = fieldHashXs ?? [getHash("left", fieldWide), getHash("right", fieldWide)];
  const losY = flipOffense ? 100 - losReferenceY : losReferenceY;
  const hashMarkRows = [13, 28, 43, 61, 76, 91];
  const sidelineInset = 1.5;
  const numberInset = 12;
  const annotationScale = compactAnnotations ? 0.72 : 1;
  const hasDraggableItems = editableOffense || editableDefense || editableDefenseGhosts || Boolean(onMoveRouteOverlay || onMoveRouteOverlayPoint);

  const getRawPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 2, 98);
    const rawY = clamp(((clientY - rect.top) / rect.height) * 100, 2, 98);
    return { x, rawY };
  };

  const getPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { x: rawX, rawY } = getRawPoint(e.clientX, e.clientY, rect);
    const shouldFlip = drag?.type === "offense" || drag?.type === "route_overlay" || drag?.type === "route_point";
    const x = shouldFlip && flipHorizontalPerspective ? 100 - rawX : rawX;
    const y = shouldFlip && flipOffense ? 100 - rawY : rawY;
    return { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    e.preventDefault();
    const { x, y } = getPointer(e);
    if (drag.type === "route_overlay" && onMoveRouteOverlay) {
      const dx = x - (drag.lastX ?? x);
      const dy = y - (drag.lastY ?? y);
      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) onMoveRouteOverlay(drag.id, dx, dy);
      setDrag((prev) => prev?.type === "route_overlay" ? { ...prev, lastX: x, lastY: y } : prev);
      return;
    }
    if (drag.type === "route_point" && onMoveRouteOverlayPoint && drag.pointIndex !== undefined) {
      onMoveRouteOverlayPoint(drag.id, drag.pointIndex, x, y);
      return;
    }
    if (drag.type === "offense" && onMoveOffense) onMoveOffense(drag.id, x, y);
    if (drag.type === "defense" && onMoveDefense) onMoveDefense(drag.id, x, y);
    if (drag.type === "defense_ghost" && onMoveDefenseGhost) onMoveDefenseGhost(drag.id, x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    e.preventDefault();
    const { x, y } = getPointer(e);
    if (drag.type === "offense" && onMoveOffense) {
      const snap = nearestLandmark(x, y, offenseLandmarks);
      onMoveOffense(drag.id, snap.x, snap.y);
    }
    if (drag.type === "defense" && onMoveDefense) {
      const snap = nearestLandmark(x, y, defenseLandmarks);
      onMoveDefense(drag.id, snap.x, snap.y);
    }
    if (drag.type === "defense_ghost" && onMoveDefenseGhost) {
      const snap = nearestLandmark(x, y, defenseLandmarks);
      onMoveDefenseGhost(drag.id, snap.x, snap.y);
    }
    setDrag(null);
  };

  const routeOverlayLayer = routeOverlays.length ? (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        {routeOverlays.map((route) => (
          <marker
            key={`marker-${route.id}`}
            id={`marker-${route.id}`}
            markerWidth={(route.endCap === "circle" ? 5 : route.endCap === "square" ? 4.8 : 5) * annotationScale}
            markerHeight={(route.endCap === "circle" ? 5 : route.endCap === "square" ? 4.8 : 5) * annotationScale}
            refX={(route.endCap === "circle" ? 2.5 : route.endCap === "square" ? 2.4 : 3.6) * annotationScale}
            refY={(route.endCap === "circle" ? 2.5 : route.endCap === "square" ? 2.4 : 2.5) * annotationScale}
            orient="auto"
          >
            {route.endCap === "circle" ? (
              <circle cx={2.5 * annotationScale} cy={2.5 * annotationScale} r={2 * annotationScale} fill={route.color} />
            ) : route.endCap === "square" ? (
              <rect x={0.6 * annotationScale} y={0.6 * annotationScale} width={3.6 * annotationScale} height={3.6 * annotationScale} rx={0.3 * annotationScale} fill={route.color} />
            ) : (
              <path d={`M0,0 L${5 * annotationScale},${2.5 * annotationScale} L0,${5 * annotationScale} z`} fill={route.color} />
            )}
          </marker>
        ))}
      </defs>
      {routeOverlays.map((route) => (
        <g key={route.id}>
          {selectedRouteOverlayId === route.id ? (
            <polyline
              points={route.path.map((point) => `${maybeFlipX(point.x, flipHorizontalPerspective)},${maybeFlipY(point.y, flipOffense)}`).join(" ")}
              fill="none"
              stroke="white"
              strokeWidth={((route.strokeWidth ?? 0.7) + 0.55) * annotationScale}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.45"
            />
          ) : null}
          <polyline
            points={route.path.map((point) => `${maybeFlipX(point.x, flipHorizontalPerspective)},${maybeFlipY(point.y, flipOffense)}`).join(" ")}
            fill="none"
            stroke={route.color}
            strokeWidth={(route.strokeWidth ?? 0.7) * annotationScale}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={route.dashed ? `${1.8 * annotationScale} ${1.4 * annotationScale}` : undefined}
            markerEnd={`url(#marker-${route.id})`}
            opacity="0.95"
          />
          <polyline
            points={route.path.map((point) => `${maybeFlipX(point.x, flipHorizontalPerspective)},${maybeFlipY(point.y, flipOffense)}`).join(" ")}
            fill="none"
            stroke="transparent"
            strokeWidth={4 * annotationScale}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={onRouteOverlayClick ? "cursor-pointer" : undefined}
            onPointerDown={(event) => {
              if (!onRouteOverlayClick || !onMoveRouteOverlay) return;
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.setPointerCapture?.(event.pointerId);
              const svg = event.currentTarget.ownerSVGElement;
              if (!svg) return;
              const rect = svg.getBoundingClientRect();
              const { x: rawX, rawY } = getRawPoint(event.clientX, event.clientY, rect);
              const x = flipHorizontalPerspective ? 100 - rawX : rawX;
              const y = flipOffense ? 100 - rawY : rawY;
              onRouteOverlayClick(route.id);
              setDrag({ id: route.id, type: "route_overlay", lastX: x, lastY: y });
            }}
            onClick={(event) => {
              if (!onRouteOverlayClick) return;
              event.stopPropagation();
              onRouteOverlayClick(route.id);
            }}
          />
          {selectedRouteOverlayId === route.id ? route.path.map((point, pointIndex) => (
            <circle
              key={`${route.id}-vertex-${pointIndex}`}
              cx={maybeFlipX(point.x, flipHorizontalPerspective)}
              cy={maybeFlipY(point.y, flipOffense)}
              r={0.8 * annotationScale}
              fill="white"
              stroke={route.color}
              strokeWidth={0.25 * annotationScale}
              className={onMoveRouteOverlayPoint ? "cursor-grab active:cursor-grabbing" : undefined}
              onPointerDown={(event) => {
                if (!onRouteOverlayClick || !onMoveRouteOverlayPoint) return;
                event.preventDefault();
                event.stopPropagation();
                event.currentTarget.setPointerCapture?.(event.pointerId);
                onRouteOverlayClick(route.id);
                setDrag({ id: route.id, type: "route_point", pointIndex });
              }}
            />
          )) : null}
          {(() => {
            const routeLabelWidth = Math.max(7.2, route.label.length * 1.16 + 2.2) * annotationScale;
            const routeLabelHeight = 4.2 * annotationScale;
            const routeLabelX = maybeFlipX(route.labelX ?? 50, flipHorizontalPerspective);
            const routeLabelY = maybeFlipY(route.labelY ?? 50, flipOffense);

            return route.labelX !== undefined && route.labelY !== undefined ? (
              <>
                <rect
                  x={routeLabelX - routeLabelWidth / 2}
                  y={routeLabelY - routeLabelHeight / 2}
                  width={routeLabelWidth}
                  height={routeLabelHeight}
                  rx={1.15 * annotationScale}
                  fill="rgba(15,23,42,0.68)"
                  className={onRouteOverlayClick ? "cursor-pointer" : undefined}
                  onPointerDown={(event) => {
                    if (!onRouteOverlayClick || !onMoveRouteOverlay) return;
                    event.preventDefault();
                    event.stopPropagation();
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    const svg = event.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    const { x: rawX, rawY } = getRawPoint(event.clientX, event.clientY, rect);
                    const x = flipHorizontalPerspective ? 100 - rawX : rawX;
                    const y = flipOffense ? 100 - rawY : rawY;
                    onRouteOverlayClick(route.id);
                    setDrag({ id: route.id, type: "route_overlay", lastX: x, lastY: y });
                  }}
                  onClick={(event) => {
                    if (!onRouteOverlayClick) return;
                    event.stopPropagation();
                    onRouteOverlayClick(route.id);
                  }}
                />
                <text
                  x={routeLabelX}
                  y={routeLabelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={1.25 * annotationScale}
                  letterSpacing="0.04em"
                  fontWeight="700"
                  fill="white"
                  className={onRouteOverlayClick ? "cursor-pointer select-none" : undefined}
                  onPointerDown={(event) => {
                    if (!onRouteOverlayClick || !onMoveRouteOverlay) return;
                    event.preventDefault();
                    event.stopPropagation();
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    const svg = event.currentTarget.ownerSVGElement;
                    if (!svg) return;
                    const rect = svg.getBoundingClientRect();
                    const { x: rawX, rawY } = getRawPoint(event.clientX, event.clientY, rect);
                    const x = flipHorizontalPerspective ? 100 - rawX : rawX;
                    const y = flipOffense ? 100 - rawY : rawY;
                    onRouteOverlayClick(route.id);
                    setDrag({ id: route.id, type: "route_overlay", lastX: x, lastY: y });
                  }}
                  onClick={(event) => {
                    if (!onRouteOverlayClick) return;
                    event.stopPropagation();
                    onRouteOverlayClick(route.id);
                  }}
                >
                  {route.label}
                </text>
              </>
            ) : null;
          })()}
        </g>
      ))}
    </svg>
  ) : null;

  return (
    <div
      className={`relative aspect-[19/9] w-full overflow-hidden rounded-2xl border bg-emerald-700 select-none ${hasDraggableItems ? "touch-none" : ""} ${drag ? "cursor-grabbing" : ""}`}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setDrag(null)}
      onDragStart={(event) => event.preventDefault()}
      onClick={(e) => {
        if (!onFieldClick || drag) return;
        if (e.detail > 1) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const { x: rawX, rawY } = getRawPoint(e.clientX, e.clientY, rect);
        const x = flipHorizontalPerspective ? 100 - rawX : rawX;
        onFieldClick(x, flipOffense ? 100 - rawY : rawY);
      }}
      onDoubleClick={(e) => {
        if (!onFieldDoubleClick || drag) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const { x: rawX, rawY } = getRawPoint(e.clientX, e.clientY, rect);
        const x = flipHorizontalPerspective ? 100 - rawX : rawX;
        onFieldDoubleClick(x, flipOffense ? 100 - rawY : rawY);
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute bottom-[4%] top-[4%] w-px bg-white/35" style={{ left: `${sidelineInset}%` }} />
      <div className="absolute bottom-[4%] top-[4%] w-px bg-white/35" style={{ left: `${100 - sidelineInset}%` }} />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-[34px] font-black italic tracking-tight text-white/60"
        style={{ left: `${numberInset}%`, top: `${losY}%` }}
      >
        #
      </div>
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 text-[34px] font-black italic tracking-tight text-white/60"
        style={{ left: `${100 - numberInset}%`, top: `${losY}%` }}
      >
        #
      </div>
      {hashXs.map((x, idx) => (
        <React.Fragment key={`hash-${idx}`}>
          {hashMarkRows.map((row) => (
            <div
              key={`hash-${idx}-${row}`}
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[1px] ${subtleHashMarks ? "h-[4px] w-[20px] bg-white/32" : "h-[6px] w-[24px] bg-white/60"}`}
              style={{ left: `${x}%`, top: `${row}%` }}
            />
          ))}
        </React.Fragment>
      ))}
      <div className="absolute left-0 right-0 border-t-2 border-dashed border-white/70" style={{ top: `${losY}%` }} />
      {yardReferenceLines.map((line) => {
        const sourceY = losReferenceY + line.yards * yardReferenceScale;
        const top = maybeFlipY(sourceY, flipOffense);

        return (
          <React.Fragment key={line.id}>
            <div
              className="absolute left-[6%] right-[6%] border-t border-white/18"
              style={{ top: `${top}%` }}
            />
            {line.label ? (
              <>
                <div
                  className="absolute -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55"
                  style={{ left: "7.5%", top: `${top}%` }}
                >
                  +{line.label}
                </div>
                <div
                  className="absolute -translate-x-full -translate-y-1/2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55"
                  style={{ left: "92.5%", top: `${top}%` }}
                >
                  +{line.label}
                </div>
              </>
            ) : null}
          </React.Fragment>
        );
      })}
      {getLineXs(editableDefense).map((x, idx) => (
        <div key={idx} className="absolute bottom-[10%] top-[10%] w-px bg-sky-200/25" style={{ left: `${x}%` }} />
      ))}

      {offenseLandmarks.map((p) => (
        <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${maybeFlipX(p.x, flipHorizontalPerspective)}%`, top: `${maybeFlipY(p.y, flipOffense)}%` }}>
          <div className="h-2 w-2 rounded-full border border-pink-100/80 bg-pink-200/50" />
        </div>
      ))}
      {defenseLandmarks.map((p) => {
        const showingAnswers = defenseGhosts.length > 0;
        const layerStyles = enhancedLandmarks
          ? {
              dl: "bg-red-300/50 border-red-100/60",
              lb: "bg-amber-200/50 border-amber-50/60",
              cb: "bg-blue-300/50 border-blue-100/60",
              db: "bg-violet-300/50 border-violet-100/60",
            }
          : {
              dl: "bg-sky-200/40 border-sky-100/60",
              lb: "bg-sky-200/40 border-sky-100/60",
              cb: "bg-sky-200/40 border-sky-100/60",
              db: "bg-sky-200/40 border-sky-100/60",
            };
        const size = enhancedLandmarks ? "h-2.5 w-2.5" : "h-2 w-2";
        const labelClass = enhancedLandmarks
          ? "text-[9px] font-semibold text-white/80"
          : "text-[9px] font-semibold text-sky-50/80";

        return (
          <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div className={`rounded-full border ${size} ${layerStyles[p.layer]}`} />
            {p.label ? <div className={`absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap ${labelClass}`}>{p.label}</div> : null}
          </div>
        );
      })}

      {!routeOverlaysOnTop ? routeOverlayLayer : null}

      {fieldTags.map((tag) => {
        const toneClass =
          tag.tone === "gold"
            ? "border-amber-200/45 bg-amber-100/15 text-amber-100"
            : tag.tone === "cyan"
              ? "border-cyan-200/45 bg-cyan-100/15 text-cyan-100"
              : tag.tone === "sky"
                ? "border-sky-200/45 bg-sky-100/15 text-sky-100"
                : "border-slate-100/20 bg-slate-950/50 text-white/95";

        return (
          <div
            key={tag.id}
            className={`absolute inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded border px-1.5 py-0.5 text-center leading-none ${compactAnnotations ? "min-h-[14px] text-[7px]" : "min-h-[18px] text-[10px]"} font-black uppercase tracking-[0.10em] shadow-sm ${toneClass} ${selectedFieldTagId === tag.id ? "ring-2 ring-white/80" : ""} ${onFieldTagClick ? "cursor-pointer" : ""}`}
            style={{ left: `${maybeFlipX(tag.x, flipHorizontalPerspective)}%`, top: `${maybeFlipY(tag.y, flipOffense)}%` }}
            onClick={(event) => {
              if (!onFieldTagClick) return;
              event.stopPropagation();
              onFieldTagClick(tag.id);
            }}
          >
            {tag.label}
          </div>
        );
      })}

      {offenseGhosts.map((p) => (
        <div key={`og-${p.id}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${clamp(maybeFlipX(p.x, flipHorizontalPerspective) + offenseGhostOffset, 2, 98)}%`, top: `${maybeFlipY(p.y, flipOffense)}%` }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-300 border-dashed bg-white/80 text-[10px] font-bold text-slate-900">{p.id}</div>
        </div>
      ))}
      {defenseGhosts.map((p) => (
        <div
          key={`dg-${p.id}`}
          className={`absolute -translate-x-1/2 -translate-y-1/2 select-none ${editableDefenseGhosts ? "cursor-grab touch-none active:cursor-grabbing" : ""}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onPointerDown={(event) => {
            if (!editableDefenseGhosts) return;
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setDrag({ id: p.id, type: "defense_ghost" });
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sky-200 border-dashed bg-sky-200/10 text-[10px] font-bold text-black">{p.id}</div>
        </div>
      ))}
      {offensePlayers.map((p) => (
        <div
          style={{ opacity: dimOffenseOnAnswers ? 0.35 : 1 }}
          key={p.id}
          className={editableOffense && !lockedOffenseIds.includes(p.id) ? "cursor-grab select-none touch-none active:cursor-grabbing" : "select-none"}
          onPointerDown={(event) => {
            if (!editableOffense) return;
            if (lockedOffenseIds.includes(p.id)) return;
            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture?.(event.pointerId);
            setDrag({ id: p.id, type: "offense" });
          }}
        >
          <Circle
            player={{ ...p, x: maybeFlipX(p.x, flipHorizontalPerspective), y: maybeFlipY(p.y, flipOffense) }}
            color={incorrectOffenseIds.includes(p.id) ? "bg-red-500" : undefined}
            border={incorrectOffenseIds.includes(p.id) ? "border-red-300" : undefined}
            className={editableOffense && !lockedOffenseIds.includes(p.id) ? "cursor-grab active:cursor-grabbing" : ""}
          />
        </div>
      ))}
      {defensePlayers.map((p) => {
        const showingAnswers = defenseGhosts.length > 0;
        return (
          <div
            key={p.id}
            className={editableDefense ? "cursor-grab select-none touch-none active:cursor-grabbing" : onDefenseClick ? "cursor-pointer select-none" : "select-none"}
            onPointerDown={(event) => {
              if (!editableDefense) {
                if (onDefenseClick) {
                  event.stopPropagation();
                  onDefenseClick(p.id);
                }
                return;
              }
              event.preventDefault();
              event.stopPropagation();
              event.currentTarget.setPointerCapture?.(event.pointerId);
              setDrag({ id: p.id, type: "defense" });
            }}
          >
            <Circle
              player={p}
              color={incorrectDefenseIds.includes(p.id) ? "bg-red-500" : "bg-sky-600"}
              text={showingAnswers ? "text-black" : "text-white"}
              border={incorrectDefenseIds.includes(p.id) ? "border-red-300" : "border-sky-200/40"}
              className={editableDefense ? "cursor-grab active:cursor-grabbing" : onDefenseClick ? "cursor-pointer" : ""}
            />
          </div>
        );
      })}

      {routeOverlaysOnTop ? routeOverlayLayer : null}

      {overlayLabel ? <div className="absolute bottom-4 left-4 rounded-lg bg-black/20 px-3 py-1 text-xs font-medium text-white/90">{overlayLabel}</div> : null}
    </div>
  );
}

function TokenTray({ title, ids, onAdd }: { title: string; ids: string[]; onAdd: (id: string) => void }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-slate-700">{title}</div>
      <div className="flex flex-wrap gap-2">
        {ids.map((id) => (
          <Button key={id} variant="outline" className="rounded-xl" onClick={() => onAdd(id)}>
            {id}
          </Button>
        ))}
      </div>
    </div>
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export default function FormationRecognitionWorkingApp() {
  const router = useRouter();
  const currentSecondsRef = useRef(0);
  const filmStudyTimeRafRef = useRef<number | null>(null);
  const didHydrateViewStateRef = useRef(false);
  const skipNextModeRandomizeRef = useRef(false);
  const previousModeRef = useRef<AppMode>("study");
  const previousAlignmentViewModeRef = useRef<AlignmentViewMode>("study");
  const previousFormationFilterSignatureRef = useRef("");
  const lastFilmRandomizeSignatureRef = useRef<string>("");
  const videoObjectUrlsRef = useRef<string[]>([]);
  const filmQuizVideoRef = useRef<HTMLVideoElement | null>(null);
  const filmStudyVideoRef = useRef<HTMLVideoElement | null>(null);
  const pendingStudyFormationRef = useRef<string | null>(null);
  const pendingAlignmentStudyFormationRef = useRef<string | null>(null);
  const [enhancedLandmarks, setEnhancedLandmarks] = useState(true);
  const [frontMode, setFrontMode] = useState<FrontMode>("4-3");
  const [formationTrainerViewMode, setFormationTrainerViewMode] = useState<FormationTrainerViewMode>("study");
  const [passConceptViewMode, setPassConceptViewMode] = useState<PassConceptViewMode>("study");
  const [passConceptQuizMode, setPassConceptQuizMode] = useState<PassConceptQuizMode>("build");
  const [alignmentViewMode, setAlignmentViewMode] = useState<AlignmentViewMode>("study");
  const [offenseBuildViewMode, setOffenseBuildViewMode] = useState<OffenseBuildViewMode>("quiz");
  const [filmViewMode, setFilmViewMode] = useState<FilmViewMode>("study");
  const [filmSubmode, setFilmSubmode] = useState<FilmSubmode>("read_key");
  const [mode, setMode] = useState<AppMode>("study");
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [accountDirectoryEntries, setAccountDirectoryEntries] = useState<LeaderboardEntry[]>([]);
  const [showAccountDirectory, setShowAccountDirectory] = useState(false);
  const [accountDirectorySort, setAccountDirectorySort] = useState<AccountDirectorySort>("points_desc");
  const [lastScoreSummary, setLastScoreSummary] = useState<Partial<Record<ScoreMode, ScoreSummary>>>({});
  const [scoredAttemptKeys, setScoredAttemptKeys] = useState<Set<string>>(() => new Set());
  const [revealedAttemptKeys, setRevealedAttemptKeys] = useState<Set<string>>(() => new Set());
  const [attemptStartedAt, setAttemptStartedAt] = useState<number>(Date.now());
  const [repAttemptId, setRepAttemptId] = useState(0);
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<PlaybookKey[]>(["Foothill", "Pro", "Wing T"]);
  const [personnelFilter, setPersonnelFilter] = useState<string>("Any");
  const [appSection, setAppSection] = useState<AppSection>("defense");
  const [selectedLeaderboardSection, setSelectedLeaderboardSection] = useState<LeaderboardSection>("defense");
  const [selectedLeaderboardMode, setSelectedLeaderboardMode] = useState<LeaderboardMode>("quiz");
  const [passConceptFamilyFilter, setPassConceptFamilyFilter] = useState<PassConceptFamilyFilter>("2x2");
  const [passConceptBoardKind, setPassConceptBoardKind] = useState<PassConceptBoardKind>("2x2");
  const [selectedFrontsideConceptId, setSelectedFrontsideConceptId] = useState<string>("spartan");
  const [selectedBacksideConceptId, setSelectedBacksideConceptId] = useState<string>("dagger");
  const [selectedThreeByOneConceptId, setSelectedThreeByOneConceptId] = useState<string>("h-wolf");
  const [index, setIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({ formation: "", runStrength: "", passStrength: "" });
  const [passConceptAnswers, setPassConceptAnswers] = useState<Record<PassConceptPlayerId, string>>({
    X: "",
    H: "",
    Y: "",
    Z: "",
  });
  const [passConceptNameAnswer, setPassConceptNameAnswer] = useState("");
  const [passConceptFrontsideNameAnswer, setPassConceptFrontsideNameAnswer] = useState("");
  const [passConceptBacksideNameAnswer, setPassConceptBacksideNameAnswer] = useState("");
  const [showPassConceptFeedback, setShowPassConceptFeedback] = useState(false);
  const [showPassConceptAnswers, setShowPassConceptAnswers] = useState(false);
  const [showRunFitAdminTools, setShowRunFitAdminTools] = useState(false);
  const [runFitTitle, setRunFitTitle] = useState("Run Fit Drawing Board");
  const [runFitEditorTool, setRunFitEditorTool] = useState<RunFitEditorTool>("select");
  const [runFitArrowColor, setRunFitArrowColor] = useState<RunFitArrowColor>("gold");
  const [runFitLineEnd, setRunFitLineEnd] = useState<RunFitLineEnd>("square");
  const [runFitLineWeight, setRunFitLineWeight] = useState("normal");
  const [runFitLineStyle, setRunFitLineStyle] = useState<RunFitLineStyle>("solid");
  const [runFitArrowLabel, setRunFitArrowLabel] = useState("PULL / KICK");
  const [runFitDraftPoints, setRunFitDraftPoints] = useState<{ x: number; y: number }[]>([]);
  const [runFitFieldTags, setRunFitFieldTags] = useState<FieldTag[]>([]);
  const [runFitRouteOverlays, setRunFitRouteOverlays] = useState<RouteOverlay[]>([]);
  const [selectedRunFitOverlayId, setSelectedRunFitOverlayId] = useState<string | null>(null);
  const [selectedRunFitTagId, setSelectedRunFitTagId] = useState<string | null>(null);
  const [runFitTagLabel, setRunFitTagLabel] = useState("SPILL");
  const [runFitTagTone, setRunFitTagTone] = useState<FieldTag["tone"]>("gold");
  const [runFitSavedBoards, setRunFitSavedBoards] = useState<RunFitSavedBoard[]>([]);
  const [runFitSavedPathways, setRunFitSavedPathways] = useState<RunFitSavedPathway[]>([]);
  const [selectedRunFitSavedPathwayId, setSelectedRunFitSavedPathwayId] = useState("");
  const [runFitSavedPathwayName, setRunFitSavedPathwayName] = useState("Over Spill");
  const [selectedRunFitBaseBoardId, setSelectedRunFitBaseBoardId] = useState<BlitzBaseBoardId>("double");
  const [selectedRunFitBoardId, setSelectedRunFitBoardId] = useState("working");
  const [runFitSaveNotice, setRunFitSaveNotice] = useState<string | null>(null);
  const [selectedRunFitPathwayDefenderId, setSelectedRunFitPathwayDefenderId] = useState("M");
  const [selectedRunFitPathwayId, setSelectedRunFitPathwayId] = useState<RunFitPathwayId>("a_gap_fit");
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);
  const [quizReadyForNext, setQuizReadyForNext] = useState(false);
  const [alignmentPlacements, setAlignmentPlacements] = useState<Record<string, PlayerDot[]>>({});
  const [offensePlacements, setOffensePlacements] = useState<Record<string, PlayerDot[]>>({});
  const [showAlignmentCheck, setShowAlignmentCheck] = useState(false);
  const [showOffenseCheck, setShowOffenseCheck] = useState(false);
  const [editorOverrides, setEditorOverrides] = useState<Record<string, FormationMeta>>({});
  const [customAlignmentLandmarks, setCustomAlignmentLandmarks] = useState<Record<string, Landmark[]>>({});
  const [filmClips, setFilmClips] = useState<FilmClip[]>(DEFAULT_FILM_CLIPS);
  const [selectedFilmClipId, setSelectedFilmClipId] = useState<string>("");
  const [filmFormationFilter, setFilmFormationFilter] = useState<string>("all");
  const [filmTeamFilter, setFilmTeamFilter] = useState<string>("all");
  const [filmStarted, setFilmStarted] = useState(false);
  const [filmPlaybackNonce, setFilmPlaybackNonce] = useState(0);
  const [filmUploadResetKey, setFilmUploadResetKey] = useState(0);
  const [filmSaveNotice, setFilmSaveNotice] = useState<FilmSaveStatus | null>(null);
  const [pendingDuplicateFilmSignature, setPendingDuplicateFilmSignature] = useState<string | null>(null);
  const [avatarUploadNotice, setAvatarUploadNotice] = useState<FilmSaveStatus | null>(null);
  const [avatarUploadResetKey, setAvatarUploadResetKey] = useState(0);
  const [showFilmAdminTools, setShowFilmAdminTools] = useState(false);
  const [filmAdminPanelMode, setFilmAdminPanelMode] = useState<FilmAdminPanelMode>("upload");
  const [filmQuizAnswers, setFilmQuizAnswers] = useState<FilmQuizAnswers>({ ...DEFAULT_FILM_QUIZ_ANSWERS });
  const [showFilmQuizFeedback, setShowFilmQuizFeedback] = useState(false);
  const [showFilmQuizAnswers, setShowFilmQuizAnswers] = useState(false);
  const [filmQuizStarted, setFilmQuizStarted] = useState(false);
  const [filmQuizFinished, setFilmQuizFinished] = useState(false);
  const [filmQuizPlaysUsed, setFilmQuizPlaysUsed] = useState(0);
  const [filmStudyCurrentTime, setFilmStudyCurrentTime] = useState(0);
  const [filmStudyDuration, setFilmStudyDuration] = useState(0);
  const [filmDraft, setFilmDraft] = useState<FilmClipDraft>({ ...DEFAULT_FILM_DRAFT });
  const [filmEditDraft, setFilmEditDraft] = useState<FilmClipEditDraft>({ ...DEFAULT_FILM_EDIT_DRAFT });
  
  const [editingAlignmentAnswers, setEditingAlignmentAnswers] = useState(false);
  const [customLandmarkDraft, setCustomLandmarkDraft] = useState<CustomLandmarkDraft>({
    label: "",
    layer: "lb",
    side: "right",
    x: "75",
    y: String(LB_Y),
  });
  const [editorDraft, setEditorDraft] = useState<{ name: string; personnel: string; runStrength: Side; passStrength: Side; backfield: string }>({
    name: "",
    personnel: "11",
    runStrength: "right",
    passStrength: "right",
    backfield: "Under Center",
  });
  const [authChecked, setAuthChecked] = useState(false);

  const emptyStats = (): UserStats => ({
    ...DEFAULT_STATS,
    quiz: { ...DEFAULT_MODE_STATS },
    offense_build: { ...DEFAULT_MODE_STATS },
    alignment: { ...DEFAULT_MODE_STATS },
    film: { ...DEFAULT_MODE_STATS },
    concept: { ...DEFAULT_MODE_STATS },
    blitz: { ...DEFAULT_MODE_STATS },
    stunt: { ...DEFAULT_MODE_STATS },
  });

  useEffect(() => {
    try {
      const rawViewState = window.localStorage.getItem(VIEW_STATE_STORAGE_KEY);
      if (!rawViewState) {
        didHydrateViewStateRef.current = true;
        return;
      }

      const savedViewState = JSON.parse(rawViewState) as {
        mode?: AppMode;
        appSection?: AppSection;
        formationTrainerViewMode?: FormationTrainerViewMode;
        passConceptViewMode?: PassConceptViewMode;
        passConceptQuizMode?: PassConceptQuizMode;
        alignmentViewMode?: AlignmentViewMode;
        offenseBuildViewMode?: OffenseBuildViewMode;
        filmViewMode?: FilmViewMode;
        filmSubmode?: FilmSubmode;
        filmFormationFilter?: string;
        filmTeamFilter?: string;
        frontMode?: FrontMode;
        selectedPlaybooks?: PlaybookKey[];
        personnelFilter?: string;
        selectedLeaderboardSection?: LeaderboardSection;
        selectedLeaderboardMode?: LeaderboardMode;
        passConceptFamilyFilter?: PassConceptFamilyFilter;
        passConceptBoardKind?: PassConceptBoardKind;
        selectedFrontsideConceptId?: string;
        selectedBacksideConceptId?: string;
        selectedThreeByOneConceptId?: string;
        index?: number;
        enhancedLandmarks?: boolean;
        studyFormation?: string;
        alignmentStudyFormation?: string;
        selectedFilmClipId?: string;
      };

      const hasSavedMode = Boolean(
        savedViewState.mode && MODE_OPTIONS.some((option) => option.value === savedViewState.mode),
      );

      if (savedViewState.mode === "quiz") {
        setMode("study");
        setAppSection(getSectionForMode("study"));
        setFormationTrainerViewMode("quiz");
        skipNextModeRandomizeRef.current = true;
      } else if (savedViewState.mode && MODE_OPTIONS.some((option) => option.value === savedViewState.mode)) {
        setMode(savedViewState.mode);
        setAppSection(getSectionForMode(savedViewState.mode));
        skipNextModeRandomizeRef.current = true;
      }

      if (
        !hasSavedMode &&
        savedViewState.appSection &&
        APP_SECTION_OPTIONS.some((option) => option.value === savedViewState.appSection)
      ) {
        setAppSection(savedViewState.appSection);
      }

      if (
        savedViewState.formationTrainerViewMode &&
        ["study", "quiz"].includes(savedViewState.formationTrainerViewMode)
      ) {
        setFormationTrainerViewMode(savedViewState.formationTrainerViewMode);
      }

      if (
        savedViewState.passConceptViewMode &&
        ["study", "quiz"].includes(savedViewState.passConceptViewMode)
      ) {
        setPassConceptViewMode(savedViewState.passConceptViewMode);
      }

      if (
        typeof savedViewState.passConceptQuizMode === "string" &&
        ["build", "identify"].includes(savedViewState.passConceptQuizMode)
      ) {
        setPassConceptQuizMode(savedViewState.passConceptQuizMode as PassConceptQuizMode);
      }

      if (
        savedViewState.alignmentViewMode &&
        ["study", "quiz"].includes(savedViewState.alignmentViewMode)
      ) {
        setAlignmentViewMode(savedViewState.alignmentViewMode);
      }

      if (
        savedViewState.offenseBuildViewMode &&
        ["study", "quiz"].includes(savedViewState.offenseBuildViewMode)
      ) {
        setOffenseBuildViewMode(savedViewState.offenseBuildViewMode);
      }

      if (
        savedViewState.filmViewMode &&
        ["study", "quiz"].includes(savedViewState.filmViewMode)
      ) {
        setFilmViewMode(savedViewState.filmViewMode);
      }

      if (savedViewState.filmSubmode === "read_key" || savedViewState.filmSubmode === "formation_key" || savedViewState.filmSubmode === "team_key") {
        setFilmSubmode(savedViewState.filmSubmode);
      }

      if (typeof savedViewState.filmFormationFilter === "string") {
        setFilmFormationFilter(savedViewState.filmFormationFilter);
      }

      if (typeof savedViewState.filmTeamFilter === "string") {
        setFilmTeamFilter(savedViewState.filmTeamFilter);
      }

      if (savedViewState.frontMode && ["4-3", "4-4"].includes(savedViewState.frontMode)) {
        setFrontMode(savedViewState.frontMode);
      }

      if (
        Array.isArray(savedViewState.selectedPlaybooks) &&
        savedViewState.selectedPlaybooks.every((playbook) => PLAYBOOK_OPTIONS.includes(playbook))
      ) {
        setSelectedPlaybooks(savedViewState.selectedPlaybooks);
      }

      if (
        typeof savedViewState.personnelFilter === "string" &&
        (savedViewState.personnelFilter === "Any" || PERSONNEL_OPTIONS.includes(savedViewState.personnelFilter as (typeof PERSONNEL_OPTIONS)[number]))
      ) {
        setPersonnelFilter(savedViewState.personnelFilter);
      }

      if (
        typeof savedViewState.selectedLeaderboardSection === "string" &&
        ["offense", "defense"].includes(savedViewState.selectedLeaderboardSection)
      ) {
        setSelectedLeaderboardSection(savedViewState.selectedLeaderboardSection as LeaderboardSection);
      }

      if (
        typeof savedViewState.selectedLeaderboardMode === "string" &&
        ["quiz", "offense_build", "alignment", "film", "concept", "blitz", "stunt"].includes(savedViewState.selectedLeaderboardMode)
      ) {
        setSelectedLeaderboardMode(savedViewState.selectedLeaderboardMode as LeaderboardMode);
      }

      if (
        typeof savedViewState.passConceptFamilyFilter === "string" &&
        ["2x2", "3x1", "all"].includes(savedViewState.passConceptFamilyFilter)
      ) {
        setPassConceptFamilyFilter(savedViewState.passConceptFamilyFilter as PassConceptFamilyFilter);
      }

      if (
        typeof savedViewState.passConceptBoardKind === "string" &&
        ["2x2", "3x1"].includes(savedViewState.passConceptBoardKind)
      ) {
        setPassConceptBoardKind(savedViewState.passConceptBoardKind as PassConceptBoardKind);
      }

      if (typeof savedViewState.index === "number" && Number.isFinite(savedViewState.index)) {
        setIndex(Math.max(0, Math.floor(savedViewState.index)));
      }

      if (typeof savedViewState.selectedFrontsideConceptId === "string" && TWO_BY_TWO_CONCEPTS.some((concept) => concept.id === savedViewState.selectedFrontsideConceptId)) {
        setSelectedFrontsideConceptId(savedViewState.selectedFrontsideConceptId);
      }

      if (typeof savedViewState.selectedBacksideConceptId === "string" && TWO_BY_TWO_CONCEPTS.some((concept) => concept.id === savedViewState.selectedBacksideConceptId)) {
        setSelectedBacksideConceptId(savedViewState.selectedBacksideConceptId);
      }

      if (typeof savedViewState.selectedThreeByOneConceptId === "string" && THREE_BY_ONE_CONCEPTS.some((concept) => concept.id === savedViewState.selectedThreeByOneConceptId)) {
        setSelectedThreeByOneConceptId(savedViewState.selectedThreeByOneConceptId);
      }

      if (typeof savedViewState.enhancedLandmarks === "boolean") {
        setEnhancedLandmarks(savedViewState.enhancedLandmarks);
      }

      if (typeof savedViewState.studyFormation === "string" && savedViewState.studyFormation) {
        pendingStudyFormationRef.current = savedViewState.studyFormation;
      }

      if (typeof savedViewState.alignmentStudyFormation === "string" && savedViewState.alignmentStudyFormation) {
        pendingAlignmentStudyFormationRef.current = savedViewState.alignmentStudyFormation;
      }

      if (typeof savedViewState.selectedFilmClipId === "string") {
        setSelectedFilmClipId(savedViewState.selectedFilmClipId);
      }

    } catch {}

    didHydrateViewStateRef.current = true;
  }, []);

  useEffect(() => {
    if (!didHydrateViewStateRef.current) return;

    try {
      window.localStorage.setItem(
        VIEW_STATE_STORAGE_KEY,
        JSON.stringify({
          appSection,
          mode,
          formationTrainerViewMode,
          passConceptViewMode,
          passConceptQuizMode,
          alignmentViewMode,
          offenseBuildViewMode,
          filmViewMode,
          filmSubmode,
          filmFormationFilter,
          filmTeamFilter,
          frontMode,
          selectedPlaybooks,
          personnelFilter,
          selectedLeaderboardSection,
          selectedLeaderboardMode,
          passConceptFamilyFilter,
          passConceptBoardKind,
          selectedFrontsideConceptId,
          selectedBacksideConceptId,
          selectedThreeByOneConceptId,
          index,
          enhancedLandmarks,
          selectedFilmClipId,
        }),
      );
    } catch {}
  }, [appSection, mode, formationTrainerViewMode, passConceptViewMode, passConceptQuizMode, alignmentViewMode, offenseBuildViewMode, filmViewMode, filmSubmode, filmFormationFilter, filmTeamFilter, frontMode, selectedPlaybooks, personnelFilter, selectedLeaderboardSection, selectedLeaderboardMode, passConceptFamilyFilter, passConceptBoardKind, selectedFrontsideConceptId, selectedBacksideConceptId, selectedThreeByOneConceptId, index, enhancedLandmarks, selectedFilmClipId]);

  useEffect(() => {
    const remoteClips = loadStoredFilmClips();
    if (remoteClips.length) setFilmClips((prev) => [...remoteClips, ...prev.filter((clip) => clip.kind === "local")]);
  }, []);

  useEffect(() => {
    persistStoredFilmClips(filmClips);
  }, [filmClips]);

  useEffect(() => {
    const loadFilmClips = async () => {
      if (!currentUser) return;

      const supabase = createClient();
      try {
        const remoteClips = await loadFilmClipsFromSupabase(supabase);
        setFilmClips((prev) => [...remoteClips, ...prev.filter((clip) => clip.kind === "local")]);
      } catch (error: any) {
        console.error("Failed to load film clips", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
      }
    };

    void loadFilmClips();
  }, [currentUser?.id]);

  useEffect(() => {
    return () => {
      videoObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

   useEffect(() => {
  const checkAuth = async () => {
    if (window.localStorage.getItem(DEMO_SESSION_STORAGE_KEY) === "true") {
      setCurrentUser((prev) => (prev?.id === DEMO_USER_ID ? prev : {
        ...DEMO_USER,
        stats: {
          ...DEMO_USER.stats,
          quiz: { ...DEMO_USER.stats.quiz },
          offense_build: { ...DEMO_USER.stats.offense_build },
          alignment: { ...DEMO_USER.stats.alignment },
          film: { ...DEMO_USER.stats.film },
          concept: { ...DEMO_USER.stats.concept },
          blitz: { ...DEMO_USER.stats.blitz },
          stunt: { ...DEMO_USER.stats.stunt },
        },
      }));
      setAuthChecked(true);
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      setCurrentUser(null);
      router.push("/login");
      return;
    }

    const user = data.user;

    const { data: profileData } = await supabase
  .from("profiles")
  .select("display_name, school, seconds_used, avatar_url")
  .eq("id", user.id)
  .single();

    if (user.email) {
      const { error: emailBackfillError } = await supabase
        .from("profiles")
        .update({ email: user.email.toLowerCase() })
        .eq("id", user.id);

      if (emailBackfillError && emailBackfillError.code !== "PGRST204" && !emailBackfillError.message?.includes("email")) {
        console.error("Failed to backfill profile email", emailBackfillError);
      }
    }

const { data: scoreRows } = await supabase
  .from("mode_scores")
  .select("mode, points, attempts, correct, best_time_ms")
  .eq("user_id", user.id);


    const displayName =
      profileData?.display_name ||
      user.email?.split("@")[0] ||
      "User";

    const school =
      profileData?.school ||
      "Foothill";

    setCurrentUser((prev) => {
  const baseStats: UserStats = {
  ...DEFAULT_STATS,
  quiz: { ...DEFAULT_MODE_STATS },
  offense_build: { ...DEFAULT_MODE_STATS },
  alignment: { ...DEFAULT_MODE_STATS },
  film: { ...DEFAULT_MODE_STATS },
  concept: { ...DEFAULT_MODE_STATS },
  blitz: { ...DEFAULT_MODE_STATS },
  stunt: { ...DEFAULT_MODE_STATS },
};

if (Array.isArray(scoreRows)) {
  for (const row of scoreRows) {
    if (row.mode === "quiz" || row.mode === "offense_build" || row.mode === "alignment" || row.mode === "film" || row.mode === "concept" || row.mode === "blitz" || row.mode === "stunt") {
      baseStats[row.mode] = {
        points: row.points ?? 0,
        attempts: row.attempts ?? 0,
        correct: row.correct ?? 0,
        bestTimeMs: row.best_time_ms ?? null,
      };
    }
  }
}

baseStats.secondsUsed = profileData?.seconds_used ?? 0;

baseStats.totalPoints =
  baseStats.quiz.points +
  baseStats.offense_build.points +
  baseStats.alignment.points +
  baseStats.film.points +
  baseStats.concept.points +
  baseStats.blitz.points +
  baseStats.stunt.points;

const existingStats =
  prev?.id === user.id
    ? {
        ...baseStats,
      }
    : baseStats;


      return {
        id: user.id,
        email: user.email || "",
        name: displayName,
        teamCode: school,
        isAdmin: ADMIN_EMAILS.includes(user.email || ""),
        avatarUrl: profileData?.avatar_url ?? null,
        stats: existingStats,
      };
    });

    setAuthChecked(true);
  };

  checkAuth();
}, [router]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!currentUser?.teamCode) {
        setLeaderboardEntries([]);
        return;
      }

      const supabase = createClient();
      let teamProfiles: Array<{
        id: string;
        display_name: string | null;
        school: string | null;
        seconds_used: number | null;
        avatar_url: string | null;
        email?: string | null;
      }> | null = null;

      let { data: profilesWithEmail, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, school, seconds_used, avatar_url, email")
        .eq("school", currentUser.teamCode);

      if (profilesError?.code === "PGRST204" || profilesError?.message?.includes("email")) {
        const fallbackProfiles = await supabase
          .from("profiles")
          .select("id, display_name, school, seconds_used, avatar_url")
          .eq("school", currentUser.teamCode);
        profilesWithEmail = fallbackProfiles.data as typeof profilesWithEmail;
        profilesError = fallbackProfiles.error;
      }

      teamProfiles = profilesWithEmail as typeof teamProfiles;

      if (profilesError) {
        console.error("Failed to load leaderboard profiles", profilesError);
        return;
      }

      const profiles = teamProfiles ?? [];
      if (!profiles.length) {
        setLeaderboardEntries([]);
        return;
      }

      const userIds = profiles.map((profile) => profile.id);
      const { data: scoreRows, error: scoresError } = await supabase
        .from("mode_scores")
        .select("user_id, mode, points, attempts, correct, best_time_ms")
        .in("user_id", userIds);

      if (scoresError) {
        console.error("Failed to load leaderboard scores", scoresError);
        return;
      }

      const statsByUser = new Map<string, UserStats>();

      for (const profile of profiles) {
        const stats = emptyStats();
        stats.secondsUsed = profile.seconds_used ?? 0;
        statsByUser.set(profile.id, stats);
      }

      for (const row of scoreRows ?? []) {
        if (row.mode !== "quiz" && row.mode !== "offense_build" && row.mode !== "alignment" && row.mode !== "film" && row.mode !== "concept" && row.mode !== "blitz" && row.mode !== "stunt") {
          continue;
        }

        const stats = statsByUser.get(row.user_id);
        if (!stats) continue;

        stats[row.mode] = {
          points: row.points ?? 0,
          attempts: row.attempts ?? 0,
          correct: row.correct ?? 0,
          bestTimeMs: row.best_time_ms ?? null,
        };
      }

      const nextEntries = profiles.map((profile) => {
        const stats = statsByUser.get(profile.id) ?? emptyStats();
        stats.totalPoints =
          stats.quiz.points +
          stats.offense_build.points +
          stats.alignment.points +
          stats.film.points +
          stats.concept.points +
          stats.blitz.points +
          stats.stunt.points;

        return {
          id: profile.id,
          name: profile.display_name || "User",
          teamCode: profile.school || currentUser.teamCode,
          avatarUrl: profile.avatar_url ?? null,
          email: profile.email ?? null,
          isAdmin: ADMIN_EMAILS.includes((profile.email ?? "").toLowerCase()),
          stats,
        };
      });

      setLeaderboardEntries(nextEntries);
    };

    void loadLeaderboard();
  }, [currentUser?.teamCode]);

  useEffect(() => {
    const loadAccountDirectory = async () => {
      if (!currentUser?.isAdmin || !showAccountDirectory) {
        setAccountDirectoryEntries([]);
        return;
      }

      const supabase = createClient();
      let { data: profilesWithEmail, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, school, seconds_used, avatar_url, email")
        .order("school", { ascending: true })
        .order("display_name", { ascending: true });

      if (profilesError?.code === "PGRST204" || profilesError?.message?.includes("email")) {
        const fallbackProfiles = await supabase
          .from("profiles")
          .select("id, display_name, school, seconds_used, avatar_url")
          .order("school", { ascending: true })
          .order("display_name", { ascending: true });
        profilesWithEmail = fallbackProfiles.data as typeof profilesWithEmail;
        profilesError = fallbackProfiles.error;
      }

      if (profilesError) {
        console.error("Failed to load account directory", profilesError);
        return;
      }

      const profiles = profilesWithEmail ?? [];
      if (!profiles.length) {
        setAccountDirectoryEntries([]);
        return;
      }

      const userIds = profiles.map((profile) => profile.id);
      const { data: scoreRows, error: scoresError } = await supabase
        .from("mode_scores")
        .select("user_id, mode, points, attempts, correct, best_time_ms")
        .in("user_id", userIds);

      if (scoresError) {
        console.error("Failed to load account directory scores", scoresError);
        return;
      }

      const statsByUser = new Map<string, UserStats>();

      for (const profile of profiles) {
        const stats = emptyStats();
        stats.secondsUsed = profile.seconds_used ?? 0;
        statsByUser.set(profile.id, stats);
      }

      for (const row of scoreRows ?? []) {
        if (row.mode !== "quiz" && row.mode !== "offense_build" && row.mode !== "alignment" && row.mode !== "film" && row.mode !== "concept" && row.mode !== "blitz" && row.mode !== "stunt") {
          continue;
        }

        const stats = statsByUser.get(row.user_id);
        if (!stats) continue;

        stats[row.mode] = {
          points: row.points ?? 0,
          attempts: row.attempts ?? 0,
          correct: row.correct ?? 0,
          bestTimeMs: row.best_time_ms ?? null,
        };
      }

      const nextEntries = profiles.map((profile) => {
        const stats = statsByUser.get(profile.id) ?? emptyStats();
        stats.totalPoints =
          stats.quiz.points +
          stats.offense_build.points +
          stats.alignment.points +
          stats.film.points +
          stats.concept.points +
          stats.blitz.points +
          stats.stunt.points;

        return {
          id: profile.id,
          name: profile.display_name || "User",
          teamCode: profile.school || "No Team",
          avatarUrl: profile.avatar_url ?? null,
          email: profile.email ?? null,
          isAdmin: ADMIN_EMAILS.includes((profile.email ?? "").toLowerCase()),
          stats,
        };
      });

      setAccountDirectoryEntries(nextEntries);
    };

    void loadAccountDirectory();
  }, [currentUser?.isAdmin, showAccountDirectory]);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.id === DEMO_USER_ID) return;

    setLeaderboardEntries((prev) => {
      const existing = prev.find((entry) => entry.id === currentUser.id);
      const nextEntry: LeaderboardEntry = {
        id: currentUser.id,
        name: currentUser.name,
        teamCode: currentUser.teamCode,
        avatarUrl: currentUser.avatarUrl ?? null,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin,
        stats: currentUser.stats,
      };

      if (!existing) {
        return [...prev, nextEntry];
      }

      return prev.map((entry) => (entry.id === currentUser.id ? nextEntry : entry));
    });
  }, [currentUser]);

  useEffect(() => {
    setScoredAttemptKeys(new Set());
    setRevealedAttemptKeys(new Set());
    setLastScoreSummary({});
  }, [currentUser?.id]);

  const effectivePlaybooks: PlaybookKey[] = mode === "offense_build" ? ["Foothill"] : selectedPlaybooks;
  const sectionModeOptions = MODE_OPTIONS.filter((option) => (
    option.section === appSection
    && !option.hiddenFromNav
    && (option.value !== "run_fit" || Boolean(currentUser?.isAdmin))
  ));
  const effectivePassConceptBoardKind: PassConceptBoardKind =
    passConceptFamilyFilter === "all" ? passConceptBoardKind : passConceptFamilyFilter;

  const pool = useMemo(() => {
    return ALL_FORMATIONS.filter((f) => effectivePlaybooks.includes(f.playbook) && (personnelFilter === "Any" || f.personnel === personnelFilter));
  }, [effectivePlaybooks, personnelFilter]);
  const formationFilterSignature = `${effectivePlaybooks.join("|")}::${personnelFilter}`;
  const current = pool[index % Math.max(pool.length, 1)] ?? ALL_FORMATIONS[0];
  const formationKey = `${current.playbook}::${current.name}`;
  const currentFormationIdentity = `${current.playbook}::${current.name}::${current.personnel}`;
  const selectedFrontsideConcept = TWO_BY_TWO_CONCEPTS.find((concept) => concept.id === selectedFrontsideConceptId) ?? TWO_BY_TWO_CONCEPTS[0];
  const selectedBacksideConcept = TWO_BY_TWO_CONCEPTS.find((concept) => concept.id === selectedBacksideConceptId) ?? TWO_BY_TWO_CONCEPTS.find((concept) => concept.id === "dagger") ?? TWO_BY_TWO_CONCEPTS[0];
  const selectedThreeByOneConcept = THREE_BY_ONE_CONCEPTS.find((concept) => concept.id === selectedThreeByOneConceptId) ?? THREE_BY_ONE_CONCEPTS[0];
  const passConceptPreview = useMemo(
    () =>
      effectivePassConceptBoardKind === "2x2"
        ? buildTwoByTwoPassConceptPreview(selectedFrontsideConcept, selectedBacksideConcept)
        : buildThreeByOnePassConceptPreview(selectedThreeByOneConcept),
    [effectivePassConceptBoardKind, selectedFrontsideConcept, selectedBacksideConcept, selectedThreeByOneConcept],
  );
  const runFitPreview = useMemo(() => {
    return buildRunFitPreview(selectedRunFitBaseBoardId, blitzRendererDeps);
  }, [selectedRunFitBaseBoardId]);
  const passConceptDefinition = passConceptPreview;
  const runFitDraftOverlay = useMemo<RouteOverlay[]>(() => {
    return buildRunFitDraftOverlay({
      runFitDraftPoints,
      runFitArrowLabel,
      runFitArrowColor,
      runFitLineWeight,
      runFitLineStyle,
      runFitLineEnd,
    });
  }, [runFitArrowColor, runFitArrowLabel, runFitDraftPoints, runFitLineEnd, runFitLineStyle, runFitLineWeight]);
  const runFitDisplayOverlays = useMemo(
    () => [...runFitRouteOverlays, ...runFitDraftOverlay],
    [runFitRouteOverlays, runFitDraftOverlay],
  );
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RUN_FIT_BOARDS_STORAGE_KEY);
      const parsed = parseRunFitStorage(raw, runFitPreview);
      setRunFitTitle(parsed.title);
      setRunFitRouteOverlays(parsed.routeOverlays);
      setRunFitFieldTags(parsed.fieldTags);
      setRunFitSavedBoards(parsed.boards);
      setRunFitSavedPathways(parsed.savedPathways);
    } catch {
      setRunFitTitle(runFitPreview.title);
      setRunFitRouteOverlays(runFitPreview.routeOverlays);
      setRunFitFieldTags(runFitPreview.fieldTags);
    }
  }, [runFitPreview]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        RUN_FIT_BOARDS_STORAGE_KEY,
        stringifyRunFitStorage({
          runFitTitle,
          runFitRouteOverlays,
          runFitFieldTags,
          runFitSavedBoards,
          runFitSavedPathways,
        }),
      );
    } catch {}
  }, [runFitFieldTags, runFitRouteOverlays, runFitSavedBoards, runFitSavedPathways, runFitTitle]);

  const passConceptQuizRoutePreview = useMemo(() => {
    return buildPassConceptQuizRoutePreview(
      passConceptViewMode,
      passConceptQuizMode,
      showPassConceptAnswers,
      passConceptPreview,
      passConceptAnswers,
    );
  }, [passConceptAnswers, passConceptPreview, passConceptQuizMode, passConceptViewMode, showPassConceptAnswers]);
  const displayFormation = useMemo(() => {
    let base;
    const buildName = mode === "offense_build" ? flipCallSide(current.name) : current.name;

    if (current.playbook === "Wing T" || current.name.startsWith("Wing T")) {
      base = buildWingTFormation(buildName, mode === "alignment");
    } else if (current.playbook === "Foothill") {
      base = buildFoothillFormation(buildName, mode === "alignment");
    } else {
      base = buildProFormation(buildName, mode === "alignment");
    }

    if (mode === "offense_build") {
      base = {
        ...base,
        name: current.name,
        runStrength: current.runStrength,
        passStrength: current.passStrength,
      };
    }

    const override = editorOverrides[formationKey];
    return override ? { ...base, ...override, players: override.players ?? base.players } : base;
  }, [current, formationKey, mode, editorOverrides]);

  const alignmentLandmarks = useMemo(() => {
    return getAlignmentLandmarks(displayFormation);
  }, [displayFormation]);
  const offenseLandmarks = useMemo(() => getOffenseBuildLandmarks(), []);

  const alignmentPlayers = alignmentPlacements[formationKey] ?? [];
  const offenseBuildPlayers = offensePlacements[formationKey] ?? [];
  const remainingDefenders = DEFENDER_TOKENS.filter((id) => !alignmentPlayers.some((p) => p.id === id));
  const remainingOffense = OFFENSE_TOKENS.filter((id) => !offenseBuildPlayers.some((p) => p.id === id));
  const leaderboardModeMeta = [
    {
      key: "quiz",
      title: "Formation Trainer",
      section: "defense",
      shellClass: "border-[#8a856f] bg-[#f8f4e6]",
      headerClass: "from-[#f4ecd5] to-[#ddd2b5]",
      columnClass: "border-[#8a856f] bg-[#e8e0c8] text-[#5a5646]",
      stripeOddClass: "border-[#d6cfb7] bg-[#faf7ec]",
      stripeEvenClass: "border-[#d6cfb7] bg-[#f2ecd9]",
    },
    {
      key: "offense_build",
      title: "Formation Trainer",
      section: "offense",
      shellClass: "border-[#7e8a74] bg-[#eef3e7]",
      headerClass: "from-[#e7f0da] to-[#cad7bc]",
      columnClass: "border-[#7e8a74] bg-[#dce7cf] text-[#4f5d48]",
      stripeOddClass: "border-[#ccd8c0] bg-[#f5faef]",
      stripeEvenClass: "border-[#ccd8c0] bg-[#eaf3df]",
    },
    {
      key: "alignment",
      title: "Alignment",
      section: "defense",
      shellClass: "border-[#7f857f] bg-[#edf1f0]",
      headerClass: "from-[#e1e6e4] to-[#c9d0cd]",
      columnClass: "border-[#7f857f] bg-[#d8dfdc] text-[#4f5652]",
      stripeOddClass: "border-[#c9d1ce] bg-[#f6f8f7]",
      stripeEvenClass: "border-[#c9d1ce] bg-[#e8eeeb]",
    },
    {
      key: "film",
      title: "Film",
      section: "defense",
      shellClass: "border-[#85766d] bg-[#f3ece8]",
      headerClass: "from-[#efe2da] to-[#d8c4b8]",
      columnClass: "border-[#85766d] bg-[#e5d5cc] text-[#5c514a]",
      stripeOddClass: "border-[#d8cac2] bg-[#fbf6f3]",
      stripeEvenClass: "border-[#d8cac2] bg-[#f1e7e1]",
    },
    {
      key: "blitz",
      title: "Blitz",
      section: "defense",
      shellClass: "border-[#826f72] bg-[#f5ebec]",
      headerClass: "from-[#f0dedf] to-[#dcc2c4]",
      columnClass: "border-[#826f72] bg-[#e6d2d4] text-[#5d4c4e]",
      stripeOddClass: "border-[#dac9ca] bg-[#fcf6f6]",
      stripeEvenClass: "border-[#dac9ca] bg-[#f3e7e8]",
    },
    {
      key: "stunt",
      title: "Stunt",
      section: "defense",
      shellClass: "border-[#7c7767] bg-[#f5f1e6]",
      headerClass: "from-[#eee6d4] to-[#d8ccb2]",
      columnClass: "border-[#7c7767] bg-[#e5dcc5] text-[#5a5342]",
      stripeOddClass: "border-[#d8cfbc] bg-[#fbf8ef]",
      stripeEvenClass: "border-[#d8cfbc] bg-[#f2ecdc]",
    },
    {
      key: "concept",
      title: "Pass Concept",
      section: "offense",
      shellClass: "border-[#6b7d8a] bg-[#edf4f7]",
      headerClass: "from-[#e2eef4] to-[#c9dce7]",
      columnClass: "border-[#6b7d8a] bg-[#d8e7ef] text-[#45555f]",
      stripeOddClass: "border-[#c7d8e1] bg-[#f7fbfd]",
      stripeEvenClass: "border-[#c7d8e1] bg-[#ebf4f8]",
    },
  ] as const;
  const leaderboardBoards = useMemo(() => {
    return leaderboardModeMeta.map(({ key, title, section, shellClass, headerClass, columnClass, stripeOddClass, stripeEvenClass }) => {
      const rankedEntries = leaderboardEntries
        .filter((entry) => !entry.isAdmin)
        .sort((a, b) => {
          const pointDiff = b.stats[key].points - a.stats[key].points;
          if (pointDiff !== 0) return pointDiff;

          const bestA = a.stats[key].bestTimeMs ?? Number.POSITIVE_INFINITY;
          const bestB = b.stats[key].bestTimeMs ?? Number.POSITIVE_INFINITY;
          if (bestA !== bestB) return bestA - bestB;

          return a.name.localeCompare(b.name);
        })
        .map((entry, idx) => ({
          ...entry,
          leaderboardRank: idx + 1,
        }));

      const entries = rankedEntries.slice(0, 10);
      const currentUserEntry =
        currentUser && !entries.some((entry) => entry.id === currentUser.id)
          ? rankedEntries.find((entry) => entry.id === currentUser.id) ?? null
          : null;

      return {
        key,
        title,
        section,
        shellClass,
        headerClass,
        columnClass,
        stripeOddClass,
        stripeEvenClass,
        entries,
        currentUserEntry,
      };
    });
  }, [leaderboardEntries, currentUser?.id]);
  const leaderboardSectionOptions = [
    { value: "offense" as const, label: "Offense" },
    { value: "defense" as const, label: "Defense" },
  ];
  const filteredLeaderboardBoards = leaderboardBoards.filter((board) => board.section === selectedLeaderboardSection);
  const selectedLeaderboardBoard =
    filteredLeaderboardBoards.find((board) => board.key === selectedLeaderboardMode) ?? filteredLeaderboardBoards[0] ?? leaderboardBoards[0];
  const sortedAccountDirectoryEntries = useMemo(() => {
    return [...accountDirectoryEntries].sort((a, b) => {
      if (accountDirectorySort === "points_desc") {
        return b.stats.totalPoints - a.stats.totalPoints || a.name.localeCompare(b.name);
      }
      if (accountDirectorySort === "points_asc") {
        return a.stats.totalPoints - b.stats.totalPoints || a.name.localeCompare(b.name);
      }
      if (accountDirectorySort === "time_desc") {
        return b.stats.secondsUsed - a.stats.secondsUsed || a.name.localeCompare(b.name);
      }
      if (accountDirectorySort === "time_asc") {
        return a.stats.secondsUsed - b.stats.secondsUsed || a.name.localeCompare(b.name);
      }

      return a.name.localeCompare(b.name);
    });
  }, [accountDirectoryEntries, accountDirectorySort]);
  useEffect(() => {
    if (!filteredLeaderboardBoards.some((board) => board.key === selectedLeaderboardMode)) {
      const fallback = filteredLeaderboardBoards[0];
      if (fallback) setSelectedLeaderboardMode(fallback.key as LeaderboardMode);
    }
  }, [filteredLeaderboardBoards, selectedLeaderboardMode]);
  const renderLeaderboardBoard = (board: (typeof leaderboardBoards)[number]) => (
    <div key={`leaderboard-board-${board.key}`} className={`overflow-hidden rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ${board.shellClass}`}>
      <div className={`border-b bg-gradient-to-b px-4 py-3 text-center ${board.columnClass.split(" ")[0]} ${board.headerClass}`}>
        <div className="flex justify-center">
          <div className="border-b-2 border-[#7b6f42] px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5f5b48]">
            {board.title}
          </div>
        </div>
        <div className="mt-1 text-lg font-black uppercase tracking-[0.12em] text-[#23241d]">Leaders</div>
      </div>
      <div className={`grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b px-2 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${board.columnClass}`}>
        <div className="border-r border-[#b7b09a] px-2 text-center">Pos</div>
        <div className="border-r border-[#b7b09a] px-3">Player</div>
        <div className="border-r border-[#b7b09a] px-2 text-center">Pts</div>
        <div className="px-2 text-center">Best</div>
      </div>
      <div>
        {board.entries.length ? (
          board.entries.map((entry, idx) => (
            <div
              key={`${board.key}-${entry.id}`}
              className={
                entry.id === currentUser?.id
                  ? "grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b border-[#5d8d62] bg-[#dff0dd] text-sm last:border-b-0"
                  : idx % 2 === 0
                    ? `grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b text-sm last:border-b-0 ${board.stripeOddClass}`
                    : `grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b text-sm last:border-b-0 ${board.stripeEvenClass}`
              }
            >
              <div className="border-r border-[#d0c8ae] px-2 py-2 text-center">
                <div
                  className={
                    idx === 0
                      ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#9b8430] bg-[#d9bf55] text-[11px] font-black text-[#2b2618]"
                      : idx === 1
                        ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#8b8d93] bg-[#d7d9dd] text-[11px] font-black text-[#2b2d32]"
                        : idx === 2
                          ? "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#866243] bg-[#b88458] text-[11px] font-black text-white"
                          : "inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#b7b09a] bg-[#efe7cf] text-[11px] font-black text-[#474334]"
                  }
                >
                  {entry.leaderboardRank}
                </div>
              </div>
              <div className="min-w-0 border-r border-[#d0c8ae] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <AvatarBadge name={entry.name} avatarUrl={entry.avatarUrl} className="h-8 w-8" textClassName="text-[10px]" />
                  <div className="truncate font-semibold uppercase tracking-[0.04em] text-[#23241d]">
                    {entry.name}
                  </div>
                </div>
                {entry.id === currentUser?.id ? (
                  <div className="text-[11px] text-[#6d6857]">You</div>
                ) : null}
              </div>
              <div className="border-r border-[#d0c8ae] px-2 py-2 text-center">
                <div className="font-black text-[#202119]">{entry.stats[board.key].points}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#78715b]">Pts</div>
              </div>
              <div className="px-2 py-2 text-center">
                <div className="text-[11px] font-semibold text-[#4f4b3f]">
                  {entry.stats[board.key].bestTimeMs
                    ? `${(entry.stats[board.key].bestTimeMs / 1000).toFixed(1)}s best`
                    : "—"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-sm text-[#6e6a5c]">
            No scores yet for this team.
          </div>
        )}
        {board.currentUserEntry ? (
          <>
            <div className="grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b border-[#d6cfb7] bg-[#ddd4bc] text-[10px] font-bold uppercase tracking-[0.16em] text-[#6a654f] last:border-b-0">
              <div className="col-span-4 px-4 py-1.5 text-center">Your Standing</div>
            </div>
            <div className="grid grid-cols-[42px_minmax(0,1fr)_56px_58px] items-center gap-0 border-b border-[#5d8d62] bg-[#dff0dd] text-sm last:border-b-0">
              <div className="border-r border-[#b5cfb4] px-2 py-2 text-center">
                <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-[#5d8d62] bg-[#bfe0bd] px-2 text-[11px] font-black text-[#244127]">
                  {board.currentUserEntry.leaderboardRank}
                </div>
              </div>
              <div className="min-w-0 border-r border-[#b5cfb4] px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <AvatarBadge
                    name={board.currentUserEntry.name}
                    avatarUrl={board.currentUserEntry.avatarUrl}
                    className="h-8 w-8"
                    textClassName="text-[10px]"
                  />
                  <div className="truncate font-semibold uppercase tracking-[0.04em] text-[#23241d]">
                    {board.currentUserEntry.name}
                  </div>
                </div>
                <div className="text-[11px] text-[#4c6a4f]">You</div>
              </div>
              <div className="border-r border-[#b5cfb4] px-2 py-2 text-center">
                <div className="font-black text-[#202119]">{board.currentUserEntry.stats[board.key].points}</div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4c6a4f]">Pts</div>
              </div>
              <div className="px-2 py-2 text-center">
                <div className="text-[11px] font-semibold text-[#36513a]">
                  {board.currentUserEntry.stats[board.key].bestTimeMs
                    ? `${(board.currentUserEntry.stats[board.key].bestTimeMs / 1000).toFixed(1)}s best`
                    : "—"}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
  const formationSelectGroups = useMemo(() => {
    const personnelOrder = Array.from({ length: 12 }, (_, idx) => String(idx + 10));
    const nameCounts = new Map<string, number>();

    pool.forEach((formation) => {
      const key = `${formation.personnel}::${formation.name}`;
      nameCounts.set(key, (nameCounts.get(key) ?? 0) + 1);
    });

    return personnelOrder
      .map((personnel) => {
        const options = pool
          .map((formation, idx) => ({
            value: `${formation.playbook}::${formation.name}::${formation.personnel}::${idx}`,
            label:
              (nameCounts.get(`${formation.personnel}::${formation.name}`) ?? 0) > 1
                ? `${formation.name} · ${formation.playbook}`
                : formation.name,
            index: idx,
            personnel: formation.personnel,
          }))
          .filter((option) => option.personnel === personnel)
          .sort((a, b) => a.label.localeCompare(b.label));

        return {
          personnel,
          options,
        };
      })
      .filter((group) => group.options.length > 0);
  }, [pool]);
  const activeFilmClips = useMemo(
    () => getActiveFilmClips(filmClips, filmSubmode, filmFormationFilter, filmTeamFilter),
    [filmClips, filmSubmode, filmFormationFilter, filmTeamFilter],
  );
  const filmFormationKeyOptions = useMemo(() => getFilmFormationKeyOptions(filmClips), [filmClips]);
  const filmTeamTagOptions = useMemo(() => getFilmTeamTagOptions(filmClips), [filmClips]);
  const filmTeamTagSelectOptions = useMemo(
    () => getFilmTeamTagSelectOptions(currentUser?.teamCode, filmDraft.teamTag, filmEditDraft.teamTag, filmTeamTagOptions),
    [currentUser?.teamCode, filmDraft.teamTag, filmEditDraft.teamTag, filmTeamTagOptions],
  );
  const safeFilmFormationFilter = getSafeFilmFormationFilter(filmFormationFilter, filmFormationKeyOptions);
  const safeFilmTeamFilter = getSafeFilmTeamFilter(filmTeamFilter, filmTeamTagOptions);
  const filmClipGroups = useMemo(() => buildFilmClipGroups(activeFilmClips), [activeFilmClips]);
  const selectedFilmClip = useMemo(
    () => getSelectedFilmClip(activeFilmClips, selectedFilmClipId),
    [activeFilmClips, selectedFilmClipId],
  );
  const passConceptResult = getPassConceptRouteResult(passConceptDefinition, passConceptAnswers);
  const passConceptScore = getPassConceptScore(passConceptDefinition, passConceptResult);
  const availablePassConceptNames = useMemo(
    () => getAvailablePassConceptNames(effectivePassConceptBoardKind),
    [effectivePassConceptBoardKind],
  );
  const passConceptIdentifyResult = getPassConceptIdentifyResult(
    passConceptDefinition,
    passConceptNameAnswer,
    passConceptFrontsideNameAnswer,
    passConceptBacksideNameAnswer,
  );
  const passConceptFrontsideNameResult = passConceptIdentifyResult.frontsideNameResult;
  const passConceptBacksideNameResult = passConceptIdentifyResult.backsideNameResult;
  const passConceptNameResult = passConceptIdentifyResult.nameResult;
  const passConceptIdentifyScore = passConceptIdentifyResult.identifyScore;
  const passConceptIdentifyQuestionCount = passConceptIdentifyResult.identifyQuestionCount;

  useEffect(() => {
    if (!didHydrateViewStateRef.current) return;

    try {
      const rawViewState = window.localStorage.getItem(VIEW_STATE_STORAGE_KEY);
      const savedViewState = rawViewState ? JSON.parse(rawViewState) : {};
      window.localStorage.setItem(
        VIEW_STATE_STORAGE_KEY,
        JSON.stringify({
          ...savedViewState,
          studyFormation:
            mode === "study"
              ? currentFormationIdentity
              : savedViewState?.studyFormation ?? null,
          alignmentStudyFormation:
            mode === "alignment" && alignmentViewMode === "study"
              ? currentFormationIdentity
              : savedViewState?.alignmentStudyFormation ?? null,
        }),
      );
    } catch {}
  }, [mode, alignmentViewMode, currentFormationIdentity]);

  useEffect(() => {
    if (!filmClips.length) {
      if (selectedFilmClipId) setSelectedFilmClipId("");
      return;
    }

    if (!selectedFilmClipId || !filmClips.some((clip) => clip.id === selectedFilmClipId)) {
      setSelectedFilmClipId(filmClips[0].id);
    }
  }, [filmClips, selectedFilmClipId]);

  useEffect(() => {
    if (filmFormationFilter !== "all" && safeFilmFormationFilter === "all") {
      setFilmFormationFilter("all");
    }
    if (filmTeamFilter !== "all" && safeFilmTeamFilter === "all") {
      setFilmTeamFilter("all");
    }
  }, [filmFormationFilter, filmTeamFilter, safeFilmFormationFilter, safeFilmTeamFilter]);

  useEffect(() => {
    setFilmStarted(false);
    setFilmPlaybackNonce(0);
  }, [selectedFilmClipId, filmViewMode, filmSubmode]);

  useEffect(() => {
    setFilmStudyCurrentTime(0);
    setFilmStudyDuration(0);
  }, [selectedFilmClipId, filmPlaybackNonce]);

  useEffect(() => {
    if (filmViewMode !== "study") return;

    const updateStudyTime = () => {
      const video = filmStudyVideoRef.current;
      if (video) {
        setFilmStudyCurrentTime(video.currentTime || 0);
        setFilmStudyDuration(video.duration || 0);
      }
      filmStudyTimeRafRef.current = window.requestAnimationFrame(updateStudyTime);
    };

    filmStudyTimeRafRef.current = window.requestAnimationFrame(updateStudyTime);

    return () => {
      if (filmStudyTimeRafRef.current !== null) {
        window.cancelAnimationFrame(filmStudyTimeRafRef.current);
        filmStudyTimeRafRef.current = null;
      }
    };
  }, [filmViewMode, selectedFilmClipId, filmPlaybackNonce]);

  useEffect(() => {
    setFilmQuizAnswers({ ...DEFAULT_FILM_QUIZ_ANSWERS });
    setShowFilmQuizFeedback(false);
    setShowFilmQuizAnswers(false);
    setFilmQuizStarted(false);
    setFilmQuizFinished(false);
    setFilmQuizPlaysUsed(0);
  }, [selectedFilmClipId]);

  useEffect(() => {
    if (mode !== "film" || !filmClips.length) return;

    const signature = `${mode}:${filmSubmode}:${filmViewMode}:${filmSubmode === "formation_key" ? filmFormationFilter : filmSubmode === "team_key" ? filmTeamFilter : "all"}`;
    const clipPool = activeFilmClips;
    if (!clipPool.length) {
      if (selectedFilmClipId) setSelectedFilmClipId("");
      return;
    }
    const hasValidSelection = Boolean(
      selectedFilmClipId && clipPool.some((clip) => clip.id === selectedFilmClipId),
    );
    const shouldRandomize =
      lastFilmRandomizeSignatureRef.current !== signature || !hasValidSelection;

    if (shouldRandomize) {
      advanceRepAttempt();
      const currentIndex = selectedFilmClipId
        ? clipPool.findIndex((clip) => clip.id === selectedFilmClipId)
        : undefined;
      const nextIndex =
        filmViewMode === "quiz"
          ? getRandomPoolIndex(clipPool.length, currentIndex >= 0 ? currentIndex : undefined)
          : getRandomPoolIndex(clipPool.length);
      setSelectedFilmClipId(clipPool[nextIndex].id);
      lastFilmRandomizeSignatureRef.current = signature;
    }
  }, [mode, filmSubmode, filmViewMode, filmFormationFilter, filmTeamFilter, filmClips, activeFilmClips, selectedFilmClipId]);

  useEffect(() => {
    if (!selectedFilmClip) return;
    setFilmEditDraft(getFilmEditDraftFromClip(selectedFilmClip));
  }, [selectedFilmClip]);

  useEffect(() => {
    if (pendingDuplicateFilmSignature) {
      setPendingDuplicateFilmSignature(null);
    }
  }, [filmDraft]);

  useEffect(() => {
    setShowFilmAdminTools(Boolean(currentUser?.isAdmin));
  }, [currentUser?.isAdmin]);

  const getRandomPoolIndex = (length: number, currentIndex?: number) => {
    if (length <= 1) return 0;

    let nextIndex = Math.floor(Math.random() * length);
    if (typeof currentIndex === "number") {
      const normalizedCurrent = ((currentIndex % length) + length) % length;
      while (nextIndex === normalizedCurrent) {
        nextIndex = Math.floor(Math.random() * length);
      }
    }

    return nextIndex;
  };

  const advanceRepAttempt = () => {
    setRepAttemptId((prev) => prev + 1);
    setLastScoreSummary({});
    setShowQuizFeedback(false);
    setShowQuizAnswers(false);
    setQuizReadyForNext(false);
    setShowFilmQuizFeedback(false);
    setShowFilmQuizAnswers(false);
    setShowPassConceptFeedback(false);
    setShowPassConceptAnswers(false);
    setShowOffenseCheck(false);
    setShowAlignmentCheck(false);
    setAttemptStartedAt(Date.now());
  };

  const getRepAttemptKey = (baseKey: string) => `${baseKey}::rep-${repAttemptId}`;

  useEffect(() => {
    setShowQuizFeedback(false);
    setShowQuizAnswers(false);
    setQuizReadyForNext(false);
    setShowPassConceptFeedback(false);
    setShowPassConceptAnswers(false);
    setPassConceptAnswers({ X: "", H: "", Y: "", Z: "" });
    setShowAlignmentCheck(false);
    setShowOffenseCheck(false);
    setEditingAlignmentAnswers(false);
    setQuizAnswers({ formation: "", runStrength: "", passStrength: "" });
  }, [current.name, mode, formationTrainerViewMode, alignmentViewMode, frontMode]);

  useEffect(() => {
    if (passConceptFamilyFilter !== "all") {
      setPassConceptBoardKind(passConceptFamilyFilter);
    }
  }, [passConceptFamilyFilter]);

  useEffect(() => {
    if (passConceptViewMode !== "quiz") return;

    advanceRepAttempt();
    const nextBoardKind: PassConceptBoardKind =
      passConceptFamilyFilter === "all"
        ? (Math.random() < 0.5 ? "2x2" : "3x1")
        : passConceptFamilyFilter;

    setPassConceptBoardKind(nextBoardKind);

    if (nextBoardKind === "2x2") {
      const nextFrontIndex = getRandomPoolIndex(
        TWO_BY_TWO_CONCEPTS.length,
        TWO_BY_TWO_CONCEPTS.findIndex((concept) => concept.id === selectedFrontsideConceptId),
      );
      const nextBackIndex = getRandomPoolIndex(
        TWO_BY_TWO_CONCEPTS.length,
        TWO_BY_TWO_CONCEPTS.findIndex((concept) => concept.id === selectedBacksideConceptId),
      );
      setSelectedFrontsideConceptId(TWO_BY_TWO_CONCEPTS[nextFrontIndex].id);
      setSelectedBacksideConceptId(TWO_BY_TWO_CONCEPTS[nextBackIndex].id);
    } else {
      const nextThreeByOneIndex = getRandomPoolIndex(
        THREE_BY_ONE_CONCEPTS.length,
        THREE_BY_ONE_CONCEPTS.findIndex((concept) => concept.id === selectedThreeByOneConceptId),
      );
      setSelectedThreeByOneConceptId(THREE_BY_ONE_CONCEPTS[nextThreeByOneIndex].id);
    }
  }, [passConceptViewMode, passConceptQuizMode, passConceptFamilyFilter]);

  useEffect(() => {
    setShowPassConceptFeedback(false);
    setShowPassConceptAnswers(false);
    setPassConceptAnswers({ X: "", H: "", Y: "", Z: "" });
    setPassConceptNameAnswer("");
    setPassConceptFrontsideNameAnswer("");
    setPassConceptBacksideNameAnswer("");
  }, [passConceptViewMode, passConceptQuizMode, effectivePassConceptBoardKind, selectedFrontsideConceptId, selectedBacksideConceptId, selectedThreeByOneConceptId]);

  useEffect(() => {
    if (!pool.length) return;
    if (skipNextModeRandomizeRef.current) {
      skipNextModeRandomizeRef.current = false;
      previousModeRef.current = mode;
      previousAlignmentViewModeRef.current = alignmentViewMode;
      return;
    }

    const previousMode = previousModeRef.current;
    const previousAlignmentViewMode = previousAlignmentViewModeRef.current;

    let shouldRandomize = false;

    if (mode !== previousMode) {
      shouldRandomize =
        (mode === "study" && formationTrainerViewMode === "quiz") ||
        mode === "quiz" ||
        mode === "offense_build" ||
        (mode === "alignment" && alignmentViewMode === "quiz");
    } else if (
      mode === "study" &&
      formationTrainerViewMode === "quiz"
    ) {
      shouldRandomize = true;
    } else if (
      mode === "alignment" &&
      alignmentViewMode !== previousAlignmentViewMode &&
      alignmentViewMode === "quiz"
    ) {
      shouldRandomize = true;
    }

    if (shouldRandomize) {
      advanceRepAttempt();
      setIndex((prev) => getRandomPoolIndex(pool.length, prev));
    }

    previousModeRef.current = mode;
    previousAlignmentViewModeRef.current = alignmentViewMode;
  }, [mode, formationTrainerViewMode, alignmentViewMode, pool.length]);

  useEffect(() => {
    if (!pool.length) return;

    const previousSignature = previousFormationFilterSignatureRef.current;
    previousFormationFilterSignatureRef.current = formationFilterSignature;

    if (!previousSignature || previousSignature === formationFilterSignature) return;

    const shouldRefreshQuizRep =
      (mode === "study" && formationTrainerViewMode === "quiz") ||
      mode === "quiz" ||
      (mode === "alignment" && alignmentViewMode === "quiz") ||
      (mode === "offense_build" && offenseBuildViewMode === "quiz");

    if (!shouldRefreshQuizRep) return;

    advanceRepAttempt();
    setIndex((prev) => getRandomPoolIndex(pool.length, prev));
    setShowQuizFeedback(false);
    setShowQuizAnswers(false);
    setQuizReadyForNext(false);
    setQuizAnswers({ formation: "", runStrength: "", passStrength: "" });
    setShowAlignmentCheck(false);
    setShowOffenseCheck(false);
  }, [
    alignmentViewMode,
    formationFilterSignature,
    formationTrainerViewMode,
    mode,
    offenseBuildViewMode,
    pool.length,
  ]);

  useEffect(() => {
    if (!pool.length) return;
    setIndex((prev) => {
      const normalized = ((prev % pool.length) + pool.length) % pool.length;
      return normalized;
    });
  }, [pool.length]);

  useEffect(() => {
    if (
      !didHydrateViewStateRef.current ||
      mode !== "study" ||
      !pool.length ||
      !pendingStudyFormationRef.current
    ) {
      return;
    }

    const savedFormation = pendingStudyFormationRef.current;
    const savedIndex = pool.findIndex(
      (formation) =>
        `${formation.playbook}::${formation.name}::${formation.personnel}` === savedFormation,
    );

    pendingStudyFormationRef.current = null;

    if (savedIndex >= 0) {
      setIndex(savedIndex);
    }
  }, [mode, pool]);

  useEffect(() => {
    if (
      !didHydrateViewStateRef.current ||
      mode !== "alignment" ||
      alignmentViewMode !== "study" ||
      !pool.length ||
      !pendingAlignmentStudyFormationRef.current
    ) {
      return;
    }

    const savedFormation = pendingAlignmentStudyFormationRef.current;
    const savedIndex = pool.findIndex(
      (formation) =>
        `${formation.playbook}::${formation.name}::${formation.personnel}` === savedFormation,
    );

    pendingAlignmentStudyFormationRef.current = null;

    if (savedIndex >= 0) {
      setIndex(savedIndex);
    }
  }, [mode, alignmentViewMode, pool]);

  useEffect(() => {
    setEditorDraft({
      name: displayFormation.name,
      personnel: displayFormation.personnel,
      runStrength: displayFormation.runStrength,
      passStrength: displayFormation.passStrength,
      backfield: displayFormation.backfield,
    });
  }, [displayFormation]);

  const nextCall = () => {
    advanceRepAttempt();
    if (mode === "film") {
      const clipPool = activeFilmClips;
      if (!clipPool.length) return;
      setSelectedFilmClipId((prev) => {
        if (clipPool.length === 1) return clipPool[0].id;
        const currentIndex = clipPool.findIndex((clip) => clip.id === prev);
        const nextIndex = getRandomPoolIndex(clipPool.length, currentIndex >= 0 ? currentIndex : undefined);
        return clipPool[nextIndex].id;
      });
      return;
    }
    if (mode === "concept") {
      const nextBoardKind: PassConceptBoardKind =
        passConceptFamilyFilter === "all"
          ? (Math.random() < 0.5 ? "2x2" : "3x1")
          : passConceptFamilyFilter;
      setPassConceptBoardKind(nextBoardKind);
      if (nextBoardKind === "2x2") {
        const nextFrontIndex = getRandomPoolIndex(TWO_BY_TWO_CONCEPTS.length, TWO_BY_TWO_CONCEPTS.findIndex((concept) => concept.id === selectedFrontsideConceptId));
        const nextBackIndex = getRandomPoolIndex(TWO_BY_TWO_CONCEPTS.length, TWO_BY_TWO_CONCEPTS.findIndex((concept) => concept.id === selectedBacksideConceptId));
        setSelectedFrontsideConceptId(TWO_BY_TWO_CONCEPTS[nextFrontIndex].id);
        setSelectedBacksideConceptId(TWO_BY_TWO_CONCEPTS[nextBackIndex].id);
      } else {
        const nextThreeByOneIndex = getRandomPoolIndex(THREE_BY_ONE_CONCEPTS.length, THREE_BY_ONE_CONCEPTS.findIndex((concept) => concept.id === selectedThreeByOneConceptId));
        setSelectedThreeByOneConceptId(THREE_BY_ONE_CONCEPTS[nextThreeByOneIndex].id);
      }
      setShowPassConceptFeedback(false);
      setShowPassConceptAnswers(false);
      setPassConceptAnswers({ X: "", H: "", Y: "", Z: "" });
      return;
    }
    if (!pool.length) return;
    setIndex((prev) => {
      if (pool.length === 1) return 0;
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * pool.length);
      }
      return next;
    });
  };

  const uploadProfileAvatar = async (file: File | null) => {
    if (!file || !currentUser) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarUploadNotice({
        tone: "error",
        message: "Use a PNG, JPG, or WEBP image.",
      });
      return;
    }

    const supabase = createClient();
    const extension = file.name.split(".").pop()?.toLowerCase() || "png";
    const storagePath = `${currentUser.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(storagePath, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      console.error("Failed to upload profile avatar", uploadError);
      setAvatarUploadNotice({
        tone: "error",
        message: "Avatar upload failed. Check bucket setup and try again.",
      });
      return;
    }

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);
    const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", currentUser.id);

    if (profileError) {
      console.error("Failed to save avatar URL", profileError);
      setAvatarUploadNotice({
        tone: "error",
        message: "Avatar uploaded but profile update failed.",
      });
      return;
    }

    setCurrentUser((prev) => (prev ? { ...prev, avatarUrl } : prev));
    setLeaderboardEntries((prev) =>
      prev.map((entry) => (entry.id === currentUser.id ? { ...entry, avatarUrl } : entry)),
    );
    setAvatarUploadResetKey((prev) => prev + 1);
    setAvatarUploadNotice({
      tone: "success",
      message: "Profile picture saved.",
    });
  };

  const nextFilmQuizClip = () => {
    const clipPool = activeFilmClips;
    if (!clipPool.length) return;
    advanceRepAttempt();
    const currentIndex = selectedFilmClip ? clipPool.findIndex((clip) => clip.id === selectedFilmClip.id) : undefined;
    const nextIndex = getRandomPoolIndex(clipPool.length, currentIndex >= 0 ? currentIndex : undefined);
    setSelectedFilmClipId(clipPool[nextIndex].id);
    setFilmQuizAnswers({ ...DEFAULT_FILM_QUIZ_ANSWERS });
    setShowFilmQuizFeedback(false);
    setShowFilmQuizAnswers(false);
    setFilmQuizStarted(false);
    setFilmQuizFinished(false);
    setFilmQuizPlaysUsed(0);
  };

  useEffect(() => {
    if (mode !== "film" || filmViewMode !== "quiz" || !showFilmQuizFeedback) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") return;
      event.preventDefault();
      nextFilmQuizClip();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mode, filmViewMode, showFilmQuizFeedback, nextFilmQuizClip]);

  const startFilmQuizClip = () => {
    const maxPlays = 1;
    if (filmQuizPlaysUsed >= maxPlays) return;
    setFilmQuizStarted(true);
    setFilmQuizFinished(false);
    setShowFilmQuizFeedback(false);
    setShowFilmQuizAnswers(false);
    setFilmQuizPlaysUsed((prev) => prev + 1);
    setFilmPlaybackNonce((prev) => prev + 1);
    setAttemptStartedAt(Date.now());
  };

  const submitFilmQuiz = () => {
    setShowFilmQuizFeedback(true);
    setShowFilmQuizAnswers(false);
  };

  const addFilmClip = () => {
    void (async () => {
      const clipBucket = deriveFilmClipBucket(filmDraft);
      const title = clipBucket;
      const sourceType = filmDraft.sourceType;
      const quizStartSeconds = parseTrimSeconds(filmDraft.quizStartSeconds);
      const quizEndSeconds = parseTrimSeconds(filmDraft.quizEndSeconds);
      const remoteStudyUrl = filmDraft.remoteStudyUrl.trim();
      const remoteQuizUrl = filmDraft.remoteQuizUrl.trim();
      const studyFile = filmDraft.studyFile;
      const quizFile = filmDraft.quizFile;
      if (!clipBucket) {
        setFilmSaveNotice({
          tone: "error",
          message: "Choose the clip metadata before saving.",
        });
        return;
      }
      if (!remoteStudyUrl && !studyFile) {
        setFilmSaveNotice({
          tone: "error",
          message: "Add a study clip URL or upload a study clip before saving.",
        });
        return;
      }
      if (quizStartSeconds !== null && quizEndSeconds !== null && quizEndSeconds <= quizStartSeconds) {
        setFilmSaveNotice({
          tone: "error",
          message: "Quiz end time must be greater than quiz start time.",
        });
        return;
      }

      const duplicateCandidate = getFilmDuplicateCandidate(filmClips, filmDraft);
      const duplicateSignature = duplicateCandidate ? `${duplicateCandidate.id}:${duplicateCandidate.studyFileName ?? duplicateCandidate.studyUrl}` : null;
      if (duplicateCandidate && pendingDuplicateFilmSignature !== duplicateSignature) {
        setPendingDuplicateFilmSignature(duplicateSignature);
        setFilmSaveNotice({
          tone: "warning",
          message: `This looks like a duplicate of ${duplicateCandidate.clipBucket}${duplicateCandidate.studyFileName ? ` (${duplicateCandidate.studyFileName})` : ""}. Press Save Clip again to confirm.`,
        });
        return;
      }

      setPendingDuplicateFilmSignature(null);

      const hasSupabaseUpload = Boolean(currentUser && (studyFile || quizFile));
      if (hasSupabaseUpload) {
        const supabase = createClient();
        const clipId = `film-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const titleSlug = slugifyFilePart(title);

        const uploadAsset = async (variant: "study" | "quiz", file: File | null) => {
          if (!file) return { publicUrl: "", storagePath: null as string | null, fileName: undefined as string | undefined };
          const extension = file.name.includes(".") ? file.name.split(".").pop() : "mp4";
          const storagePath = `${currentUser!.id}/${clipId}/${variant}-${titleSlug}.${extension}`;
          const { error: uploadError } = await supabase.storage.from(FILM_BUCKET).upload(storagePath, file, {
            upsert: false,
            cacheControl: "3600",
          });
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from(FILM_BUCKET).getPublicUrl(storagePath);
          return { publicUrl: data.publicUrl, storagePath, fileName: file.name };
        };

        try {
          const studyAsset = await uploadAsset("study", studyFile);
          const quizAsset = await uploadAsset("quiz", quizFile);

          const studyUrl = studyAsset.publicUrl || remoteStudyUrl;
          const quizUrl = quizAsset.publicUrl || remoteQuizUrl || null;
          const nextClip = buildFilmClipFromDraft({
            id: clipId,
            title,
            clipBucket,
            draft: filmDraft,
            studyUrl,
            quizUrl,
            quizStartSeconds,
            quizEndSeconds,
            studyStoragePath: studyAsset.storagePath,
            quizStoragePath: quizAsset.storagePath,
            kind: "supabase",
            studyFileName: studyAsset.fileName ?? studyFile?.name,
            quizFileName: quizAsset.fileName ?? quizFile?.name,
            studyFileSize: studyFile?.size ?? null,
            quizFileSize: quizFile?.size ?? null,
          });

          let { error: insertError } = await supabase.from("film_clips").insert(buildFilmClipInsertPayload(nextClip, currentUser.id));

          if (insertError?.code === "PGRST204" || insertError?.message?.includes("formation_key") || insertError?.message?.includes("team_tag")) {
            const fallbackResult = await supabase.from("film_clips").insert(buildFilmClipFallbackInsertPayload(nextClip, currentUser.id));
            insertError = fallbackResult.error;
          }

          if (insertError) throw insertError;

          setFilmClips((prev) => [nextClip, ...prev.filter((clip) => clip.id !== nextClip.id)]);
          setSelectedFilmClipId(nextClip.id);
          setFilmAdminPanelMode("edit");
          setShowFilmAdminTools(true);
          setFilmSaveNotice({
            tone: "success",
            message: `Saved ${nextClip.clipBucket} to the film library.`,
          });
        } catch (error) {
          console.error("Failed to save film clip", error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          const selectedFiles = [
            studyFile ? `study ${studyFile.name} (${formatFileSize(studyFile.size)})` : null,
            quizFile ? `quiz ${quizFile.name} (${formatFileSize(quizFile.size)})` : null,
          ].filter(Boolean);
          setFilmSaveNotice({
            tone: "error",
            message: errorMessage.includes("maximum allowed size")
              ? `Clip save failed because the file is larger than your Supabase Storage size limit.${selectedFiles.length ? ` Selected: ${selectedFiles.join(" • ")}.` : ""}`
              : "Clip save failed. Check the video file or URL and try again.",
          });
          return;
        }
      } else {
        let studyUrl = remoteStudyUrl;
        let quizUrl = remoteQuizUrl || null;
        let kind: FilmClip["kind"] = "remote";
        let studyFileName: string | undefined;
        let quizFileName: string | undefined;

        if (studyFile) {
          studyUrl = URL.createObjectURL(studyFile);
          kind = "local";
          studyFileName = studyFile.name;
          videoObjectUrlsRef.current.push(studyUrl);
        }

        if (quizFile) {
          quizUrl = URL.createObjectURL(quizFile);
          kind = "local";
          quizFileName = quizFile.name;
          videoObjectUrlsRef.current.push(quizUrl);
        }

        const nextClip = buildFilmClipFromDraft({
          id: `film-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          clipBucket,
          draft: filmDraft,
          studyUrl,
          quizUrl,
          quizStartSeconds,
          quizEndSeconds,
          studyStoragePath: null,
          quizStoragePath: null,
          kind,
          studyFileName,
          quizFileName,
          studyFileSize: studyFile?.size ?? null,
          quizFileSize: quizFile?.size ?? null,
        });

        setFilmClips((prev) => [nextClip, ...prev]);
        setSelectedFilmClipId(nextClip.id);
        setFilmAdminPanelMode("edit");
        setShowFilmAdminTools(true);
        setFilmSaveNotice({
          tone: "success",
          message: `Saved ${nextClip.clipBucket} to the film library.`,
        });
      }

      setFilmStarted(false);
      setFilmPlaybackNonce(0);
      setPendingDuplicateFilmSignature(null);
      setFilmDraft({ ...RESET_FILM_DRAFT_AFTER_SAVE });
      setFilmUploadResetKey((prev) => prev + 1);
    })();
  };

  const saveFilmMetadata = () => {
    void (async () => {
      if (!currentUser?.isAdmin || !selectedFilmClip) return;

      const clipBucket = deriveFilmClipBucket(filmEditDraft);
      const quizStartSeconds = parseTrimSeconds(filmEditDraft.quizStartSeconds);
      const quizEndSeconds = parseTrimSeconds(filmEditDraft.quizEndSeconds);
      if (quizStartSeconds !== null && quizEndSeconds !== null && quizEndSeconds <= quizStartSeconds) {
        setFilmSaveNotice({
          tone: "error",
          message: "Quiz end time must be greater than quiz start time.",
        });
        return;
      }
      const nextClip = buildFilmClipFromDraft({
        id: selectedFilmClip.id,
        title: clipBucket,
        clipBucket,
        draft: filmEditDraft,
        studyUrl: selectedFilmClip.studyUrl,
        quizUrl: selectedFilmClip.quizUrl ?? null,
        quizStartSeconds,
        quizEndSeconds,
        studyStoragePath: selectedFilmClip.studyStoragePath ?? null,
        quizStoragePath: selectedFilmClip.quizStoragePath ?? null,
        kind: selectedFilmClip.kind,
        studyFileName: selectedFilmClip.studyFileName,
        quizFileName: selectedFilmClip.quizFileName,
        studyFileSize: selectedFilmClip.studyFileSize,
        quizFileSize: selectedFilmClip.quizFileSize,
        existingClip: selectedFilmClip,
      });

      try {
        if (selectedFilmClip.kind === "supabase") {
          const supabase = createClient();
          const updatePayload = buildFilmClipUpdatePayload(nextClip);
          let updateResult = await supabase
            .from("film_clips")
            .update(updatePayload)
            .eq("id", selectedFilmClip.id)
            .select("id")
            .maybeSingle();
          let error = updateResult.error;
          let updatedRow = updateResult.data;

          if (error?.code === "PGRST204" || error?.message?.includes("zone_type") || error?.message?.includes("formation_key") || error?.message?.includes("team_tag")) {
            updateResult = await supabase
              .from("film_clips")
              .update(buildFilmClipFallbackUpdatePayload(nextClip))
              .eq("id", selectedFilmClip.id)
              .select("id")
              .maybeSingle();
            error = updateResult.error;
            updatedRow = updateResult.data;
          }

          if (error) throw error;
          if (!updatedRow) {
            throw new Error("No film clip row was updated. This usually means your Supabase policies do not allow this account to edit that clip.");
          }
        }

        setFilmClips((prev) => prev.map((clip) => (clip.id === nextClip.id ? nextClip : clip)));
        setFilmSaveNotice({
          tone: "success",
          message: `Updated ${nextClip.clipBucket}.`,
        });
      } catch (error) {
        if (error && typeof error === "object" && "message" in error) {
          const typedError = error as {
            message?: string;
            details?: string | null;
            hint?: string | null;
            code?: string | null;
          };
          console.error("Failed to update film clip metadata", {
            message: typedError.message,
            details: typedError.details,
            hint: typedError.hint,
            code: typedError.code,
          });
        } else {
          console.error("Failed to update film clip metadata", error);
        }
        setFilmSaveNotice({
          tone: "error",
          message:
            error instanceof Error && error.message
              ? `Clip update failed: ${error.message}`
              : "Clip update failed. Check the file or URL changes and try again.",
        });
      }
    })();
  };

  const addDefender = (id: string) => {
    if (alignmentPlayers.some((p) => p.id === id)) return;
    setAlignmentPlacements((prev) => ({ ...prev, [formationKey]: [...alignmentPlayers, { id, x: 50, y: 80 }] }));
  };

  const moveDefender = (id: string, x: number, y: number) => {
    setAlignmentPlacements((prev) => ({
      ...prev,
      [formationKey]: alignmentPlayers.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  };

  const addOffense = (id: string) => {
    if (offenseBuildPlayers.some((p) => p.id === id)) return;
    const defaultPoint = nearestLandmark(50, 80, offenseLandmarks);
    setOffensePlacements((prev) => ({ ...prev, [formationKey]: [...offenseBuildPlayers, { id, x: defaultPoint.x, y: defaultPoint.y }] }));
  };

  const moveOffense = (id: string, x: number, y: number) => {
    setOffensePlacements((prev) => ({
      ...prev,
      [formationKey]: offenseBuildPlayers.map((p) => (p.id === id ? { ...p, x, y } : p)),
    }));
  };

  const moveEditorPlayer = (id: string, x: number, y: number) => {
    setEditorOverrides((prev) => ({
      ...prev,
      [formationKey]: {
        ...displayFormation,
        ...prev[formationKey],
        players: displayFormation.players.map((p) => (p.id === id ? { ...p, x, y } : p)),
      },
    }));
  };

  const addCustomAlignmentLandmark = () => {
    const label = customLandmarkDraft.label.trim();
    if (!label) return;
    const x = clamp(Number(customLandmarkDraft.x || 0), 2, 98);
    const y = clamp(Number(customLandmarkDraft.y || 0), 2, 98);
    if (Number.isNaN(x) || Number.isNaN(y)) return;

    const nextLandmark: Landmark = {
      id: `custom-${formationKey}-${Date.now()}`,
      x,
      y,
      label,
      layer: customLandmarkDraft.layer,
    };

    setCustomAlignmentLandmarks((prev) => ({
      ...prev,
      [formationKey]: [...(prev[formationKey] ?? []), nextLandmark],
    }));
  };

  

  

  const removeCustomAlignmentLandmark = (id: string) => {
    setCustomAlignmentLandmarks((prev) => ({
      ...prev,
      [formationKey]: (prev[formationKey] ?? []).filter((p) => p.id !== id),
    }));
  };

  const resetCustomAlignmentLandmarks = () => {
    setCustomAlignmentLandmarks((prev) => ({
      ...prev,
      [formationKey]: [],
    }));
  };

  const saveEditorChanges = () => {
    setEditorOverrides((prev) => ({
      ...prev,
      [formationKey]: {
        ...displayFormation,
        ...prev[formationKey],
        name: editorDraft.name,
        personnel: editorDraft.personnel,
        runStrength: editorDraft.runStrength,
        passStrength: editorDraft.passStrength,
        backfield: editorDraft.backfield,
        players: prev[formationKey]?.players ?? displayFormation.players,
      },
    }));
  };

  const resetEditorChanges = () => {
    setEditorOverrides((prev) => {
      const next = { ...prev };
      delete next[formationKey];
      return next;
    });
  };

  const quizResult = {
    formation: normalize(quizAnswers.formation) === normalize(getQuizFormationFamily(displayFormation.name)),
    runStrength: normalizeStrength(quizAnswers.runStrength) === normalize(displayFormation.runStrength),
    passStrength: normalizeStrength(quizAnswers.passStrength) === normalize(displayFormation.passStrength),
  };
  const quizScore = [quizResult.formation, quizResult.runStrength, quizResult.passStrength].filter(Boolean).length;

  const submitQuiz = () => {
    setShowQuizFeedback(true);
    setShowQuizAnswers(false);
    const perfect =
      normalize(quizAnswers.formation) === normalize(getQuizFormationFamily(displayFormation.name)) &&
      normalizeStrength(quizAnswers.runStrength) === normalize(displayFormation.runStrength) &&
      normalizeStrength(quizAnswers.passStrength) === normalize(displayFormation.passStrength);
    setQuizReadyForNext(perfect);
  };

  const correctQuizAnswers = {
    formation: getQuizFormationFamily(displayFormation.name),
    runStrength: FIELD_LABELS[displayFormation.runStrength],
    passStrength: FIELD_LABELS[displayFormation.passStrength],
  };
  const {
    filmQuizIsPass,
    filmQuizNeedsPassType,
    selectedFilmGapConcept,
    filmQuizNeedsRunScheme,
    filmQuizNeedsZoneType,
    filmQuizNeedsGapDetails,
    filmQuizResult,
    filmQuizQuestionCount,
    filmQuizScore,
    filmQuizIsPerfect,
    filmQuizTotalPlaysAllowed,
    filmQuizReplaysRemaining,
    filmQuizPlaybackUrl,
    showFilmQuizRunFields,
    showFilmQuizPassFields,
    showFilmQuizZoneFields,
    showFilmQuizGapFields,
  } = getFilmQuizState(selectedFilmClip, filmQuizAnswers, filmQuizPlaysUsed);

  const offenseAnswerKey = useMemo(() => getOffenseAnswerKeyFromFormation(displayFormation), [displayFormation]);
  const offenseCheck = useMemo(() => getCheckResult(offenseBuildPlayers, offenseAnswerKey, 0.75), [offenseBuildPlayers, offenseAnswerKey]);
  const alignmentAnswerKey = useMemo(() => {
    return getAlignmentAnswerKey(displayFormation, alignmentLandmarks, frontMode);
  }, [displayFormation, alignmentLandmarks, frontMode]);
  const alignmentStudyPlayers = useMemo(() => getDefensePlayersFromAnswerKey(alignmentAnswerKey), [alignmentAnswerKey]);
  const alignmentCheck = useMemo(() => getCheckResult(alignmentPlayers, alignmentAnswerKey, 1.0), [alignmentPlayers, alignmentAnswerKey]);


  useEffect(() => {
    currentSecondsRef.current = currentUser?.stats.secondsUsed ?? 0;
  }, [currentUser?.stats.secondsUsed]);

  useEffect(() => {
    if (!currentUser) return;

    const tickInterval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const nextSecondsUsed = prev.stats.secondsUsed + 1;
        currentSecondsRef.current = nextSecondsUsed;
        void persistSecondsUsed(prev.id, nextSecondsUsed);
        return {
          ...prev,
          stats: {
            ...prev.stats,
            secondsUsed: nextSecondsUsed,
          },
        };
      });
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void persistSecondsUsed(currentUser.id, currentSecondsRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(tickInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void persistSecondsUsed(currentUser.id, currentSecondsRef.current);
    };
  }, [currentUser?.id]);

  const handleLogout = async () => {
  if (currentUser?.id === DEMO_USER_ID) {
    window.localStorage.removeItem(DEMO_SESSION_STORAGE_KEY);
    setCurrentUser(null);
    router.push("/login");
    return;
  }

  const supabase = createClient();

  if (currentUser?.id) {
    await persistSecondsUsed(currentUser.id, currentSecondsRef.current);
  }
  await supabase.auth.signOut();

  setCurrentUser(null);
  router.push("/login");
};

  const selectedRunFitOverlay = runFitRouteOverlays.find((overlay) => overlay.id === selectedRunFitOverlayId) ?? null;
  const {
    selectedRunFitTag,
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
  } = createRunFitActions({
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
  });

  const getSpeedBonus = (activeMode: ScoreMode, elapsedMs: number) => {
    const seconds = elapsedMs / 1000;
    if (activeMode === "quiz") {
      if (seconds <= 6) return 30;
      if (seconds <= 10) return 20;
      if (seconds <= 15) return 10;
      return 0;
    }
    if (activeMode === "film") {
      if (seconds <= 4) return 30;
      if (seconds <= 7) return 20;
      if (seconds <= 10) return 10;
      return 0;
    }
    if (activeMode === "offense_build") {
      if (seconds <= 12) return 30;
      if (seconds <= 20) return 20;
      if (seconds <= 30) return 10;
      return 0;
    }
    if (seconds <= 12) return 30;
    if (seconds <= 20) return 20;
    if (seconds <= 30) return 10;
    return 0;
  };

  const persistModeScore = async (
    userId: string,
    activeMode: ScoreMode,
    nextModeStats: ModeScoreStats,
  ) => {
    if (userId === DEMO_USER_ID) return;
    const supabase = createClient();
    const { error } = await supabase.from("mode_scores").upsert(
      {
        user_id: userId,
        mode: activeMode,
        points: nextModeStats.points,
        attempts: nextModeStats.attempts,
        correct: nextModeStats.correct,
        best_time_ms: nextModeStats.bestTimeMs,
      },
      {
        onConflict: "user_id,mode",
      },
    );

    if (error) {
      const errorPayload = {
        mode: activeMode,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      };
      console.error("Failed to save mode score", {
        ...errorPayload,
        serialized: JSON.stringify(errorPayload),
      });
    }
  };

  const persistSecondsUsed = async (userId: string, secondsUsed: number) => {
    if (userId === DEMO_USER_ID) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ seconds_used: secondsUsed })
      .eq("id", userId);

    if (error) {
      console.error("Failed to save total seconds used", error);
    }
  };

  const scoreAttempt = (
    activeMode: ScoreMode,
    accuracy: number,
    isCorrect: boolean,
    customAttemptKey?: string,
  ) => {
    if (!currentUser) return;
    const attemptKey = customAttemptKey ?? getRepAttemptKey(`${activeMode}::${formationKey}`);
    if (revealedAttemptKeys.has(attemptKey)) {
      setLastScoreSummary((prev) => ({
        ...prev,
        [activeMode]: {
          awarded: 0,
          total: currentUser.stats[activeMode].points,
          blockedByReveal: true,
        },
      }));
      return;
    }
    if (scoredAttemptKeys.has(attemptKey)) {
      setLastScoreSummary((prev) => ({
        ...prev,
        [activeMode]: {
          awarded: 0,
          total: currentUser.stats[activeMode].points,
          alreadyScored: true,
        },
      }));
      return;
    }

    const elapsedMs = Math.max(250, Date.now() - attemptStartedAt);
    const modePointMultiplier = activeMode === "alignment" ? 1.5 : 1;
    const accuracyPoints = Math.round(accuracy * 100 * modePointMultiplier);
    const speedBonus = activeMode === "alignment" || activeMode === "blitz" || activeMode === "stunt"
      ? 0
      : isCorrect
        ? getSpeedBonus(activeMode, elapsedMs)
        : 0;
    const totalAward = accuracyPoints + speedBonus;
    const currentModeStats = currentUser.stats[activeMode];
    const nextModeStats: ModeScoreStats = {
      ...currentModeStats,
      points: currentModeStats.points + totalAward,
      attempts: currentModeStats.attempts + 1,
      correct: currentModeStats.correct + (isCorrect ? 1 : 0),
      bestTimeMs: isCorrect
        ? currentModeStats.bestTimeMs === null
          ? elapsedMs
          : Math.min(currentModeStats.bestTimeMs, elapsedMs)
        : currentModeStats.bestTimeMs,
    };

    setScoredAttemptKeys((prev) => {
      const next = new Set(prev);
      next.add(attemptKey);
      return next;
    });
    setLastScoreSummary((prev) => ({
      ...prev,
      [activeMode]: {
        awarded: totalAward,
        total: nextModeStats.points,
      },
    }));
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        stats: {
          ...prev.stats,
          totalPoints: prev.stats.totalPoints + totalAward,
          [activeMode]: nextModeStats,
        },
      };
    });

    void persistModeScore(currentUser.id, activeMode, nextModeStats);
  };

  const markAttemptRevealed = (
    activeMode: ScoreMode,
    customAttemptKey?: string,
  ) => {
    const attemptKey = customAttemptKey ?? getRepAttemptKey(`${activeMode}::${formationKey}`);
    setRevealedAttemptKeys((prev) => {
      const next = new Set(prev);
      next.add(attemptKey);
      return next;
    });
    setLastScoreSummary((prev) => ({
      ...prev,
      [activeMode]: {
        awarded: 0,
        total: currentUser?.stats[activeMode].points ?? 0,
        blockedByReveal: true,
      },
    }));
  };

  useEffect(() => {
    if (showQuizFeedback) {
      scoreAttempt("quiz", quizScore / 3, quizScore === 3, getRepAttemptKey(`quiz::${formationKey}`));
    }
  }, [showQuizFeedback, quizScore, formationKey, repAttemptId]);

  useEffect(() => {
    if (mode === "film" && filmViewMode === "quiz" && showFilmQuizFeedback && selectedFilmClip) {
      scoreAttempt("film", filmQuizScore / Math.max(1, filmQuizQuestionCount), filmQuizIsPerfect, getRepAttemptKey(`film::${selectedFilmClip.id}`));
    }
  }, [mode, filmViewMode, showFilmQuizFeedback, filmQuizScore, filmQuizQuestionCount, filmQuizIsPerfect, selectedFilmClip?.id, repAttemptId]);

  useEffect(() => {
    if (mode !== "concept" || passConceptViewMode !== "quiz" || !showPassConceptFeedback) return;

    const accuracy =
      passConceptQuizMode === "build"
        ? passConceptScore / Math.max(1, passConceptDefinition.activePlayers.length)
        : passConceptIdentifyScore / Math.max(1, passConceptIdentifyQuestionCount);
    const isCorrect =
      passConceptQuizMode === "build"
        ? passConceptScore === passConceptDefinition.activePlayers.length
        : passConceptIdentifyScore === passConceptIdentifyQuestionCount;
    const attemptIdentity =
      passConceptDefinition.boardKind === "2x2"
        ? `${selectedFrontsideConceptId}::${selectedBacksideConceptId}`
        : selectedThreeByOneConceptId;

    scoreAttempt(
      "concept",
      accuracy,
      isCorrect,
      getRepAttemptKey(`concept::${passConceptQuizMode}::${passConceptDefinition.boardKind}::${attemptIdentity}`),
    );
  }, [
    mode,
    passConceptViewMode,
    showPassConceptFeedback,
    passConceptQuizMode,
    passConceptScore,
    passConceptDefinition.activePlayers.length,
    passConceptDefinition.boardKind,
    passConceptIdentifyQuestionCount,
    passConceptIdentifyScore,
    passConceptNameResult,
    selectedFrontsideConceptId,
    selectedBacksideConceptId,
    selectedThreeByOneConceptId,
    repAttemptId,
  ]);

  useEffect(() => {
    if (showOffenseCheck) {
      const total = Object.keys(offenseAnswerKey).length || 1;
      const wrong = offenseCheck.incorrectIds.length;
      const placedCount = offenseBuildPlayers.length;
      const missing = Math.max(0, total - placedCount);
      const accuracy = Math.max(0, (total - wrong - missing) / total);
      scoreAttempt("offense_build", accuracy, offenseCheck.isCorrect, getRepAttemptKey(`offense_build::${formationKey}`));
    }
  }, [showOffenseCheck, offenseCheck.isCorrect, offenseCheck.incorrectIds.length, formationKey, offenseBuildPlayers.length, repAttemptId]);

  useEffect(() => {
    if (mode === "alignment" && alignmentViewMode === "quiz" && showAlignmentCheck) {
      const total = Object.keys(alignmentAnswerKey).length || 1;
      const wrong = alignmentCheck.incorrectIds.length;
      const placedCount = alignmentPlayers.length;
      const missing = Math.max(0, total - placedCount);
      const accuracy = Math.max(0, (total - wrong - missing) / total);
      scoreAttempt("alignment", accuracy, alignmentCheck.isCorrect, getRepAttemptKey(`alignment::${formationKey}::${frontMode}`));
    }
  }, [mode, alignmentViewMode, showAlignmentCheck, alignmentCheck.isCorrect, alignmentCheck.incorrectIds.length, formationKey, frontMode, alignmentPlayers.length, repAttemptId]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <div className="rounded-2xl border border-[#d8ddcf] bg-white/88 px-6 py-4 text-sm text-slate-600 shadow-[0_18px_50px_rgba(43,81,61,0.08)] backdrop-blur-sm">
          Loading...
        </div>
      </div>
    );
  }

  const formationBoardProps = {
    mode,
    formationTrainerViewMode,
    setFormationTrainerViewMode,
    setShowQuizFeedback,
    setShowQuizAnswers,
    setQuizReadyForNext,
    TrainingFieldComponent: TrainingField,
    TokenTrayComponent: TokenTray,
    displayFormation,
    getQuizFormationFamily,
    nextCall,
    current,
    index,
    pool,
    formationSelectGroups,
    setIndex,
    quizAnswers,
    setQuizAnswers,
    showQuizFeedback,
    quizScore,
    quizReadyForNext,
    submitQuiz,
    markAttemptRevealed,
    showQuizAnswers,
    correctQuizAnswers,
    lastScoreSummary,
    quizResult,
    alignmentViewMode,
    setAlignmentViewMode,
    setShowAlignmentCheck,
    frontMode,
    setFrontMode,
    setAttemptStartedAt,
    setLastScoreSummary,
    setEnhancedLandmarks,
    alignmentStudyPlayers,
    alignmentPlayers,
    alignmentLandmarks,
    enhancedLandmarks,
    showAlignmentCheck,
    alignmentCheck,
    moveDefender,
    remainingDefenders,
    addDefender,
    currentUser,
    moveEditorPlayer,
    editorDraft,
    setEditorDraft,
    saveEditorChanges,
    resetEditorChanges,
    offenseBuildViewMode,
    setOffenseBuildViewMode,
    setShowOffenseCheck,
    offenseBuildPlayers,
    offenseLandmarks,
    showOffenseCheck,
    moveOffense,
    offenseCheck,
    remainingOffense,
    addOffense,
  };

  const filmPlayerProps = {
    filmSubmode,
    setFilmSubmode,
    filmViewMode,
    setFilmViewMode,
    selectedFilmClip,
    filmQuizStarted,
    filmQuizFinished,
    filmQuizVideoRef,
    filmPlaybackNonce,
    filmQuizPlaybackUrl,
    setFilmQuizFinished,
    showFilmQuizFeedback,
    filmStudyVideoRef,
    setFilmStudyDuration,
    setFilmStudyCurrentTime,
    currentUser,
    showFilmAdminTools,
    setShowFilmAdminTools,
    filmAdminPanelMode,
    setFilmAdminPanelMode,
    filmDraft,
    setFilmDraft,
    filmTeamTagSelectOptions,
    filmStudyCurrentTime,
    filmUploadResetKey,
    addFilmClip,
    filmSaveNotice,
    filmEditDraft,
    setFilmEditDraft,
    saveFilmMetadata,
    filmFormationFilter,
    setFilmFormationFilter,
    safeFilmFormationFilter,
    filmFormationKeyOptions,
    filmTeamFilter,
    setFilmTeamFilter,
    safeFilmTeamFilter,
    filmTeamTagOptions,
    filmClipGroups,
    setSelectedFilmClipId,
    setFilmStarted,
    setFilmPlaybackNonce,
    filmStudyDuration,
    filmQuizAnswers,
    setFilmQuizAnswers,
    showFilmQuizRunFields,
    showFilmQuizPassFields,
    showFilmQuizZoneFields,
    showFilmQuizGapFields,
    startFilmQuizClip,
    filmQuizPlaysUsed,
    filmQuizTotalPlaysAllowed,
    filmQuizReplaysRemaining,
    submitFilmQuiz,
    showFilmQuizAnswers,
    setShowFilmQuizAnswers,
    filmQuizNeedsPassType,
    filmQuizNeedsRunScheme,
    filmQuizNeedsZoneType,
    filmQuizNeedsGapDetails,
    selectedFilmGapConcept,
    filmQuizScore,
    filmQuizQuestionCount,
    lastScoreSummary,
    filmQuizResult,
    filmQuizIsPass,
    nextFilmQuizClip,
    nextCall,
  };

  const passConceptBoardProps = {
    passConceptViewMode,
    setPassConceptViewMode,
    setShowPassConceptFeedback,
    setShowPassConceptAnswers,
    passConceptQuizMode,
    setPassConceptQuizMode,
    passConceptDefinition,
    TrainingFieldComponent: TrainingField,
    passConceptPreview,
    passConceptQuizRoutePreview,
    passConceptFamilyFilter,
    setPassConceptFamilyFilter,
    effectivePassConceptBoardKind,
    selectedFrontsideConceptId,
    setSelectedFrontsideConceptId,
    selectedBacksideConceptId,
    setSelectedBacksideConceptId,
    selectedThreeByOneConceptId,
    setSelectedThreeByOneConceptId,
    nextCall,
    passConceptAnswers,
    setPassConceptAnswers,
    passConceptFrontsideNameAnswer,
    setPassConceptFrontsideNameAnswer,
    availablePassConceptNames,
    passConceptBacksideNameAnswer,
    setPassConceptBacksideNameAnswer,
    passConceptNameAnswer,
    setPassConceptNameAnswer,
    showPassConceptAnswers,
    showPassConceptFeedback,
    passConceptScore,
    lastScoreSummary,
    passConceptResult,
    passConceptIdentifyScore,
    passConceptIdentifyQuestionCount,
    passConceptFrontsideNameResult,
    passConceptBacksideNameResult,
    passConceptNameResult,
  };

  const runFitBoardProps = {
    currentUser,
    TrainingFieldComponent: TrainingField,
    runFitTitle,
    showRunFitAdminTools,
    setShowRunFitAdminTools,
    runFitEditorTool,
    setRunFitEditorTool,
    runFitArrowLabel,
    setRunFitArrowLabel,
    runFitArrowColor,
    setRunFitArrowColor,
    runFitLineWeight,
    setRunFitLineWeight,
    runFitLineStyle,
    setRunFitLineStyle,
    runFitLineEnd,
    setRunFitLineEnd,
    finishRunFitArrow,
    runFitDraftPoints,
    setRunFitDraftPoints,
    runFitTagLabel,
    setRunFitTagLabel,
    runFitTagTone,
    setRunFitTagTone,
    selectedRunFitOverlay,
    selectedRunFitTag,
    updateSelectedRunFitOverlay,
    updateSelectedRunFitTag,
    duplicateSelectedRunFitObject,
    deleteSelectedRunFitObject,
    runFitPreview,
    runFitDisplayOverlays,
    runFitFieldTags,
    handleRunFitFieldClick,
    handleRunFitFieldDoubleClick,
    selectedRunFitOverlayId,
    selectedRunFitTagId,
    selectRunFitOverlay,
    selectRunFitTag,
    moveRunFitRouteOverlay,
    moveRunFitRouteOverlayPoint,
    selectedRunFitBaseBoardId,
    loadRunFitBaseBoard,
    selectedRunFitBoardId,
    loadRunFitBoard,
    runFitSavedBoards,
    setRunFitTitle,
    selectedRunFitPathwayDefenderId,
    setSelectedRunFitPathwayDefenderId,
    selectedRunFitPathwayId,
    setSelectedRunFitPathwayId,
    addRunFitPathway,
    runFitSavedPathwayName,
    setRunFitSavedPathwayName,
    saveRunFitDraftAsPathway,
    selectedRunFitSavedPathwayId,
    setSelectedRunFitSavedPathwayId,
    runFitSavedPathways,
    stampSavedRunFitPathway,
    deleteSavedRunFitPathway,
    nudgeSelectedRunFitObject,
    sendSelectedRunFitLineBackward,
    bringSelectedRunFitLineForward,
    saveRunFitBoard,
    resetRunFitSample,
    setRunFitRouteOverlays,
    setRunFitFieldTags,
    runFitRouteOverlays,
    runFitSaveNotice,
  };

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="overflow-hidden rounded-[28px] border border-[#d5dccf] bg-white/84 shadow-[0_24px_70px_rgba(43,81,61,0.10)] backdrop-blur-sm">
          <CardHeader className="space-y-4 bg-gradient-to-b from-[#f7faf6] via-[#f9f7f0] to-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                <span className="bg-gradient-to-r from-[#274836] via-[#355d46] to-[#7f6a2d] bg-clip-text text-transparent">
                  {getModeTitle(mode)}
                </span>
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={mode === "offense_build" ? "default" : "outline"}
                  className="rounded-xl"
                  onClick={() => {
                    setAppSection("offense");
                    setMode("offense_build");
                  }}
                >
                  Home
                </Button>
                {currentUser ? (
                  <Button variant={mode === "account" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("account")}>
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Button>
                ) : null}
                <Button variant={mode === "leaderboard" ? "default" : "outline"} className="rounded-xl" onClick={() => setMode("leaderboard")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Leaderboard
                </Button>
                {authChecked ? (
                  <Button variant="outline" className="rounded-xl" onClick={handleLogout}>
                    Log Out
                  </Button>
                ) : null}

                <div className="min-w-[150px]">
                  <Select
                    value={appSection}
                    onValueChange={(value: AppSection) => {
                      setAppSection(value);
                      const nextMode = MODE_OPTIONS.find((option) => option.section === value)?.value;
                      if (nextMode) setMode(nextMode);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {APP_SECTION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[180px]">
                  <Select
                    value={sectionModeOptions.some((option) => option.value === mode) ? mode : (sectionModeOptions[0]?.value ?? "study")}
                    onValueChange={(value: AppMode) => { setMode(value); setAppSection(getSectionForMode(value)); }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {sectionModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[220px]">
                  {mode === "leaderboard" ? null : mode === "offense_build" ? (
                    <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Foothill</div>
                  ) : mode === "film" || mode === "concept" || mode === "run_fit" || mode === "blitz" || mode === "stunt" ? (
                    <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      {mode === "film" ? "Film Library" : mode === "concept" ? "Concept Board" : mode === "run_fit" ? "Fit Board" : mode === "blitz" ? "Blitz Board" : "Stunt Board"}
                    </div>
                  ) : (
                    <details className="relative">
                      <summary className="cursor-pointer list-none rounded-md border bg-white px-3 py-2 text-sm font-medium text-slate-700">
                        Playbooks: {selectedPlaybooks.length === PLAYBOOK_OPTIONS.length ? "All" : selectedPlaybooks.join(", ")}
                      </summary>
                      <div className="absolute z-20 mt-2 min-w-[220px] rounded-xl border bg-white p-3 shadow-lg">
                        <label className="mb-2 flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            checked={selectedPlaybooks.length === PLAYBOOK_OPTIONS.length}
                            onChange={(e) => {
                              setSelectedPlaybooks(e.target.checked ? [...PLAYBOOK_OPTIONS] : ["Foothill"]);
                              setIndex(0);
                            }}
                          />
                          All
                        </label>
                        {PLAYBOOK_OPTIONS.map((option) => (
                          <label key={option} className="mb-2 flex items-center gap-2 text-sm text-slate-700 last:mb-0">
                            <input
                              type="checkbox"
                              checked={selectedPlaybooks.includes(option)}
                              onChange={(e) => {
                                setSelectedPlaybooks((prev) => {
                                  const next = e.target.checked ? [...prev, option] : prev.filter((p) => p !== option);
                                  return next.length ? (Array.from(new Set(next)) as PlaybookKey[]) : ["Foothill"];
                                });
                                setIndex(0);
                              }}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
                {mode === "offense_build" || mode === "film" || mode === "concept" || mode === "leaderboard" || mode === "run_fit" || mode === "blitz" || mode === "stunt" ? null : (
                  <div className="min-w-[120px]">
                    <Select value={personnelFilter} onValueChange={(value: string) => { setPersonnelFilter(value); setIndex(0); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        {PERSONNEL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === "Any" ? "Any" : `${option}P`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            {(mode === "alignment" || (mode === "study" && formationTrainerViewMode === "study") || mode === "offense_build") && (
              <div className="rounded-2xl border border-[#dde3d8] bg-gradient-to-r from-white via-[#fbfcfa] to-[#f4f4ee] p-4 text-3xl font-extrabold tracking-tight text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] md:text-4xl">
                {displayFormation.name}
                <div className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  {mode === "offense_build" && offenseBuildViewMode === "quiz" ? "Build this formation" : displayFormation.playbook}
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
           {mode === "account" ? (
  <div className="space-y-4">
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardContent className="p-4">
        {currentUser ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <User className="h-4 w-4" />
                User
              </div>
              <div className="mt-2 flex items-center gap-3">
                <AvatarBadge name={currentUser.name} avatarUrl={currentUser.avatarUrl} />
                <div className="min-w-0">
                  <div className="truncate text-lg font-semibold text-slate-900">{currentUser.name}</div>
                  <div className="text-sm text-slate-500">Team: {currentUser.teamCode}</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Profile Picture</div>
                <Input
                  key={avatarUploadResetKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => void uploadProfileAvatar(e.target.files?.[0] ?? null)}
                />
                {avatarUploadNotice ? (
                  <div
                    className={`mt-2 rounded-lg border px-3 py-2 text-xs ${
                      avatarUploadNotice.tone === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-red-200 bg-red-50 text-red-800"
                    }`}
                  >
                    {avatarUploadNotice.message}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Trophy className="h-4 w-4" />
                Points
              </div>
              <div className="text-lg font-semibold text-slate-900">{currentUser.stats.totalPoints}</div>
              <div className="text-sm text-slate-500">
                Quiz {currentUser.stats.quiz.points} • Offense {currentUser.stats.offense_build.points} • Concept {currentUser.stats.concept.points} • Align {currentUser.stats.alignment.points} • Film {currentUser.stats.film.points} • Blitz {currentUser.stats.blitz.points} • Stunt {currentUser.stats.stunt.points}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Clock3 className="h-4 w-4" />
                Time Used
              </div>
              <div className="text-lg font-semibold text-slate-900">
                {formatDuration(currentUser.stats.secondsUsed)}
              </div>
              <div className="text-sm text-slate-500">Tracked while app is open</div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">
            No user profile loaded.
          </div>
        )}
      </CardContent>
    </Card>
  </div>

            ) : mode === "leaderboard" ? (
  <div className="space-y-4">
    <Card className="overflow-hidden rounded-2xl border border-[#35533f] bg-[#2f5b43] shadow-xl">
      <CardHeader className="border-b border-[#496a54] bg-gradient-to-b from-[#3c6b51] to-[#2b513d] pb-3">
        <CardTitle className="text-center text-xl font-black uppercase tracking-[0.22em] text-[#f3ead0]">Mode Leaderboards</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#2f5b43]">
          <div className="space-y-6 p-1">
            {currentUser?.isAdmin ? (
              <div className="mx-auto flex max-w-[540px] justify-center">
                <Button
                  variant={showAccountDirectory ? "default" : "outline"}
                  className="rounded-xl bg-white/95 text-slate-950 hover:bg-white data-[state=open]:bg-white"
                  onClick={() => setShowAccountDirectory((prev) => !prev)}
                >
                  {showAccountDirectory ? "Hide Created Accounts" : "Show Created Accounts"}
                </Button>
              </div>
            ) : null}
            {currentUser?.isAdmin && showAccountDirectory ? (
              <div className="overflow-hidden rounded-xl border border-[#8a856f] bg-[#f8f4e6] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                <div className="border-b border-[#8a856f] bg-[#e8e0c8] px-4 py-3">
                  <div className="text-center text-[10px] font-bold uppercase tracking-[0.22em] text-[#5a5646]">
                    Admin Account Directory
                  </div>
                  <div className="mt-1 text-center text-xs text-[#6d6857]">
                    {accountDirectoryEntries.length} created account{accountDirectoryEntries.length === 1 ? "" : "s"}
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {([
                      ["points_desc", "Most Points"],
                      ["points_asc", "Fewest Points"],
                      ["time_desc", "Most Time"],
                      ["time_asc", "Least Time"],
                      ["name_asc", "Name A-Z"],
                    ] as const).map(([value, label]) => (
                      <Button
                        key={value}
                        variant={accountDirectorySort === value ? "default" : "outline"}
                        className="h-8 rounded-lg px-3 text-[11px]"
                        onClick={() => setAccountDirectorySort(value)}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_72px_90px] items-center border-b border-[#b7b09a] bg-[#ddd4bc] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5a5646]">
                  <div className="px-2">User</div>
                  <div className="px-2">Email</div>
                  <div className="px-2 text-center">Points</div>
                  <div className="px-2 text-center">Time</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {sortedAccountDirectoryEntries.length ? (
                    sortedAccountDirectoryEntries.map((entry, idx) => (
                      <div
                        key={`account-directory-${entry.id}`}
                        className={`grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_72px_90px] items-center border-b border-[#d6cfb7] px-3 py-2 text-sm last:border-b-0 ${
                          idx % 2 === 0 ? "bg-[#faf7ec]" : "bg-[#f2ecd9]"
                        }`}
                      >
                        <div className="min-w-0 px-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <AvatarBadge name={entry.name} avatarUrl={entry.avatarUrl} className="h-8 w-8" textClassName="text-[10px]" />
                            <div className="min-w-0">
                              <div className="truncate font-semibold text-[#23241d]">
                                {entry.name}
                                {entry.isAdmin ? <span className="ml-2 rounded-full bg-[#2f5b43] px-2 py-0.5 text-[10px] uppercase tracking-wide text-white">Admin</span> : null}
                              </div>
                              <div className="truncate text-[11px] text-[#6d6857]">{entry.teamCode}</div>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 truncate px-2 text-xs text-[#4f4b3f]">
                          {entry.email || "No email saved"}
                        </div>
                        <div className="px-2 text-center font-black text-[#202119]">
                          {entry.stats.totalPoints}
                        </div>
                        <div className="px-2 text-center text-xs font-semibold text-[#4f4b3f]">
                          {formatDuration(entry.stats.secondsUsed)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-[#6e6a5c]">
                      No accounts loaded yet.
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            <div className="space-y-6">
              <section className="space-y-3">
                <div className="rounded-xl border border-[#7e8a74] bg-[#eef3e7] px-4 py-3 text-center">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-[#4f5d48]">Offense</div>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {leaderboardBoards.filter((board) => board.section === "offense").map(renderLeaderboardBoard)}
                </div>
              </section>
              <section className="space-y-3">
                <div className="rounded-xl border border-[#8a856f] bg-[#f8f4e6] px-4 py-3 text-center">
                  <div className="text-xs font-black uppercase tracking-[0.24em] text-[#5a5646]">Defense</div>
                </div>
                <div className="grid gap-4 xl:grid-cols-3">
                  {leaderboardBoards.filter((board) => board.section === "defense").map(renderLeaderboardBoard)}
                </div>
              </section>
            </div>
          </div>
      </CardContent>
    </Card>
  </div>

            ) : mode === "study" ? (
              <FormationBoard {...formationBoardProps} />
            ) : mode === "run_fit" ? (
              <RunFitBoard {...runFitBoardProps} />
            ) : mode === "blitz" ? (
              <BlitzBoard
                isAdmin={Boolean(currentUser?.isAdmin)}
                TrainingFieldComponent={TrainingField}
                blitzRendererDeps={blitzRendererDeps}
                scoreBlitzAttempt={(accuracy, isCorrect, attemptKey) => scoreAttempt("blitz", accuracy, isCorrect, getRepAttemptKey(attemptKey))}
                markBlitzAttemptRevealed={(attemptKey) => markAttemptRevealed("blitz", getRepAttemptKey(attemptKey))}
                lastBlitzScoreSummary={lastScoreSummary.blitz}
                onBlitzRepAdvanced={advanceRepAttempt}
              />
            ) : mode === "stunt" ? (
              <StuntBoard
                scoreStuntAttempt={(accuracy, isCorrect, attemptKey) => scoreAttempt("stunt", accuracy, isCorrect, getRepAttemptKey(attemptKey))}
                lastStuntScoreSummary={lastScoreSummary.stunt}
              />
            ) : mode === "concept" ? (
              <PassConceptBoard {...passConceptBoardProps} />
            ) : mode === "film" ? (
              <FilmPlayer {...filmPlayerProps} />
            ) : mode === "quiz" || mode === "alignment" || mode === "editor" || mode === "offense_build" ? (
              <FormationBoard {...formationBoardProps} />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
