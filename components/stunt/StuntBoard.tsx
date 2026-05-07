"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  STUNT_BOARDS_STORAGE_KEY,
  STUNT_PLAYERS,
  buildStuntDraftOverlay,
  getStuntLineStroke,
  getStuntLineStrokeWidth,
  parseStuntStorage,
  stringifyStuntStorage,
  type StuntDirectionAnswer,
  type StuntEditorTool,
  type StuntFieldTag,
  type StuntGameSideAnswer,
  type StuntLineColor,
  type StuntLineEnd,
  type StuntLineStyle,
  type StuntLoadFront,
  type StuntPlayerId,
  type StuntQuizType,
  type StuntRouteOverlay,
  type StuntSavedBoard,
} from "@/lib/stunt/stuntLogic";
import { getStuntBoardSurfacePlayers } from "@/lib/stunt/stuntRenderer";

const EMPTY_BOARD_ID = "working";
const VIEWBOX_WIDTH = 100;
const VIEWBOX_HEIGHT = 74;
const STUNT_ARROW_END_Y = 22;
const STUNT_ARROW_LABEL_Y = 18.9;
const STUNT_DIRECTION_OPTIONS: { value: StuntDirectionAnswer; label: string }[] = [
  { value: "to_te", label: "To TE" },
  { value: "away_te", label: "Away From TE" },
  { value: "to_field", label: "To Field" },
  { value: "to_boundary", label: "To Boundary" },
  { value: "strong_side", label: "Strong Side Stunt" },
  { value: "weak_side", label: "Weak Side Stunt" },
];
const STUNT_GAME_SIDE_OPTIONS: StuntGameSideAnswer[] = [
  "Bandit",
  "Blood",
  "End",
  "Heavy",
  "Ice",
  "Lava",
  "Load",
  "Not",
  "Pirate",
  "Plug",
  "Ram",
  "Rip",
  "Tex",
  "Ton",
  "Torch",
  "Water",
  "Wedge",
  "Wrap",
];
const STUNT_QUIZ_TYPE_LABELS: Record<StuntQuizType, string> = {
  first_second: "1st / 2nd Stunt",
  direction: "Direction / Strong-Weak Side",
  games: "Games",
};
const STUNT_QUIZ_INSTRUCTIONS: Record<StuntQuizType, string> = {
  first_second: "Choose which DL is the 1st stunter and which DL is the 2nd stunter.",
  direction: "Choose the stunt direction or side, then click the DL who are part of the stunt.",
  games: "Choose the weak-side stunt and the strong-side stunt.",
};
const STUNT_QUIZ_MODE_LABELS = {
  build: "Build the Stunt",
  name: "Name the Stunt",
} as const;

type ScoreSummary = {
  awarded: number;
  total: number;
  blockedByReveal?: boolean;
  alreadyScored?: boolean;
};

function getTagToneClass(tone: StuntFieldTag["tone"]) {
  if (tone === "red") return "fill-[#ef3124]";
  if (tone === "gold") return "fill-[#f4cf63]";
  if (tone === "cyan") return "fill-[#78dfd0]";
  return "fill-slate-100";
}

function getSvgPoint(event: ReactMouseEvent<SVGSVGElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
  };
}

function getSvgPointFromClient(svg: SVGSVGElement | null, clientX: number, clientY: number) {
  if (!svg) return { x: 0, y: 0 };
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
    y: ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
  };
}

function pointsToPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
}

function alignStuntArrowOverlay(overlay: StuntRouteOverlay): StuntRouteOverlay {
  if (overlay.endCap !== "arrow" || overlay.path.length < 2) return overlay;
  const lastIndex = overlay.path.length - 1;
  return {
    ...overlay,
    path: overlay.path.map((point, index) => (index === lastIndex ? { ...point, y: STUNT_ARROW_END_Y } : point)),
    labelY: overlay.label ? STUNT_ARROW_LABEL_Y : overlay.labelY,
  };
}

function getStuntPlayerLabel(playerId?: StuntPlayerId) {
  return STUNT_PLAYERS.find((player) => player.id === playerId)?.label ?? playerId ?? "";
}

function hasCompleteStuntQuiz(quiz?: StuntSavedBoard["quiz"]) {
  if (!quiz) return false;
  if (quiz.type === "games") return Boolean(quiz.weakSideStunt && quiz.strongSideStunt);
  if (quiz.type === "direction") return Boolean(quiz.direction && quiz.directionPlayerIds?.length);
  return Boolean(getQuizFirstPlayerIds(quiz).length && getQuizSecondPlayerIds(quiz).length);
}

function getQuizFirstPlayerIds(quiz?: StuntSavedBoard["quiz"]) {
  return Array.isArray(quiz?.firstPlayerIds)
    ? quiz.firstPlayerIds.filter(Boolean)
    : quiz?.firstPlayerId
      ? [quiz.firstPlayerId]
      : [];
}

function getQuizSecondPlayerIds(quiz?: StuntSavedBoard["quiz"]) {
  return Array.isArray(quiz?.secondPlayerIds)
    ? quiz.secondPlayerIds.filter(Boolean)
    : quiz?.secondPlayerId
      ? [quiz.secondPlayerId]
      : [];
}

function samePlayerSet(a: StuntPlayerId[], b: StuntPlayerId[]) {
  return [...a].sort().join(",") === [...b].sort().join(",");
}

function getNearestStuntPlayerId(
  point: { x: number; y: number } | undefined,
  surface: StuntSavedBoard["surface"],
): StuntPlayerId | null {
  if (!point) return null;
  const players = getStuntBoardSurfacePlayers(surface).filter((player) => player.group === "dl");
  let bestPlayer: StuntPlayerId | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const player of players) {
    const distance = Math.hypot(player.x - point.x, player.y - point.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPlayer = player.id as StuntPlayerId;
    }
  }
  return bestDistance <= 14 ? bestPlayer : null;
}

function inferDirectionFromArrows(
  overlays: StuntRouteOverlay[],
  surface: StuntSavedBoard["surface"],
): StuntDirectionAnswer | undefined {
  const arrowDeltas = overlays
    .filter((overlay) => overlay.endCap === "arrow" && overlay.path.length >= 2)
    .map((overlay) => {
      const first = overlay.path[0];
      const last = overlay.path[overlay.path.length - 1];
      return last.x - first.x;
    })
    .filter((delta) => Math.abs(delta) > 1.5);

  if (!arrowDeltas.length) return undefined;
  const averageDelta = arrowDeltas.reduce((sum, delta) => sum + delta, 0) / arrowDeltas.length;
  if (surface?.teSide === "right") return averageDelta > 0 ? "to_te" : "away_te";
  if (surface?.teSide === "left") return averageDelta < 0 ? "to_te" : "away_te";
  return averageDelta > 0 ? "to_field" : "to_boundary";
}

function inferStuntQuizFromBoard(board: StuntSavedBoard): StuntSavedBoard["quiz"] {
  const arrowOverlays = board.routeOverlays.filter((overlay) => overlay.endCap === "arrow" && overlay.path.length >= 2);
  const directionPlayerIds = Array.from(new Set(
    arrowOverlays
      .map((overlay) => getNearestStuntPlayerId(overlay.path[0], board.surface))
      .filter((playerId): playerId is StuntPlayerId => Boolean(playerId)),
  ));
  const isPirateOnly = /\bpirate\b/i.test(board.title) && !/\bbandit\b/i.test(board.title);
  const isBanditOnly = /\bbandit\b/i.test(board.title) && !/\bpirate\b/i.test(board.title);
  const isWrapBoard = /\bwrap\b/i.test(board.title);

  if (directionPlayerIds.length && (isPirateOnly || isBanditOnly)) {
    return {
      type: "direction",
      directionPlayerIds,
      direction: isPirateOnly ? "strong_side" : "weak_side",
    };
  }

  if (!isWrapBoard && hasCompleteStuntQuiz(board.quiz)) return board.quiz;
  if (/\bgames?\b/i.test(board.title)) {
    return {
      type: "games",
      directionPlayerIds: [],
      weakSideStunt: "End",
      strongSideStunt: "Tex",
    };
  }
  const firstPlayerIds = Array.from(new Set(
    arrowOverlays
      .filter((overlay) => /\b(1st|first)\b/i.test(overlay.label))
      .map((overlay) => getNearestStuntPlayerId(overlay.path[0], board.surface))
      .filter((playerId): playerId is StuntPlayerId => Boolean(playerId)),
  ));
  const secondPlayerIds = Array.from(new Set(
    arrowOverlays
      .filter((overlay) => /\b(2nd|second)\b/i.test(overlay.label))
      .map((overlay) => getNearestStuntPlayerId(overlay.path[0], board.surface))
      .filter((playerId): playerId is StuntPlayerId => Boolean(playerId)),
  ));
  const firstPlayerId = firstPlayerIds[0];
  const secondPlayerId = secondPlayerIds[0];

  if (firstPlayerId && secondPlayerId) {
    return {
      type: "first_second",
      firstPlayerId,
      firstPlayerIds,
      secondPlayerId,
      secondPlayerIds,
      directionPlayerIds: [],
    };
  }

  if (isWrapBoard && hasCompleteStuntQuiz(board.quiz)) return board.quiz;

  const direction = inferDirectionFromArrows(arrowOverlays, board.surface);

  if (directionPlayerIds.length && direction) {
    return {
      type: "direction",
      directionPlayerIds,
      direction,
    };
  }

  return board.quiz;
}

function applyInferredStuntQuiz(board: StuntSavedBoard): StuntSavedBoard {
  return {
    ...board,
    quiz: inferStuntQuizFromBoard(board),
  };
}

function getLineColorFromStroke(stroke?: string): StuntLineColor {
  if (stroke === getStuntLineStroke("gold")) return "gold";
  if (stroke === getStuntLineStroke("white")) return "white";
  if (stroke === getStuntLineStroke("cyan")) return "cyan";
  return "red";
}

function getLineWeightFromStrokeWidth(strokeWidth?: number) {
  if (strokeWidth === getStuntLineStrokeWidth("thin")) return "thin";
  if (strokeWidth === getStuntLineStrokeWidth("thick")) return "thick";
  if (strokeWidth === getStuntLineStrokeWidth("heavy")) return "heavy";
  return "normal";
}

function StuntField({
  routeOverlays,
  fieldTags,
  selectedRouteOverlayId,
  selectedFieldTagId,
  editorTool,
  onBoardClick,
  onBoardDoubleClick,
  onOverlayClick,
  onTagClick,
  onMoveOverlay,
  onMoveOverlayPoint,
  teSide,
  loadFront,
}: {
  routeOverlays: StuntRouteOverlay[];
  fieldTags: StuntFieldTag[];
  selectedRouteOverlayId: string | null;
  selectedFieldTagId: string | null;
  editorTool: StuntEditorTool;
  onBoardClick: (event: ReactMouseEvent<SVGSVGElement>) => void;
  onBoardDoubleClick: (event: ReactMouseEvent<SVGSVGElement>) => void;
  onOverlayClick: (id: string) => void;
  onTagClick: (id: string) => void;
  onMoveOverlay: (id: string, dx: number, dy: number) => void;
  onMoveOverlayPoint: (id: string, pointIndex: number, x: number, y: number) => void;
  teSide: "none" | "left" | "right";
  loadFront: StuntLoadFront;
}) {
  const players = getStuntBoardSurfacePlayers({ teSide, loadFront });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragRef = useRef<{
    overlayId: string;
    pointIndex?: number;
    lastX: number;
    lastY: number;
  } | null>(null);

  const handleMouseMove = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const point = getSvgPointFromClient(svgRef.current, event.clientX, event.clientY);
    if (typeof dragRef.current.pointIndex === "number") {
      onMoveOverlayPoint(dragRef.current.overlayId, dragRef.current.pointIndex, point.x, point.y);
      return;
    }
    onMoveOverlay(dragRef.current.overlayId, point.x - dragRef.current.lastX, point.y - dragRef.current.lastY);
    dragRef.current.lastX = point.x;
    dragRef.current.lastY = point.y;
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      ref={svgRef}
      className={`h-auto w-full rounded-3xl border border-emerald-950 bg-[#0b7f5a] shadow-inner ${editorTool === "line" || editorTool === "tag" ? "cursor-crosshair" : "cursor-default"}`}
      onClick={onBoardClick}
      onDoubleClick={onBoardDoubleClick}
      onMouseMove={handleMouseMove}
      onMouseUp={() => { dragRef.current = null; }}
      onMouseLeave={() => { dragRef.current = null; }}
    >
      <defs>
        <marker id="stunt-editor-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="context-stroke" />
        </marker>
        <marker id="stunt-field-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
          <path d="M 0 0 L 8 4 L 0 8 z" fill="rgba(255,255,255,0.86)" />
        </marker>
      </defs>
      <rect x="1.5" y="1.5" width="97" height="71" rx="2" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.35" />
      {[22, 34, 46, 58].map((y) => (
        <line key={y} x1="8" x2="92" y1={y} y2={y} stroke="rgba(255,255,255,0.16)" strokeWidth="0.3" />
      ))}
      <g>
        <text x="74" y="10" fill="rgba(255,255,255,0.86)" fontSize="3.25" fontWeight="900" letterSpacing="0.16em">
          FIELD
        </text>
        <path d="M 88 8.8 L 97 8.8" stroke="rgba(255,255,255,0.86)" strokeWidth="0.75" strokeLinecap="round" markerEnd="url(#stunt-field-arrow)" />
      </g>

      {players.map((player) => {
        const isDl = player.group === "dl";
        return (
          <g key={player.id}>
            <circle
              cx={player.x}
              cy={player.y}
              r={5.2}
              fill={isDl ? "#147fc0" : "#f15a24"}
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.35"
            />
            <text x={player.x} y={player.y + 1.15} textAnchor="middle" fill="white" fontSize="3.35" fontWeight="900">
              {player.label}
            </text>
          </g>
        );
      })}

      {routeOverlays.map((overlay) => {
        const selected = selectedRouteOverlayId === overlay.id;
        const lastPoint = overlay.path[overlay.path.length - 1];
        return (
          <g key={overlay.id}>
            <path
              d={pointsToPath(overlay.path)}
              fill="none"
              stroke={overlay.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={(overlay.strokeWidth ?? 0.75) + (selected ? 0.35 : 0)}
              strokeDasharray={overlay.dashed ? "2 1.5" : undefined}
              markerEnd={overlay.endCap === "arrow" ? "url(#stunt-editor-arrow)" : undefined}
              onClick={(event) => {
                event.stopPropagation();
                onOverlayClick(overlay.id);
              }}
              onMouseDown={(event) => {
                if (editorTool !== "select") return;
                event.stopPropagation();
                const point = getSvgPointFromClient(svgRef.current, event.clientX, event.clientY);
                dragRef.current = { overlayId: overlay.id, lastX: point.x, lastY: point.y };
              }}
            />
            {overlay.endCap === "square" && lastPoint ? (
              <rect x={lastPoint.x - 1.1} y={lastPoint.y - 1.1} width="2.2" height="2.2" fill={overlay.color} />
            ) : null}
            {overlay.endCap === "circle" && lastPoint ? (
              <circle cx={lastPoint.x} cy={lastPoint.y} r="1.35" fill={overlay.color} />
            ) : null}
            {overlay.label ? (
              <g>
                <rect
                  x={(overlay.labelX ?? lastPoint?.x ?? 50) - Math.max(5, overlay.label.length * 0.95)}
                  y={(overlay.labelY ?? (lastPoint?.y ?? 50) - 3) - 2.7}
                  width={Math.max(10, overlay.label.length * 1.9)}
                  height="4.6"
                  rx="1.2"
                  fill="rgba(8, 18, 38, 0.85)"
                />
                <text
                  x={overlay.labelX ?? lastPoint?.x ?? 50}
                  y={(overlay.labelY ?? (lastPoint?.y ?? 50) - 3) - 0.4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="2.2"
                  fontWeight="900"
                >
                  {overlay.label}
                </text>
              </g>
            ) : null}
            {selected && overlay.path.map((point, pointIndex) => (
              <circle
                key={`${overlay.id}-${pointIndex}`}
                cx={point.x}
                cy={point.y}
                r="1.25"
                fill="#fde047"
                stroke="#111827"
                strokeWidth="0.25"
                className="cursor-grab"
                onMouseDown={(event) => {
                  if (editorTool !== "select") return;
                  event.stopPropagation();
                  dragRef.current = { overlayId: overlay.id, pointIndex, lastX: point.x, lastY: point.y };
                }}
              />
            ))}
          </g>
        );
      })}

      {fieldTags.map((tag) => (
        <g
          key={tag.id}
          className="cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onTagClick(tag.id);
          }}
        >
          <rect
            x={tag.x - Math.max(5, tag.label.length * 0.95)}
            y={tag.y - 3}
            width={Math.max(10, tag.label.length * 1.9)}
            height="5.2"
            rx="1.3"
            className={getTagToneClass(tag.tone)}
            opacity="0.95"
            stroke={selectedFieldTagId === tag.id ? "#111827" : "rgba(255,255,255,0.4)"}
            strokeWidth={selectedFieldTagId === tag.id ? "0.45" : "0.2"}
          />
          <text x={tag.x} y={tag.y - 0.4} textAnchor="middle" dominantBaseline="middle" fill="#111827" fontSize="2.25" fontWeight="900">
            {tag.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

type StuntBoardProps = {
  scoreStuntAttempt?: (accuracy: number, isCorrect: boolean, attemptKey: string) => void;
  lastStuntScoreSummary?: ScoreSummary;
};

export function StuntBoard({
  scoreStuntAttempt,
  lastStuntScoreSummary,
}: StuntBoardProps = {}) {
  const [boardTitle, setBoardTitle] = useState("Working Stunt Board");
  const [savedBoards, setSavedBoards] = useState<StuntSavedBoard[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState(EMPTY_BOARD_ID);
  const [routeOverlays, setRouteOverlays] = useState<StuntRouteOverlay[]>([]);
  const [fieldTags, setFieldTags] = useState<StuntFieldTag[]>([]);
  const [editorTool, setEditorTool] = useState<StuntEditorTool>("line");
  const [lineLabel, setLineLabel] = useState("");
  const [lineColor, setLineColor] = useState<StuntLineColor>("red");
  const [lineWeight, setLineWeight] = useState("normal");
  const [lineStyle, setLineStyle] = useState<StuntLineStyle>("solid");
  const [lineEnd, setLineEnd] = useState<StuntLineEnd>("arrow");
  const [tagLabel, setTagLabel] = useState("");
  const [tagTone, setTagTone] = useState<StuntFieldTag["tone"]>("red");
  const [teSide, setTeSide] = useState<"none" | "left" | "right">("none");
  const [loadFront, setLoadFront] = useState<StuntLoadFront>("none");
  const [stuntViewMode, setStuntViewMode] = useState<"study" | "quiz">("study");
  const [stuntQuizMode, setStuntQuizMode] = useState<keyof typeof STUNT_QUIZ_MODE_LABELS>("build");
  const [quizType, setQuizType] = useState<StuntQuizType>("first_second");
  const [quizFirstPlayerId, setQuizFirstPlayerId] = useState<StuntPlayerId | "">("");
  const [quizExtraFirstPlayerId, setQuizExtraFirstPlayerId] = useState<StuntPlayerId | "">("");
  const [quizSecondPlayerId, setQuizSecondPlayerId] = useState<StuntPlayerId | "">("");
  const [quizDirection, setQuizDirection] = useState<StuntDirectionAnswer | "">("");
  const [quizDirectionPlayerIds, setQuizDirectionPlayerIds] = useState<StuntPlayerId[]>([]);
  const [quizWeakSideStunt, setQuizWeakSideStunt] = useState<StuntGameSideAnswer | "">("");
  const [quizStrongSideStunt, setQuizStrongSideStunt] = useState<StuntGameSideAnswer | "">("");
  const [quizAnswerFirstPlayerId, setQuizAnswerFirstPlayerId] = useState<StuntPlayerId | "">("");
  const [quizAnswerExtraFirstPlayerId, setQuizAnswerExtraFirstPlayerId] = useState<StuntPlayerId | "">("");
  const [quizAnswerSecondPlayerId, setQuizAnswerSecondPlayerId] = useState<StuntPlayerId | "">("");
  const [quizAnswerDirection, setQuizAnswerDirection] = useState<StuntDirectionAnswer | "">("");
  const [quizAnswerDirectionPlayerIds, setQuizAnswerDirectionPlayerIds] = useState<StuntPlayerId[]>([]);
  const [quizAnswerWeakSideStunt, setQuizAnswerWeakSideStunt] = useState<StuntGameSideAnswer | "">("");
  const [quizAnswerStrongSideStunt, setQuizAnswerStrongSideStunt] = useState<StuntGameSideAnswer | "">("");
  const [quizAnswerStuntName, setQuizAnswerStuntName] = useState("");
  const [quizResult, setQuizResult] = useState("");
  const [showStuntCorrectAnswer, setShowStuntCorrectAnswer] = useState(false);
  const [showStuntAdminTools, setShowStuntAdminTools] = useState(false);
  const [stuntQuizRepId, setStuntQuizRepId] = useState(() => Date.now());
  const [draftPoints, setDraftPoints] = useState<{ x: number; y: number }[]>([]);
  const [selectedRouteOverlayId, setSelectedRouteOverlayId] = useState<string | null>(null);
  const [selectedFieldTagId, setSelectedFieldTagId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [stuntStorageLoaded, setStuntStorageLoaded] = useState(false);

  useEffect(() => {
    try {
      const parsed = parseStuntStorage(window.localStorage.getItem(STUNT_BOARDS_STORAGE_KEY));
      setBoardTitle(parsed.working.title);
      setRouteOverlays(parsed.working.routeOverlays.map(alignStuntArrowOverlay));
      setFieldTags(parsed.working.fieldTags);
      setTeSide(parsed.working.surface?.teSide ?? "none");
      setLoadFront(parsed.working.surface?.loadFront === true ? "strong" : parsed.working.surface?.loadFront || "none");
      const inferredWorking = applyInferredStuntQuiz({
        id: EMPTY_BOARD_ID,
        title: parsed.working.title,
        routeOverlays: parsed.working.routeOverlays.map(alignStuntArrowOverlay),
        fieldTags: parsed.working.fieldTags,
        surface: parsed.working.surface,
        quiz: parsed.working.quiz,
      });
      setQuizType(inferredWorking.quiz?.type ?? "first_second");
      setQuizFirstPlayerId(getQuizFirstPlayerIds(inferredWorking.quiz)[0] ?? "");
      setQuizExtraFirstPlayerId(getQuizFirstPlayerIds(inferredWorking.quiz)[1] ?? "");
      setQuizSecondPlayerId(getQuizSecondPlayerIds(inferredWorking.quiz)[0] ?? "");
      setQuizDirection(inferredWorking.quiz?.direction ?? "");
      setQuizDirectionPlayerIds(inferredWorking.quiz?.directionPlayerIds ?? []);
      setQuizWeakSideStunt(inferredWorking.quiz?.weakSideStunt ?? "");
      setQuizStrongSideStunt(inferredWorking.quiz?.strongSideStunt ?? "");
      setSavedBoards(parsed.boards.map((board) => ({
        ...applyInferredStuntQuiz(board),
        routeOverlays: board.routeOverlays.map(alignStuntArrowOverlay),
      })));
    } catch {
    } finally {
      setStuntStorageLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!stuntStorageLoaded) return;
    window.localStorage.setItem(STUNT_BOARDS_STORAGE_KEY, stringifyStuntStorage({
      title: boardTitle,
      routeOverlays,
      fieldTags,
      boards: savedBoards,
      surface: { teSide, loadFront },
      quiz: {
        type: quizType,
        firstPlayerId: quizFirstPlayerId || undefined,
        firstPlayerIds: [quizFirstPlayerId, quizExtraFirstPlayerId].filter(Boolean) as StuntPlayerId[],
        secondPlayerId: quizSecondPlayerId || undefined,
        secondPlayerIds: [quizSecondPlayerId].filter(Boolean) as StuntPlayerId[],
        directionPlayerIds: quizDirectionPlayerIds,
        direction: quizDirection || undefined,
        weakSideStunt: quizWeakSideStunt || undefined,
        strongSideStunt: quizStrongSideStunt || undefined,
      },
    }));
  }, [boardTitle, fieldTags, loadFront, quizDirection, quizDirectionPlayerIds, quizExtraFirstPlayerId, quizFirstPlayerId, quizSecondPlayerId, quizStrongSideStunt, quizType, quizWeakSideStunt, routeOverlays, savedBoards, stuntStorageLoaded, teSide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();
      if (target?.isContentEditable || tagName === "input" || tagName === "textarea" || tagName === "select") return;
      if (!selectedRouteOverlayId && !selectedFieldTagId) return;
      event.preventDefault();
      deleteSelectedObject();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const displayOverlays = useMemo(() => ([
    ...routeOverlays,
    ...buildStuntDraftOverlay({
      draftPoints,
      label: lineLabel,
      color: lineColor,
      weight: lineWeight,
      style: lineStyle,
      endCap: lineEnd,
    }),
  ]), [draftPoints, lineColor, lineEnd, lineLabel, lineStyle, lineWeight, routeOverlays]);

  const selectedOverlay = routeOverlays.find((overlay) => overlay.id === selectedRouteOverlayId) ?? null;
  const selectedTag = fieldTags.find((tag) => tag.id === selectedFieldTagId) ?? null;
  const activeLineColor = editorTool === "select" && selectedOverlay ? getLineColorFromStroke(selectedOverlay.color) : lineColor;
  const activeLineWeight = editorTool === "select" && selectedOverlay ? getLineWeightFromStrokeWidth(selectedOverlay.strokeWidth) : lineWeight;
  const activeLineStyle = editorTool === "select" && selectedOverlay ? (selectedOverlay.dashed ? "dashed" : "solid") : lineStyle;
  const activeLineEnd = editorTool === "select" && selectedOverlay ? (selectedOverlay.endCap ?? "arrow") : lineEnd;
  const stuntNameOptions = useMemo(() => Array.from(new Set(
    savedBoards
      .map((board) => board.title.trim())
      .filter(Boolean),
  )).sort((a, b) => a.localeCompare(b)), [savedBoards]);
  const showQuizAnswerBoard = stuntViewMode === "quiz" && (stuntQuizMode === "name" || showStuntCorrectAnswer);
  const boardRouteOverlays = stuntViewMode === "quiz"
    ? (showQuizAnswerBoard ? routeOverlays : [])
    : displayOverlays;
  const boardFieldTags = stuntViewMode === "quiz" ? (showQuizAnswerBoard ? fieldTags : []) : fieldTags;
  const canEditStuntBoard = stuntViewMode === "study" && showStuntAdminTools;
  const expectedFirstPlayerIds = [quizFirstPlayerId, quizExtraFirstPlayerId].filter(Boolean) as StuntPlayerId[];
  const expectedSecondPlayerIds = [quizSecondPlayerId].filter(Boolean) as StuntPlayerId[];
  const needsExtraFirstAnswer = expectedFirstPlayerIds.length > 1;

  const clearSelection = () => {
    setSelectedRouteOverlayId(null);
    setSelectedFieldTagId(null);
  };

  const finishLine = () => {
    if (draftPoints.length < 2) return;
    const finishedPath = lineEnd === "arrow"
      ? draftPoints.map((point, index) => (index === draftPoints.length - 1 ? { ...point, y: STUNT_ARROW_END_Y } : point))
      : draftPoints;
    const lastPoint = finishedPath[finishedPath.length - 1];
    setRouteOverlays((prev) => [
      ...prev,
      alignStuntArrowOverlay({
        id: `stunt-line-${Date.now()}`,
        label: lineLabel.trim(),
        color: getStuntLineStroke(lineColor),
        path: finishedPath,
        labelX: lineLabel.trim() ? lastPoint.x : undefined,
        labelY: lineLabel.trim() ? (lineEnd === "arrow" ? STUNT_ARROW_LABEL_Y : lastPoint.y - 3) : undefined,
        strokeWidth: getStuntLineStrokeWidth(lineWeight),
        dashed: lineStyle === "dashed",
        endCap: lineEnd,
      }),
    ]);
    setDraftPoints([]);
  };

  const handleBoardClick = (event: ReactMouseEvent<SVGSVGElement>) => {
    const point = getSvgPoint(event);
    if (editorTool === "select") {
      clearSelection();
      return;
    }
    if (editorTool === "tag") {
      const cleanLabel = tagLabel.trim();
      if (!cleanLabel) return;
      setFieldTags((prev) => [...prev, { id: `stunt-tag-${Date.now()}`, label: cleanLabel, x: point.x, y: point.y, tone: tagTone }]);
      return;
    }
    setDraftPoints((prev) => [...prev, point]);
  };

  const handleBoardDoubleClick = (event: ReactMouseEvent<SVGSVGElement>) => {
    if (editorTool !== "line") return;
    event.preventDefault();
    finishLine();
  };

  const saveBoard = () => {
    const cleanTitle = boardTitle.trim() || "Untitled Stunt";
    const nextBoard: StuntSavedBoard = {
      id: selectedBoardId !== EMPTY_BOARD_ID ? selectedBoardId : `stunt-board-${Date.now()}`,
      title: cleanTitle,
      routeOverlays,
      fieldTags,
      surface: { teSide, loadFront },
      quiz: {
        type: quizType,
        firstPlayerId: quizFirstPlayerId || undefined,
        firstPlayerIds: [quizFirstPlayerId, quizExtraFirstPlayerId].filter(Boolean) as StuntPlayerId[],
        secondPlayerId: quizSecondPlayerId || undefined,
        secondPlayerIds: [quizSecondPlayerId].filter(Boolean) as StuntPlayerId[],
        directionPlayerIds: quizDirectionPlayerIds,
        direction: quizDirection || undefined,
        weakSideStunt: quizWeakSideStunt || undefined,
        strongSideStunt: quizStrongSideStunt || undefined,
      },
    };
    setSavedBoards((prev) => {
      const exists = prev.some((board) => board.id === nextBoard.id);
      return exists ? prev.map((board) => (board.id === nextBoard.id ? nextBoard : board)) : [...prev, nextBoard];
    });
    setSelectedBoardId(nextBoard.id);
    setNotice(`Saved ${cleanTitle}.`);
  };

  const loadStuntBoard = (board: StuntSavedBoard) => {
    clearSelection();
    setDraftPoints([]);
    const inferredBoard = applyInferredStuntQuiz(board);
    setSelectedBoardId(inferredBoard.id);
    setBoardTitle(inferredBoard.title);
    setRouteOverlays(inferredBoard.routeOverlays.map(alignStuntArrowOverlay));
    setFieldTags(inferredBoard.fieldTags);
    setTeSide(inferredBoard.surface?.teSide ?? "none");
    setLoadFront(inferredBoard.surface?.loadFront === true ? "strong" : inferredBoard.surface?.loadFront || "none");
    setQuizType(inferredBoard.quiz?.type ?? "first_second");
    setQuizFirstPlayerId(getQuizFirstPlayerIds(inferredBoard.quiz)[0] ?? "");
    setQuizExtraFirstPlayerId(getQuizFirstPlayerIds(inferredBoard.quiz)[1] ?? "");
    setQuizSecondPlayerId(getQuizSecondPlayerIds(inferredBoard.quiz)[0] ?? "");
    setQuizDirection(inferredBoard.quiz?.direction ?? "");
    setQuizDirectionPlayerIds(inferredBoard.quiz?.directionPlayerIds ?? []);
    setQuizWeakSideStunt(inferredBoard.quiz?.weakSideStunt ?? "");
    setQuizStrongSideStunt(inferredBoard.quiz?.strongSideStunt ?? "");
    if (!hasCompleteStuntQuiz(board.quiz) && hasCompleteStuntQuiz(inferredBoard.quiz)) {
      setSavedBoards((prev) => prev.map((item) => (item.id === inferredBoard.id ? inferredBoard : item)));
    }
    setQuizAnswerFirstPlayerId("");
    setQuizAnswerExtraFirstPlayerId("");
    setQuizAnswerSecondPlayerId("");
    setQuizAnswerDirection("");
    setQuizAnswerDirectionPlayerIds([]);
    setQuizAnswerWeakSideStunt("");
    setQuizAnswerStrongSideStunt("");
    setQuizAnswerStuntName("");
    setQuizResult("");
    setShowStuntCorrectAnswer(false);
  };

  const loadBoard = (boardId: string) => {
    if (boardId === EMPTY_BOARD_ID) {
      setSelectedBoardId(boardId);
      clearSelection();
      setDraftPoints([]);
      setShowStuntCorrectAnswer(false);
      return;
    }
    const board = savedBoards.find((item) => item.id === boardId);
    if (!board) return;
    loadStuntBoard(board);
  };

  const loadRandomStuntQuizBoard = (mode: keyof typeof STUNT_QUIZ_MODE_LABELS = stuntQuizMode) => {
    setStuntQuizRepId(Date.now());
    const quizBoards = mode === "name"
      ? savedBoards.filter((board) => board.routeOverlays.length || board.fieldTags.length)
      : savedBoards
        .map(applyInferredStuntQuiz)
        .filter((board) => hasCompleteStuntQuiz(board.quiz));
    if (!quizBoards.length) {
      setQuizResult(mode === "name" ? "No saved stunt boards to name yet." : "No saved stunt boards with answer keys yet.");
      return;
    }
    const otherBoards = quizBoards.filter((board) => board.id !== selectedBoardId);
    const pool = otherBoards.length ? otherBoards : quizBoards;
    loadStuntBoard(pool[Math.floor(Math.random() * pool.length)]);
  };

  const newBoard = () => {
    setSelectedBoardId(EMPTY_BOARD_ID);
    setBoardTitle("Working Stunt Board");
    setRouteOverlays([]);
    setFieldTags([]);
    setTeSide("none");
    setLoadFront("none");
    setQuizType("first_second");
    setQuizFirstPlayerId("");
    setQuizExtraFirstPlayerId("");
    setQuizSecondPlayerId("");
    setQuizDirection("");
    setQuizDirectionPlayerIds([]);
    setQuizWeakSideStunt("");
    setQuizStrongSideStunt("");
    setQuizAnswerFirstPlayerId("");
    setQuizAnswerExtraFirstPlayerId("");
    setQuizAnswerSecondPlayerId("");
    setQuizAnswerDirection("");
    setQuizAnswerDirectionPlayerIds([]);
    setQuizAnswerWeakSideStunt("");
    setQuizAnswerStrongSideStunt("");
    setQuizAnswerStuntName("");
    setQuizResult("");
    setShowStuntCorrectAnswer(false);
    setDraftPoints([]);
    clearSelection();
    setNotice("Fresh stunt board ready.");
  };

  const deleteSelectedObject = () => {
    if (selectedRouteOverlayId) {
      setRouteOverlays((prev) => prev.filter((overlay) => overlay.id !== selectedRouteOverlayId));
      setSelectedRouteOverlayId(null);
    }
    if (selectedFieldTagId) {
      setFieldTags((prev) => prev.filter((tag) => tag.id !== selectedFieldTagId));
      setSelectedFieldTagId(null);
    }
  };

  const updateSelectedOverlay = (patch: Partial<StuntRouteOverlay>) => {
    if (!selectedRouteOverlayId) return;
    setRouteOverlays((prev) => prev.map((overlay) => (
      overlay.id === selectedRouteOverlayId ? alignStuntArrowOverlay({ ...overlay, ...patch }) : overlay
    )));
  };

  const updateSelectedTag = (patch: Partial<StuntFieldTag>) => {
    if (!selectedFieldTagId) return;
    setFieldTags((prev) => prev.map((tag) => (
      tag.id === selectedFieldTagId ? { ...tag, ...patch } : tag
    )));
  };

  const moveOverlay = (id: string, dx: number, dy: number) => {
    setRouteOverlays((prev) => prev.map((overlay) => (
      overlay.id === id
        ? alignStuntArrowOverlay({
          ...overlay,
          path: overlay.path.map((point) => ({ x: point.x + dx, y: point.y + dy })),
          labelX: typeof overlay.labelX === "number" ? overlay.labelX + dx : overlay.labelX,
          labelY: typeof overlay.labelY === "number" ? overlay.labelY + dy : overlay.labelY,
        })
        : overlay
    )));
  };

  const moveOverlayPoint = (id: string, pointIndex: number, x: number, y: number) => {
    setRouteOverlays((prev) => prev.map((overlay) => (
      overlay.id === id
        ? alignStuntArrowOverlay({
          ...overlay,
          path: overlay.path.map((point, index) => (index === pointIndex ? { x, y } : point)),
        })
        : overlay
    )));
  };

  const toggleQuizDirectionPlayer = (playerId: StuntPlayerId) => {
    setQuizDirectionPlayerIds((prev) => (
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    ));
  };

  const toggleQuizAnswerDirectionPlayer = (playerId: StuntPlayerId) => {
    setShowStuntCorrectAnswer(false);
    setQuizAnswerDirectionPlayerIds((prev) => (
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    ));
  };

  const checkStuntQuiz = () => {
    setShowStuntCorrectAnswer(true);
    const attemptKey = `stunt::${stuntQuizMode}::${quizType}::${selectedBoardId}::${stuntQuizRepId}`;
    if (stuntQuizMode === "name") {
      const isCorrect = quizAnswerStuntName === boardTitle;
      scoreStuntAttempt?.(isCorrect ? 1 : 0, isCorrect, attemptKey);
      setQuizResult(isCorrect ? "1/1 correct. Good rep." : `0/1 correct. Correct answer: ${boardTitle}.`);
      return;
    }

    if (quizType === "first_second") {
      const answeredFirstPlayerIds = [quizAnswerFirstPlayerId, quizAnswerExtraFirstPlayerId].filter(Boolean) as StuntPlayerId[];
      const answeredSecondPlayerIds = [quizAnswerSecondPlayerId].filter(Boolean) as StuntPlayerId[];
      const firstCorrect = samePlayerSet(answeredFirstPlayerIds, expectedFirstPlayerIds);
      const secondCorrect = samePlayerSet(answeredSecondPlayerIds, expectedSecondPlayerIds);
      const score = Number(firstCorrect) + Number(secondCorrect);
      const firstLabels = expectedFirstPlayerIds.map(getStuntPlayerLabel).join(" + ") || "unset";
      const secondLabels = expectedSecondPlayerIds.map(getStuntPlayerLabel).join(" + ") || "unset";
      scoreStuntAttempt?.(score / 2, score === 2, attemptKey);
      setQuizResult(`${score}/2 correct${score === 2 ? ". Good rep." : `. Correct answer: ${firstLabels} 1ST, ${secondLabels} 2ND.`}`);
      return;
    }

    if (quizType === "games") {
      const weakCorrect = quizAnswerWeakSideStunt === quizWeakSideStunt;
      const strongCorrect = quizAnswerStrongSideStunt === quizStrongSideStunt;
      const score = Number(weakCorrect) + Number(strongCorrect);
      scoreStuntAttempt?.(score / 2, score === 2, attemptKey);
      setQuizResult(`${score}/2 correct${score === 2 ? ". Good rep." : `. Correct answer: Weak ${quizWeakSideStunt || "unset"}, Strong ${quizStrongSideStunt || "unset"}.`}`);
      return;
    }

    const expectedPlayers = [...quizDirectionPlayerIds].sort().join(",");
    const answeredPlayers = [...quizAnswerDirectionPlayerIds].sort().join(",");
    const playersCorrect = expectedPlayers === answeredPlayers;
    const directionCorrect = quizAnswerDirection === quizDirection;
    const score = Number(playersCorrect) + Number(directionCorrect);
    const directionLabel = STUNT_DIRECTION_OPTIONS.find((option) => option.value === quizDirection)?.label ?? "unset";
    const playerLabel = quizDirectionPlayerIds.map(getStuntPlayerLabel).join(", ") || "unset";
    scoreStuntAttempt?.(score / 2, score === 2, attemptKey);
    setQuizResult(`${score}/2 correct${score === 2 ? ". Good rep." : `. Correct answer: ${playerLabel} / ${directionLabel}.`}`);
  };

  const autoSetupSavedStuntKeys = () => {
    setSavedBoards((prev) => prev.map(applyInferredStuntQuiz));
    const currentBoard: StuntSavedBoard = {
      id: selectedBoardId,
      title: boardTitle,
      routeOverlays,
      fieldTags,
      surface: { teSide, loadFront },
      quiz: {
        type: quizType,
        firstPlayerId: quizFirstPlayerId || undefined,
        firstPlayerIds: [quizFirstPlayerId, quizExtraFirstPlayerId].filter(Boolean) as StuntPlayerId[],
        secondPlayerId: quizSecondPlayerId || undefined,
        secondPlayerIds: [quizSecondPlayerId].filter(Boolean) as StuntPlayerId[],
        directionPlayerIds: quizDirectionPlayerIds,
        direction: quizDirection || undefined,
        weakSideStunt: quizWeakSideStunt || undefined,
        strongSideStunt: quizStrongSideStunt || undefined,
      },
    };
    const inferredCurrent = applyInferredStuntQuiz(currentBoard);
    setQuizType(inferredCurrent.quiz?.type ?? "first_second");
    setQuizFirstPlayerId(getQuizFirstPlayerIds(inferredCurrent.quiz)[0] ?? "");
    setQuizExtraFirstPlayerId(getQuizFirstPlayerIds(inferredCurrent.quiz)[1] ?? "");
    setQuizSecondPlayerId(getQuizSecondPlayerIds(inferredCurrent.quiz)[0] ?? "");
    setQuizDirection(inferredCurrent.quiz?.direction ?? "");
    setQuizDirectionPlayerIds(inferredCurrent.quiz?.directionPlayerIds ?? []);
    setQuizWeakSideStunt(inferredCurrent.quiz?.weakSideStunt ?? "");
    setQuizStrongSideStunt(inferredCurrent.quiz?.strongSideStunt ?? "");
    setNotice("Auto-set stunt quiz keys from existing board drawings.");
  };

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border bg-white p-4">
            <div className="mb-3">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Stunt Mode</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              {stuntViewMode === "quiz" && stuntQuizMode === "name" ? "Name the Stunt" : boardTitle}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {stuntViewMode === "quiz" && stuntQuizMode === "name"
                ? "Study the stunt on the board, then choose the correct name."
                : "Draw and save stunt boards from a clean OL/DL surface."}
            </div>
          </div>

          <div className="mb-3 grid gap-2 sm:grid-cols-2">
            <Button
              variant={stuntViewMode === "study" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => {
                setStuntViewMode("study");
                setQuizResult("");
                setShowStuntCorrectAnswer(false);
              }}
            >
              Study
            </Button>
            <Button
              variant={stuntViewMode === "quiz" ? "default" : "outline"}
              className="rounded-xl"
              onClick={() => {
                setStuntViewMode("quiz");
                setShowStuntAdminTools(false);
                clearSelection();
                setDraftPoints([]);
                setQuizResult("");
                setShowStuntCorrectAnswer(false);
                loadRandomStuntQuizBoard();
              }}
            >
              Quiz
            </Button>
          </div>

          {canEditStuntBoard ? (
          <div className="mb-3 rounded-xl border bg-slate-50 p-2.5">
            <div className="grid min-w-0 gap-2">
              <div className="grid min-w-0 gap-2 md:grid-cols-[150px_minmax(180px,1fr)_140px]">
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Tool</div>
                  <Select value={editorTool} onValueChange={(value: StuntEditorTool) => setEditorTool(value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      <SelectItem value="select">Select / Edit</SelectItem>
                      <SelectItem value="line">Polyline</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    {editorTool === "tag" ? "Tag Label" : "Line Label"}
                  </div>
                  <Input
                    className="h-9 px-2 text-sm"
                    value={editorTool === "tag" ? tagLabel : selectedOverlay ? selectedOverlay.label : selectedTag ? selectedTag.label : lineLabel}
                    placeholder={editorTool === "select" ? "Select an object to edit" : "Optional label"}
                    onChange={(event) => {
                      if (editorTool === "tag") setTagLabel(event.target.value);
                      else if (editorTool === "select" && selectedOverlay) updateSelectedOverlay({ label: event.target.value });
                      else if (editorTool === "select" && selectedTag) updateSelectedTag({ label: event.target.value });
                      else setLineLabel(event.target.value);
                    }}
                  />
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Color</div>
                  <Select
                    value={activeLineColor}
                    onValueChange={(value: StuntLineColor) => {
                      if (editorTool === "select" && selectedOverlay) updateSelectedOverlay({ color: getStuntLineStroke(value) });
                      else setLineColor(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="cyan">Cyan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid min-w-0 gap-2 md:grid-cols-[repeat(3,minmax(100px,1fr))_auto]">
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Weight</div>
                  <Select
                    value={activeLineWeight}
                    onValueChange={(value) => {
                      if (editorTool === "select" && selectedOverlay) updateSelectedOverlay({ strokeWidth: getStuntLineStrokeWidth(value) });
                      else setLineWeight(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      <SelectItem value="thin">Thin</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="thick">Thick</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Style</div>
                  <Select
                    value={activeLineStyle}
                    onValueChange={(value: StuntLineStyle) => {
                      if (editorTool === "select" && selectedOverlay) updateSelectedOverlay({ dashed: value === "dashed" });
                      else setLineStyle(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-48 overflow-y-auto">
                      <SelectItem value="solid">Solid</SelectItem>
                      <SelectItem value="dashed">Dashed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">End</div>
                  <Select
                    value={activeLineEnd}
                    onValueChange={(value: StuntLineEnd) => {
                      if (editorTool === "select" && selectedOverlay) updateSelectedOverlay({ endCap: value });
                      else setLineEnd(value);
                    }}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arrow">Arrow</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button className="h-9 rounded-xl px-3 text-sm" onClick={finishLine} disabled={draftPoints.length < 2}>Finish</Button>
                  <Button variant="outline" className="h-9 rounded-xl px-3 text-sm" onClick={() => setDraftPoints([])}>Cancel</Button>
                </div>
              </div>
            </div>
            <div className="mt-2 text-[11px] leading-4 text-slate-500">
              {editorTool === "line"
                ? `Draft points: ${draftPoints.length}. Click for angles, double-click or Finish to complete.`
                : editorTool === "tag"
                  ? "Click the board to place the current tag."
                  : "Select a line to drag it or move individual endpoints. Press Delete to remove selected objects."}
            </div>
          </div>
          ) : null}

          <StuntField
            routeOverlays={boardRouteOverlays}
            fieldTags={boardFieldTags}
            selectedRouteOverlayId={selectedRouteOverlayId}
            selectedFieldTagId={selectedFieldTagId}
            editorTool={canEditStuntBoard ? editorTool : "select"}
            onBoardClick={canEditStuntBoard ? handleBoardClick : () => {}}
            onBoardDoubleClick={canEditStuntBoard ? handleBoardDoubleClick : () => {}}
            onOverlayClick={(id) => {
              if (!canEditStuntBoard) return;
              setSelectedRouteOverlayId(id);
              setSelectedFieldTagId(null);
              setEditorTool("select");
            }}
            onTagClick={(id) => {
              if (!canEditStuntBoard) return;
              setSelectedFieldTagId(id);
              setSelectedRouteOverlayId(null);
              setEditorTool("select");
            }}
            onMoveOverlay={canEditStuntBoard ? moveOverlay : () => {}}
            onMoveOverlayPoint={canEditStuntBoard ? moveOverlayPoint : () => {}}
            teSide={teSide}
            loadFront={loadFront}
          />
        </div>
      </div>

      <div className="max-h-[calc(100vh-220px)] min-w-0 space-y-3 overflow-y-auto overflow-x-hidden rounded-2xl border bg-white p-4 pr-3 text-sm text-slate-600">
        {stuntViewMode === "study" ? (
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Boards</div>
            <Select value={selectedBoardId} onValueChange={loadBoard}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                <SelectItem value={EMPTY_BOARD_ID}>Working Board</SelectItem>
                {savedBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id}>
                    {board.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {stuntViewMode === "study" ? (
          <Button
            className="w-full rounded-xl"
            variant={showStuntAdminTools ? "default" : "outline"}
            onClick={() => {
              setShowStuntAdminTools((prev) => {
                if (prev) {
                  clearSelection();
                  setDraftPoints([]);
                }
                return !prev;
              });
            }}
          >
            {showStuntAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
          </Button>
        ) : null}

        {showStuntAdminTools && stuntViewMode === "study" ? (
          <>
        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Title</div>
          <Input value={boardTitle} onChange={(event) => setBoardTitle(event.target.value)} />
        </div>

        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Surface</div>
          <div className="grid gap-2">
            <Select value={teSide} onValueChange={(value: "none" | "left" | "right") => setTeSide(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No TE</SelectItem>
                <SelectItem value="left">TE Left</SelectItem>
                <SelectItem value="right">TE Right</SelectItem>
              </SelectContent>
            </Select>
            <Select value={loadFront} onValueChange={(value: StuntLoadFront) => setLoadFront(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Normal Front</SelectItem>
                <SelectItem value="strong">Load Strong</SelectItem>
                <SelectItem value="weak">Load Weak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border bg-amber-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-800">Quiz Answer Key</div>
          <div className="grid gap-2">
            <Button variant="outline" className="rounded-xl border-amber-300 text-amber-900" onClick={autoSetupSavedStuntKeys}>
              Auto-Set From Boards
            </Button>
            <Select value={quizType} onValueChange={(value: StuntQuizType) => {
              setQuizType(value);
              setQuizResult("");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_second">{STUNT_QUIZ_TYPE_LABELS.first_second}</SelectItem>
                <SelectItem value="direction">{STUNT_QUIZ_TYPE_LABELS.direction}</SelectItem>
                <SelectItem value="games">{STUNT_QUIZ_TYPE_LABELS.games}</SelectItem>
              </SelectContent>
            </Select>

            {quizType === "first_second" ? (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">1st A</div>
                  <Select value={quizFirstPlayerId || "unset"} onValueChange={(value) => setQuizFirstPlayerId(value === "unset" ? "" : value as StuntPlayerId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Choose</SelectItem>
                      {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">1st B</div>
                  <Select value={quizExtraFirstPlayerId || "unset"} onValueChange={(value) => setQuizExtraFirstPlayerId(value === "unset" ? "" : value as StuntPlayerId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Optional</SelectItem>
                      {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">2nd</div>
                  <Select value={quizSecondPlayerId || "unset"} onValueChange={(value) => setQuizSecondPlayerId(value === "unset" ? "" : value as StuntPlayerId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Choose</SelectItem>
                      {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : quizType === "games" ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">Weak Side</div>
                  <Select value={quizWeakSideStunt || "unset"} onValueChange={(value) => setQuizWeakSideStunt(value === "unset" ? "" : value as StuntGameSideAnswer)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Choose</SelectItem>
                      {STUNT_GAME_SIDE_OPTIONS.map((stunt) => <SelectItem key={stunt} value={stunt}>{stunt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">Strong Side</div>
                  <Select value={quizStrongSideStunt || "unset"} onValueChange={(value) => setQuizStrongSideStunt(value === "unset" ? "" : value as StuntGameSideAnswer)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Choose</SelectItem>
                      {STUNT_GAME_SIDE_OPTIONS.map((stunt) => <SelectItem key={stunt} value={stunt}>{stunt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Select value={quizDirection || "unset"} onValueChange={(value) => setQuizDirection(value === "unset" ? "" : value as StuntDirectionAnswer)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unset">Choose Direction</SelectItem>
                    {STUNT_DIRECTION_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 gap-1">
                  {STUNT_PLAYERS.map((player) => (
                    <Button
                      key={player.id}
                      variant={quizDirectionPlayerIds.includes(player.id) ? "default" : "outline"}
                      className="rounded-lg px-2 text-xs"
                      onClick={() => toggleQuizDirectionPlayer(player.id)}
                    >
                      {player.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-amber-900">Save the board after setting this answer key.</div>
          </div>
        </div>
          </>
        ) : null}

        {stuntViewMode === "quiz" ? (
          <div className="rounded-xl border bg-emerald-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-800">Quiz Rep</div>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <Button
                variant={stuntQuizMode === "build" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => {
                  setStuntQuizMode("build");
                  setQuizAnswerStuntName("");
                  setQuizResult("");
                  setShowStuntCorrectAnswer(false);
                  loadRandomStuntQuizBoard("build");
                }}
              >
                {STUNT_QUIZ_MODE_LABELS.build}
              </Button>
              <Button
                variant={stuntQuizMode === "name" ? "default" : "outline"}
                className="rounded-xl"
                onClick={() => {
                  setStuntQuizMode("name");
                  setQuizAnswerFirstPlayerId("");
                  setQuizAnswerExtraFirstPlayerId("");
                  setQuizAnswerSecondPlayerId("");
                  setQuizAnswerDirection("");
                  setQuizAnswerDirectionPlayerIds([]);
                  setQuizAnswerWeakSideStunt("");
                  setQuizAnswerStrongSideStunt("");
                  setQuizResult("");
                  setShowStuntCorrectAnswer(false);
                  loadRandomStuntQuizBoard("name");
                }}
              >
                {STUNT_QUIZ_MODE_LABELS.name}
              </Button>
            </div>
            <div className="mb-2 rounded-lg border border-emerald-200 bg-white p-2 text-xs text-emerald-950">
              <div className="font-semibold">
                {stuntQuizMode === "name" ? STUNT_QUIZ_MODE_LABELS.name : STUNT_QUIZ_TYPE_LABELS[quizType]}
              </div>
              <div className="mt-0.5 text-emerald-800">
                {stuntQuizMode === "name"
                  ? "Study the full stunt drawing, then name it from the dropdown."
                  : quizType === "first_second" && needsExtraFirstAnswer
                    ? "Choose both 1ST stunters and the 2ND stunter."
                    : STUNT_QUIZ_INSTRUCTIONS[quizType]}
              </div>
            </div>
            {stuntQuizMode === "name" ? (
              <Select
                value={quizAnswerStuntName || "unset"}
                onValueChange={(value) => {
                  setShowStuntCorrectAnswer(false);
                  setQuizAnswerStuntName(value === "unset" ? "" : value);
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-80 overflow-y-auto">
                  <SelectItem value="unset">Choose stunt</SelectItem>
                  {stuntNameOptions.map((name) => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : quizType === "first_second" ? (
              <div className={`grid gap-2 ${needsExtraFirstAnswer ? "grid-cols-3" : "grid-cols-2"}`}>
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">{needsExtraFirstAnswer ? "1st A" : "1st"}</div>
                  <Select
                    value={quizAnswerFirstPlayerId || "unset"}
                    onValueChange={(value) => {
                      setShowStuntCorrectAnswer(false);
                      setQuizAnswerFirstPlayerId(value === "unset" ? "" : value as StuntPlayerId);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Who is 1st?</SelectItem>
                      {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {needsExtraFirstAnswer ? (
                  <div>
                    <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">1st B</div>
                    <Select
                      value={quizAnswerExtraFirstPlayerId || "unset"}
                      onValueChange={(value) => {
                        setShowStuntCorrectAnswer(false);
                        setQuizAnswerExtraFirstPlayerId(value === "unset" ? "" : value as StuntPlayerId);
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unset">Other 1st?</SelectItem>
                        {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">2nd</div>
                  <Select
                    value={quizAnswerSecondPlayerId || "unset"}
                    onValueChange={(value) => {
                      setShowStuntCorrectAnswer(false);
                      setQuizAnswerSecondPlayerId(value === "unset" ? "" : value as StuntPlayerId);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Who is 2nd?</SelectItem>
                      {STUNT_PLAYERS.map((player) => <SelectItem key={player.id} value={player.id}>{player.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : quizType === "games" ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">Weak Side</div>
                  <Select
                    value={quizAnswerWeakSideStunt || "unset"}
                    onValueChange={(value) => {
                      setShowStuntCorrectAnswer(false);
                      setQuizAnswerWeakSideStunt(value === "unset" ? "" : value as StuntGameSideAnswer);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Weak side stunt</SelectItem>
                      {STUNT_GAME_SIDE_OPTIONS.map((stunt) => <SelectItem key={stunt} value={stunt}>{stunt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">Strong Side</div>
                  <Select
                    value={quizAnswerStrongSideStunt || "unset"}
                    onValueChange={(value) => {
                      setShowStuntCorrectAnswer(false);
                      setQuizAnswerStrongSideStunt(value === "unset" ? "" : value as StuntGameSideAnswer);
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unset">Strong side stunt</SelectItem>
                      {STUNT_GAME_SIDE_OPTIONS.map((stunt) => <SelectItem key={stunt} value={stunt}>{stunt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="grid gap-2">
                <Select
                  value={quizAnswerDirection || "unset"}
                  onValueChange={(value) => {
                    setShowStuntCorrectAnswer(false);
                    setQuizAnswerDirection(value === "unset" ? "" : value as StuntDirectionAnswer);
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unset">Direction</SelectItem>
                    {STUNT_DIRECTION_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-4 gap-1">
                  {STUNT_PLAYERS.map((player) => (
                    <Button
                      key={player.id}
                      variant={quizAnswerDirectionPlayerIds.includes(player.id) ? "default" : "outline"}
                      className="rounded-lg px-2 text-xs"
                      onClick={() => toggleQuizAnswerDirectionPlayer(player.id)}
                    >
                      {player.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button className="rounded-xl" onClick={checkStuntQuiz}>Check</Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setQuizAnswerFirstPlayerId("");
                  setQuizAnswerExtraFirstPlayerId("");
                  setQuizAnswerSecondPlayerId("");
	                  setQuizAnswerDirection("");
                  setQuizAnswerDirectionPlayerIds([]);
	                  setQuizAnswerWeakSideStunt("");
	                  setQuizAnswerStrongSideStunt("");
                  setQuizAnswerStuntName("");
	                  setQuizResult("");
	                  setShowStuntCorrectAnswer(false);
	                }}
              >
                Reset
              </Button>
            </div>
            {quizResult ? (
              <div className="mt-2 space-y-2 rounded-lg border bg-white p-2 text-xs text-emerald-950">
                <div>{quizResult}</div>
                {lastStuntScoreSummary ? (
                  <div className="rounded-lg border border-sky-200 bg-sky-50 p-2 text-sky-900">
                    <span className="font-semibold">Points earned:</span> {lastStuntScoreSummary.awarded}
                    <div>
                      <span className="font-semibold">Stunt total:</span> {lastStuntScoreSummary.total}
                    </div>
                    {lastStuntScoreSummary.alreadyScored ? (
                      <div className="mt-1 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}
            <Button variant="outline" className="mt-2 w-full rounded-xl" onClick={() => loadRandomStuntQuizBoard()}>
              Random Stunt
            </Button>
          </div>
        ) : null}

        {showStuntAdminTools && stuntViewMode === "study" ? (
        <div className="grid grid-cols-2 gap-2">
          <Button className="rounded-xl" onClick={saveBoard}>Save Board</Button>
          <Button variant="outline" className="rounded-xl" onClick={newBoard}>New Board</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => setRouteOverlays((prev) => prev.slice(0, -1))} disabled={!routeOverlays.length}>Undo Line</Button>
          <Button variant="outline" className="rounded-xl" onClick={() => setFieldTags((prev) => prev.slice(0, -1))} disabled={!fieldTags.length}>Undo Tag</Button>
          <Button variant="outline" className="rounded-xl border-red-300 text-red-700" onClick={deleteSelectedObject} disabled={!selectedOverlay && !selectedTag}>Delete Selected</Button>
          <Button variant="outline" className="rounded-xl" onClick={clearSelection}>Clear Select</Button>
        </div>
        ) : null}

        {notice ? (
          <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
            {notice}
          </div>
        ) : null}
      </div>
    </div>
  );
}
