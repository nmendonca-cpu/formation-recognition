"use client";

import { type PointerEvent, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RUN_GAME_BLOCK_OPTIONS,
  RUN_GAME_BLOCKERS,
  RUN_GAME_FORMATIONS,
  RUN_GAME_FRONTS,
  RUN_GAME_SCHEMES,
  getRunGameAnswerAssignments,
  getRunGameFormation,
  getRunGameFront,
  getRunGameQuizResult,
  getRunGameScheme,
  type RunGameBlockType,
  type RunGameBlockerId,
  type RunGameFrontId,
} from "@/lib/runGame/runGameLogic";
import {
  buildRunGamePaths,
  buildRunGameRunPath,
  getRunGameBoardData,
} from "@/lib/runGame/runGameRenderer";

type RunGameViewMode = "study" | "quiz";
type LabelOffset = { x: number; y: number };
type LabelOffsetMap = Record<string, LabelOffset>;
type HiddenLabelMap = Record<string, true>;
type CustomLabel = { id: string; boardKey: string; text: string; x: number; y: number };

function pointsToPolyline(points: { x: number; y: number }[]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

function getPathLabelPosition(
  path: ReturnType<typeof buildRunGamePaths>[number],
  index: number,
  paths: ReturnType<typeof buildRunGamePaths>,
) {
  const end = path.points[path.points.length - 1] ?? { x: 50, y: 50 };
  const nearbyEarlierLabels = paths
    .slice(0, index)
    .filter((otherPath) => otherPath.label)
    .filter((otherPath) => {
      const otherEnd = otherPath.points[otherPath.points.length - 1] ?? { x: 50, y: 50 };
      return Math.abs(otherEnd.x - end.x) < 10 && Math.abs(otherEnd.y - end.y) < 6;
    }).length;

  const lane = nearbyEarlierLabels % 4;
  const xOffsets = [-4.2, 4.2, -7.8, 7.8];
  const yOffsets = [-7, -10.6, -13.9, -5.2];

  return {
    x: Math.max(7, Math.min(93, end.x + xOffsets[lane])),
    y: Math.max(6, Math.min(80, end.y + yOffsets[lane])),
  };
}

function getSvgPoint(svg: SVGSVGElement, event: PointerEvent<SVGElement>) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const matrix = svg.getScreenCTM();
  if (!matrix) return { x: 0, y: 0 };
  return point.matrixTransform(matrix.inverse());
}

function RunGameField({
  schemeId,
  formationId,
  frontId,
  viewMode,
  selectedBlockerId,
  answers,
  showCorrectAnswer,
  incorrectIds,
  canEditLabels,
  labelOffsets,
  hiddenLabelKeys,
  customLabels,
  selectedLabelKey,
  onSelectBlocker,
  onSelectLabel,
  onMoveLabel,
  onMoveCustomLabel,
}: {
  schemeId: string;
  formationId: string;
  frontId: RunGameFrontId;
  viewMode: RunGameViewMode;
  selectedBlockerId: RunGameBlockerId | null;
  answers: Partial<Record<RunGameBlockerId, RunGameBlockType>>;
  showCorrectAnswer: boolean;
  incorrectIds: RunGameBlockerId[];
  canEditLabels: boolean;
  labelOffsets: LabelOffsetMap;
  hiddenLabelKeys: HiddenLabelMap;
  customLabels: CustomLabel[];
  selectedLabelKey: string | null;
  onSelectBlocker: (id: RunGameBlockerId) => void;
  onSelectLabel: (key: string) => void;
  onMoveLabel: (key: string, offset: LabelOffset) => void;
  onMoveCustomLabel: (id: string, position: LabelOffset) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingLabel, setDraggingLabel] = useState<{
    kind: "existing" | "custom";
    key: string;
    pointerStart: LabelOffset;
    startValue: LabelOffset;
  } | null>(null);

  const scheme = getRunGameScheme(schemeId);
  const { players } = getRunGameBoardData(formationId, frontId);
  const answerAssignments = getRunGameAnswerAssignments(scheme, formationId, frontId);
  const activeBlockers = RUN_GAME_BLOCKERS.filter((id) => Boolean(answerAssignments[id]));
  const answerPaths = buildRunGamePaths(scheme, answerAssignments, [], formationId, frontId);
  const previewPaths = buildRunGamePaths(scheme, answers, [], formationId, frontId);
  const visiblePaths = viewMode === "study" || showCorrectAnswer ? answerPaths : previewPaths;
  const runPath = buildRunGameRunPath(scheme, formationId, frontId);
  const boardKey = `${formationId}:${frontId}:${schemeId}`;

  const handleLabelPointerDown = (
    event: PointerEvent<SVGGElement>,
    kind: "existing" | "custom",
    key: string,
    startValue: LabelOffset,
  ) => {
    if (!canEditLabels || !svgRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    svgRef.current.setPointerCapture(event.pointerId);
    onSelectLabel(`${kind}:${key}`);
    setDraggingLabel({
      kind,
      key,
      pointerStart: getSvgPoint(svgRef.current, event),
      startValue,
    });
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggingLabel || !svgRef.current) return;
    const point = getSvgPoint(svgRef.current, event);
    const nextPosition = {
      x: draggingLabel.startValue.x + point.x - draggingLabel.pointerStart.x,
      y: draggingLabel.startValue.y + point.y - draggingLabel.pointerStart.y,
    };
    if (draggingLabel.kind === "existing") {
      onMoveLabel(draggingLabel.key, nextPosition);
    } else {
      onMoveCustomLabel(draggingLabel.key, {
        x: Math.max(6, Math.min(94, nextPosition.x)),
        y: Math.max(4, Math.min(81, nextPosition.y)),
      });
    }
  };

  const stopDragging = (event: PointerEvent<SVGSVGElement>) => {
    if (!draggingLabel) return;
    if (svgRef.current?.hasPointerCapture(event.pointerId)) {
      svgRef.current.releasePointerCapture(event.pointerId);
    }
    setDraggingLabel(null);
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 86"
      className="h-auto w-full rounded-3xl border border-emerald-950 bg-[#0b7f5a] shadow-inner"
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerLeave={stopDragging}
    >
      <defs>
        <marker id="run-game-block-cap" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <path d="M 4 0.8 L 4 7.2" stroke="context-stroke" strokeWidth="1.2" strokeLinecap="round" />
        </marker>
        <marker id="run-game-run-arrow" markerHeight="9" markerWidth="9" orient="auto" refX="8" refY="4.5">
          <path d="M 0 0 L 9 4.5 L 0 9 z" fill="#f4cf63" />
        </marker>
      </defs>

      <rect x="2" y="2" width="96" height="82" rx="3" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.35" />
      {[24, 40, 56, 72].map((y) => (
        <line key={y} x1="7" x2="93" y1={y} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.35" />
      ))}
      <line x1="6" x2="94" y1="56" y2="56" stroke="rgba(255,255,255,0.78)" strokeDasharray="1.2 1.2" strokeWidth="0.4" />

      {players.map((player) => {
        const isBlocker = activeBlockers.includes(player.id as RunGameBlockerId);
        const isIncorrect = incorrectIds.includes(player.id as RunGameBlockerId);
        return (
          <g
            key={player.id}
            className={viewMode === "quiz" && isBlocker ? "cursor-pointer" : ""}
            onClick={() => {
              if (viewMode !== "quiz" || !isBlocker) return;
              onSelectBlocker(player.id as RunGameBlockerId);
            }}
          >
            <circle
              cx={player.x}
              cy={player.y}
              r={4.2}
              fill={player.group === "offense" ? (isIncorrect ? "#ef4444" : "#f15a24") : "#147fc0"}
              stroke="rgba(255,255,255,0.42)"
              strokeWidth="0.35"
            />
            <text x={player.x} y={player.y + 1.1} textAnchor="middle" fill="white" fontSize="2.6" fontWeight="900">
              {player.label}
            </text>
          </g>
        );
      })}

      {visiblePaths.map((path, index) => {
        const labelKey = `${boardKey}:${path.id}`;
        const labelDeleted = Boolean(hiddenLabelKeys[labelKey]);
        const baseLabelPosition = path.label && !labelDeleted ? getPathLabelPosition(path, index, visiblePaths) : null;
        const labelOffset = labelOffsets[labelKey] ?? { x: 0, y: 0 };
        const labelPosition = baseLabelPosition
          ? {
              x: Math.max(6, Math.min(94, baseLabelPosition.x + labelOffset.x)),
              y: Math.max(4, Math.min(81, baseLabelPosition.y + labelOffset.y)),
            }
          : null;
        return (
          <g key={path.id}>
            <polyline
              points={pointsToPolyline(path.points)}
              fill="none"
              stroke="#f4cf63"
              strokeWidth="0.55"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={path.dashed ? "1.8 1.2" : undefined}
              markerEnd="url(#run-game-block-cap)"
            />
            {path.label && labelPosition ? (
              <g
                className={canEditLabels ? "cursor-move" : ""}
                onPointerDown={(event) => handleLabelPointerDown(event, "existing", labelKey, labelOffset)}
              >
                <rect
                  x={labelPosition.x - 4.8}
                  y={labelPosition.y}
                  width="9.6"
                  height="3.2"
                  rx="1"
                  fill="rgba(15,23,42,0.72)"
                />
                <text
                  x={labelPosition.x}
                  y={labelPosition.y + 2.25}
                  textAnchor="middle"
                  fill="white"
                  fontSize="1.25"
                  fontWeight="900"
                  letterSpacing="0.04em"
                >
                  {path.label}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}

      {customLabels.filter((label) => label.boardKey === boardKey).map((label) => (
        <g
          key={label.id}
          className={canEditLabels ? "cursor-move" : ""}
          onPointerDown={(event) => handleLabelPointerDown(event, "custom", label.id, { x: label.x, y: label.y })}
        >
          <rect
            x={label.x - 4.8}
            y={label.y}
            width="9.6"
            height="3.2"
            rx="1"
            fill="rgba(15,23,42,0.72)"
          />
          <text
            x={label.x}
            y={label.y + 2.25}
            textAnchor="middle"
            fill="white"
            fontSize="1.25"
            fontWeight="900"
            letterSpacing="0.04em"
          >
            {label.text}
          </text>
        </g>
      ))}

      <polyline
        points={pointsToPolyline(runPath.points)}
        fill="none"
        stroke="#f4cf63"
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd="url(#run-game-run-arrow)"
      />
      <rect x="41" y="79.4" width="18" height="3.6" rx="1.2" fill="rgba(15,23,42,0.74)" />
      <text x="50" y="81.9" textAnchor="middle" fill="white" fontSize="1.45" fontWeight="900">
        {runPath.label}
      </text>
    </svg>
  );
}

export function RunGameBoard({ isAdmin = false }: { isAdmin?: boolean }) {
  const [viewMode, setViewMode] = useState<RunGameViewMode>("study");
  const [formationId, setFormationId] = useState<string>(RUN_GAME_FORMATIONS[0].id);
  const [frontId, setFrontId] = useState<RunGameFrontId>("even_over");
  const [schemeId, setSchemeId] = useState(RUN_GAME_SCHEMES[0].id);
  const [selectedBlockerId, setSelectedBlockerId] = useState<RunGameBlockerId>("LT");
  const [answers, setAnswers] = useState<Partial<Record<RunGameBlockerId, RunGameBlockType>>>({});
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [resultText, setResultText] = useState("");
  const [showAdminTools, setShowAdminTools] = useState(false);
  const [labelOffsets, setLabelOffsets] = useState<LabelOffsetMap>({});
  const [hiddenLabelKeys, setHiddenLabelKeys] = useState<HiddenLabelMap>({});
  const [customLabels, setCustomLabels] = useState<CustomLabel[]>([]);
  const [selectedLabelKey, setSelectedLabelKey] = useState<string | null>(null);
  const [newPillText, setNewPillText] = useState("Base");

  const scheme = getRunGameScheme(schemeId);
  const formation = getRunGameFormation(formationId);
  const front = getRunGameFront(frontId);
  const counterStrongUnavailable = (id: string) => ["doubles", "trips", "trey"].includes(id);
  const availableSchemes = useMemo(
    () => RUN_GAME_SCHEMES.filter((schemeOption) => !(counterStrongUnavailable(formationId) && schemeOption.id === "counter_strong")),
    [formationId],
  );
  const answerAssignments = useMemo(() => getRunGameAnswerAssignments(scheme, formationId, frontId), [formationId, frontId, scheme]);
  const activeBlockers = useMemo(() => RUN_GAME_BLOCKERS.filter((id) => Boolean(answerAssignments[id])), [answerAssignments]);
  const result = useMemo(() => getRunGameQuizResult(scheme, answers, answerAssignments), [answerAssignments, answers, scheme]);

  const resetRep = (nextSchemeId = schemeId, nextFormationId = formationId) => {
    const safeNextSchemeId = counterStrongUnavailable(nextFormationId) && nextSchemeId === "counter_strong"
      ? "outside_zone_strong"
      : nextSchemeId;
    setSchemeId(safeNextSchemeId);
    setFormationId(nextFormationId);
    setAnswers({});
    setSelectedBlockerId("LT");
    setShowCorrectAnswer(false);
    setResultText("");
  };

  const assignBlock = (blockType: RunGameBlockType) => {
    setShowCorrectAnswer(false);
    setAnswers((prev) => ({ ...prev, [selectedBlockerId]: blockType }));
  };

  const checkAnswers = () => {
    setShowCorrectAnswer(true);
    setResultText(`${result.score}/${result.total} correct${result.isPerfect ? ". Great rep." : ". Correct paths are now shown on the board."}`);
  };

  const resetCurrentBoardLabels = () => {
    const currentBoardPrefix = `${formationId}:${frontId}:${schemeId}:`;
    const currentBoardKey = `${formationId}:${frontId}:${schemeId}`;
    setLabelOffsets((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(currentBoardPrefix)) delete next[key];
      });
      return next;
    });
    setHiddenLabelKeys((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(currentBoardPrefix)) delete next[key];
      });
      return next;
    });
    setCustomLabels((prev) => prev.filter((label) => label.boardKey !== currentBoardKey));
    setSelectedLabelKey(null);
  };

  const addCustomPill = () => {
    const text = newPillText.trim();
    if (!text) return;
    setCustomLabels((prev) => [
      ...prev,
      {
        id: `custom-pill-${Date.now()}`,
        boardKey: `${formationId}:${schemeId}`,
        text,
        x: 50,
        y: 18,
      },
    ]);
  };

  const deleteSelectedPill = () => {
    if (!selectedLabelKey) return;
    if (selectedLabelKey.startsWith("existing:")) {
      const key = selectedLabelKey.replace("existing:", "");
      setHiddenLabelKeys((prev) => ({ ...prev, [key]: true }));
    }
    if (selectedLabelKey.startsWith("custom:")) {
      const id = selectedLabelKey.replace("custom:", "");
      setCustomLabels((prev) => prev.filter((label) => label.id !== id));
    }
    setSelectedLabelKey(null);
  };

  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 rounded-2xl border bg-white p-4">
        <div className="mb-4">
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Run Game</div>
          <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            {viewMode === "study" ? `${scheme.name} vs ${formation.name}` : `Create ${scheme.name} vs ${formation.name}`}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {viewMode === "study" ? `${front.name}: ${scheme.description}` : `Assign each OL/TE his blocking path against ${front.name}, then check the scheme.`}
          </div>
        </div>

        <RunGameField
          schemeId={schemeId}
          formationId={formationId}
          frontId={frontId}
          viewMode={viewMode}
          selectedBlockerId={selectedBlockerId}
          answers={answers}
          showCorrectAnswer={showCorrectAnswer}
          incorrectIds={showCorrectAnswer ? result.incorrectIds : []}
          canEditLabels={isAdmin && showAdminTools}
          labelOffsets={labelOffsets}
          hiddenLabelKeys={hiddenLabelKeys}
          customLabels={customLabels}
          selectedLabelKey={selectedLabelKey}
          onSelectBlocker={setSelectedBlockerId}
          onSelectLabel={setSelectedLabelKey}
          onMoveLabel={(key, offset) => setLabelOffsets((prev) => ({ ...prev, [key]: offset }))}
          onMoveCustomLabel={(id, position) => setCustomLabels((prev) => prev.map((label) => label.id === id ? { ...label, ...position } : label))}
        />
      </div>

      <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
        {isAdmin ? (
          <>
            <Button
              variant={showAdminTools ? "default" : "outline"}
              className="w-full rounded-xl"
              onClick={() => setShowAdminTools((prev) => !prev)}
            >
              {showAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
            </Button>
            {showAdminTools ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-950">
                <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pill Label Editor</div>
                <div className="mt-1 text-sm">Drag pills, delete selected pills, or add a custom pill to this board.</div>
                <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
                  <Input value={newPillText} onChange={(event) => setNewPillText(event.target.value)} placeholder="Pill text" />
                  <Button className="rounded-xl" onClick={addCustomPill}>Add</Button>
                </div>
                <Button
                  variant="outline"
                  className="mt-2 w-full rounded-xl bg-white text-red-700 hover:text-red-800"
                  disabled={!selectedLabelKey}
                  onClick={deleteSelectedPill}
                >
                  Delete Selected Pill
                </Button>
                <Button variant="outline" className="mt-2 w-full rounded-xl bg-white" onClick={resetCurrentBoardLabels}>
                  Reset Current Board Labels
                </Button>
              </div>
            ) : null}
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-2">
          <Button variant={viewMode === "study" ? "default" : "outline"} className="rounded-xl" onClick={() => setViewMode("study")}>Study</Button>
          <Button variant={viewMode === "quiz" ? "default" : "outline"} className="rounded-xl" onClick={() => setViewMode("quiz")}>Quiz</Button>
        </div>

        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</div>
          <Select value={formationId} onValueChange={(value) => resetRep(schemeId, value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RUN_GAME_FORMATIONS.map((formationOption) => (
                <SelectItem key={formationOption.id} value={formationOption.id}>
                  {formationOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Front</div>
          <Select
            value={frontId}
            onValueChange={(value) => {
              setFrontId(value as RunGameFrontId);
              setAnswers({});
              setSelectedBlockerId("LT");
              setShowCorrectAnswer(false);
              setResultText("");
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RUN_GAME_FRONTS.map((frontOption) => (
                <SelectItem key={frontOption.id} value={frontOption.id}>
                  {frontOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border bg-slate-50 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Scheme</div>
          <Select value={schemeId} onValueChange={(value) => resetRep(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableSchemes.map((schemeOption) => (
                <SelectItem key={schemeOption.id} value={schemeOption.id}>
                  {schemeOption.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {viewMode === "quiz" ? (
          <>
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Blocker</div>
              <div className="grid grid-cols-3 gap-2">
                {activeBlockers.map((id) => (
                  <Button
                    key={id}
                    variant={selectedBlockerId === id ? "default" : "outline"}
                    className="rounded-xl"
                    onClick={() => setSelectedBlockerId(id)}
                  >
                    {id}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Assignment</div>
              <Select value={answers[selectedBlockerId] ?? "unset"} onValueChange={(value) => assignBlock(value as RunGameBlockType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose block" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="unset" disabled>Choose block</SelectItem>
                  {RUN_GAME_BLOCK_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="rounded-xl" onClick={checkAnswers}>Check</Button>
              <Button variant="outline" className="rounded-xl" onClick={() => resetRep()}>Reset</Button>
            </div>
            {resultText ? (
              <div className="rounded-xl border bg-emerald-50 p-3 font-semibold text-emerald-900">
                {resultText}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed bg-white p-3 text-slate-500">
                Click a blocker on the board or the buttons, choose his path, then check.
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border bg-amber-50 p-3 text-amber-900">
            Study mode shows the complete run scheme. Quiz mode hides the blocking paths until the user builds them.
          </div>
        )}
      </div>
    </div>
  );
}
