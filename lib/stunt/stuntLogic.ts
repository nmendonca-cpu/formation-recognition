export type StuntPlayerId = "LE" | "N" | "T" | "RE";
export type StuntOrder = "1ST" | "2ND";
export type StuntMovement = "Step" | "Loop" | "Surf" | "Chase" | "Flash & Loop" | "Pick & Penetrate" | "COP";
export type StuntSide = "field" | "boundary" | "both";
export type StuntPathKind = "step" | "loop" | "surf" | "chase" | "flash_loop" | "pick_penetrate" | "cop";
export type StuntVisualPath =
  | "stepLeft"
  | "stepRight"
  | "stepVertical"
  | "loopLeft"
  | "loopRight"
  | "loopWideLeft"
  | "loopWideRight"
  | "surfLeft"
  | "surfRight"
  | "chaseLeft"
  | "chaseRight"
  | "pickLeft"
  | "pickRight"
  | "flashLoopLeft"
  | "flashLoopRight"
  | "copLeft"
  | "copRight";

export type StuntAssignment = {
  playerId: StuntPlayerId;
  movement: StuntMovement;
  order: StuntOrder;
  targetGap: string;
  side?: StuntSide;
  subLabel?: string;
  teachingLabel?: string;
  showOrder?: boolean;
  box?: boolean;
  dashed?: boolean;
  pathKind?: StuntPathKind;
  visual?: StuntVisualPath;
};

export type StuntDefinition = {
  id: string;
  name: string;
  subtitle: string;
  pairedName?: string;
  fieldDirection?: "left" | "right";
  boardNote?: string;
  assignments: StuntAssignment[];
};

export type StuntQuizAnswer = {
  movement: StuntMovement | "";
  order: StuntOrder | "";
};

export type StuntEditorTool = "select" | "line" | "tag";
export type StuntLineColor = "red" | "gold" | "white" | "cyan";
export type StuntLineEnd = "arrow" | "square" | "circle";
export type StuntLineStyle = "solid" | "dashed";
export type StuntLoadFront = "none" | "strong" | "weak";

export type StuntRouteOverlay = {
  id: string;
  label: string;
  color: string;
  path: { x: number; y: number }[];
  labelX?: number;
  labelY?: number;
  strokeWidth?: number;
  dashed?: boolean;
  endCap?: StuntLineEnd;
};

export type StuntFieldTag = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "default" | "red" | "gold" | "cyan";
};

export type StuntSavedBoard = {
  id: string;
  title: string;
  routeOverlays: StuntRouteOverlay[];
  fieldTags: StuntFieldTag[];
  surface?: {
    teSide?: "none" | "left" | "right";
    loadFront?: boolean | StuntLoadFront;
  };
};

export const STUNT_BOARDS_STORAGE_KEY = "formation-recognition-stunt-boards-v1";

function normalizeStuntSurface(surface?: StuntSavedBoard["surface"]): NonNullable<StuntSavedBoard["surface"]> {
  const loadFront = surface?.loadFront === true ? "strong" : surface?.loadFront || "none";
  return {
    teSide: surface?.teSide ?? "none",
    loadFront,
  };
}

export function getStuntLineStroke(color: StuntLineColor) {
  if (color === "gold") return "#f4cf63";
  if (color === "white") return "#ffffff";
  if (color === "cyan") return "#78dfd0";
  return "#ef3124";
}

export function getStuntLineStrokeWidth(weight: string) {
  if (weight === "thin") return 0.55;
  if (weight === "thick") return 1;
  if (weight === "heavy") return 1.3;
  return 0.75;
}

export function buildStuntDraftOverlay({
  draftPoints,
  label,
  color,
  weight,
  style,
  endCap,
}: {
  draftPoints: { x: number; y: number }[];
  label: string;
  color: StuntLineColor;
  weight: string;
  style: StuntLineStyle;
  endCap: StuntLineEnd;
}): StuntRouteOverlay[] {
  if (draftPoints.length < 2) return [];
  const lastPoint = draftPoints[draftPoints.length - 1];
  return [{
    id: "stunt-draft",
    label: label.trim(),
    color: getStuntLineStroke(color),
    path: draftPoints,
    labelX: label.trim() ? lastPoint.x : undefined,
    labelY: label.trim() ? lastPoint.y - 3 : undefined,
    strokeWidth: getStuntLineStrokeWidth(weight),
    dashed: style === "dashed",
    endCap,
  }];
}

export function parseStuntStorage(raw: string | null) {
  if (!raw) {
    return {
      working: {
        title: "Working Stunt Board",
        routeOverlays: [] as StuntRouteOverlay[],
        fieldTags: [] as StuntFieldTag[],
        surface: normalizeStuntSurface(),
      },
      boards: [] as StuntSavedBoard[],
    };
  }

  const parsed = JSON.parse(raw) as {
    working?: Partial<StuntSavedBoard>;
    boards?: StuntSavedBoard[];
  };

  return {
    working: {
      title: parsed.working?.title || "Working Stunt Board",
      routeOverlays: Array.isArray(parsed.working?.routeOverlays) ? parsed.working.routeOverlays : [],
      fieldTags: Array.isArray(parsed.working?.fieldTags) ? parsed.working.fieldTags : [],
      surface: normalizeStuntSurface(parsed.working?.surface),
    },
    boards: Array.isArray(parsed.boards)
      ? parsed.boards.map((board) => ({ ...board, surface: normalizeStuntSurface(board.surface) }))
      : [],
  };
}

export function stringifyStuntStorage({
  title,
  routeOverlays,
  fieldTags,
  boards,
  surface,
}: {
  title: string;
  routeOverlays: StuntRouteOverlay[];
  fieldTags: StuntFieldTag[];
  boards: StuntSavedBoard[];
  surface: StuntSavedBoard["surface"];
}) {
  return JSON.stringify({
    working: { title, routeOverlays, fieldTags, surface },
    boards,
  });
}

export const STUNT_PLAYERS: { id: StuntPlayerId; label: string; role: "end" | "interior" }[] = [
  { id: "LE", label: "WDE", role: "end" },
  { id: "N", label: "N", role: "interior" },
  { id: "T", label: "T", role: "interior" },
  { id: "RE", label: "SDE", role: "end" },
];

export const STUNT_MOVEMENT_OPTIONS: StuntMovement[] = [
  "Step",
  "Loop",
  "Surf",
  "Chase",
  "Flash & Loop",
  "Pick & Penetrate",
  "COP",
];

export const STUNT_ORDER_OPTIONS: StuntOrder[] = ["1ST", "2ND"];

const a = (
  playerId: StuntPlayerId,
  movement: StuntMovement,
  order: StuntOrder,
  targetGap: string,
  extras: Omit<Partial<StuntAssignment>, "playerId" | "movement" | "order" | "targetGap"> = {},
): StuntAssignment => ({
  playerId,
  movement,
  order,
  targetGap,
  pathKind: movement === "Step" ? "step" : movement === "Loop" ? "loop" : movement === "Flash & Loop" ? "flash_loop" : movement === "Pick & Penetrate" ? "pick_penetrate" : movement.toLowerCase().replaceAll(" ", "_") as StuntPathKind,
  ...extras,
});

export const STUNT_DEFINITIONS: StuntDefinition[] = [
  {
    id: "pirate_bandit",
    name: "Pirate / Bandit",
    subtitle: "Tackle penetrates first; end loops tight over the top. Pirate/Bandit mirrors by side.",
    pairedName: "Pirate / Bandit",
    assignments: [
      a("T", "Step", "1ST", "B gap", { visual: "stepLeft" }),
      a("RE", "Loop", "2ND", "C gap", { visual: "loopLeft" }),
    ],
  },
  {
    id: "rip_ram",
    name: "Rip / Ram",
    subtitle: "End goes first inside; tackle wraps outside. Rip/Ram mirrors by side.",
    pairedName: "Rip / Ram",
    assignments: [
      a("RE", "Step", "1ST", "B gap", { visual: "stepLeft" }),
      a("T", "Loop", "2ND", "C gap", { visual: "loopRight" }),
    ],
  },
  {
    id: "heavy",
    name: "Heavy",
    subtitle: "Both edges step to the B gap picture; interiors step away with Surf technique.",
    assignments: [
      a("LE", "Step", "1ST", "B gap", { teachingLabel: "STEP TO = B GAP", visual: "stepRight" }),
      a("N", "Surf", "1ST", "Away", { teachingLabel: "STEP AWAY = SURF", visual: "surfLeft" }),
      a("T", "Surf", "1ST", "Away", { teachingLabel: "STEP AWAY = SURF", visual: "surfRight" }),
      a("RE", "Step", "1ST", "B gap", { teachingLabel: "STEP TO = B GAP", visual: "stepLeft" }),
    ],
  },
  {
    id: "plug",
    name: "Plug",
    subtitle: "Interior players penetrate first; ends make the large loops over the top.",
    assignments: [
      a("N", "Step", "1ST", "B gap", { visual: "stepLeft" }),
      a("LE", "Loop", "2ND", "C gap", { visual: "loopWideRight" }),
      a("T", "Step", "1ST", "B gap", { visual: "stepRight" }),
      a("RE", "Loop", "2ND", "C gap", { visual: "loopWideLeft" }),
    ],
  },
  {
    id: "blood_water",
    name: "Blood / Water",
    subtitle: "Field call with the box end held on the opposite side.",
    pairedName: "Blood / Water",
    fieldDirection: "right",
    boardNote: "FIELD ->",
    assignments: [
      a("LE", "Step", "1ST", "Field", { visual: "stepRight" }),
      a("N", "Loop", "2ND", "Field loop", { visual: "loopRight" }),
      a("RE", "COP", "1ST", "Box", { box: true, teachingLabel: "BOX", visual: "copRight" }),
    ],
  },
  {
    id: "ice_lava",
    name: "Ice / Lava",
    subtitle: "Blood / Water mirrored with the boundary end tagged as the box player.",
    pairedName: "Ice / Lava",
    fieldDirection: "left",
    boardNote: "<- FIELD",
    assignments: [
      a("RE", "Step", "1ST", "Field", { visual: "stepLeft" }),
      a("N", "Loop", "2ND", "Field loop", { visual: "loopLeft" }),
      a("LE", "COP", "1ST", "Box", { box: true, teachingLabel: "BOX", visual: "copLeft" }),
    ],
  },
  {
    id: "tex_ned",
    name: "Tex / Ned",
    subtitle: "Both sides work at once: end/nose game and tackle/end game.",
    pairedName: "Tex / Ned",
    assignments: [
      a("LE", "Step", "1ST", "B gap", { showOrder: true, visual: "stepRight" }),
      a("N", "Loop", "2ND", "C gap", { showOrder: true, visual: "loopLeft" }),
      a("T", "Step", "1ST", "B gap", { showOrder: true, visual: "stepLeft" }),
      a("RE", "Loop", "2ND", "C gap", { showOrder: true, visual: "loopRight" }),
    ],
  },
  {
    id: "ton_not",
    name: "Ton / Not",
    subtitle: "Nose goes first; tackle loops over. Mirror by side.",
    pairedName: "Ton / Not",
    assignments: [
      a("T", "Step", "1ST", "A gap", { showOrder: true, visual: "stepLeft" }),
      a("N", "Loop", "2ND", "A/B wrap", { showOrder: true, visual: "loopRight" }),
    ],
  },
  {
    id: "exit_end",
    name: "Exit / End",
    subtitle: "Both sides: first penetrator creates the wrap lane for the second mover.",
    pairedName: "Exit / End",
    assignments: [
      a("LE", "Loop", "2ND", "C gap", { showOrder: true, visual: "loopRight" }),
      a("N", "Step", "1ST", "B gap", { showOrder: true, visual: "stepVertical" }),
      a("T", "Step", "1ST", "B gap", { showOrder: true, visual: "stepVertical" }),
      a("RE", "Loop", "2ND", "C gap", { showOrder: true, visual: "loopRight" }),
    ],
  },
  {
    id: "torch",
    name: "Torch",
    subtitle: "N and T step to center. Step-to end flashes/loops; step-away end picks/penetrates.",
    boardNote: "BOTH STEP TO CENTER",
    assignments: [
      a("LE", "Pick & Penetrate", "1ST", "Pick", { teachingLabel: "STEP AWAY = PICK & PENETRATE", pathKind: "pick_penetrate", visual: "pickRight" }),
      a("N", "Step", "1ST", "Center", { visual: "stepRight" }),
      a("T", "Step", "1ST", "Center", { visual: "stepLeft" }),
      a("RE", "Flash & Loop", "2ND", "Loop", { teachingLabel: "STEP TO = FLASH & LOOP", pathKind: "flash_loop", visual: "flashLoopLeft" }),
    ],
  },
  {
    id: "wedge",
    name: "Wedge",
    subtitle: "Ends read tackles. Step-away is Chase; step-to is Tex read.",
    boardNote: "END READS TACKLE",
    assignments: [
      a("LE", "Step", "1ST", "Tackle", { visual: "stepRight" }),
      a("N", "Chase", "2ND", "Chase", { teachingLabel: "STEP AWAY = CHASE", dashed: true, visual: "chaseLeft" }),
      a("T", "Step", "1ST", "Tex read", { teachingLabel: "STEP TO = TEX", dashed: true, visual: "stepRight" }),
      a("RE", "Step", "1ST", "Tackle", { visual: "stepLeft" }),
    ],
  },
  {
    id: "wrap_load",
    name: "Wrap / Load",
    subtitle: "Tackle first, nose wraps, weak end loops outside strong end.",
    pairedName: "Wrap / Load",
    assignments: [
      a("LE", "Step", "1ST", "C gap", { showOrder: true, visual: "stepVertical" }),
      a("N", "Loop", "2ND", "Over T", { showOrder: true, visual: "loopRight" }),
      a("T", "Loop", "2ND", "Outside", { showOrder: true, visual: "loopRight" }),
      a("RE", "Step", "1ST", "C gap", { showOrder: true, visual: "stepVertical" }),
    ],
  },
];

export function getStuntById(id: string) {
  return STUNT_DEFINITIONS.find((stunt) => stunt.id === id) ?? STUNT_DEFINITIONS[0];
}

export function getStuntAnswerKey(stunt: StuntDefinition): Record<StuntPlayerId, StuntQuizAnswer> {
  return Object.fromEntries(
    stunt.assignments.map((assignment) => [
      assignment.playerId,
      { movement: assignment.movement, order: assignment.order },
    ]),
  ) as Record<StuntPlayerId, StuntQuizAnswer>;
}

export function getStuntQuizResult(stunt: StuntDefinition, answers: Partial<Record<StuntPlayerId, StuntQuizAnswer>>) {
  const key = getStuntAnswerKey(stunt);
  const activePlayers = Object.keys(key) as StuntPlayerId[];
  const correctPlayers = activePlayers.filter((playerId) => (
    answers[playerId]?.movement === key[playerId].movement
    && answers[playerId]?.order === key[playerId].order
  ));
  const wrongPlayers = activePlayers.filter((playerId) => !correctPlayers.includes(playerId));
  return {
    total: activePlayers.length,
    correct: correctPlayers.length,
    wrongPlayers,
    isCorrect: activePlayers.length > 0 && correctPlayers.length === activePlayers.length,
  };
}
