import {
  RUN_GAME_BLOCKERS,
  type RunGameBlockType,
  type RunGameBlockerId,
  type RunGameFrontId,
  type RunGamePath,
  type RunGamePlayer,
  type RunGameScheme,
  getRunGamePlayers,
} from "@/lib/runGame/runGameLogic";

const LOS_Y = 56;
const PLAYER_RADIUS = 4.2;

function playerById(players: RunGamePlayer[], id: string) {
  return players.find((player) => player.id === id);
}

function dirMultiplier(direction: "left" | "right") {
  return direction === "right" ? 1 : -1;
}

function firstPlayerById(players: RunGamePlayer[], ids: string[]) {
  return ids.map((id) => playerById(players, id)).find(Boolean);
}

function getNextLinebackerToward(
  players: RunGamePlayer[],
  fromX: number,
  direction: 1 | -1,
) {
  return players
    .filter((player) => ["Ni", "M", "W", "BS"].includes(player.id))
    .filter((player) => direction === 1 ? player.x > fromX : player.x < fromX)
    .sort((a, b) => Math.abs(a.x - fromX) - Math.abs(b.x - fromX))[0];
}

function getNearestLinebackerOnSide(players: RunGamePlayer[], fromX: number) {
  const sideDirection = fromX >= 50 ? 1 : -1;
  return players
    .filter((player) => ["Ni", "M", "W", "BS"].includes(player.id))
    .filter((player) => sideDirection === 1 ? player.x > 50 : player.x < 50)
    .sort((a, b) => Math.abs(a.x - fromX) - Math.abs(b.x - fromX))[0]
    ?? getNextLinebackerToward(players, fromX, -sideDirection as 1 | -1);
}

function getMostOutsideLinebackerOnPlaySide(players: RunGamePlayer[], runDirection: "left" | "right") {
  const playDirection = dirMultiplier(runDirection);
  return players
    .filter((player) => ["Ni", "M", "W", "BS"].includes(player.id))
    .filter((player) => playDirection === 1 ? player.x > 50 : player.x < 50)
    .sort((a, b) => playDirection === 1 ? b.x - a.x : a.x - b.x)[0];
}

function getRunGameSchemeFamily(schemeId: string) {
  if (schemeId.startsWith("outside_zone")) return "outside_zone";
  if (schemeId.startsWith("power")) return "power";
  if (schemeId.startsWith("counter")) return "counter";
  return schemeId;
}

function pointAtCircleEdge(from: { x: number; y: number }, target: RunGamePlayer, margin = 0.2) {
  const dx = target.x - from.x;
  const dy = target.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const stopDistance = PLAYER_RADIUS + margin;
  return {
    x: target.x - (dx / length) * stopDistance,
    y: target.y - (dy / length) * stopDistance,
  };
}

function trimPathEndToPlayerEdge(points: { x: number; y: number }[], players: RunGamePlayer[]) {
  if (points.length < 2) return points;
  const finalPoint = points[points.length - 1];
  const target = players.find((player) => {
    const distance = Math.hypot(player.x - finalPoint.x, player.y - finalPoint.y);
    return distance <= PLAYER_RADIUS + 1.2;
  });

  if (!target) return points;

  const previousPoint = points[points.length - 2];
  return [
    ...points.slice(0, -1),
    pointAtCircleEdge(previousPoint, target),
  ];
}

const RUN_GAME_FRONT_DEFENDER_IDS = ["WDE", "N", "T", "SDE"];

function getOrderedRunGameBlockers(players: RunGamePlayer[]) {
  return RUN_GAME_BLOCKERS
    .map((id) => playerById(players, id))
    .filter((player): player is RunGamePlayer & { id: RunGameBlockerId } => Boolean(player))
    .sort((a, b) => a.x - b.x);
}

function getFrontDefenderBetween(
  players: RunGamePlayer[],
  first: RunGamePlayer,
  second: RunGamePlayer,
) {
  const leftX = Math.min(first.x, second.x);
  const rightX = Math.max(first.x, second.x);
  const midpoint = (leftX + rightX) / 2;

  return RUN_GAME_FRONT_DEFENDER_IDS
    .map((id) => playerById(players, id))
    .filter((player): player is RunGamePlayer => Boolean(player))
    .filter((player) => player.x >= leftX - 0.8 && player.x <= rightX + 0.8)
    .sort((a, b) => Math.abs(a.x - midpoint) - Math.abs(b.x - midpoint))[0];
}

function getOutsideZoneComboTargetIds(
  playerId: string,
  runDirection: "left" | "right",
  formationId: string,
  frontId: RunGameFrontId,
  schemeId: string,
) {
  const players = getRunGamePlayers(formationId, frontId);
  if (schemeId === "outside_zone_strong" && formationId === "trips" && (playerId === "TE" || playerId === "H")) {
    return {
      fitId: "SDE",
      backerIds: ["Ni", "BS", "W", "M"],
      climberId: "H",
    };
  }

  const blockers = getOrderedRunGameBlockers(players);
  const blocker = blockers.find((candidate) => candidate.id === playerId);
  if (!blocker) return null;

  const index = blockers.findIndex((candidate) => candidate.id === blocker.id);
  const adjacentPairs = [blockers[index - 1], blockers[index + 1]]
    .filter((candidate): candidate is RunGamePlayer & { id: RunGameBlockerId } => Boolean(candidate))
    .filter((candidate) => {
      const blockerIsCoreSkill = blocker.id === "TE" || blocker.id === "H";
      const candidateIsCoreSkill = candidate.id === "TE" || candidate.id === "H";
      return blockerIsCoreSkill ? candidateIsCoreSkill : !candidateIsCoreSkill;
    })
    .map((teammate) => ({
      teammate,
      fit: getFrontDefenderBetween(players, blocker, teammate),
    }))
    .filter((candidate): candidate is {
      teammate: RunGamePlayer & { id: RunGameBlockerId };
      fit: RunGamePlayer;
    } => Boolean(candidate.fit))
    .sort((a, b) => Math.abs(a.fit.x - blocker.x) - Math.abs(b.fit.x - blocker.x));

  const comboPair = adjacentPairs[0];
  if (!comboPair) return null;

  const playDirection = dirMultiplier(runDirection);
  const climber = playDirection === 1
    ? (blocker.x > comboPair.teammate.x ? blocker : comboPair.teammate)
    : (blocker.x < comboPair.teammate.x ? blocker : comboPair.teammate);
  const backerIdsByFit: Record<string, string[]> = schemeId === "outside_zone_strong" && formationId === "dog"
    ? {
        WDE: ["W", "M", "Ni", "BS"],
        N: ["W", "M"],
        T: ["BS", "Ni", "W", "M"],
        SDE: ["BS", "Ni", "W", "M"],
      }
    : schemeId === "outside_zone_strong"
    ? {
        WDE: ["W", "M", "Ni", "BS"],
        N: ["W", "M"],
        T: ["Ni", "BS", "W", "M"],
        SDE: ["Ni", "BS", "W", "M"],
      }
    : schemeId === "outside_zone_weak"
      ? {
          WDE: ["BS", "Ni", "M", "W"],
          N: ["M", "W"],
          T: ["M", "W"],
          SDE: ["M", "W", "BS", "Ni"],
        }
    : {
    WDE: ["Ni", "M", "W", "BS"],
    N: ["M", "W"],
    T: ["W", "M"],
    SDE: ["W", "M", "Ni", "BS"],
      };

  return {
    fitId: comboPair.fit.id,
    backerIds: backerIdsByFit[comboPair.fit.id] ?? (playDirection === 1 ? ["W", "M"] : ["M", "W"]),
    climberId: climber.id,
  };
}

function getComboTargetIds(
  playerId: string,
  runDirection: "left" | "right",
  schemeId: string,
  formationId: string,
  frontId: RunGameFrontId,
) {
  const schemeFamily = getRunGameSchemeFamily(schemeId);

  if (schemeFamily === "outside_zone") {
    const zoneTarget = getOutsideZoneComboTargetIds(playerId, runDirection, formationId, frontId, schemeId);
    if (zoneTarget) return zoneTarget;
  }

  if (schemeFamily === "outside_zone" && runDirection === "right") {
    if (playerId === "LG" || playerId === "C") {
      return { fitId: "N", backerIds: ["M", "W"], climberId: "C" };
    }

    if (formationId === "dog" && (playerId === "RT" || playerId === "TE")) {
      return { fitId: "SDE", backerIds: ["W", "M", "BS", "Ni"], climberId: "RT" };
    }

    if (formationId === "trips" && (playerId === "RG" || playerId === "RT")) {
      return { fitId: "T", backerIds: ["M"], climberId: "RG" };
    }

    if (formationId === "trips" && (playerId === "TE" || playerId === "H")) {
      return { fitId: "SDE", backerIds: ["Ni", "BS", "M"], climberId: "H" };
    }
  }

  if (schemeFamily === "outside_zone" && runDirection === "left") {
    if (formationId === "dog" && (playerId === "LT" || playerId === "H")) {
      return { fitId: "WDE", backerIds: ["Ni", "M", "W", "BS"], climberId: "H" };
    }

    if (playerId === "LG" || playerId === "C") {
      return { fitId: "N", backerIds: ["M", "W"], climberId: "LG" };
    }

    if (playerId === "RG" || playerId === "RT") {
      return { fitId: "T", backerIds: ["W", "M"], climberId: "RG" };
    }

    if (playerId === "LT") {
      return { fitId: "WDE", backerIds: ["Ni", "M", "W"], climberId: "LT" };
    }
  }

  if ((schemeFamily === "power" || schemeFamily === "counter") && runDirection === "right") {
    return { fitId: "T", backerIds: ["W", "BS", "M"], climberId: "RG" };
  }

  if ((schemeFamily === "power" || schemeFamily === "counter") && runDirection === "left") {
    return { fitId: "N", backerIds: ["M", "Ni", "W"], climberId: "LG" };
  }

  if (runDirection === "right") {
    return { fitId: "T", backerIds: ["M", "W"], climberId: "RG" };
  }

  return { fitId: "N", backerIds: ["W", "M"], climberId: "LG" };
}

export function buildRunGamePath(
  player: RunGamePlayer,
  blockType: RunGameBlockType,
  runDirection: "left" | "right",
  schemeId = "",
  formationId = "",
  frontId: RunGameFrontId = "even_over",
): RunGamePath[] {
  const d = dirMultiplier(runDirection);
  const start = { x: player.x, y: player.y - 4.5 };
  const awayFromRun = -d;
  const schemeFamily = getRunGameSchemeFamily(schemeId);

  if (blockType === "Combo") {
    const players = getRunGamePlayers(formationId, frontId);
    const comboTargets = getComboTargetIds(player.id, runDirection, schemeId, formationId, frontId);
    const comboFitPlayer = playerById(players, comboTargets.fitId);
    const comboDefender = comboFitPlayer
      ? pointAtCircleEdge(start, comboFitPlayer)
      : { x: runDirection === "right" ? 61.5 : 45.5, y: LOS_Y - 7 };
    const preferredZoneBacker = schemeFamily === "outside_zone"
      ? firstPlayerById(players, comboTargets.backerIds)
      : undefined;
    const directionalBacker = comboFitPlayer && schemeFamily === "outside_zone"
      ? preferredZoneBacker ?? getNextLinebackerToward(players, comboFitPlayer.x, d as 1 | -1)
      : comboFitPlayer && (schemeFamily === "power" || schemeFamily === "counter")
        ? getNextLinebackerToward(players, comboFitPlayer.x, -d as 1 | -1)
        : undefined;
    const comboBacker = directionalBacker ?? firstPlayerById(players, comboTargets.backerIds) ?? { x: 50, y: LOS_Y - 28 };
    const comboClimbStart = comboFitPlayer
      ? pointAtCircleEdge(comboBacker, comboFitPlayer)
      : comboDefender;
    const comboBackerEdge = firstPlayerById(players, comboTargets.backerIds)
      ? pointAtCircleEdge(comboClimbStart, comboBacker as RunGamePlayer)
      : comboBacker;
    const isComboClimber = player.id === comboTargets.climberId;
    const comboPaths: RunGamePath[] = [
      {
        id: `${player.id}-Combo-fit`,
        playerId: player.id as RunGameBlockerId,
        label: isComboClimber ? "Combo" : "",
        points: [
          start,
          comboDefender,
        ],
      },
    ];

    if (isComboClimber) {
      comboPaths.push({
        id: `${player.id}-Combo-climb`,
        playerId: player.id as RunGameBlockerId,
        label: "",
        points: [
          comboClimbStart,
          comboBackerEdge,
        ],
        dashed: true,
      });
    }

    return comboPaths.map((path) => ({
      ...path,
      points: trimPathEndToPlayerEdge(path.points, players),
    }));
  }

  if (blockType === "Pull") {
    const players = getRunGamePlayers(formationId, frontId);
    const secondCounterPullerId = schemeId === "counter_strong"
      ? formationId === "dog" ? "H" : "TE"
      : "TE";
    const isSecondPuller = schemeFamily === "counter" && player.id === secondCounterPullerId;
    const target = isSecondPuller
      ? getMostOutsideLinebackerOnPlaySide(players, runDirection)
      : playerById(players, runDirection === "right" ? "SDE" : "WDE");
    const approach = {
      x: player.x + d * 13,
      y: player.y + 1.5,
    };
    const bGapEntry = {
      x: 50 + d * 17,
      y: LOS_Y - 3,
    };
    const finish = target
      ? pointAtCircleEdge(approach, target)
      : {
        x: player.x + d * 23,
        y: LOS_Y - 8,
      };
    const pullPoints = isSecondPuller
      ? [
          { x: player.x, y: player.y + 4.5 },
          { x: player.x + d * 7.5, y: player.y + 4.5 },
          bGapEntry,
          finish,
        ]
      : [
          { x: player.x, y: player.y + 4.5 },
          { x: player.x + d * 7.5, y: player.y + 4.5 },
          approach,
          finish,
        ];

    return [
      {
        id: `${player.id}-${isSecondPuller ? "Pull-climb" : "Pull-kick"}`,
        playerId: player.id as RunGameBlockerId,
        label: schemeFamily === "counter" ? (isSecondPuller ? "Pull 2" : "Pull 1") : "Pull",
        points: trimPathEndToPlayerEdge(pullPoints, players),
      },
    ];
  }

  const players = getRunGamePlayers(formationId, frontId);
  const climbTarget = blockType === "Climb" && schemeId === "counter_strong" && formationId === "dog" && player.id === "TE"
    ? playerById(players, "W")
    : blockType === "Climb" && schemeId === "outside_zone_strong" && formationId === "dog" && player.id === "H"
      ? playerById(players, "Ni")
    : blockType === "Climb" && schemeId === "counter_weak" && formationId === "dog" && player.id === "H"
      ? playerById(players, "M")
      : blockType === "Climb" && schemeFamily === "power" && player.id === "TE" && (formationId === "trips" || formationId === "trey")
        ? playerById(players, "M")
    : blockType === "Climb"
      ? getNearestLinebackerOnSide(players, player.x)
      : undefined;
  const climbFinish = climbTarget
    ? pointAtCircleEdge({ x: player.x, y: LOS_Y - 15 }, climbTarget)
    : { x: player.x + d * 1.8, y: LOS_Y - 27 };
  const pathByType: Record<RunGameBlockType, { x: number; y: number }[]> = {
    Down: [
      start,
      { x: player.x + awayFromRun * 3.4, y: LOS_Y - 8 },
    ],
    Reach: [
      start,
      { x: player.x + d * 2.2, y: LOS_Y - 6 },
      { x: player.x + d * 5.8, y: LOS_Y - 10 },
    ],
    Base: [
      start,
      { x: player.x, y: LOS_Y - 12 },
    ],
    Pull: [start],
    Climb: [
      start,
      { x: player.x, y: LOS_Y - 15 },
      climbFinish,
    ],
    Combo: [start],
    Kick: [
      { x: player.x, y: player.y + 4.2 },
      { x: player.x + d * 11, y: player.y + 3.5 },
      { x: player.x + d * 23, y: LOS_Y - 8 },
    ],
    Arc: [
      start,
      { x: player.x + d * 5, y: LOS_Y - 7 },
      { x: player.x + d * 9, y: LOS_Y - 22 },
    ],
    Fold: [
      { x: player.x, y: player.y - 2.5 },
      { x: player.x + d * 5.5, y: player.y - 2.5 },
      { x: player.x + d * 5.5, y: LOS_Y - 13 },
    ],
  };

  return [
    {
      id: `${player.id}-${blockType}`,
      playerId: player.id as RunGameBlockerId,
      label: blockType,
      points: trimPathEndToPlayerEdge(pathByType[blockType], players),
    },
  ];
}

export function buildRunGamePaths(
  scheme: RunGameScheme,
  assignments: Partial<Record<RunGameBlockerId, RunGameBlockType>> = scheme.assignments,
  revealCorrectIds: RunGameBlockerId[] = [],
  formationId = "",
  frontId: RunGameFrontId = "even_over",
) {
  const players = getRunGamePlayers(formationId, frontId);
  return RUN_GAME_BLOCKERS.flatMap((id) => {
    const player = playerById(players, id);
    const blockType = assignments[id];
    if (!player || !blockType) return [];
    const paths = buildRunGamePath(player, blockType, scheme.runDirection, scheme.id, formationId, frontId);
    return revealCorrectIds.includes(id)
      ? paths.map((path) => ({ ...path, id: `${path.id}-correct` }))
      : paths;
  });
}

export function buildRunGameRunPath(scheme: RunGameScheme, formationId = "", frontId: RunGameFrontId = "even_over"): RunGamePath {
  const players = getRunGamePlayers(formationId, frontId);
  const rb = playerById(players, "RB")!;
  const d = dirMultiplier(scheme.runDirection);
  return {
    id: "run-direction",
    playerId: "RB",
    label: scheme.runDirection === "right" ? "Run Right" : "Run Left",
    points: [
      { x: rb.x, y: rb.y - 4 },
      { x: rb.x + d * 9, y: rb.y - 13 },
    ],
  };
}

export function getRunGameBoardData(formationId = "", frontId: RunGameFrontId = "even_over") {
  return {
    players: getRunGamePlayers(formationId, frontId),
    blockers: RUN_GAME_BLOCKERS,
  };
}
