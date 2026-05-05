export type Side = "left" | "right";
export type FrontMode = "4-3" | "4-4";

export type PlayerDot = {
  id: string;
  x: number;
  y: number;
};

export type BlitzBaseBoardId = "double" | "trey" | "quad" | "dog" | "trips" | "troop";
export type BlitzBoardSpot = "mof" | "hash";
export type BlitzCallId =
  | "newton"
  | "panthers"
  | "carolina"
  | "fields"
  | "bears"
  | "chicago"
  | "brees"
  | "saints"
  | "nola"
  | "bradshaw"
  | "steelers"
  | "pitt"
  | "carr"
  | "raiders"
  | "oakland"
  | "allen"
  | "bills"
  | "buffalo"
  | "brady"
  | "patriots"
  | "boston"
  | "fitz"
  | "bucs"
  | "tampa_bay";
export type BlitzCallFamilyId = "newton" | "fields" | "brees" | "bradshaw" | "carr" | "allen" | "brady" | "fitz";
export type BlitzCallType = "last_name" | "team_name" | "location_name";
export type BlitzPathwayId =
  | "a_gap_blitz"
  | "weak_a_gap_blitz"
  | "c_read_blitz"
  | "b_gap_blitz"
  | "boundary_b_gap_blitz"
  | "field_b_gap_blitz"
  | "c_gap_blitz"
  | "d_gap_blitz"
  | "edge_pressure"
  | "strong_edge_pressure"
  | "weak_edge_pressure"
  | "one_gap_slant_left"
  | "one_gap_slant_right"
  | "two_gap_slant_left"
  | "two_gap_slant_right"
  | "cop_rush"
  | "curl_flat"
  | "weak_curl_flat"
  | "wall_flat"
  | "weak_wall_flat"
  | "strong_hook"
  | "weak_hook"
  | "hole"
  | "eyes"
  | "strong_eyes"
  | "weak_eyes"
  | "vert_hook"
  | "cb_flat"
  | "field_flat"
  | "weak_flat"
  | "tampa_pole"
  | "quarter"
  | "drop_hook"
  | "drop_curl_flat"
  | "mof"
  | "deep_half_left"
  | "deep_half_right"
  | "deep_third_left"
  | "deep_third_middle"
  | "deep_third_right";

export type RunFitLineEnd = "square" | "circle" | "arrow";
export type BlitzPathwayLayer = "pressure" | "coverage" | "dl" | "cover2";

export type RouteOverlay = {
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
    pathwayId: BlitzPathwayId;
    layer?: BlitzPathwayLayer;
  };
};

const LOS_Y = 50;
const WING_Y = 44;
const FIXED_OL_IDS = ["LT", "LG", "C", "RG", "RT"] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function getMidpoint(a: number, b: number) {
  return (a + b) / 2;
}

function getAttached(side: Side, wide = false) {
  const base = wide ? 12 : 8;
  return side === "right" ? 50 + base : 50 - base;
}

function getWide(side: Side) {
  return side === "right" ? 90 : 10;
}

function getSlot(side: Side, wide = false) {
  return (getAttached(side, wide) + getWide(side)) / 2;
}

function getHash(side: Side, wide = false) {
  return getSlot(side, wide);
}

export function getBlitzHash(side: Side) {
  return side === "right" ? 64 : 36;
}

export const BLITZ_BASE_BOARD_OPTIONS: { value: BlitzBaseBoardId; label: string; call: string }[] = [
  { value: "double", label: "Double", call: "Doubles Right" },
  { value: "trey", label: "Trey", call: "Trey Right" },
  { value: "quad", label: "Quad", call: "Quad Right" },
  { value: "dog", label: "Dog", call: "Dog Right" },
  { value: "trips", label: "Trips", call: "Trips Right" },
  { value: "troop", label: "Troop", call: "Troop Right" },
];

export const BLITZ_BOARD_STRUCTURE: Record<BlitzBaseBoardId, "2x2" | "3x1"> = {
  double: "2x2",
  dog: "2x2",
  quad: "2x2",
  trey: "3x1",
  trips: "3x1",
  troop: "3x1",
};

export const BLITZ_BOARD_SPOT_OPTIONS: { value: BlitzBoardSpot; label: string }[] = [
  { value: "mof", label: "MOF" },
  { value: "hash", label: "Hash" },
];

export const BLITZ_CALL_OPTIONS: { value: BlitzCallId; label: string; family: string; detail: string }[] = [
  {
    value: "newton",
    label: "Newton",
    family: "QB Name / 4 MPRS",
    detail: "Nickel edge pressure with the opposite DE as the dropper family and Swap-style replacement rules.",
  },
  {
    value: "panthers",
    label: "Panthers",
    family: "Team Name / 5 MPRS",
    detail: "Newton family without the DE dropper. Nickel edge pressure with all four DL rushing.",
  },
  {
    value: "carolina",
    label: "Carolina",
    family: "City Name / 6 MPRS",
    detail: "Panthers plus the next inside linebacker inserted into the pressure.",
  },
  {
    value: "fields",
    label: "Fields",
    family: "QB Name / 4 MPRS",
    detail: "Mike field-side edge pressure with the opposite DE dropping to coverage.",
  },
  {
    value: "bears",
    label: "Bears",
    family: "Team Name / 5 MPRS",
    detail: "Fields family without the DE dropper. Mike edge pressure with all four DL rushing.",
  },
  {
    value: "chicago",
    label: "Chicago",
    family: "City Name / 6 MPRS",
    detail: "Bears plus the Will inserted into the pressure.",
  },
  {
    value: "brees",
    label: "Brees",
    family: "QB Name / 4 MPRS",
    detail: "Will boundary-side edge pressure with the opposite DE dropping to coverage.",
  },
  {
    value: "saints",
    label: "Saints",
    family: "Team Name / 5 MPRS",
    detail: "Brees family without the DE dropper. Will edge pressure with all four DL rushing.",
  },
  {
    value: "nola",
    label: "NOLA",
    family: "City Name / 6 MPRS",
    detail: "Saints plus the Mike inserted into the pressure.",
  },
  {
    value: "bradshaw",
    label: "Bradshaw",
    family: "QB Name / 4 MPRS",
    detail: "Backside safety boundary edge pressure with the opposite DE dropping to coverage.",
  },
  {
    value: "steelers",
    label: "Steelers",
    family: "Team Name / 5 MPRS",
    detail: "Bradshaw family without the DE dropper. Backside safety edge pressure with all four DL rushing.",
  },
  {
    value: "pitt",
    label: "Pitt",
    family: "City Name / 6 MPRS",
    detail: "Steelers plus the Will inserted into the pressure.",
  },
  {
    value: "carr",
    label: "Carr",
    family: "QB Name / 4 MPRS",
    detail: "Backside corner boundary edge pressure with the opposite DE dropping to coverage.",
  },
  {
    value: "raiders",
    label: "Raiders",
    family: "Team Name / 5 MPRS",
    detail: "Carr family without the DE dropper. Backside corner edge pressure with all four DL rushing.",
  },
  {
    value: "oakland",
    label: "Oakland",
    family: "City Name / 6 MPRS",
    detail: "Raiders plus the Mike inserted into the pressure.",
  },
  {
    value: "allen",
    label: "Allen",
    family: "QB Name / 4 MPRS",
    detail: "Mike A-gap/C-read pressure with the run-strength DE dropping to coverage.",
  },
  {
    value: "bills",
    label: "Bills",
    family: "Team Name / 5 MPRS",
    detail: "Allen family without the DE dropper. Mike A-gap pressure with all four DL rushing.",
  },
  {
    value: "buffalo",
    label: "Buffalo",
    family: "City Name / 6 MPRS",
    detail: "Bills plus the Will inserted into the opposite A-gap pressure.",
  },
  {
    value: "brady",
    label: "Brady",
    family: "QB Name / 4 MPRS",
    detail: "Will B-gap pressure with the opposite DE dropping to coverage.",
  },
  {
    value: "patriots",
    label: "Patriots",
    family: "Team Name / 5 MPRS",
    detail: "Brady family without the DE dropper. Will B-gap pressure with all four DL rushing.",
  },
  {
    value: "boston",
    label: "Boston",
    family: "City Name / 6 MPRS",
    detail: "Patriots plus the Mike inserted into the B-gap pressure.",
  },
  {
    value: "fitz",
    label: "Fitz",
    family: "QB Name / 4 MPRS",
    detail: "Mirrored Brady. Will attacks the field-side B gap with the opposite DE dropping to coverage.",
  },
  {
    value: "bucs",
    label: "Bucs",
    family: "Team Name / 5 MPRS",
    detail: "Fitz family without the DE dropper. Will attacks the field-side B gap with all four DL rushing.",
  },
  {
    value: "tampa_bay",
    label: "Tampa Bay",
    family: "City Name / 6 MPRS",
    detail: "Bucs plus the Mike inserted into the B-gap pressure.",
  },
];

export const BLITZ_CALL_FAMILY_OPTIONS: { value: BlitzCallFamilyId; label: string }[] = [
  { value: "newton", label: "Newton" },
  { value: "fields", label: "Fields" },
  { value: "brees", label: "Brees" },
  { value: "bradshaw", label: "Bradshaw" },
  { value: "carr", label: "Carr" },
  { value: "allen", label: "Allen" },
  { value: "brady", label: "Brady" },
  { value: "fitz", label: "Fitz" },
];

export const BLITZ_CALL_TYPE_LABELS: Record<BlitzCallType, string> = {
  last_name: "4 Man (QB)",
  team_name: "5 Man (Team)",
  location_name: "6 Man (Location)",
};

export const BLITZ_CALL_MATRIX: Record<BlitzCallFamilyId, Record<BlitzCallType, BlitzCallId>> = {
  newton: { last_name: "newton", team_name: "panthers", location_name: "carolina" },
  fields: { last_name: "fields", team_name: "bears", location_name: "chicago" },
  brees: { last_name: "brees", team_name: "saints", location_name: "nola" },
  bradshaw: { last_name: "bradshaw", team_name: "steelers", location_name: "pitt" },
  carr: { last_name: "carr", team_name: "raiders", location_name: "oakland" },
  allen: { last_name: "allen", team_name: "bills", location_name: "buffalo" },
  brady: { last_name: "brady", team_name: "patriots", location_name: "boston" },
  fitz: { last_name: "fitz", team_name: "bucs", location_name: "tampa_bay" },
};

export const BLITZ_PATHWAY_OPTIONS: { value: BlitzPathwayId; label: string }[] = [
  { value: "a_gap_blitz", label: "A-Gap Blitz" },
  { value: "weak_a_gap_blitz", label: "Weak A-Gap Blitz" },
  { value: "c_read_blitz", label: "C-Read Blitz" },
  { value: "b_gap_blitz", label: "B-Gap Blitz" },
  { value: "boundary_b_gap_blitz", label: "Boundary B-Gap Blitz" },
  { value: "field_b_gap_blitz", label: "Field B-Gap Blitz" },
  { value: "c_gap_blitz", label: "C-Gap Blitz" },
  { value: "d_gap_blitz", label: "D-Gap Blitz" },
  { value: "edge_pressure", label: "Edge Pressure" },
  { value: "strong_edge_pressure", label: "Strong Edge Pressure" },
  { value: "weak_edge_pressure", label: "Weak Edge Pressure" },
  { value: "one_gap_slant_left", label: "1-Gap Slant Left" },
  { value: "one_gap_slant_right", label: "1-Gap Slant Right" },
  { value: "two_gap_slant_left", label: "2-Gap Slant Left" },
  { value: "two_gap_slant_right", label: "2-Gap Slant Right" },
  { value: "cop_rush", label: "COP Rush" },
  { value: "curl_flat", label: "Curl/Flat" },
  { value: "weak_curl_flat", label: "Weak Curl/Flat" },
  { value: "wall_flat", label: "Wall Flat" },
  { value: "weak_wall_flat", label: "Weak Wall Flat" },
  { value: "strong_hook", label: "Strong Hook" },
  { value: "weak_hook", label: "Weak Hook" },
  { value: "hole", label: "Hole" },
  { value: "eyes", label: "Eyes" },
  { value: "strong_eyes", label: "Strong Eyes" },
  { value: "weak_eyes", label: "Weak Eyes" },
  { value: "vert_hook", label: "Vert Hook" },
  { value: "cb_flat", label: "CB Flat" },
  { value: "field_flat", label: "Field Flat" },
  { value: "weak_flat", label: "Weak Flat" },
  { value: "tampa_pole", label: "Tampa Pole" },
  { value: "quarter", label: "1/4" },
  { value: "drop_hook", label: "DE Drop Hook" },
  { value: "drop_curl_flat", label: "DE Drop C/F" },
  { value: "mof", label: "MOF" },
  { value: "deep_half_left", label: "1/2 Left" },
  { value: "deep_half_right", label: "1/2 Right" },
  { value: "deep_third_left", label: "1/3 Left" },
  { value: "deep_third_middle", label: "1/3 Middle" },
  { value: "deep_third_right", label: "1/3 Right" },
];

export const getBlitzCallFamilyId = (callId: BlitzCallId): BlitzCallFamilyId => (
  (Object.entries(BLITZ_CALL_MATRIX).find(([, calls]) => (
    Object.values(calls).includes(callId)
  ))?.[0] as BlitzCallFamilyId | undefined) ?? "newton"
);

export const getBlitzCallType = (callId: BlitzCallId): BlitzCallType => (
  (Object.values(BLITZ_CALL_MATRIX).flatMap((calls) => (
    Object.entries(calls) as [BlitzCallType, BlitzCallId][]
  )).find(([, candidateCallId]) => candidateCallId === callId)?.[0]) ?? "last_name"
);

export const getBlitzCallId = (familyId: BlitzCallFamilyId, callType: BlitzCallType) => BLITZ_CALL_MATRIX[familyId][callType];
export const getBlitzCallLabel = (callId: BlitzCallId) => BLITZ_CALL_OPTIONS.find((option) => option.value === callId)?.label ?? "Blitz";
export const getBlitzBoardCallLabel = (callId: BlitzCallId, frontMode: FrontMode) => (
  callId === "carr" && frontMode === "4-4" ? "Carr Bounce" : getBlitzCallLabel(callId)
);

export function getBlitzPathwayLabel(pathwayId: BlitzPathwayId) {
  return BLITZ_PATHWAY_OPTIONS.find((option) => option.value === pathwayId)?.label ?? "Pathway";
}

export function isCoverageBlitzPathway(pathwayId: BlitzPathwayId) {
  return ["curl_flat", "weak_curl_flat", "wall_flat", "weak_wall_flat", "strong_hook", "weak_hook", "hole", "eyes", "strong_eyes", "weak_eyes", "vert_hook", "cb_flat", "field_flat", "weak_flat", "tampa_pole", "quarter", "drop_hook", "drop_curl_flat", "mof", "deep_half_left", "deep_half_right", "deep_third_left", "deep_third_middle", "deep_third_right"].includes(pathwayId);
}

export function isDeepCoverageBlitzPathway(pathwayId: BlitzPathwayId) {
  return ["mof", "tampa_pole", "deep_half_left", "deep_half_right", "deep_third_left", "deep_third_middle", "deep_third_right", "quarter"].includes(pathwayId);
}

export function getBlitzPathwayStroke(pathwayId: BlitzPathwayId, layer?: BlitzPathwayLayer) {
  if (layer === "dl") return "#39ff88";
  if (isDeepCoverageBlitzPathway(pathwayId)) return "#a855f7";
  if (isCoverageBlitzPathway(pathwayId)) return "#f4cf63";
  return "#ef4444";
}

export function getBlitzCoverageLabel(pathwayId: BlitzPathwayId) {
  const labels: Partial<Record<BlitzPathwayId, string>> = {
    curl_flat: "C/F",
    weak_curl_flat: "C/F",
    wall_flat: "Wall Flat",
    weak_wall_flat: "Wall Flat",
    strong_hook: "Str Hk",
    weak_hook: "Wk Hk",
    hole: "Hole",
    eyes: "Eyes",
    strong_eyes: "Eyes",
    weak_eyes: "Eyes",
    vert_hook: "Vert Hk",
    cb_flat: "Flat",
    field_flat: "Flat",
    weak_flat: "Flat",
    tampa_pole: "Tampa",
    quarter: "1/4",
    drop_hook: "Drop Hk",
    drop_curl_flat: "Drop C/F",
    mof: "MOF",
    deep_half_left: "1/2",
    deep_half_right: "1/2",
    deep_third_left: "1/3",
    deep_third_middle: "1/3",
    deep_third_right: "1/3",
  };
  return labels[pathwayId] ?? "";
}

export function getBlitzDlMovementLabel(defender: PlayerDot, offensePlayers: PlayerDot[], pathwayId: BlitzPathwayId, layer?: BlitzPathwayLayer, interiorCopDefenderIds: string[] = []) {
  if (layer !== "dl") return "";
  const isSlantPathway = pathwayId === "one_gap_slant_left" || pathwayId === "one_gap_slant_right" || pathwayId === "two_gap_slant_left" || pathwayId === "two_gap_slant_right";
  const slantDirection = pathwayId.endsWith("left") ? -1 : 1;
  if (pathwayId === "cop_rush") return "COP";
  if (defender.id === "N" && pathwayId === "b_gap_blitz") return "C-Read";
  if (["N", "T"].includes(defender.id) && isSlantPathway && interiorCopDefenderIds.includes(defender.id)) return "COP";
  if (defender.id === "N" && isSlantPathway) {
    const originX = getBlitzOriginX(offensePlayers);
    const towardCenterDirection = defender.x < originX ? 1 : -1;
    return slantDirection === towardCenterDirection ? "C-Read" : "Step";
  }
  if (defender.id === "T" && isSlantPathway) {
    const originX = getBlitzOriginX(offensePlayers);
    const outwardDirection = defender.x < originX ? -1 : 1;
    return slantDirection === outwardDirection ? "Gap" : "Step";
  }
  if (["SDE", "WDE"].includes(defender.id) && isSlantPathway) {
    const originX = getBlitzOriginX(offensePlayers);
    const alignedSideDirection = defender.x < originX ? -1 : 1;
    const slantDirection = pathwayId.endsWith("left") ? -1 : 1;
    return slantDirection === alignedSideDirection ? "COP" : "Stick";
  }
  return "";
}

export function getBlitzGapTargetX(offensePlayers: PlayerDot[], gap: "A" | "B" | "C", side: Side) {
  const byId = Object.fromEntries(offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
  const leftTackle = byId.LT?.x ?? 34;
  const leftGuard = byId.LG?.x ?? 42;
  const center = byId.C?.x ?? 50;
  const rightGuard = byId.RG?.x ?? 58;
  const rightTackle = byId.RT?.x ?? 66;

  if (gap === "A") return side === "left" ? getMidpoint(leftGuard, center) : getMidpoint(center, rightGuard);
  if (gap === "B") return side === "left" ? getMidpoint(leftTackle, leftGuard) : getMidpoint(rightGuard, rightTackle);
  return side === "left" ? leftTackle - 5 : rightTackle + 5;
}

export function getBlitzOriginX(offensePlayers: PlayerDot[]) {
  return offensePlayers.find((player) => player.id === "C")?.x ?? 50;
}

export function getBlitzRelativeX(offensePlayers: PlayerDot[], centeredX: number) {
  return clamp(getBlitzOriginX(offensePlayers) + centeredX - 50, 3, 97);
}

export function getBlitzCoverageHashX(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  if (Math.abs(originX - getBlitzHash("right")) < 1.5) return side === "right" ? 82 : getBlitzHash("left");
  if (Math.abs(originX - getBlitzHash("left")) < 1.5) return side === "left" ? 18 : getBlitzHash("right");
  return getHash(side, true);
}

export function getBlitzCurlFlatTargetX(offensePlayers: PlayerDot[], side: Side, passStrength: Side) {
  const strongEligibles = getBlitzOrderedEligibles(offensePlayers, passStrength);
  const weakSide: Side = passStrength === "left" ? "right" : "left";
  const weakEligibles = getBlitzOrderedEligibles(offensePlayers, weakSide);
  const isThreeByOne = side === passStrength && strongEligibles.length >= 3 && weakEligibles.length <= 1;
  if (isThreeByOne && strongEligibles[0] && strongEligibles[1]) {
    return getMidpoint(strongEligibles[0].x, strongEligibles[1].x);
  }
  return getBlitzCoverageHashX(offensePlayers, side);
}

export function getBlitzBoundarySide(offensePlayers: PlayerDot[]): Side | null {
  const originX = getBlitzOriginX(offensePlayers);
  if (Math.abs(originX - getBlitzHash("right")) < 1.5) return "right";
  if (Math.abs(originX - getBlitzHash("left")) < 1.5) return "left";
  return null;
}

export function getBlitzCoverTwoFlatX(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  if (Math.abs(originX - getBlitzHash("right")) < 1.5 || Math.abs(originX - getBlitzHash("left")) < 1.5) {
    return side === "left" ? 10 : 90;
  }
  return getBlitzRelativeX(offensePlayers, side === "left" ? 22 : 78);
}

export function getBlitzNumberOneDepthY(offensePlayers: PlayerDot[], side: Side, fallbackY = LOS_Y) {
  const numberOne = getBlitzOrderedEligibles(offensePlayers, side)
    .filter((player) => !["RB", "R", "F", "FB"].includes(player.id))
    [0];
  return numberOne?.y ?? fallbackY;
}

export function getBlitzFlatApexPoint(offensePlayers: PlayerDot[], defensePlayers: PlayerDot[] = [], side: Side, fallbackY = LOS_Y) {
  const numberOne = getBlitzOrderedEligibles(offensePlayers, side)
    .filter((player) => !["RB", "R", "F", "FB"].includes(player.id))
    [0];
  const originX = getBlitzOriginX(offensePlayers);
  const corner = defensePlayers
    .filter((player) => ["FC", "BC"].includes(player.id))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => Math.abs(a.x - originX) - Math.abs(b.x - originX))[0];
  if (numberOne && corner) return { x: getMidpoint(numberOne.x, corner.x), y: getMidpoint(numberOne.y, corner.y) };
  return { x: getBlitzCoverTwoFlatX(offensePlayers, side), y: numberOne?.y ?? fallbackY };
}

export function getBlitzWallFlatDepthY(defender: PlayerDot, offensePlayers: PlayerDot[], defensePlayers: PlayerDot[] = [], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  const sameSideLb = defensePlayers
    .filter((player) => ["Ni", "M", "W"].includes(player.id))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => Math.abs(a.x - originX) - Math.abs(b.x - originX))[0];
  return (sameSideLb ?? defender).y + 16;
}

export function getBlitzEdgePressureTargetX(offensePlayers: PlayerDot[], side: Side, losY = LOS_Y, wingY = WING_Y) {
  const awayFromCenter = side === "left" ? -1 : 1;
  const byId = Object.fromEntries(offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
  const tackleX = side === "left" ? byId.LT?.x ?? 34 : byId.RT?.x ?? 66;
  const originX = getBlitzOriginX(offensePlayers);
  const sidePlayers = offensePlayers.filter((player) => (
    ![...FIXED_OL_IDS, "QB", "RB", "R", "F", "FB"].includes(player.id as any)
    && (side === "left" ? player.x < originX : player.x > originX)
  ));
  const linePlayers = sidePlayers.filter((player) => Math.abs(player.y - losY) < 1.25 && Math.abs(player.x - tackleX) <= 7);
  const wingPlayers = sidePlayers.filter((player) => Math.abs(player.y - wingY) < 1.75 && Math.abs(player.x - tackleX) <= 14);
  const detachedTe = sidePlayers
    .filter((player) => ["Y", "U"].includes(player.id) && Math.abs(player.x - tackleX) > 7)
    .sort((a, b) => side === "left" ? b.x - a.x : a.x - b.x)[0];
  const emolos = linePlayers
    .sort((a, b) => side === "left" ? a.x - b.x : b.x - a.x)[0];
  const wingOutsideEmolos = emolos
    ? wingPlayers
        .filter((player) => side === "left" ? player.x < emolos.x : player.x > emolos.x)
        .sort((a, b) => side === "left" ? a.x - b.x : b.x - a.x)[0]
    : null;
  const tightWingSurface = wingOutsideEmolos ?? wingPlayers
    .sort((a, b) => side === "left" ? a.x - b.x : b.x - a.x)[0];

  if (detachedTe) return clamp(detachedTe.x - awayFromCenter * 4, 3, 97);
  if (tightWingSurface) return clamp(tightWingSurface.x + awayFromCenter * 4, 3, 97);
  if (emolos) return clamp(emolos.x + awayFromCenter * 4, 3, 97);
  return getBlitzGapTargetX(offensePlayers, "C", side);
}

export function getBlitzOrderedEligibles(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  return offensePlayers
    .filter((player) => ![...FIXED_OL_IDS, "QB"].includes(player.id as any))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => side === "left" ? a.x - b.x : b.x - a.x);
}

export function getBlitzBackfieldEligible(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  return offensePlayers
    .filter((player) => ["RB", "R", "F", "FB"].includes(player.id))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => Math.abs(a.x - originX) - Math.abs(b.x - originX))[0] ?? null;
}

export function getBlitzEyesTargetX(offensePlayers: PlayerDot[], side: Side, passStrength: Side) {
  const strongEligibles = getBlitzOrderedEligibles(offensePlayers, passStrength);
  const weakSide: Side = passStrength === "left" ? "right" : "left";
  const weakEligibles = getBlitzOrderedEligibles(offensePlayers, weakSide);
  const isThreeByOne = strongEligibles.length >= 3 && weakEligibles.length <= 1;

  if (!isThreeByOne) return getBlitzCoverageHashX(offensePlayers, side);

  if (side === passStrength) {
    const numberTwo = strongEligibles[1];
    const numberThree = strongEligibles[2];
    if (numberTwo && numberThree) return getMidpoint(numberTwo.x, numberThree.x);
  }

  const numberThree = strongEligibles[2];
  const weakNumberTwo = weakEligibles[1] ?? getBlitzBackfieldEligible(offensePlayers, weakSide) ?? weakEligibles[0];
  if (numberThree && weakNumberTwo) return getMidpoint(numberThree.x, weakNumberTwo.x);
  return getBlitzCoverageHashX(offensePlayers, side);
}

export function getBlitzStrongHookTargetX(offensePlayers: PlayerDot[], passStrength: Side) {
  const strongEligibles = getBlitzOrderedEligibles(offensePlayers, passStrength);
  const passAway: Side = passStrength === "left" ? "right" : "left";
  const weakEligibles = getBlitzOrderedEligibles(offensePlayers, passAway);
  const numberThree = strongEligibles[2];
  if (!numberThree || strongEligibles.length < 3 || weakEligibles.length > 1) {
    return getBlitzRelativeX(offensePlayers, passStrength === "left" ? 42 : 58);
  }

  const byId = Object.fromEntries(offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
  const tackle = passStrength === "left" ? byId.LT : byId.RT;
  const isDetachedNumberThree = Boolean(tackle && Math.abs(numberThree.x - tackle.x) > 9);
  const outsideDirection = passStrength === "left" ? -1 : 1;
  return clamp(numberThree.x + (isDetachedNumberThree ? 0 : outsideDirection * 3.1), 3, 97);
}

export function buildBlitzPathwayOverlay({
  id,
  defender,
  offensePlayers,
  defensePlayers = [],
  pathwayId,
  runStrength,
  passStrength,
  losY = LOS_Y,
  wingY = WING_Y,
  frontMode = "4-4",
  layer,
  interiorCopDefenderIds = [],
}: {
  id?: string;
  defender: PlayerDot;
  offensePlayers: PlayerDot[];
  defensePlayers?: PlayerDot[];
  pathwayId: BlitzPathwayId;
  runStrength?: Side;
  passStrength: Side;
  losY?: number;
  wingY?: number;
  frontMode?: FrontMode;
  layer?: BlitzPathwayLayer;
  interiorCopDefenderIds?: string[];
}): RouteOverlay {
  const originX = getBlitzOriginX(offensePlayers);
  const side: Side = defender.x < originX ? "left" : "right";
  const passAway: Side = passStrength === "left" ? "right" : "left";
  const runWeak: Side = (runStrength ?? passStrength) === "left" ? "right" : "left";
  const stroke = getBlitzPathwayStroke(pathwayId, layer);
  const slantDirection = pathwayId.endsWith("left") ? -1 : pathwayId.endsWith("right") ? 1 : side === "left" ? -1 : 1;
  const makePressurePath = (targetX: number) => [
    { x: defender.x, y: defender.y },
    { x: getMidpoint(defender.x, targetX), y: getMidpoint(defender.y, losY) },
    { x: targetX, y: losY - 4 },
  ];
  const makeEdgePressurePath = (edgeLaneXRaw: number, edgeSide: Side = side) => {
    const awayFromCenter = edgeSide === "left" ? -1 : 1;
    const edgeLaneX = clamp(edgeLaneXRaw, 3, 97);
    const backfieldX = clamp(edgeLaneX - awayFromCenter * 10, 3, 97);
    const backfieldY = losY - 15;
    return [
      { x: defender.x, y: defender.y },
      { x: edgeLaneX, y: losY + 3 },
      { x: backfieldX, y: backfieldY },
    ];
  };
  const makeCoveragePath = (targetX: number, targetY: number) => [
    { x: defender.x, y: defender.y },
    { x: getMidpoint(defender.x, targetX), y: getMidpoint(defender.y, targetY) },
    { x: targetX, y: targetY },
  ];
  const isFourThreeSafety = frontMode === "4-3" && ["FS", "BS"].includes(defender.id);
  const safetyDownhillY = getMidpoint(defender.y, losY);
  const trimPathStartToCircleEdge = (rawPath: { x: number; y: number }[]) => {
    if (rawPath.length < 2) return rawPath;
    const [start, next, ...rest] = rawPath;
    const dx = next.x - start.x;
    const dy = next.y - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0.1) return rawPath;
    const circleRadius = 3.1;
    const trimDistance = Math.min(circleRadius, distance - 0.1);
    return [
      {
        x: start.x + (dx / distance) * trimDistance,
        y: start.y + (dy / distance) * trimDistance,
      },
      next,
      ...rest,
    ];
  };
  const getCoverageLabelPoint = () => path[Math.max(0, Math.floor(path.length / 2))] ?? path[path.length - 1];

  let path: { x: number; y: number }[];
  let endCap: RunFitLineEnd = isCoverageBlitzPathway(pathwayId) && !isDeepCoverageBlitzPathway(pathwayId) ? "circle" : "arrow";

  if (pathwayId === "c_read_blitz") {
    const centerX = offensePlayers.find((player) => player.id === "C")?.x ?? originX;
    path = makePressurePath(centerX);
  } else if (pathwayId === "a_gap_blitz" || pathwayId === "weak_a_gap_blitz") {
    const gapSide = pathwayId === "weak_a_gap_blitz" ? runWeak : side;
    path = makePressurePath(getBlitzGapTargetX(offensePlayers, "A", gapSide));
  } else if (pathwayId === "b_gap_blitz" || pathwayId === "boundary_b_gap_blitz" || pathwayId === "field_b_gap_blitz") {
    const boundary = getBlitzBoundarySide(offensePlayers);
    const targetSide = pathwayId === "boundary_b_gap_blitz"
      ? boundary ?? passAway
      : pathwayId === "field_b_gap_blitz"
        ? boundary
          ? boundary === "left" ? "right" : "left"
          : passStrength
        : side;
    path = makePressurePath(getBlitzGapTargetX(offensePlayers, "B", targetSide));
  } else if (pathwayId === "c_gap_blitz") {
    path = makePressurePath(getBlitzGapTargetX(offensePlayers, "C", side));
  } else if (pathwayId === "d_gap_blitz") {
    path = makePressurePath(getBlitzEdgePressureTargetX(offensePlayers, side, losY, wingY));
  } else if (pathwayId === "edge_pressure" || pathwayId === "strong_edge_pressure" || pathwayId === "weak_edge_pressure") {
    const edgeSide = pathwayId === "strong_edge_pressure" ? passStrength : pathwayId === "weak_edge_pressure" ? passAway : side;
    path = makeEdgePressurePath(getBlitzEdgePressureTargetX(offensePlayers, edgeSide, losY, wingY), edgeSide);
  } else if (pathwayId === "one_gap_slant_left" || pathwayId === "one_gap_slant_right") {
    path = [
      { x: defender.x, y: defender.y },
      { x: clamp(defender.x + slantDirection * 6, 3, 97), y: losY - 3 },
    ];
  } else if (pathwayId === "two_gap_slant_left" || pathwayId === "two_gap_slant_right") {
    path = [
      { x: defender.x, y: defender.y },
      { x: clamp(defender.x + slantDirection * 12, 3, 97), y: losY - 3 },
    ];
  } else if (pathwayId === "cop_rush") {
    const awayFromCenter = side === "left" ? -1 : 1;
    path = [
      { x: defender.x, y: defender.y },
      { x: clamp(defender.x + awayFromCenter * 3, 3, 97), y: losY - 5 },
      { x: clamp(defender.x + awayFromCenter * 6, 3, 97), y: losY - 12 },
    ];
  } else if (pathwayId === "curl_flat" || pathwayId === "weak_curl_flat") {
    const curlFlatSide = pathwayId === "weak_curl_flat" ? passAway : side;
    const targetX = getBlitzCurlFlatTargetX(offensePlayers, curlFlatSide, passStrength);
    path = makeCoveragePath(targetX, isFourThreeSafety ? safetyDownhillY : defender.y + 15);
  } else if (pathwayId === "wall_flat" || pathwayId === "weak_wall_flat") {
    const wallFlatSide = pathwayId === "weak_wall_flat" ? passAway : passStrength;
    path = makeCoveragePath(
      getBlitzCoverageHashX(offensePlayers, wallFlatSide),
      isFourThreeSafety ? safetyDownhillY : getBlitzWallFlatDepthY(defender, offensePlayers, defensePlayers, wallFlatSide),
    );
  } else if (pathwayId === "strong_hook" || pathwayId === "weak_hook") {
    const hookSide = pathwayId === "strong_hook" ? passStrength : passAway;
    const hasThreeReceiverPassStrength = getBlitzOrderedEligibles(offensePlayers, passStrength).length >= 3;
    const isCoverTwoDeHook = layer === "cover2" && ["SDE", "WDE"].includes(defender.id);
    const targetX = isCoverTwoDeHook
      ? getBlitzCoverageHashX(offensePlayers, side)
      : pathwayId === "strong_hook" && hasThreeReceiverPassStrength
      ? getBlitzStrongHookTargetX(offensePlayers, passStrength)
      : pathwayId === "weak_hook" && hasThreeReceiverPassStrength
      ? originX
      : getBlitzRelativeX(offensePlayers, hookSide === "left" ? 42 : 58);
    path = makeCoveragePath(targetX, isFourThreeSafety ? safetyDownhillY : defender.y + 14);
  } else if (pathwayId === "hole") {
    path = makeCoveragePath(originX, isFourThreeSafety ? safetyDownhillY : clamp(defender.y + 18, 3, 94));
  } else if (pathwayId === "eyes" || pathwayId === "strong_eyes" || pathwayId === "weak_eyes") {
    const eyesSide = pathwayId === "strong_eyes" ? passStrength : pathwayId === "weak_eyes" ? passAway : side;
    const targetX = getBlitzEyesTargetX(offensePlayers, eyesSide, passStrength);
    path = makeCoveragePath(targetX, isFourThreeSafety ? safetyDownhillY : defender.y + 14);
  } else if (pathwayId === "vert_hook") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, side === "left" ? 43 : 57), defender.y + 17);
  } else if (pathwayId === "cb_flat") {
    const flatPoint = getBlitzFlatApexPoint(offensePlayers, defensePlayers, side, losY);
    path = makeCoveragePath(flatPoint.x, flatPoint.y);
  } else if (pathwayId === "field_flat" || pathwayId === "weak_flat") {
    const targetSide = side;
    const flatPoint = getBlitzFlatApexPoint(offensePlayers, defensePlayers, targetSide, losY);
    path = makeCoveragePath(flatPoint.x, flatPoint.y);
  } else if (pathwayId === "tampa_pole") {
    path = makeCoveragePath(originX, clamp(defender.y + 24, 3, 94));
  } else if (pathwayId === "quarter") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, side === "left" ? 25 : 75), 88);
  } else if (pathwayId === "drop_hook") {
    const targetX = layer === "cover2" && ["SDE", "WDE"].includes(defender.id)
      ? getBlitzCoverageHashX(offensePlayers, side)
      : getBlitzRelativeX(offensePlayers, side === "left" ? 36 : 64);
    path = [
      { x: defender.x, y: defender.y },
      { x: getMidpoint(defender.x, targetX), y: defender.y + 7 },
      { x: targetX, y: defender.y + 15 },
    ];
  } else if (pathwayId === "drop_curl_flat") {
    const isHashBoard = Math.abs(originX - getBlitzHash("right")) < 1.5 || Math.abs(originX - getBlitzHash("left")) < 1.5;
    if (isHashBoard) {
      const sidelineDirection = side === "left" ? -1 : 1;
      const dropDistance = 13;
      path = [
        { x: defender.x, y: defender.y },
        {
          x: clamp(defender.x + sidelineDirection * dropDistance, 3, 97),
          y: defender.y + dropDistance,
        },
      ];
    } else {
      const targetX = getBlitzCurlFlatTargetX(offensePlayers, side, passStrength);
      path = makeCoveragePath(targetX, defender.y + 13);
    }
  } else if (pathwayId === "mof") {
    path = makeCoveragePath(originX, clamp(defender.y + 20, 3, 94));
  } else if (pathwayId === "deep_half_left") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, 30), 88);
  } else if (pathwayId === "deep_half_right") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, 70), 88);
  } else if (pathwayId === "deep_third_left") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, 20), 88);
  } else if (pathwayId === "deep_third_middle") {
    path = makeCoveragePath(originX, 88);
  } else {
    const fallbackX = getBlitzRelativeX(offensePlayers, 80);
    path = [
      { x: defender.x, y: defender.y },
      { x: getMidpoint(defender.x, fallbackX), y: getMidpoint(defender.y, 88) },
      { x: fallbackX, y: 88 },
    ];
  }
  path = trimPathStartToCircleEdge(path);
  const hasThreeReceiverPassStrength = getBlitzOrderedEligibles(offensePlayers, passStrength).length >= 3;
  const coverageLabel = pathwayId === "weak_hook" && hasThreeReceiverPassStrength && layer !== "cover2" ? "3 Up" : getBlitzCoverageLabel(pathwayId);
  const label = coverageLabel || getBlitzDlMovementLabel(defender, offensePlayers, pathwayId, layer, interiorCopDefenderIds);
  const labelPoint = getCoverageLabelPoint();

  return {
    id: id ?? `blitz-pathway-${pathwayId}-${defender.id}-${Date.now()}`,
    label,
    color: stroke,
    path,
    labelX: label ? labelPoint.x : undefined,
    labelY: label ? labelPoint.y - 2.5 : undefined,
    endCap,
    pathway: {
      defenderId: defender.id,
      pathwayId,
      layer,
    },
  };
}

export function getBlitzPathwayMetaFromOverlay(overlay: {
  id: string;
  pathway?: {
    defenderId: string;
    pathwayId: any;
    layer?: BlitzPathwayLayer;
  };
}) {
  if (overlay.pathway) return overlay.pathway;
  const parts = overlay.id.split("-");
  if (parts[0] !== "blitz" || parts[1] !== "pathway") return null;
  const maybeDefenderId = parts[parts.length - 2];
  const maybePathwayId = parts.slice(2, -2).join("_") as BlitzPathwayId;
  if (!BLITZ_PATHWAY_OPTIONS.some((option) => option.value === maybePathwayId)) return null;
  return {
    defenderId: maybeDefenderId,
    pathwayId: maybePathwayId,
    layer: undefined,
  };
}

export function getBlitzTemplateAssignments({
  callId,
  baseBoardId,
  defensePlayers,
  offensePlayers,
  runStrength,
  passStrength,
  frontMode = "4-4",
  boardSpot = "mof",
}: {
  callId: BlitzCallId;
  baseBoardId?: BlitzBaseBoardId;
  defensePlayers: PlayerDot[];
  offensePlayers: PlayerDot[];
  runStrength?: Side;
  passStrength: Side;
  frontMode?: FrontMode;
  boardSpot?: BlitzBoardSpot;
}): { defenderId: string; pathwayId: BlitzPathwayId; layer?: BlitzPathwayLayer }[] {
  const assignments: { defenderId: string; pathwayId: BlitzPathwayId; layer?: BlitzPathwayLayer }[] = [];
  const usedDefenders = new Set<string>();
  const originX = getBlitzOriginX(offensePlayers);
  const defenderSide = (defenderId: string): Side => {
    const defender = defensePlayers.find((player) => player.id === defenderId);
    return defender && defender.x < originX ? "left" : "right";
  };
  const pressureAlignmentSide = (defenderId: string): Side => (
    defenderId === "W" ? (passStrength === "left" ? "right" : "left") : defenderSide(defenderId)
  );
  const oppositeEnd = (side: Side) => (
    ["WDE", "SDE"].find((defenderId) => defenderSide(defenderId) !== side) ?? (side === "left" ? "SDE" : "WDE")
  );
  const endOnSide = (side: Side) => (
    ["WDE", "SDE"].find((defenderId) => defenderSide(defenderId) === side) ?? (side === "left" ? "SDE" : "WDE")
  );
  const slantAway = (side: Side): BlitzPathwayId => side === "left" ? "one_gap_slant_right" : "one_gap_slant_left";
  const add = (defenderId: string, pathwayId: BlitzPathwayId, layer?: BlitzPathwayLayer) => {
    if (usedDefenders.has(defenderId)) return;
    assignments.push({ defenderId, pathwayId, layer });
    usedDefenders.add(defenderId);
  };
  const addCornerThirds = () => {
    add("FC", defenderSide("FC") === "left" ? "deep_third_left" : "deep_third_right", "coverage");
    add("BC", defenderSide("BC") === "left" ? "deep_third_left" : "deep_third_right", "coverage");
  };
  const addDlSlants = (pressureSide: Side, dropperId?: string, copEndId?: string) => {
    const slantPathway = slantAway(pressureSide);
    ["N", "T", "WDE", "SDE"].forEach((defenderId) => {
      if (defenderId !== dropperId && defenderId !== copEndId) add(defenderId, slantPathway, "dl");
    });
    if (copEndId && copEndId !== dropperId) add(copEndId, "cop_rush", "dl");
  };
  const addEyesCoverage = () => {
    const addFirstAvailable = (defenderIds: string[], pathwayId: BlitzPathwayId) => {
      for (const defenderId of defenderIds) {
        if (usedDefenders.has(defenderId)) continue;
        add(defenderId, pathwayId, "coverage");
        return;
      }
    };

    add("FS", frontMode === "4-4" ? "mof" : "eyes", "coverage");
    addFirstAvailable(["Ni", "M", "W", "BS"], "strong_eyes");
    addFirstAvailable(["BS", "W", "M", "Ni"], frontMode === "4-4" ? "weak_eyes" : "mof");
    addCornerThirds();
  };
  const addBaseCoverage = (coverage: "standard" | "fire" | "eyes" = "standard") => {
    if (coverage === "fire") {
      add("FS", frontMode === "4-4" ? "mof" : "hole", "coverage");
      add("BS", frontMode === "4-4" ? "wall_flat" : "mof", "coverage");
      add("M", "hole", "coverage");
      add("W", "wall_flat", "coverage");
      add("Ni", "wall_flat", "coverage");
      addCornerThirds();
      return;
    }

    if (coverage === "eyes") {
      addEyesCoverage();
      return;
    }

    add("FS", frontMode === "4-4" ? "mof" : "curl_flat", "coverage");
    add("BS", frontMode === "4-4" ? "weak_hook" : "mof", "coverage");
    add("M", "strong_hook", "coverage");
    add("W", "weak_hook", "coverage");
    add("Ni", "curl_flat", "coverage");
    addCornerThirds();
  };
  const passAway: Side = passStrength === "left" ? "right" : "left";
  const weakSideEligibleCount = offensePlayers.filter((player) => (
    ![...FIXED_OL_IDS, "QB", "RB", "R", "F", "FB"].includes(player.id as any)
    && (passAway === "left" ? player.x < originX : player.x > originX)
  )).length;
  const boundarySide: Side | null = boardSpot === "hash"
    ? "right"
    : Math.abs(originX - getBlitzHash("right")) < 1.5
    ? "right"
    : Math.abs(originX - getBlitzHash("left")) < 1.5
      ? "left"
      : null;
  const getDropperPathway = (dropperId: string, pressureSide: Side): BlitzPathwayId => {
    const dropperSide = pressureSide === "left" ? "right" : "left";
    if (boundarySide && defenderSide(dropperId) === boundarySide) return "drop_curl_flat";
    return passAway === dropperSide && weakSideEligibleCount <= 1 ? "drop_curl_flat" : "drop_hook";
  };
  const byOffenseId = Object.fromEntries(offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
  const hasDetachedNumberThreeThreeByOne = ["left", "right"].some((side) => {
    const eligibles = getBlitzOrderedEligibles(offensePlayers, side as Side);
    const oppositeEligibles = getBlitzOrderedEligibles(offensePlayers, side === "left" ? "right" : "left");
    const numberThree = eligibles[2];
    if (!numberThree || eligibles.length < 3 || oppositeEligibles.length > 1) return false;
    const tackle = side === "left" ? byOffenseId.LT : byOffenseId.RT;
    return Boolean(tackle && Math.abs(numberThree.x - tackle.x) > 9);
  });
  const addLastNameCoverage = (blitzerId: string, dropperId: string, pressureSide: Side) => {
    const dropperPathway = getDropperPathway(dropperId, pressureSide);
    const dropperHasCurlFlat = dropperPathway === "drop_curl_flat";
    const hasThreeReceiverPassStrength = getBlitzOrderedEligibles(offensePlayers, passStrength).length >= 3;
    const weakAwayPathway: BlitzPathwayId = hasThreeReceiverPassStrength ? "weak_hook" : "weak_curl_flat";

    if (frontMode === "4-3") {
      if (["FC", "BC"].includes(blitzerId)) {
        const boundaryThirdSide = boundarySide ?? defenderSide(blitzerId);
        add(dropperId, "strong_hook", "coverage");
        add("FS", "mof", "coverage");
        add("BS", boundaryThirdSide === "left" ? "deep_third_left" : "deep_third_right", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("M", "weak_hook", "coverage");
        add("W", "weak_curl_flat", "coverage");
        addCornerThirds();
        return;
      }

      if (blitzerId === "Ni") {
        add("FS", "curl_flat", "coverage");
        add("BS", "mof", "coverage");
        add("M", "strong_hook", "coverage");
        add("W", weakAwayPathway, "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "M") {
        add("FS", "strong_hook", "coverage");
        add("BS", "mof", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("W", "weak_curl_flat", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "W") {
        add("BS", "weak_curl_flat", "coverage");
        add("FS", "mof", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("M", hasThreeReceiverPassStrength ? "strong_hook" : "weak_hook", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "BS") {
        add("W", hasThreeReceiverPassStrength ? "weak_curl_flat" : weakAwayPathway, "coverage");
        add("M", "weak_hook", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("FS", "mof", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else {
        add(dropperId, dropperPathway, "coverage");
        add("FS", "curl_flat", "coverage");
        add("BS", "mof", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("M", "strong_hook", "coverage");
        add("W", "weak_hook", "coverage");
      }

      addCornerThirds();
      return;
    }

    if (frontMode === "4-4" && ["FC", "BC"].includes(blitzerId)) {
      const boundaryHalf = pressureSide === "left" ? "deep_half_left" : "deep_half_right";
      const fieldHalf = pressureSide === "left" ? "deep_half_right" : "deep_half_left";
      add(dropperId, "strong_hook", "cover2");
      add("FS", boundaryHalf, "coverage");
      add(blitzerId === "BC" ? "FC" : "BC", fieldHalf, "coverage");
      add("Ni", "field_flat", "coverage");
      add("M", "tampa_pole", "coverage");
      add("W", "weak_hook", "coverage");
      add("BS", "weak_flat", "coverage");
      return;
    }

    add(dropperId, dropperPathway, "coverage");
    add("FS", frontMode === "4-4" ? "mof" : "curl_flat", "coverage");

    if (frontMode === "4-4" && dropperHasCurlFlat) {
      if (blitzerId === "Ni") {
        add("M", "curl_flat", "coverage");
        add("W", "strong_hook", "coverage");
        add("BS", "weak_hook", "coverage");
      } else if (blitzerId === "BS") {
        add("W", "weak_curl_flat", "coverage");
        add("M", "weak_hook", "coverage");
        add("Ni", "strong_hook", "coverage");
      } else if (blitzerId === "M") {
        add("Ni", "curl_flat", "coverage");
        add("W", "strong_hook", "coverage");
        add("BS", "weak_hook", "coverage");
      } else if (blitzerId === "W") {
        add("BS", "weak_curl_flat", "coverage");
        add("M", "weak_hook", "coverage");
        add("Ni", "strong_hook", "coverage");
      } else {
        add("Ni", "curl_flat", "coverage");
        add("M", "strong_hook", "coverage");
        add("W", "weak_hook", "coverage");
        add("BS", "weak_hook", "coverage");
      }
      addCornerThirds();
      return;
    }

    if (blitzerId === "Ni") {
      if (dropperHasCurlFlat) {
        add("BS", "weak_hook", "coverage");
        add("W", "strong_hook", "coverage");
      } else {
        add("M", "curl_flat", "coverage");
        add("BS", "curl_flat", "coverage");
        add("W", "strong_hook", "coverage");
      }
    } else if (blitzerId === "BS") {
      add("Ni", "curl_flat", "coverage");
      if (!dropperHasCurlFlat) add("W", "weak_curl_flat", "coverage");
      add("M", dropperHasCurlFlat ? "strong_hook" : "weak_hook", "coverage");
    } else if (blitzerId === "M") {
      add("Ni", "curl_flat", "coverage");
      add("BS", dropperHasCurlFlat ? "weak_hook" : "curl_flat", "coverage");
      add("W", "strong_hook", "coverage");
    } else if (blitzerId === "W") {
      add("Ni", "curl_flat", "coverage");
      add("BS", dropperHasCurlFlat ? "weak_hook" : "curl_flat", "coverage");
      add("M", "weak_hook", "coverage");
    } else {
      add("Ni", "curl_flat", "coverage");
      add("BS", "curl_flat", "coverage");
      add("M", "strong_hook", "coverage");
      add("W", "weak_hook", "coverage");
    }

    addCornerThirds();
  };
  const runQbNamePressure = (blitzerId: string, pressurePathway: BlitzPathwayId, forcedDropperId?: string) => {
    const pressureSide = defenderSide(blitzerId);
    const dropperId = forcedDropperId ?? oppositeEnd(pressureAlignmentSide(blitzerId));
    add(blitzerId, pressurePathway, "pressure");
    addDlSlants(pressureSide, dropperId);
    addLastNameCoverage(blitzerId, dropperId, pressureSide);
  };
  const runTeamNamePressure = (blitzerId: string, pressurePathway: BlitzPathwayId) => {
    const pressureSide = defenderSide(blitzerId);
    add(blitzerId, pressurePathway, "pressure");
    addDlSlants(pressureSide);

    if (frontMode === "4-3") {
      if (blitzerId === "Ni") {
        add("FS", "wall_flat", "coverage");
        add("BS", "mof", "coverage");
        add("M", "hole", "coverage");
        add("W", "wall_flat", "coverage");
      } else if (blitzerId === "M") {
        add("FS", "hole", "coverage");
        add("BS", "mof", "coverage");
        add("Ni", "wall_flat", "coverage");
        add("W", "wall_flat", "coverage");
      } else if (blitzerId === "W") {
        add("BS", "weak_wall_flat", "coverage");
        add("FS", "mof", "coverage");
        add("Ni", "wall_flat", "coverage");
        add("M", "hole", "coverage");
      } else if (blitzerId === "BS") {
        add("W", "wall_flat", "coverage");
        add("FS", "mof", "coverage");
        add("Ni", "wall_flat", "coverage");
        add("M", "hole", "coverage");
      } else {
        add("FS", "hole", "coverage");
        add("BS", "mof", "coverage");
        add("Ni", "wall_flat", "coverage");
        add("M", "hole", "coverage");
        add("W", "wall_flat", "coverage");
      }

      addCornerThirds();
      return;
    }

    add("FS", frontMode === "4-4" ? "mof" : "hole", "coverage");
    if (blitzerId === "Ni") {
      add("M", "wall_flat", "coverage");
      add("BS", "wall_flat", "coverage");
      add("W", "hole", "coverage");
    } else if (blitzerId === "BS") {
      add("Ni", "wall_flat", "coverage");
      add("W", "weak_wall_flat", "coverage");
      add("M", "hole", "coverage");
    } else if (blitzerId === "M") {
      add("Ni", "wall_flat", "coverage");
      add("BS", "wall_flat", "coverage");
      add("W", "hole", "coverage");
    } else if (blitzerId === "W") {
      add("Ni", "wall_flat", "coverage");
      add("BS", "wall_flat", "coverage");
      add("M", "hole", "coverage");
    } else {
      add("Ni", "wall_flat", "coverage");
      add("BS", frontMode === "4-4" ? "wall_flat" : "mof", "coverage");
      add("M", "hole", "coverage");
      add("W", "wall_flat", "coverage");
    }
    addCornerThirds();
  };
  const runCityNamePressure = (blitzerId: string, pressurePathway: BlitzPathwayId, extraBlitzerId: string, extraPathway: BlitzPathwayId) => {
    const pressureSide = defenderSide(blitzerId);
    add(blitzerId, pressurePathway, "pressure");
    add(extraBlitzerId, extraPathway, "pressure");
    addDlSlants(pressureSide);
    addBaseCoverage("eyes");
  };
  const getBreesPressureSide = (): Side => boundarySide ?? passAway;
  const getBreesPressurePathway = (): BlitzPathwayId => (
    getBreesPressureSide() === passStrength ? "strong_edge_pressure" : "weak_edge_pressure"
  );
  const runBreesQbNamePressure = () => {
    const pressureSide = getBreesPressureSide();
    const dropperId = oppositeEnd(pressureAlignmentSide("W"));
    add("W", getBreesPressurePathway(), "pressure");
    addDlSlants(pressureSide, dropperId);
    addLastNameCoverage("W", dropperId, pressureSide);
  };
  const runBreesTeamNamePressure = () => {
    const pressureSide = getBreesPressureSide();
    add("W", getBreesPressurePathway(), "pressure");
    addDlSlants(pressureSide);
    addBaseCoverage("fire");
  };
  const runNolaPressure = () => {
    const pressureSide = getBreesPressureSide();
    add("W", getBreesPressurePathway(), "pressure");
    add("M", "weak_a_gap_blitz", "pressure");
    addDlSlants(pressureSide);
    addBaseCoverage("eyes");
  };
  const addCarrBounceNoDropCoverage = (pressureSide: Side) => {
    const boundaryHalf = pressureSide === "left" ? "deep_half_left" : "deep_half_right";
    const fieldHalf = pressureSide === "left" ? "deep_half_right" : "deep_half_left";
    add("FS", boundaryHalf, "coverage");
    add("FC", fieldHalf, "coverage");
    add("Ni", "field_flat", "coverage");
    add("M", "tampa_pole", "coverage");
    add("W", "strong_hook", "coverage");
    add("BS", "weak_hook", "cover2");
  };
  const runRaidersPressure = () => {
    const pressureSide = defenderSide("BC");
    add("BC", "edge_pressure", "pressure");
    addDlSlants(pressureSide);
    add("BS", pressureSide === "left" ? "deep_third_left" : "deep_third_right", "coverage");
    add("FS", "mof", "coverage");
    add("FC", defenderSide("FC") === "left" ? "deep_third_left" : "deep_third_right", "coverage");
    add("Ni", "curl_flat", "coverage");
    add("M", "strong_hook", "coverage");
    add("W", "weak_hook", "coverage");
  };
  const runOaklandPressure = () => {
    const pressureSide = defenderSide("BC");
    add("BC", "edge_pressure", "pressure");
    add("W", "weak_a_gap_blitz", "pressure");
    addDlSlants(pressureSide);
    if (frontMode === "4-4") {
      addCarrBounceNoDropCoverage(pressureSide);
      return;
    }
    addBaseCoverage("eyes");
  };
  const getBoundaryOrPassAwaySide = (): Side => boundarySide ?? passAway;
  const getFieldOrPassStrengthSide = (): Side => boundarySide ? boundarySide === "left" ? "right" : "left" : passStrength;
  const runQbNamePressureWithCop = (blitzerId: string, pressurePathway: BlitzPathwayId, forcedDropperId?: string, forcedPressureSide?: Side) => {
    const pressureSide = forcedPressureSide ?? defenderSide(blitzerId);
    const dropperId = forcedDropperId ?? oppositeEnd(pressureAlignmentSide(blitzerId));
    const copEndId = endOnSide(pressureSide);
    add(blitzerId, pressurePathway, "pressure");
    addDlSlants(pressureSide, dropperId, copEndId);
    addLastNameCoverage(blitzerId, dropperId, pressureSide);
  };
  const runTeamNamePressureWithCop = (blitzerId: string, pressurePathway: BlitzPathwayId, forcedPressureSide?: Side) => {
    const pressureSide = forcedPressureSide ?? defenderSide(blitzerId);
    const copEndId = endOnSide(pressureSide);
    add(blitzerId, pressurePathway, "pressure");
    addDlSlants(pressureSide, undefined, copEndId);
    addBaseCoverage("fire");
  };
  const runCityNamePressureWithCop = (blitzerId: string, pressurePathway: BlitzPathwayId, extraBlitzerId: string, extraPathway: BlitzPathwayId, forcedPressureSide?: Side) => {
    const pressureSide = forcedPressureSide ?? defenderSide(blitzerId);
    const copEndId = endOnSide(pressureSide);
    add(blitzerId, pressurePathway, "pressure");
    add(extraBlitzerId, extraPathway, "pressure");
    addDlSlants(pressureSide, undefined, copEndId);
    addBaseCoverage("eyes");
  };
  const getOneTechSideIlb = () => {
    const oneTechSide = defenderSide("N");
    if (defenderSide("M") === oneTechSide) return "M";
    if (defenderSide("W") === oneTechSide) return "W";
    return "M";
  };
  const addAllenNoseStunt = () => {
    add("N", "b_gap_blitz", "dl");
  };
  const runAllenQbNamePressure = () => {
    const blitzerId = getOneTechSideIlb();
    const pressureSide = defenderSide(blitzerId);
    const dropperId = oppositeEnd(defenderSide(blitzerId));
    const copEndId = oppositeEnd(defenderSide(dropperId));
    add(blitzerId, "c_read_blitz", "pressure");
    addAllenNoseStunt();
    addDlSlants(pressureSide, dropperId, copEndId);
    addLastNameCoverage(blitzerId, dropperId, pressureSide);
  };
  const runAllenTeamNamePressure = () => {
    const blitzerId = getOneTechSideIlb();
    const holeId = blitzerId === "M" ? "W" : "M";
    const pressureSide = defenderSide(blitzerId);
    const copEndId = endOnSide(pressureSide);
    add(blitzerId, "c_read_blitz", "pressure");
    addAllenNoseStunt();
    addDlSlants(pressureSide, undefined, copEndId);
    add(holeId, "hole", "coverage");
    addBaseCoverage("fire");
  };
  const runAllenCityNamePressure = () => {
    const blitzerId = getOneTechSideIlb();
    const holeId = blitzerId === "M" ? "W" : "M";
    const pressureSide = defenderSide(blitzerId);
    const copEndId = endOnSide(pressureSide);
    add(blitzerId, "c_read_blitz", "pressure");
    addAllenNoseStunt();
    addDlSlants(pressureSide, undefined, copEndId);
    add(holeId, "hole", "coverage");
    addBaseCoverage("eyes");
  };

  const runFieldsAutoCheck = () => runQbNamePressure("M", "edge_pressure");
  const runBearsAutoCheck = () => runTeamNamePressure("M", "edge_pressure");
  const runChicagoAutoCheck = () => runCityNamePressure("M", "edge_pressure", "W", "weak_a_gap_blitz");
  const isQuadBoard = baseBoardId === "quad";
  const resolveFourThreeDeDropZoneConflicts = () => {
    if (frontMode !== "4-3") return assignments;

    let nextAssignments = assignments;
    const hasThreeByOnePassStrength = getBlitzOrderedEligibles(offensePlayers, passStrength).length >= 3
      && getBlitzOrderedEligibles(offensePlayers, passAway).length <= 1;
    const getDeDropPathway = (deDrop: typeof assignments[number]): BlitzPathwayId => {
      const dropSide = defenderSide(deDrop.defenderId);
      if (hasThreeByOnePassStrength) return dropSide === passStrength ? "drop_hook" : "drop_curl_flat";
      return "drop_hook";
    };
    const deOwnedZone = (deDrop: typeof assignments[number]): BlitzPathwayId => {
      const dropSide = defenderSide(deDrop.defenderId);
      const normalizedDrop = getDeDropPathway(deDrop);
      if (normalizedDrop === "drop_curl_flat") return dropSide === passStrength ? "curl_flat" : "weak_curl_flat";
      return dropSide === passStrength ? "strong_hook" : "weak_hook";
    };
    const bumpInside = (pathwayId: BlitzPathwayId): BlitzPathwayId => {
      if (pathwayId === "curl_flat") return "strong_hook";
      if (pathwayId === "weak_curl_flat") return "weak_hook";
      if (pathwayId === "strong_hook") return "weak_hook";
      if (pathwayId === "weak_hook") return "hole";
      return pathwayId;
    };

    nextAssignments
      .filter((assignment) => (
        ["SDE", "WDE"].includes(assignment.defenderId)
        && ["drop_hook", "drop_curl_flat"].includes(assignment.pathwayId)
        && assignment.layer !== "cover2"
      ))
      .forEach((deDrop) => {
        const ownedZone = deOwnedZone(deDrop);

        nextAssignments = nextAssignments.map((assignment) => {
          if (assignment === deDrop) return { ...assignment, pathwayId: getDeDropPathway(deDrop) };
          if (
            assignment.layer !== "coverage"
            || assignment.defenderId === deDrop.defenderId
            || ["SDE", "WDE"].includes(assignment.defenderId)
            || assignment.pathwayId !== ownedZone
          ) {
            return assignment;
          }
          return { ...assignment, pathwayId: bumpInside(assignment.pathwayId) };
        });
      });

    return nextAssignments;
  };
  const resolveFourThreeWallFlatCoverage = (inputAssignments: typeof assignments) => {
    if (frontMode !== "4-3") return inputAssignments;
    if (inputAssignments.some((assignment) => assignment.layer === "cover2")) return inputAssignments;
    if (!inputAssignments.some((assignment) => ["wall_flat", "weak_wall_flat", "hole"].includes(assignment.pathwayId))) return inputAssignments;

    const pressureIds = new Set(inputAssignments
      .filter((assignment) => assignment.layer === "pressure")
      .map((assignment) => assignment.defenderId));
    const managedDefenders = new Set(["Ni", "M", "W", "FS", "BS"]);
    const managedCoveragePathways = new Set<BlitzPathwayId>(["wall_flat", "weak_wall_flat", "hole", "mof"]);
    const nextAssignments = inputAssignments.filter((assignment) => !(
      managedDefenders.has(assignment.defenderId)
      && managedCoveragePathways.has(assignment.pathwayId)
      && assignment.layer !== "pressure"
    ));
    const addResolved = (defenderId: string, pathwayId: BlitzPathwayId) => {
      if (pressureIds.has(defenderId)) return;
      nextAssignments.push({ defenderId, pathwayId, layer: "coverage" });
    };

    if (pressureIds.has("Ni")) {
      addResolved("FS", "wall_flat");
      addResolved("W", "weak_wall_flat");
      addResolved("M", "hole");
      addResolved("BS", "mof");
      return nextAssignments;
    }

    if (pressureIds.has("W")) {
      addResolved("BS", "weak_wall_flat");
      addResolved("Ni", "wall_flat");
      addResolved("M", "hole");
      addResolved("FS", "mof");
      return nextAssignments;
    }

    if (pressureIds.has("BS")) {
      addResolved("W", "weak_wall_flat");
      addResolved("Ni", "wall_flat");
      addResolved("M", "hole");
      addResolved("FS", "mof");
      return nextAssignments;
    }

    if (pressureIds.has("M")) {
      addResolved("W", "weak_wall_flat");
      addResolved("Ni", "wall_flat");
      addResolved("FS", "hole");
      addResolved("BS", "mof");
      return nextAssignments;
    }

    addResolved("M", "hole");
    addResolved("Ni", "wall_flat");
    addResolved("W", "weak_wall_flat");
    addResolved("BS", "mof");
    return nextAssignments;
  };
  const resolveFourThreeLocationEyesCoverage = (inputAssignments: typeof assignments) => {
    const locationCallIds = new Set<BlitzCallId>(["carolina", "chicago", "nola", "pitt", "oakland", "buffalo", "boston", "tampa_bay"]);
    if (frontMode !== "4-3" || !locationCallIds.has(callId)) return inputAssignments;
    if (inputAssignments.some((assignment) => assignment.layer === "cover2")) return inputAssignments;

    const pressureIds = new Set(inputAssignments
      .filter((assignment) => assignment.layer === "pressure")
      .map((assignment) => assignment.defenderId));
    const coverageDefenders = new Set(["Ni", "M", "W", "FS", "BS", "FC", "BC"]);
    const nextAssignments = inputAssignments.filter((assignment) => !(
      coverageDefenders.has(assignment.defenderId)
      && assignment.layer !== "pressure"
      && assignment.layer !== "dl"
    ));
    const addResolved = (defenderId: string, pathwayId: BlitzPathwayId) => {
      if (pressureIds.has(defenderId)) return;
      nextAssignments.push({ defenderId, pathwayId, layer: "coverage" });
    };
    const eyesForSide = (defenderId: string): BlitzPathwayId => (
      pressureAlignmentSide(defenderId) === passStrength ? "strong_eyes" : "weak_eyes"
    );
    const deepThirdForSide = (defenderId: string): BlitzPathwayId => (
      defenderSide(defenderId) === "left" ? "deep_third_left" : "deep_third_right"
    );
    const rotatedSafety: "FS" | "BS" | null = callId === "chicago"
      ? "BS"
      : pressureIds.has("W")
        ? "BS"
        : pressureIds.has("M") || pressureIds.has("Ni")
          ? "FS"
          : null;

    if (rotatedSafety && !pressureIds.has(rotatedSafety)) addResolved(rotatedSafety, eyesForSide(rotatedSafety));

    if (callId === "pitt") {
      addResolved("M", "weak_eyes");
      addResolved("Ni", "strong_eyes");
      addResolved("FC", deepThirdForSide("FC"));
      addResolved("BC", deepThirdForSide("BC"));
      const middleSafety = rotatedSafety === "FS" ? "BS" : "FS";
      addResolved(middleSafety, "deep_third_middle");
      return nextAssignments;
    }

    const availableLbs = ["Ni", "M", "W"].filter((defenderId) => !pressureIds.has(defenderId));
    const lbEyesCount = rotatedSafety && !pressureIds.has(rotatedSafety) ? 1 : 2;
    availableLbs.slice(0, lbEyesCount).forEach((defenderId) => addResolved(defenderId, eyesForSide(defenderId)));

    addResolved("FC", deepThirdForSide("FC"));
    addResolved("BC", deepThirdForSide("BC"));
    const middleSafety = rotatedSafety === "FS" ? "BS" : "FS";
    addResolved(middleSafety, "deep_third_middle");

    return nextAssignments;
  };
  const resolveFourThreeLastNameIlbZoneSwap = (inputAssignments: typeof assignments) => {
    const lastNameCallIds = new Set<BlitzCallId>(["newton", "fields", "brees", "bradshaw", "carr", "allen", "brady", "fitz"]);
    if (frontMode !== "4-3" || !lastNameCallIds.has(callId)) return inputAssignments;

    const pressureIds = new Set(inputAssignments
      .filter((assignment) => assignment.layer === "pressure")
      .map((assignment) => assignment.defenderId));
    if (!pressureIds.has("M") && !pressureIds.has("W")) return inputAssignments;

    return inputAssignments.map((assignment) => {
      if (pressureIds.has("W") && assignment.defenderId === "M" && assignment.layer === "coverage") {
        return { ...assignment, pathwayId: "weak_hook" as BlitzPathwayId };
      }
      if (pressureIds.has("M") && assignment.defenderId === "W" && assignment.layer === "coverage") {
        return { ...assignment, pathwayId: "strong_hook" as BlitzPathwayId };
      }
      return assignment;
    });
  };

  if (callId === "newton" && hasDetachedNumberThreeThreeByOne) runFieldsAutoCheck();
  else if (callId === "newton") runQbNamePressure("Ni", "edge_pressure");
  if (callId === "panthers" && hasDetachedNumberThreeThreeByOne) runBearsAutoCheck();
  else if (callId === "panthers") runTeamNamePressure("Ni", "edge_pressure");
  if (callId === "carolina" && hasDetachedNumberThreeThreeByOne) runChicagoAutoCheck();
  else if (callId === "carolina") runCityNamePressure("Ni", "edge_pressure", "M", "weak_a_gap_blitz");
  if (callId === "fields") runQbNamePressure("M", "edge_pressure");
  if (callId === "bears") runTeamNamePressure("M", "edge_pressure");
  if (callId === "chicago") runCityNamePressure("M", "edge_pressure", "W", "weak_a_gap_blitz");
  if (callId === "brees" || (callId === "carr" && isQuadBoard)) runBreesQbNamePressure();
  if (callId === "saints" || (callId === "raiders" && isQuadBoard)) runBreesTeamNamePressure();
  if (callId === "nola" || (callId === "oakland" && isQuadBoard)) runNolaPressure();
  if (callId === "bradshaw") runQbNamePressure("BS", "edge_pressure");
  if (callId === "steelers") runTeamNamePressure("BS", "edge_pressure");
  if (callId === "pitt") runCityNamePressure("BS", "edge_pressure", "W", "weak_a_gap_blitz");
  if (callId === "carr" && !isQuadBoard) runQbNamePressure("BC", "edge_pressure");
  if (callId === "raiders" && !isQuadBoard) runRaidersPressure();
  if (callId === "oakland" && !isQuadBoard) runOaklandPressure();
  if (callId === "allen") runAllenQbNamePressure();
  if (callId === "bills") runAllenTeamNamePressure();
  if (callId === "buffalo") runAllenCityNamePressure();
  if (callId === "brady") runQbNamePressureWithCop("W", "boundary_b_gap_blitz", undefined, getBoundaryOrPassAwaySide());
  if (callId === "patriots") runTeamNamePressureWithCop("W", "boundary_b_gap_blitz", getBoundaryOrPassAwaySide());
  if (callId === "boston") runCityNamePressureWithCop("W", "boundary_b_gap_blitz", "M", "weak_a_gap_blitz", getBoundaryOrPassAwaySide());
  if (callId === "fitz") runQbNamePressureWithCop("M", "field_b_gap_blitz", undefined, getFieldOrPassStrengthSide());
  if (callId === "bucs") runTeamNamePressureWithCop("M", "field_b_gap_blitz", getFieldOrPassStrengthSide());
  if (callId === "tampa_bay") runCityNamePressureWithCop("M", "field_b_gap_blitz", "W", "weak_a_gap_blitz", getFieldOrPassStrengthSide());

  return resolveFourThreeWallFlatCoverage(resolveFourThreeLocationEyesCoverage(resolveFourThreeDeDropZoneConflicts()));
}

export function buildBlitzTemplateOverlays({
  callId,
  baseBoardId,
  defensePlayers,
  offensePlayers,
  runStrength,
  passStrength,
  losY,
  wingY,
  frontMode = "4-4",
  boardSpot = "mof",
}: {
  callId: BlitzCallId;
  baseBoardId?: BlitzBaseBoardId;
  defensePlayers: PlayerDot[];
  offensePlayers: PlayerDot[];
  runStrength?: Side;
  passStrength: Side;
  losY: number;
  wingY: number;
  frontMode?: FrontMode;
  boardSpot?: BlitzBoardSpot;
}) {
  const originX = getBlitzOriginX(offensePlayers);
  const getDefenderSide = (defenderId: string): Side => (
    (defensePlayers.find((player) => player.id === defenderId)?.x ?? originX) < originX ? "left" : "right"
  );
  const passAway: Side = passStrength === "left" ? "right" : "left";
  const passStrengthEligibleCount = offensePlayers.filter((player) => (
    ![...FIXED_OL_IDS, "QB", "RB", "R", "F", "FB"].includes(player.id as any)
    && (passStrength === "left" ? player.x < originX : player.x > originX)
  )).length;
  const hasThreeReceiverPassStrength = passStrengthEligibleCount >= 3;
  const assignments = getBlitzTemplateAssignments({ callId, baseBoardId, defensePlayers, offensePlayers, passStrength, frontMode, boardSpot }).map((assignment) => {
    if (
      hasThreeReceiverPassStrength
      && ["SDE", "WDE"].includes(assignment.defenderId)
      && assignment.pathwayId === "drop_hook"
      && getDefenderSide(assignment.defenderId) === passAway
    ) {
      return { ...assignment, pathwayId: "drop_curl_flat" as BlitzPathwayId };
    }
    return assignment;
  });
  const deDropSides = assignments
    .filter((assignment) => (
      ["SDE", "WDE"].includes(assignment.defenderId)
      && ["drop_hook", "drop_curl_flat"].includes(assignment.pathwayId)
    ))
    .map((assignment) => getDefenderSide(assignment.defenderId));
  const interiorCopDefenderIds = Array.from(new Set(deDropSides.map((dropSide) => {
    const interiors = defensePlayers.filter((player) => ["N", "T"].includes(player.id));
    const closestInterior = interiors.sort((a, b) => (
      dropSide === "left" ? a.x - b.x : b.x - a.x
    ))[0];
    return closestInterior?.id;
  }).filter(Boolean) as string[]));

  return assignments.flatMap((assignment) => {
    const defender = defensePlayers.find((player) => player.id === assignment.defenderId);
    if (!defender) return [];
    const overlay = buildBlitzPathwayOverlay({
      defender,
      offensePlayers,
      defensePlayers,
      pathwayId: assignment.pathwayId,
      runStrength,
      passStrength,
      losY,
      wingY,
      frontMode,
      layer: assignment.layer,
      interiorCopDefenderIds,
    });
    return overlay;
  });
}
