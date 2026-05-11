import {
  getAlignmentAnswerKey,
  getAlignmentLandmarks,
  getInlineSurface,
  getWingSurface,
} from "@/lib/alignment/alignmentLogic";
import { buildFoothillFormation } from "@/lib/formation/formationLogic";

export type RunGameSide = "left" | "right";
export type RunGameFrontId = "even_over" | "even_under";
export type RunGamePlayerGroup = "offense" | "defense";
export type RunGameBlockType = "Down" | "Reach" | "Base" | "Pull" | "Climb" | "Combo" | "Kick" | "Arc" | "Fold";
export type RunGameBlockerId = "LT" | "LG" | "C" | "RG" | "RT" | "TE" | "H";
export type RunGameFormationId = "doubles" | "dog" | "trips" | "trey";
export type RunGamePlayerId = RunGameBlockerId | "H" | "QB" | "RB" | "WDE" | "N" | "T" | "SDE" | "M" | "W" | "Ni" | "BS";

export type RunGamePlayer = {
  id: RunGamePlayerId;
  label: string;
  x: number;
  y: number;
  group: RunGamePlayerGroup;
};

export type RunGamePath = {
  id: string;
  playerId: RunGameBlockerId | "QB" | "RB";
  label: string;
  points: { x: number; y: number }[];
  dashed?: boolean;
};

export type RunGameScheme = {
  id: string;
  name: string;
  runDirection: RunGameSide;
  family: "outside_zone" | "power" | "counter";
  description: string;
  assignments: RunGameAssignments;
};

export type RunGameAssignments = Partial<Record<RunGameBlockerId, RunGameBlockType>>;

export type RunGameFormation = {
  id: RunGameFormationId;
  name: string;
  baseCall: "Doubles" | "Dog" | "Trips" | "Trey";
};

export type RunGameFront = {
  id: RunGameFrontId;
  name: string;
};

export const RUN_GAME_FORMATIONS: RunGameFormation[] = [
  { id: "doubles", name: "Doubles", baseCall: "Doubles" },
  { id: "dog", name: "Dog", baseCall: "Dog" },
  { id: "trips", name: "Trips", baseCall: "Trips" },
  { id: "trey", name: "Trey", baseCall: "Trey" },
];

export const RUN_GAME_FRONTS: RunGameFront[] = [
  { id: "even_over", name: "Even (Over)" },
  { id: "even_under", name: "Even (Under)" },
];

export const RUN_GAME_BLOCKERS: RunGameBlockerId[] = ["LT", "LG", "C", "RG", "RT", "TE", "H"];
const RUN_GAME_FRONT_DEFENDERS: RunGamePlayerId[] = ["WDE", "N", "T", "SDE"];

export const RUN_GAME_BLOCK_OPTIONS: RunGameBlockType[] = [
  "Arc",
  "Base",
  "Climb",
  "Combo",
  "Down",
  "Fold",
  "Kick",
  "Pull",
  "Reach",
];

export const RUN_GAME_SCHEMES: RunGameScheme[] = [
  {
    id: "outside_zone_strong",
    name: "OZ Strong",
    runDirection: "right",
    family: "outside_zone",
    description: "Front works aggressive reach tracks with the TE arcing or reaching outside.",
    assignments: {
      LT: "Reach",
      LG: "Reach",
      C: "Reach",
      RG: "Reach",
      RT: "Reach",
      TE: "Arc",
    },
  },
  {
    id: "outside_zone_weak",
    name: "OZ Weak",
    runDirection: "left",
    family: "outside_zone",
    description: "Outside zone away from the TE surface with the backside end left for boot.",
    assignments: {
      LT: "Reach",
      LG: "Reach",
      C: "Reach",
      RG: "Reach",
      RT: "Reach",
      TE: "Climb",
    },
  },
  {
    id: "power_strong",
    name: "Power Strong",
    runDirection: "right",
    family: "power",
    description: "Playside works down/base rules while the backside guard pulls and kicks the EMOL.",
    assignments: {
      LT: "Fold",
      LG: "Pull",
      C: "Down",
      RG: "Combo",
      RT: "Combo",
      TE: "Arc",
    },
  },
  {
    id: "power_weak",
    name: "Power Weak",
    runDirection: "left",
    family: "power",
    description: "Power away from the TE surface with the backside guard pulling to the weak edge.",
    assignments: {
      LT: "Combo",
      LG: "Combo",
      C: "Down",
      RG: "Pull",
      RT: "Fold",
      TE: "Base",
    },
  },
  {
    id: "counter_strong",
    name: "Counter Strong",
    runDirection: "right",
    family: "counter",
    description: "Counter back to the TE surface with two pullers and frontside combo rules.",
    assignments: {
      LT: "Fold",
      LG: "Pull",
      C: "Down",
      RG: "Combo",
      RT: "Combo",
      TE: "Pull",
    },
  },
  {
    id: "counter_weak",
    name: "Counter Weak",
    runDirection: "left",
    family: "counter",
    description: "Backside action with two pullers and a counter path from the back.",
    assignments: {
      LT: "Down",
      LG: "Climb",
      C: "Down",
      RG: "Pull",
      RT: "Pull",
      TE: "Kick",
    },
  },
];

export function getRunGameScheme(schemeId: string) {
  return RUN_GAME_SCHEMES.find((scheme) => scheme.id === schemeId) ?? RUN_GAME_SCHEMES[0];
}

export function getRunGameFormation(formationId: string) {
  return RUN_GAME_FORMATIONS.find((formation) => formation.id === formationId) ?? RUN_GAME_FORMATIONS[0];
}

export function getRunGameFront(frontId: string) {
  return RUN_GAME_FRONTS.find((front) => front.id === frontId) ?? RUN_GAME_FRONTS[0];
}

function transformAlignmentPoint(point: { x: number; y: number }) {
  // Alignment mode uses the normal formation surface. Run Game widens the OL,
  // so scale defensive landmarks away from center to stay tied to the widened gaps.
  return {
    x: Math.max(8, Math.min(92, 50 + (point.x - 50) * 1.5)),
    y: Math.max(10, Math.min(82, 92 - point.y)),
  };
}

function getOppositeRunGameSide(side: RunGameSide): RunGameSide {
  return side === "right" ? "left" : "right";
}

function applyRunGameDeSurfaceOverride(
  answerKey: Record<string, { x: number; y: number }>,
  alignmentFormation: ReturnType<typeof buildFoothillFormation>,
  runGameOffense: RunGamePlayer[],
) {
  const applyOverride = (defenderId: "SDE" | "WDE", side: RunGameSide) => {
    const hasInline = Boolean(getInlineSurface(alignmentFormation, side));
    const hasWing = Boolean(getWingSurface(alignmentFormation, side));

    const awayFromCenter = side === "right" ? 1 : -1;
    const runGameTe = runGameOffense.find((player) => player.id === "TE");
    const runGameWing = runGameOffense.find((player) => player.id === "H" && (side === "right" ? player.x > 50 : player.x < 50));
    if (!hasInline && !hasWing) {
      const runGameTackle = runGameOffense.find((player) => player.id === (side === "right" ? "RT" : "LT"));
      if (!runGameTackle) return;
      const targetX = runGameTackle.x + awayFromCenter * 5.8;
      answerKey[defenderId] = {
        x: 50 + (targetX - 50) / 1.5,
        y: answerKey[defenderId]?.y ?? 47,
      };
      return;
    }

    const surfacePlayer = hasWing && (!hasInline || defenderId === "WDE")
      ? runGameWing
      : runGameTe;
    if (!surfacePlayer) return;

    const offset = defenderId === "SDE" && hasInline && hasWing ? 8.8 : 4.8;
    const targetX = surfacePlayer.x + awayFromCenter * offset;
    answerKey[defenderId] = {
      x: 50 + (targetX - 50) / 1.5,
      y: answerKey[defenderId]?.y ?? 47,
    };
  };

  const sdeSide = alignmentFormation.runStrength as RunGameSide;
  const wdeSide = getOppositeRunGameSide(sdeSide);
  applyOverride("SDE", sdeSide);
  applyOverride("WDE", wdeSide);
}

function setRunGameFrontTechnique(
  answerKey: Record<string, { x: number; y: number }>,
  defenderId: "N" | "T",
  displayX: number,
) {
  answerKey[defenderId] = {
    x: 50 + (displayX - 50) / 1.5,
    y: answerKey[defenderId]?.y ?? 47,
  };
}

function applyRunGameFrontOverride(
  answerKey: Record<string, { x: number; y: number }>,
  frontId: RunGameFrontId,
  alignmentFormation: ReturnType<typeof buildFoothillFormation>,
) {
  if (frontId !== "even_under") return;

  const strengthDirection = alignmentFormation.runStrength === "right" ? 1 : -1;
  const weakDirection = -strengthDirection;
  setRunGameFrontTechnique(answerKey, "N", 50 + strengthDirection * 4.8);
  setRunGameFrontTechnique(answerKey, "T", 50 + weakDirection * 13.2);
}

function getRunGameOffensePlayers(formation: RunGameFormation): RunGamePlayer[] {
  const players: RunGamePlayer[] = [
    { id: "LT", label: "LT", x: 32, y: 56, group: "offense" },
    { id: "LG", label: "LG", x: 41, y: 56, group: "offense" },
    { id: "C", label: "C", x: 50, y: 56, group: "offense" },
    { id: "RG", label: "RG", x: 59, y: 56, group: "offense" },
    { id: "RT", label: "RT", x: 68, y: 56, group: "offense" },
    { id: "TE", label: "TE", x: 78, y: 60, group: "offense" },
    { id: "QB", label: "QB", x: 50, y: 66, group: "offense" },
    { id: "RB", label: "RB", x: 50, y: 77, group: "offense" },
  ];

  if (formation.id === "dog") {
    players.push({ id: "H", label: "H", x: 23, y: 60, group: "offense" });
  } else if (formation.id === "trips") {
    const te = players.find((player) => player.id === "TE")!;
    players.push({ id: "H", label: "H", x: te.x + 7.4, y: 60, group: "offense" });
  }

  return players;
}

function getRunGameDefensePlayers(formation: RunGameFormation, frontId: RunGameFrontId): RunGamePlayer[] {
  const alignmentFormation = buildFoothillFormation(`${formation.baseCall} Right`);
  const landmarks = getAlignmentLandmarks(alignmentFormation);
  const answerKey = getAlignmentAnswerKey(alignmentFormation, landmarks, "4-4");
  const runGameOffense = getRunGameOffensePlayers(formation);
  applyRunGameFrontOverride(answerKey, frontId, alignmentFormation);
  applyRunGameDeSurfaceOverride(answerKey, alignmentFormation, runGameOffense);
  const nickelDisplacedBySlot = formation.id === "doubles" || formation.id === "trey";
  const mapAnswer = (
    sourceId: string,
    id: RunGamePlayerId,
    label: string,
  ): RunGamePlayer | null => {
    const point = answerKey[sourceId];
    if (!point) return null;
    return {
      id,
      label,
      ...transformAlignmentPoint(point),
      group: "defense",
    };
  };

  const defensePlayers = [
    mapAnswer("WDE", "WDE", "WDE"),
    mapAnswer("N", "N", "N"),
    mapAnswer("T", "T", "T"),
    mapAnswer("SDE", "SDE", "SDE"),
    mapAnswer("M", "M", "Mike"),
    mapAnswer("W", "W", "Will"),
    nickelDisplacedBySlot ? null : mapAnswer("Ni", "Ni", "Ni"),
    mapAnswer("BS", "BS", "BS"),
  ].filter(Boolean) as RunGamePlayer[];

  return defensePlayers;
}

export function getRunGamePlayers(
  formationId: string = RUN_GAME_FORMATIONS[0].id,
  frontId: RunGameFrontId = "even_over",
): RunGamePlayer[] {
  const formation = getRunGameFormation(formationId);
  return [
    ...getRunGameOffensePlayers(formation),
    ...getRunGameDefensePlayers(formation, frontId),
  ];
}

function runGamePlayerById(players: RunGamePlayer[], id: string) {
  return players.find((player) => player.id === id);
}

function isDefenderInWindow(defender: RunGamePlayer | undefined, leftX: number, rightX: number) {
  if (!defender) return false;
  return defender.x >= Math.min(leftX, rightX) - 1.2 && defender.x <= Math.max(leftX, rightX) + 1.2;
}

function isCoveredBy(defender: RunGamePlayer | undefined, blocker: RunGamePlayer | undefined, threshold = 4.8) {
  if (!defender || !blocker) return false;
  return Math.abs(defender.x - blocker.x) <= threshold;
}

function getBacksideClimberId(players: RunGamePlayer[], runRight: boolean): RunGameBlockerId | null {
  const backsideEnd = runGamePlayerById(players, runRight ? "WDE" : "SDE");
  if (!backsideEnd) return null;

  return RUN_GAME_BLOCKERS
    .map((id) => runGamePlayerById(players, id))
    .filter((player): player is RunGamePlayer & { id: RunGameBlockerId } => Boolean(player))
    .filter((player) => runRight ? player.x < 50 : player.x > 50)
    .sort((a, b) => Math.abs(a.x - backsideEnd.x) - Math.abs(b.x - backsideEnd.x))[0]?.id ?? null;
}

function getOrderedRunGameBlockers(players: RunGamePlayer[]) {
  return RUN_GAME_BLOCKERS
    .map((id) => runGamePlayerById(players, id))
    .filter((player): player is RunGamePlayer & { id: RunGameBlockerId } => Boolean(player))
    .sort((a, b) => a.x - b.x);
}

function getAdjacentBlocker(
  blockers: Array<RunGamePlayer & { id: RunGameBlockerId }>,
  blocker: RunGamePlayer & { id: RunGameBlockerId },
  direction: 1 | -1,
) {
  const index = blockers.findIndex((candidate) => candidate.id === blocker.id);
  return blockers[index + direction];
}

function getDefenderInGap(
  players: RunGamePlayer[],
  blocker: RunGamePlayer,
  teammate: RunGamePlayer | undefined,
) {
  if (!teammate) return undefined;
  const leftX = Math.min(blocker.x, teammate.x);
  const rightX = Math.max(blocker.x, teammate.x);
  const gapMidpoint = (leftX + rightX) / 2;

  return RUN_GAME_FRONT_DEFENDERS
    .map((id) => runGamePlayerById(players, id))
    .filter((player): player is RunGamePlayer => Boolean(player))
    .filter((player) => player.x >= leftX - 0.8 && player.x <= rightX + 0.8)
    .sort((a, b) => Math.abs(a.x - gapMidpoint) - Math.abs(b.x - gapMidpoint))[0];
}

function isBacksideCoreSkill(player: RunGamePlayer & { id: RunGameBlockerId }, runRight: boolean) {
  if (player.id !== "TE" && player.id !== "H") return false;
  return runRight ? player.x < 50 : player.x > 50;
}

function isEmolBlocker(
  blockers: Array<RunGamePlayer & { id: RunGameBlockerId }>,
  blocker: RunGamePlayer & { id: RunGameBlockerId },
  playDirection: 1 | -1,
) {
  return !getAdjacentBlocker(blockers, blocker, playDirection);
}

function getLineRoleIds(runRight: boolean) {
  return runRight
    ? { pst: "RT", psg: "RG", center: "C", bsg: "LG", bst: "LT" } as const
    : { pst: "LT", psg: "LG", center: "C", bsg: "RG", bst: "RT" } as const;
}

function getCoreSkillBlockersOnSide(players: RunGamePlayer[], side: RunGameSide) {
  return (["TE", "H"] as const)
    .map((id) => runGamePlayerById(players, id))
    .filter((player): player is RunGamePlayer & { id: "TE" | "H" } => Boolean(player))
    .filter((player) => side === "right" ? player.x > 50 : player.x < 50)
    .sort((a, b) => side === "right" ? b.x - a.x : a.x - b.x);
}

function assignComboPair(assignments: RunGameAssignments, first: RunGameBlockerId, second: RunGameBlockerId) {
  assignments[first] = "Combo";
  assignments[second] = "Combo";
}

function assignOutsideZoneCoreSurface(
  assignments: RunGameAssignments,
  players: RunGamePlayer[],
  runRight: boolean,
) {
  const playSide = runRight ? "right" : "left";
  const backSide = runRight ? "left" : "right";
  const playsideCore = getCoreSkillBlockersOnSide(players, playSide);
  const backsideCore = getCoreSkillBlockersOnSide(players, backSide);

  playsideCore.forEach((player, index) => {
    assignments[player.id] = index === 0 ? "Reach" : "Climb";
  });

  backsideCore.forEach((player, index) => {
    assignments[player.id] = index === 0 ? "Reach" : "Climb";
  });
}

function getGapDefenderBetween(players: RunGamePlayer[], firstId: RunGameBlockerId, secondId: RunGameBlockerId) {
  const first = runGamePlayerById(players, firstId);
  const second = runGamePlayerById(players, secondId);
  return first && second ? getDefenderInGap(players, first, second) : undefined;
}

function hasEdgeThreat(players: RunGamePlayer[], blocker: RunGamePlayer, side: RunGameSide) {
  const edgeDefender = side === "right"
    ? runGamePlayerById(players, "SDE")
    : runGamePlayerById(players, "WDE");
  if (!edgeDefender) return false;
  return side === "right"
    ? edgeDefender.x >= blocker.x - 8
    : edgeDefender.x <= blocker.x + 8;
}

function assignEmol(
  assignments: RunGameAssignments,
  players: RunGamePlayer[],
  blockerId: RunGameBlockerId,
  side: RunGameSide,
) {
  const blocker = runGamePlayerById(players, blockerId);
  if (!blocker) return;
  if (assignments[blockerId] === "Combo") return;
  assignments[blockerId] = hasEdgeThreat(players, blocker, side) ? "Reach" : "Climb";
}

function isSkillBlockerId(id: RunGameBlockerId) {
  return id === "TE" || id === "H";
}

function getUniversalOutsideZoneAssignments(
  scheme: RunGameScheme,
  formationId: string,
  frontId: RunGameFrontId,
): RunGameAssignments {
  const players = getRunGamePlayers(formationId, frontId);
  const runRight = scheme.runDirection === "right";
  const playSide = runRight ? "right" : "left";
  const backSide = runRight ? "left" : "right";
  const roles = getLineRoleIds(runRight);
  const playsideCore = getCoreSkillBlockersOnSide(players, playSide);
  const backsideCore = getCoreSkillBlockersOnSide(players, backSide);
  const playEmol = playsideCore[0]?.id ?? roles.pst;
  const backsideEmol = backsideCore[0]?.id;
  const assignments: RunGameAssignments = {};

  if (formationId === "trips" && scheme.id === "outside_zone_strong" && playsideCore.some((player) => player.id === "TE") && playsideCore.some((player) => player.id === "H")) {
    assignComboPair(assignments, "TE", "H");
  }

  assignEmol(assignments, players, playEmol, playSide);
  if (backsideEmol) assignEmol(assignments, players, backsideEmol, backSide);

  const maybeComboPair = (first: RunGameBlockerId, second: RunGameBlockerId) => {
    if (assignments[first] && isSkillBlockerId(first)) return false;
    if (assignments[second] && isSkillBlockerId(second)) return false;
    assignComboPair(assignments, first, second);
    return true;
  };

  if (!assignments[roles.pst]) {
    if (getGapDefenderBetween(players, roles.pst, roles.psg)) {
      maybeComboPair(roles.pst, roles.psg);
    } else {
      assignments[roles.pst] = "Climb";
    }
  }

  if (!assignments[roles.psg]) {
    if (getGapDefenderBetween(players, roles.psg, roles.pst)) {
      maybeComboPair(roles.psg, roles.pst);
    } else if (getGapDefenderBetween(players, roles.psg, roles.center)) {
      maybeComboPair(roles.psg, roles.center);
    } else {
      assignments[roles.psg] = "Climb";
    }
  }

  if (!assignments[roles.center]) {
    if (getGapDefenderBetween(players, roles.center, roles.psg)) {
      maybeComboPair(roles.center, roles.psg);
    } else if (getGapDefenderBetween(players, roles.center, roles.bsg)) {
      maybeComboPair(roles.center, roles.bsg);
    } else {
      assignments[roles.center] = "Climb";
    }
  }

  if (!assignments[roles.bsg]) {
    if (getGapDefenderBetween(players, roles.bsg, roles.center)) {
      maybeComboPair(roles.bsg, roles.center);
    } else if (getGapDefenderBetween(players, roles.bsg, roles.bst)) {
      maybeComboPair(roles.bsg, roles.bst);
    } else {
      assignments[roles.bsg] = "Climb";
    }
  }

  if (!assignments[roles.bst]) {
    assignments[roles.bst] = getGapDefenderBetween(players, roles.bst, roles.bsg) ? "Reach" : "Climb";
  }

  playsideCore.slice(1).forEach((player) => {
    if (!assignments[player.id]) assignments[player.id] = "Climb";
  });
  backsideCore.slice(1).forEach((player) => {
    if (!assignments[player.id]) assignments[player.id] = "Climb";
  });

  return assignments;
}

function isHOnRunSide(players: RunGamePlayer[], runRight: boolean) {
  const h = runGamePlayerById(players, "H");
  if (!h) return false;
  return runRight ? h.x > 50 : h.x < 50;
}

function isHOnPullSide(players: RunGamePlayer[], runRight: boolean) {
  const h = runGamePlayerById(players, "H");
  if (!h) return false;
  return runRight ? h.x < 50 : h.x > 50;
}

function getOutsideZoneAssignments(scheme: RunGameScheme, formationId: string, frontId: RunGameFrontId): RunGameAssignments {
  return getUniversalOutsideZoneAssignments(scheme, formationId, frontId);
}

function getPowerAssignments(scheme: RunGameScheme, formationId: string): RunGameAssignments {
  const players = getRunGamePlayers(formationId);
  const hRunside = isHOnRunSide(players, scheme.runDirection === "right");

  if (scheme.runDirection === "left") {
    if (formationId === "trips") {
      return {
        LT: "Combo",
        LG: "Combo",
        C: "Down",
        RG: "Pull",
        RT: "Fold",
        TE: "Climb",
        H: "Down",
      };
    }

    return {
      LT: "Combo",
      LG: "Combo",
      C: "Down",
      RG: "Pull",
      RT: "Fold",
      TE: "Base",
      ...(hRunside ? { H: "Climb" as RunGameBlockType } : {}),
    };
  }

  if (formationId === "dog") {
    return {
      LT: "Down",
      LG: "Pull",
      C: "Down",
      RG: "Combo",
      RT: "Combo",
      TE: "Arc",
      H: "Fold",
    };
  }

  return {
    LT: "Fold",
    LG: "Pull",
    C: "Down",
    RG: "Combo",
    RT: "Combo",
    TE: formationId === "trips" || formationId === "trey" ? "Climb" : "Arc",
    ...(hRunside ? { H: "Climb" as RunGameBlockType } : {}),
  };
}

function getCounterAssignments(scheme: RunGameScheme, formationId: string): RunGameAssignments {
  const players = getRunGamePlayers(formationId);
  const runRight = scheme.runDirection === "right";
  const hRunside = isHOnRunSide(players, runRight);
  const hOnPullSideWithTe = formationId === "trips" && isHOnPullSide(players, runRight);

  if (scheme.runDirection === "right") {
    if (formationId === "dog") {
      return {
        LT: "Fold",
        LG: "Pull",
        C: "Down",
        RG: "Combo",
        RT: "Combo",
        TE: "Climb",
        H: "Pull",
      };
    }

    return {
      LT: "Fold",
      LG: "Pull",
      C: "Down",
      RG: "Combo",
      RT: "Combo",
      TE: "Pull",
      ...(hRunside ? { H: "Climb" as RunGameBlockType } : {}),
    };
  }

  return {
    LT: "Combo",
    LG: "Combo",
    C: "Down",
    RG: "Pull",
    RT: "Fold",
    TE: "Pull",
    ...(hOnPullSideWithTe
      ? { H: "Down" as RunGameBlockType }
      : hRunside
        ? { H: "Climb" as RunGameBlockType }
        : {}),
  };
}

export function getRunGameAnswerAssignments(
  scheme: RunGameScheme,
  formationId: string,
  frontId: RunGameFrontId = "even_over",
): RunGameAssignments {
  if (scheme.family === "outside_zone") {
    return getOutsideZoneAssignments(scheme, formationId, frontId);
  }

  if (scheme.family === "power") {
    return getPowerAssignments(scheme, formationId);
  }

  if (scheme.family === "counter") {
    return getCounterAssignments(scheme, formationId);
  }

  return scheme.assignments;
}

export function getRunGameQuizResult(
  scheme: RunGameScheme,
  answers: Partial<Record<RunGameBlockerId, RunGameBlockType>>,
  correctAssignments: RunGameAssignments = scheme.assignments,
) {
  const expectedIds = RUN_GAME_BLOCKERS.filter((id) => Boolean(correctAssignments[id]));
  const correctIds = expectedIds.filter((id) => answers[id] === correctAssignments[id]);
  const incorrectIds = expectedIds.filter((id) => answers[id] && answers[id] !== correctAssignments[id]);
  const unansweredIds = expectedIds.filter((id) => !answers[id]);
  return {
    correctIds,
    incorrectIds,
    unansweredIds,
    score: correctIds.length,
    total: expectedIds.length,
    isPerfect: correctIds.length === expectedIds.length,
  };
}
