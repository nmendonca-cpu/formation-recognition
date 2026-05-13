import { getBlitzOriginX, type FrontMode } from "@/lib/blitz/blitzLogic";

export type Side = "left" | "right";
export type PlaybookKey = "Foothill" | "Pro" | "Wing T";
export type Family = "Spread" | "I" | "12p" | "Wing T";
export type LandmarkLayer = "dl" | "lb" | "cb" | "db" | "offense";

export type PlayerDot = {
  id: string;
  x: number;
  y: number;
};

export type FormationMeta = {
  playbook: PlaybookKey;
  family: Family;
  name: string;
  personnel: string;
  runStrength: Side;
  passStrength: Side;
  backfield: string;
  players: PlayerDot[];
};

export type Landmark = {
  id: string;
  x: number;
  y: number;
  label?: string;
  layer: LandmarkLayer;
};

export type CheckResult = {
  incorrectIds: string[];
  ghosts: PlayerDot[];
  isCorrect: boolean;
};

export const PLAYBOOK_OPTIONS: PlaybookKey[] = ["Foothill", "Pro", "Wing T"];
export const PERSONNEL_OPTIONS = ["Any", "11", "12", "21"] as const;
export const ALIGNMENT_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch", "B Trips", "B Trey", "B Doubles", "Quad", "Dog"] as const;
export const ALIGNMENT_EMPTY_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch"] as const;
export const CUSTOM_ALIGNMENT_LAYERS = ["dl", "lb", "cb", "db"] as const;
export const ALIGNMENT_CALLS = [
  ...ALIGNMENT_BASE_CALLS.flatMap((base) => [
    `${base} Left`, `${base} Right`, `${base} Left King`, `${base} Right King`, `${base} Left Queen`, `${base} Right Queen`,
  ]),
  ...ALIGNMENT_EMPTY_BASE_CALLS.flatMap((base) => [`${base} Empty Left`, `${base} Empty Right`]),
  "Bunch Closed Left", "Bunch Closed Right",
] as const;
export const WING_T_CALLS = [
  "Wing T Far Right", "Wing T Far Left",
  "Wing T Near Right", "Wing T Near Left",
  "Wing T Unbalanced Far Right", "Wing T Unbalanced Far Left",
  "Wing T Unbalanced Near Right", "Wing T Unbalanced Near Left",
  "Double Wing Right", "Double Wing Left",
  "Wing T Closed Far Right", "Wing T Closed Far Left",
  "Wing T Closed Near Right", "Wing T Closed Near Left",
] as const;
export const PRO_CALLS = [
  "I Dot Right", "I Dot Left", "I Far Right", "I Far Left", "I Near Right", "I Near Left",
  "I Slot Right", "I Slot Left", "I Slot Far Right", "I Slot Far Left", "I Slot Near Right", "I Slot Near Left",
  "Ace Right", "Ace Left", "Ace Trey Right", "Ace Trey Left", "Flank Right", "Flank Left",
] as const;
export const DEFENDER_TOKENS = ["N", "T", "SDE", "WDE", "M", "W", "Ni", "FC", "BC", "FS", "BS"] as const;
export const OFFENSE_TOKENS = ["QB", "RB", "X", "Y", "H", "Z"] as const;
export const FIXED_OL_IDS = ["LT", "LG", "C", "RG", "RT"] as const;

export const TIGHT_OLINE_X = [40, 45, 50, 55, 60] as const;
export const ALIGNMENT_OLINE_X = [38, 44, 50, 56, 62] as const;
export const LOS_Y = 36;
export const OFF_Y = 28;
export const WING_Y = LOS_Y - (LOS_Y - OFF_Y) * 0.75;
export const QB_UNDER_Y = 26;
export const QB_GUN_Y = 10;
export const RB_DOT_Y = 8;
export const LB_Y = 64;
export const CB_Y = 79;
export const DB_Y = 94;
export const DL_Y = 47;
export const FIELD_LABELS = { left: "Left", right: "Right" } as const;

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function getLineXs(wide = false) {
  return wide ? ALIGNMENT_OLINE_X : TIGHT_OLINE_X;
}

export function getFormationLineXs(formation: FormationMeta): number[] {
  const fallback = ALIGNMENT_OLINE_X;
  return FIXED_OL_IDS.map((id, index) => formation.players.find((player) => player.id === id)?.x ?? fallback[index]);
}

export function baseLine(wide = false): PlayerDot[] {
  const xs = getLineXs(wide);
  return [
    { id: "LT", x: xs[0], y: LOS_Y },
    { id: "LG", x: xs[1], y: LOS_Y },
    { id: "C", x: xs[2], y: LOS_Y },
    { id: "RG", x: xs[3], y: LOS_Y },
    { id: "RT", x: xs[4], y: LOS_Y },
  ];
}

export function getWide(side: Side) {
  return side === "right" ? 92 : 8;
}

export function getAttached(side: Side, wide = false) {
  const xs = getLineXs(wide);
  const attachSpacing = wide ? xs[1] - xs[0] : 4;
  return side === "right" ? xs[4] + attachSpacing : xs[0] - attachSpacing;
}

export function getFlexTe(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 6 : -6);
}

export function getWing(side: Side, wide = false) {
  const xs = getLineXs(wide);
  const olSpacing = xs[1] - xs[0];
  return getAttached(side, wide) + (side === "right" ? olSpacing * 0.25 : -olSpacing * 0.25);
}

export function getBunchWing(side: Side, wide = false) {
  return getWing(side, wide);
}

export function getBunchMiddle(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 3 : -3);
}

export function getBunchOutside(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 6 : -6);
}

export function getSlot(side: Side, wide = false) {
  return (getAttached(side, wide) + getWide(side)) / 2;
}

export function getHash(side: Side, wide = false) {
  return getSlot(side, wide);
}

export function getOppositeSide(side: Side): Side {
  return side === "left" ? "right" : "left";
}

export function flipCallSide(call: string) {
  if (call.includes("Right")) return call.replace("Right", "Left");
  if (call.includes("Left")) return call.replace("Left", "Right");
  return call;
}

export function getMidpoint(a: number, b: number) {
  return (a + b) / 2;
}

export function isBackfieldEligible(p: PlayerDot) {
  return p.y < OFF_Y - 2;
}

export function isEligibleSkillPlayer(p: PlayerDot) {
  return ![...FIXED_OL_IDS, "QB"].includes(p.id as any) && !isBackfieldEligible(p);
}

export function isSplitOutWideEligible(p: PlayerDot) {
  return isEligibleSkillPlayer(p);
}

export function countsAsNonBackfieldEligible(p: PlayerDot) {
  return isEligibleSkillPlayer(p);
}

export function isWingLikePlayer(p: PlayerDot) {
  return Math.abs(p.y - WING_Y) < 1.0;
}

export function isTrueWideReceiver(p: PlayerDot) {
  if (!["X", "Z", "H"].includes(p.id)) return false;
  if (isWingLikePlayer(p)) return false;
  return !isBackfieldEligible(p);
}

export function getPassCatcherPriorityScore(p: PlayerDot) {
  if (["Y", "U"].includes(p.id)) return 1;
  if (p.id === "RB" || p.id === "F") return 0;
  if (isWingLikePlayer(p)) return 2;
  if (["X", "Z", "H"].includes(p.id)) return 3;
  return 0;
}

export function getOffsetBackSide(players: PlayerDot[]): Side | null {
  const back = players.find((p) => ["RB", "F"].includes(p.id) && p.x !== 50);
  if (!back) return null;
  return back.x < 50 ? "left" : "right";
}

export function computePassStrengthFromEligibles(
  players: PlayerDot[],
  callSide: Side,
  opts?: { isEmpty?: boolean; isPistol?: boolean; personnel?: string },
): Side {
  const isEmpty = opts?.isEmpty ?? false;
  const isPistol = opts?.isPistol ?? false;
  const personnel = opts?.personnel ?? "11";

  const trueEligibles = players.filter((p) => {
    if (["LT", "LG", "C", "RG", "RT", "QB"].includes(p.id)) return false;
    return !isBackfieldEligible(p);
  });

  const left = trueEligibles.filter((p) => p.x < 50);
  const right = trueEligibles.filter((p) => p.x > 50);

  if (left.length > right.length) return "left";
  if (right.length > left.length) return "right";

  const leftTrueWr = left.filter(isTrueWideReceiver).length;
  const rightTrueWr = right.filter(isTrueWideReceiver).length;

  if (leftTrueWr > rightTrueWr) return "left";
  if (rightTrueWr > leftTrueWr) return "right";

  const leftPassPriority = left.reduce((sum, p) => sum + getPassCatcherPriorityScore(p), 0);
  const rightPassPriority = right.reduce((sum, p) => sum + getPassCatcherPriorityScore(p), 0);

  if (leftPassPriority > rightPassPriority) return "left";
  if (rightPassPriority > leftPassPriority) return "right";

  const isTwoByTwo = left.length === 2 && right.length === 2;
  if (isTwoByTwo) {
    const is10p = personnel === "10" || !trueEligibles.some((p) => ["Y", "U"].includes(p.id));
    if (is10p) {
      if (isPistol) return "left";
      const offsetSide = getOffsetBackSide(players);
      if (offsetSide) return offsetSide;
      return "left";
    }
  }

  return callSide;
}

export function dedupeLandmarks(points: Landmark[]) {
  const out: Landmark[] = [];
  points.forEach((point) => {
    const exists = out.some((p) => p.layer === point.layer && p.label === point.label && Math.abs(p.x - point.x) < 0.2 && Math.abs(p.y - point.y) < 0.2);
    if (!exists) out.push(point);
  });
  return out;
}

export function buildFoothillFormation(call: string, wide = false): FormationMeta {
  const side: Side = call.includes("Left") ? "left" : "right";
  const other: Side = side === "right" ? "left" : "right";
  const isEmpty = call.includes("Empty");
  const isKing = call.includes("King");
  const isQueen = call.includes("Queen");
  const isGun = !isEmpty && (isKing || isQueen);
  const foothillBaseCalls = ["Bunch Closed", "B Trips", "B Trey", "B Doubles", "Trips", "Trey", "Troop", "Bunch", "Doubles", "Dog", "Quad"] as const;
  const base = foothillBaseCalls.find((baseCall) => call.startsWith(baseCall)) ?? (call.startsWith("B ") ? `${call.split(" ")[0]} ${call.split(" ")[1]}` : call.split(" ")[0]);
  const players: PlayerDot[] = [...baseLine(wide), { id: "QB", x: 50, y: isGun || isEmpty ? QB_GUN_Y : QB_UNDER_Y }];
  const add = (id: string, x: number, y: number) => players.push({ id, x, y });

  if (!isEmpty) {
    add("RB", isGun ? (isKing ? 58 : isQueen ? 42 : 50) : 50, isGun ? QB_GUN_Y : RB_DOT_Y);
  }

  switch (base) {
    case "Trips":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getWing(side, wide), WING_Y);
      add("Z", getWide(side), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "Trey":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getSlot(side, wide), OFF_Y);
      add("Z", getWide(side), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "Troop": {
      const yX = getFlexTe(side, wide);
      const zX = wide ? (side === "right" ? 96 : 4) : getWide(side);
      const hX = getSlot(side, wide);
      add("Y", yX, LOS_Y);
      add("H", hX, OFF_Y);
      add("Z", zX, OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    }
    case "Bunch":
      if (isEmpty) {
        add("H", getBunchWing(side, wide), WING_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
        add("RB", getSlot(other, wide), OFF_Y);
      } else {
        add("H", getBunchWing(side, wide), WING_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
      }
      break;
    case "Bunch Closed":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getBunchWing(other, wide), WING_Y);
      add("X", getBunchMiddle(other, wide), LOS_Y);
      add("Z", getBunchOutside(other, wide), OFF_Y);
      break;
    case "Doubles":
      // Y/Z stay on the called side. X/H are opposite the called side, which becomes strong pass.
      add("Y", getAttached(side, wide), LOS_Y);
      add("Z", getWide(side), OFF_Y);
      add("H", getSlot(other, wide), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "Dog": {
      // H is opposite the called side in a true wing alignment so wing-surface detection can identify it cleanly.
      const hX = getWing(other, wide);
      add("Y", getAttached(side, wide), LOS_Y);
      add("Z", getWide(side), OFF_Y);
      add("H", hX, WING_Y);
      add("X", getWide(other), LOS_Y);
      break;
    }
    case "B Trips":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getWing(other, wide), WING_Y);
      add("Z", getSlot(other, wide), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "B Trey":
      add("Y", getAttached(side, wide), LOS_Y);
      add("Z", getFlexTe(other, wide), OFF_Y);
      add("H", getMidpoint(getFlexTe(other, wide), getWide(other)), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "B Doubles":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getWing(side, wide), WING_Y);
      add("Z", getSlot(other, wide), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    case "Quad":
      add("Y", getSlot(side, wide), LOS_Y);
      add("Z", getWide(side), OFF_Y);
      add("H", getSlot(other, wide), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    default:
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getSlot(side, wide), OFF_Y);
      add("Z", getWide(side), OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
  }

  if (isEmpty && base !== "Bunch") {
    const emptyBackSide: Side = base === "Doubles" ? side : other;
    add("RB", getSlot(emptyBackSide, wide), OFF_Y);
  }

  const passStrength: Side = computePassStrengthFromEligibles(players, side, {
    isEmpty,
    isPistol: false,
    personnel: isEmpty ? "10" : "11",
  });

  return {
    playbook: "Foothill",
    family: "Spread",
    name: call,
    personnel: "11",
    runStrength: side,
    passStrength,
    backfield: isEmpty ? "Empty" : isGun ? "Gun" : "Under Center",
    players,
  };
}

export function buildWingTFormation(call: string, wide = false): FormationMeta {
  const side: Side = call.includes("Left") ? "left" : "right";
  const other: Side = side === "right" ? "left" : "right";
  const isUnbalanced = call.includes("Unbalanced");
  const isFar = call.includes("Far");
  const isNear = call.includes("Near");
  const isDoubleWing = call.startsWith("Double Wing");
  const isClosed = call.startsWith("Wing T Closed");

  const players: PlayerDot[] = [...baseLine(wide), { id: "QB", x: 50, y: QB_UNDER_Y }];
  const add = (id: string, x: number, y: number) => players.push({ id, x, y });
  const xs = getLineXs(wide);
  const useFarBackfield = isFar;
  const useNearBackfield = isNear;

  add("RB", 50, RB_DOT_Y);

  if (!isDoubleWing) {
    const fbX = useFarBackfield ? (side === "right" ? xs[0] : xs[4]) : useNearBackfield ? (side === "right" ? xs[4] : xs[0]) : 50;
    add("F", fbX, RB_DOT_Y);
  }

  add("Y", getAttached(side, wide), LOS_Y);

  if (isDoubleWing) {
    add("Z", getWing(side, wide), WING_Y);
    add("H", getAttached(other, wide), WING_Y);
    add("X", getWide(other), LOS_Y);
  } else if (isClosed) {
    add("Z", getSlot(other, wide), OFF_Y);
    add("X", getWide(other), LOS_Y);
  } else {
    add("Z", getWing(side, wide), WING_Y);
    if (isUnbalanced) {
      add("X", getWide(side), LOS_Y);
    } else {
      add("X", getWide(other), LOS_Y);
    }
  }

  const passStrength = isUnbalanced
    ? side
    : computePassStrengthFromEligibles(players, side, {
        isEmpty: false,
        isPistol: false,
        personnel: "21",
      });

  return {
    playbook: "Wing T",
    family: "Wing T",
    name: call,
    personnel: "21",
    runStrength: side,
    passStrength,
    backfield: "Under Center",
    players,
  };
}

export function buildProFormation(call: string, wide = false): FormationMeta {
  const side: Side = call.includes("Left") ? "left" : "right";
  const other: Side = side === "right" ? "left" : "right";
  const isFar = call.includes("Far");
  const isNear = call.includes("Near");
  const isISlot = call.startsWith("I Slot");
  const isAce = call.startsWith("Ace") && !call.startsWith("Ace Trey");
  const isAceTrey = call.startsWith("Ace Trey");
  const isFlank = call.startsWith("Flank");
  const players: PlayerDot[] = [...baseLine(wide), { id: "QB", x: 50, y: QB_UNDER_Y }];
  const add = (id: string, x: number, y: number) => players.push({ id, x, y });
  const fbY = getMidpoint(QB_UNDER_Y, RB_DOT_Y);
  const xs = getLineXs(wide);
  const fbX = isFar ? (side === "right" ? xs[1] : xs[3]) : isNear ? (side === "right" ? xs[3] : xs[1]) : 50;

  if (call.startsWith("I ")) {
    add("F", fbX, fbY);
    add("RB", 50, RB_DOT_Y);
  }
  if (call.startsWith("I Dot") || call.startsWith("I Far") || call.startsWith("I Near")) {
    add("Y", getAttached(side, wide), LOS_Y);
    add("Z", getWide(side), LOS_Y);
    add("X", getWide(other), LOS_Y);
  }
  if (isISlot) {
    add("Y", getAttached(side, wide), LOS_Y);
    add("X", getWide(other), LOS_Y);
    add("Z", getSlot(other, wide), OFF_Y);
  }
  if (isAce) {
    add("Y", getAttached(side, wide), LOS_Y);
    add("U", getAttached(other, wide), LOS_Y);
    add("Z", getWide(side), OFF_Y);
    add("X", getWide(other), OFF_Y);
    add("RB", 50, RB_DOT_Y);
  }
  if (isAceTrey) {
    add("Y", getAttached(side, wide), LOS_Y);
    add("U", getAttached(other, wide), LOS_Y);
    add("Z", getSlot(side, wide), OFF_Y);
    add("X", getWide(side), OFF_Y);
    add("RB", 50, RB_DOT_Y);
  }
  if (isFlank) {
    add("Y", getAttached(side, wide), LOS_Y);
    add("U", getWing(side, wide), WING_Y);
    add("Z", getSlot(other, wide), OFF_Y);
    add("X", getWide(other), LOS_Y);
    add("RB", 50, RB_DOT_Y);
  }

  const passStrength: Side = computePassStrengthFromEligibles(players, side, {
    isEmpty: false,
    isPistol: false,
    personnel: call.startsWith("I ") ? "21" : "12",
  });

  return {
    playbook: "Pro",
    family: call.startsWith("I ") ? "I" : "12p",
    name: call,
    personnel: call.startsWith("I ") ? "21" : "12",
    runStrength: side,
    passStrength,
    backfield: "Under Center",
    players,
  };
}

export const ALL_FORMATIONS: FormationMeta[] = [
  ...WING_T_CALLS.map((call) => buildWingTFormation(call, false)),
  ...ALIGNMENT_CALLS.map((call) => buildFoothillFormation(call, false)),
  ...PRO_CALLS.map((call) => buildProFormation(call, false)),
];

export function getDefaultCustomLandmarkPosition(layer: "dl" | "lb" | "cb" | "db", side: Side) {
  const yMap = { dl: DL_Y, lb: LB_Y, cb: CB_Y, db: DB_Y } as const;
  return { x: side === "left" ? 25 : 75, y: yMap[layer] };
}

export function getOffenseBuildLandmarks(formation?: FormationMeta): Landmark[] {
  const leftAttached = getAttached("left", false);
  const rightAttached = getAttached("right", false);
  const leftSlot = getSlot("left", false);
  const rightSlot = getSlot("right", false);
  const landmarks: Landmark[] = [
    { id: "o-qb-under", x: 50, y: QB_UNDER_Y, layer: "offense" },
    { id: "o-qb-gun", x: 50, y: QB_GUN_Y, layer: "offense" },
    { id: "o-rb-dot", x: 50, y: RB_DOT_Y, layer: "offense" },
    { id: "o-rb-left", x: 42, y: QB_GUN_Y, layer: "offense" },
    { id: "o-rb-right", x: 58, y: QB_GUN_Y, layer: "offense" },
    { id: "o-y-left", x: leftAttached, y: LOS_Y, layer: "offense" },
    { id: "o-y-right", x: rightAttached, y: LOS_Y, layer: "offense" },
    { id: "o-y-flex-left", x: getFlexTe("left", false), y: LOS_Y, layer: "offense" },
    { id: "o-y-flex-right", x: getFlexTe("right", false), y: LOS_Y, layer: "offense" },
    { id: "o-h-wing-left", x: getWing("left", false), y: WING_Y, layer: "offense" },
    { id: "o-h-wing-right", x: getWing("right", false), y: WING_Y, layer: "offense" },
    { id: "o-slot-left-on", x: leftSlot, y: LOS_Y, layer: "offense" },
    { id: "o-slot-right-on", x: rightSlot, y: LOS_Y, layer: "offense" },
    { id: "o-slot-left", x: leftSlot, y: OFF_Y, layer: "offense" },
    { id: "o-slot-right", x: rightSlot, y: OFF_Y, layer: "offense" },
    { id: "o-wide-left-on", x: 8, y: LOS_Y, layer: "offense" },
    { id: "o-wide-right-on", x: 92, y: LOS_Y, layer: "offense" },
    { id: "o-wide-left-off", x: 8, y: OFF_Y, layer: "offense" },
    { id: "o-wide-right-off", x: 92, y: OFF_Y, layer: "offense" },
  ];

  if (formation?.name.toLowerCase().includes("bunch")) {
    (["left", "right"] as const).forEach((side) => {
      landmarks.push(
        { id: `o-bunch-${side}-h`, x: getBunchWing(side, false), y: WING_Y, layer: "offense" },
        { id: `o-bunch-${side}-y`, x: getBunchMiddle(side, false), y: LOS_Y, layer: "offense" },
        { id: `o-bunch-${side}-z`, x: getBunchOutside(side, false), y: OFF_Y, layer: "offense" },
        { id: `o-bunch-${side}-x-point`, x: getBunchMiddle(side, false), y: LOS_Y, layer: "offense" },
      );
    });

    formation.players
      .filter((player) => ["H", "Y", "Z", "X"].includes(player.id))
      .forEach((player) => {
        landmarks.push({
          id: `o-bunch-${formation.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${player.id}`,
          x: player.x,
          y: player.y,
          layer: "offense",
        });
      });
  }

  return dedupeLandmarks(landmarks);
}

export function getOffenseAnswerKeyFromFormation(formation: FormationMeta): Record<string, { x: number; y: number }> {
  const answer: Record<string, { x: number; y: number }> = {};
  formation.players
    .filter((p) => !FIXED_OL_IDS.includes(p.id as (typeof FIXED_OL_IDS)[number]))
    .forEach((p) => {
      answer[p.id] = { x: p.x, y: p.y };
    });
  return answer;
}
