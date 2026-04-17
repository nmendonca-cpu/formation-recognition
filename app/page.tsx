"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock3, Shuffle, Trophy, User, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AppMode = "study" | "alignment" | "offense_build" | "quiz" | "editor" | "account";
type FrontMode = "4-3" | "4-4";
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

type CheckResult = {
  incorrectIds: string[];
  ghosts: PlayerDot[];
  isCorrect: boolean;
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
};

type UserRecord = {
  id: string;
  email: string;
  name: string;
  teamCode: string;
  isAdmin: boolean;
  stats: UserStats;
};

type LeaderboardEntry = {
  id: string;
  name: string;
  teamCode: string;
  stats: UserStats;
};


type CustomLandmarkDraft = {
  label: string;
  layer: "dl" | "lb" | "cb" | "db";
  side: Side;
  x: string;
  y: string;
};

type AnswerOverrideMap = Record<string, { x: number; y: number }>;

const MODE_OPTIONS: { value: AppMode; label: string; title: string }[] = [
  { value: "study", label: "Formation Trainer", title: "FORMATION TRAINER" },
  { value: "alignment", label: "Alignment Mode", title: "DEFENSIVE ALIGNMENT" },
  { value: "offense_build", label: "Offensive Mode", title: "OFFENSIVE FORMATION" },
  { value: "quiz", label: "Quiz Mode", title: "QUIZ MODE" },
  { value: "editor", label: "Formation Editor", title: "FORMATION EDITOR" },
  { value: "account", label: "Account / Leaderboard", title: "ACCOUNT / LEADERBOARD" },
];

const PLAYBOOK_OPTIONS: PlaybookKey[] = ["Foothill", "Pro", "Wing T"];
const PERSONNEL_OPTIONS = ["Any", "11", "12", "21"] as const;
const ALIGNMENT_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch", "B Trips", "B Trey", "B Doubles", "Quad", "Dog"] as const;
const ALIGNMENT_EMPTY_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch"] as const;
const CUSTOM_ALIGNMENT_LAYERS = ["dl", "lb", "cb", "db"] as const;
const ALIGNMENT_CALLS = [
  ...ALIGNMENT_BASE_CALLS.flatMap((base) => [
    `${base} Left`, `${base} Right`, `${base} Left King`, `${base} Right King`, `${base} Left Queen`, `${base} Right Queen`,
  ]),
  ...ALIGNMENT_EMPTY_BASE_CALLS.flatMap((base) => [`${base} Empty Left`, `${base} Empty Right`]),
] as const;
const WING_T_CALLS = [
  "Wing T Far Right", "Wing T Far Left",
  "Wing T Near Right", "Wing T Near Left",
  "Wing T Unbalanced Far Right", "Wing T Unbalanced Far Left",
  "Wing T Unbalanced Near Right", "Wing T Unbalanced Near Left",
] as const;
const PRO_CALLS = [
  "I Dot Right", "I Dot Left", "I Far Right", "I Far Left", "I Near Right", "I Near Left",
  "I Slot Right", "I Slot Left", "I Slot Far Right", "I Slot Far Left", "I Slot Near Right", "I Slot Near Left",
  "Ace Right", "Ace Left", "Ace Trey Right", "Ace Trey Left", "Flank Right", "Flank Left",
] as const;
const DEFENDER_TOKENS = ["N", "T", "SDE", "WDE", "M", "W", "Ni", "FC", "BC", "FS", "BS"] as const;
const OFFENSE_TOKENS = ["QB", "RB", "X", "Y", "H", "Z"] as const;
const FIXED_OL_IDS = ["LT", "LG", "C", "RG", "RT"] as const;

const TIGHT_OLINE_X = [40, 45, 50, 55, 60] as const;
const ALIGNMENT_OLINE_X = [38, 44, 50, 56, 62] as const;
const LOS_Y = 52;
const OFF_Y = 44;
const WING_Y = LOS_Y - (LOS_Y - OFF_Y) * 0.75;
const QB_UNDER_Y = 42;
const QB_GUN_Y = 24;
const RB_DOT_Y = 24;
const LB_Y = 66;
const CB_Y = 76;
const DB_Y = 86;
const DL_Y = 58;
const FIELD_LABELS = { left: "Left", right: "Right" } as const;
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
};

const ADMIN_EMAILS = [
  "nmendonca@pleasantonusd.net",
];

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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getLineXs(wide = false) {
  return wide ? ALIGNMENT_OLINE_X : TIGHT_OLINE_X;
}

function baseLine(wide = false): PlayerDot[] {
  const xs = getLineXs(wide);
  return [
    { id: "LT", x: xs[0], y: LOS_Y },
    { id: "LG", x: xs[1], y: LOS_Y },
    { id: "C", x: xs[2], y: LOS_Y },
    { id: "RG", x: xs[3], y: LOS_Y },
    { id: "RT", x: xs[4], y: LOS_Y },
  ];
}

function getWide(side: Side) {
  return side === "right" ? 92 : 8;
}

function getAttached(side: Side, wide = false) {
  const xs = getLineXs(wide);
  const attachSpacing = wide ? xs[1] - xs[0] : 4;
  return side === "right" ? xs[4] + attachSpacing : xs[0] - attachSpacing;
}

function getFlexTe(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 6 : -6);
}

function getWing(side: Side, wide = false) {
  const xs = getLineXs(wide);
  const olSpacing = xs[1] - xs[0];
  return getAttached(side, wide) + (side === "right" ? olSpacing * 0.25 : -olSpacing * 0.25);
}

function getBunchMiddle(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 3 : -3);
}

function getBunchOutside(side: Side, wide = false) {
  return getAttached(side, wide) + (side === "right" ? 6 : -6);
}

function getSlot(side: Side, wide = false) {
  return (getAttached(side, wide) + getWide(side)) / 2;
}

function getMidpoint(a: number, b: number) {
  return (a + b) / 2;
}

function isBackfieldEligible(p: PlayerDot) {
  return p.y < OFF_Y - 2;
}

function isEligibleSkillPlayer(p: PlayerDot) {
  return ![...FIXED_OL_IDS, "QB"].includes(p.id as any) && !isBackfieldEligible(p);
}

function isSplitOutWideEligible(p: PlayerDot) {
  return isEligibleSkillPlayer(p);
}

function countsAsNonBackfieldEligible(p: PlayerDot) {
  return isEligibleSkillPlayer(p);
}

function isWingLikePlayer(p: PlayerDot) {
  return Math.abs(p.y - WING_Y) < 1.0;
}

function isTrueWideReceiver(p: PlayerDot) {
  if (!["X", "Z", "H"].includes(p.id)) return false;
  if (isWingLikePlayer(p)) return false;
  return !isBackfieldEligible(p);
}

function getPassCatcherPriorityScore(p: PlayerDot) {
  if (["Y", "U"].includes(p.id)) return 1;
  if (p.id === "RB" || p.id === "F") return 0;
  if (isWingLikePlayer(p)) return 2;
  if (["X", "Z", "H"].includes(p.id)) return 3;
  return 0;
}

function getOffsetBackSide(players: PlayerDot[]): Side | null {
  const back = players.find((p) => ["RB", "F"].includes(p.id) && p.x !== 50);
  if (!back) return null;
  return back.x < 50 ? "left" : "right";
}

function computePassStrengthFromEligibles(
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

function dedupeLandmarks(points: Landmark[]) {
  const out: Landmark[] = [];
  points.forEach((point) => {
    const exists = out.some((p) => p.layer === point.layer && p.label === point.label && Math.abs(p.x - point.x) < 0.2 && Math.abs(p.y - point.y) < 0.2);
    if (!exists) out.push(point);
  });
  return out;
}

function buildFoothillFormation(call: string, wide = false): FormationMeta {
  const side: Side = call.includes("Left") ? "left" : "right";
  const other: Side = side === "right" ? "left" : "right";
  const isEmpty = call.includes("Empty");
  const isKing = call.includes("King");
  const isQueen = call.includes("Queen");
  const isGun = !isEmpty && (isKing || isQueen);
  const base = call.startsWith("B ") ? `${call.split(" ")[0]} ${call.split(" ")[1]}` : call.split(" ")[0];
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
      const hX = getMidpoint(yX, zX);
      add("Y", yX, LOS_Y);
      add("H", hX, OFF_Y);
      add("Z", zX, OFF_Y);
      add("X", getWide(other), LOS_Y);
      break;
    }
    case "Bunch":
      if (isEmpty) {
        add("H", getAttached(side, wide), OFF_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
        add("RB", getSlot(other, wide), OFF_Y);
      } else {
        add("H", getAttached(side, wide), OFF_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
      }
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
    const emptySide: Side = base === "Doubles" ? side : other;
    const slotOccupied = players.some(
      (p) =>
        p.id !== "QB" &&
        p.id !== "RB" &&
        Math.abs(p.y - OFF_Y) < 0.2 &&
        (emptySide === "left" ? p.x < 50 : p.x > 50) &&
        Math.abs(p.x - getSlot(emptySide, wide)) < 8,
    );
    add("RB", slotOccupied ? getWing(emptySide, wide) : getSlot(emptySide, wide), OFF_Y);
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

function buildWingTFormation(call: string, wide = false): FormationMeta {
  const side: Side = call.includes("Left") ? "left" : "right";
  const other: Side = side === "right" ? "left" : "right";
  const isUnbalanced = call.includes("Unbalanced");
  const isFar = call.includes("Far");
  const isNear = call.includes("Near");

  const players: PlayerDot[] = [...baseLine(wide), { id: "QB", x: 50, y: QB_UNDER_Y }];
  const add = (id: string, x: number, y: number) => players.push({ id, x, y });
  const xs = getLineXs(wide);

  add("RB", 50, RB_DOT_Y);

  const fbX = isFar ? (side === "right" ? xs[0] : xs[4]) : isNear ? (side === "right" ? xs[4] : xs[0]) : 50;
  add("F", fbX, RB_DOT_Y);

  add("Y", getAttached(side, wide), LOS_Y);
  add("Z", getWing(side, wide), WING_Y);

  if (isUnbalanced) {
    add("X", getWide(side), LOS_Y);
  } else {
    add("X", getWide(other), LOS_Y);
  }

  const passStrength = computePassStrengthFromEligibles(players, side, {
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

function buildProFormation(call: string, wide = false): FormationMeta {
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

const ALL_FORMATIONS: FormationMeta[] = [
  ...WING_T_CALLS.map((call) => buildWingTFormation(call, false)),
  ...ALIGNMENT_CALLS.map((call) => buildFoothillFormation(call, false)),
  ...PRO_CALLS.map((call) => buildProFormation(call, false)),
];

function getDefaultCustomLandmarkPosition(layer: "dl" | "lb" | "cb" | "db", side: Side) {
  const yMap = { dl: DL_Y, lb: LB_Y, cb: CB_Y, db: DB_Y } as const;
  return { x: side === "left" ? 25 : 75, y: yMap[layer] };
}

function getOffenseBuildLandmarks(): Landmark[] {
  const leftAttached = getAttached("left", false);
  const rightAttached = getAttached("right", false);
  const leftSlot = getSlot("left", false);
  const rightSlot = getSlot("right", false);
  return dedupeLandmarks([
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
    { id: "o-slot-left", x: leftSlot, y: OFF_Y, layer: "offense" },
    { id: "o-slot-right", x: rightSlot, y: OFF_Y, layer: "offense" },
    { id: "o-wide-left-on", x: 8, y: LOS_Y, layer: "offense" },
    { id: "o-wide-right-on", x: 92, y: LOS_Y, layer: "offense" },
    { id: "o-wide-left-off", x: 8, y: OFF_Y, layer: "offense" },
    { id: "o-wide-right-off", x: 92, y: OFF_Y, layer: "offense" },
  ]);
}

function getAlignmentLandmarks(formation: FormationMeta): Landmark[] {

  const offense = formation.players;
  const skill = offense.filter((p) => isEligibleSkillPlayer(p));
  const points: Landmark[] = [];
  const push = (id: string, x: number, y: number, label: string, layer: LandmarkLayer) => points.push({ id, x, y, label, layer });
  const xs = ALIGNMENT_OLINE_X;

  push("dl-left-5", xs[0] - 2.2, DL_Y, "5T", "dl");
  push("dl-left-4", xs[0], DL_Y, "4", "dl");
  push("dl-left-4i", xs[0] + 2.2, DL_Y, "4i", "dl");
  push("dl-right-4i", xs[4] - 2.2, DL_Y, "4i", "dl");
  push("dl-right-4", xs[4], DL_Y, "4", "dl");
  push("dl-right-5", xs[4] + 2.2, DL_Y, "5T", "dl");
  push("dl-left-3", xs[1] - 2.2, DL_Y, "3T", "dl");
  push("dl-left-2", xs[1], DL_Y, "2", "dl");
  push("dl-left-2i", xs[1] + 2.2, DL_Y, "2i", "dl");
  push("dl-right-2i", xs[3] - 2.2, DL_Y, "2i", "dl");
  push("dl-right-2", xs[3], DL_Y, "2", "dl");
  push("dl-right-3", xs[3] + 2.2, DL_Y, "3T", "dl");
  push("dl-0", xs[2], DL_Y, "0", "dl");
  push("dl-left-1", xs[2] - 2.2, DL_Y, "1T", "dl");
  push("dl-right-1", xs[2] + 2.2, DL_Y, "1T", "dl");

  const getFirstLevelSurface = (side: Side) => {
    const tackleX = side === "left" ? xs[0] : xs[4];
    const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
    const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
    const sideSkill = skill.filter((p) => (side === "left" ? p.x < 50 : p.x > 50));

    const inline = sideSkill
      .filter((p) => Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - attachedX) <= 3.5 && Math.abs(p.x - tackleX) <= 8)
      .sort((a, b) => Math.abs(a.x - attachedX) - Math.abs(b.x - attachedX))[0];
    if (inline) return { player: inline, type: "inline" as const };

    const wing = sideSkill
      .filter((p) => Math.abs(p.y - WING_Y) < 1.0 && Math.abs(p.x - wingX) <= 3.5 && Math.abs(p.x - tackleX) <= 8)
      .sort((a, b) => Math.abs(a.x - wingX) - Math.abs(b.x - wingX))[0];
    if (wing) return { player: wing, type: "wing" as const };

    return null;
  };

  const isTightBunchToEmolos = (side: Side) => {
    const name = formation.name.toLowerCase();
    const isBunchCall = name.includes("bunch") || name.startsWith("b ");
    if (isBunchCall) return true;

    const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
    const sideSkill = skill.filter((p) => (side === "left" ? p.x < 50 : p.x > 50));
    const tight = sideSkill.filter((p) => Math.abs(p.x - attachedX) <= 6 && (Math.abs(p.y - LOS_Y) < 1.5 || Math.abs(p.y - OFF_Y) < 2));
    return tight.length >= 3;
  };

  const addSurface = (surfaceInfo: { player: PlayerDot; type: "inline" | "wing" } | null, side: Side) => {
    if (!surfaceInfo) return;

    const tackleX = side === "left" ? xs[0] : xs[4];
    const towardCenter = side === "left" ? 2.2 : -2.2;
    const awayFromCenter = -towardCenter;

    if (isBunchFamilyOnSide(formation, side)) {
      const bunch = getBunchNumberedReceivers(formation, side);
      const numberThree = bunch.numberThree;
      const numberTwo = bunch.numberTwo;

      push(`dl-${side}-5t-bunch`, tackleX + (side === "left" ? -2.2 : 2.2), DL_Y, "5T", "dl");

      if (numberThree) {
        push(`dl-${side}-6i-bunch`, numberThree.x + towardCenter, DL_Y, "6i", "dl");
        push(`dl-${side}-6-bunch`, numberThree.x, DL_Y, "6T", "dl");
        push(`dl-${side}-7t-bunch`, numberThree.x + awayFromCenter, DL_Y, "7T", "dl");
      }

      if (numberTwo) {
        push(`dl-${side}-9t-bunch`, numberTwo.x, DL_Y, "9T", "dl");
      }
      return;
    }

    if (surfaceInfo.type === "inline") {
      const surface = surfaceInfo.player;
      const insideX = surface.x + towardCenter;
      const outsideX = surface.x + awayFromCenter;
      const attachedWing = getWingSurface(formation, side);
      push(`dl-${side}-6i`, insideX, DL_Y, "6i", "dl");
      push(`dl-${side}-6`, surface.x, DL_Y, "6", "dl");
      push(`dl-${side}-7t`, outsideX, DL_Y, "7T", "dl");
      if (attachedWing) {
        push(`dl-${side}-9t-wing`, attachedWing.x + awayFromCenter, DL_Y, "9T", "dl");
      }
      return;
    }

    const surface = surfaceInfo.player;
    push(`dl-${side}-6i-wing`, surface.x + towardCenter, DL_Y, "6i", "dl");
    push(`dl-${side}-6t`, surface.x, DL_Y, "6T", "dl");
    push(`dl-${side}-7t-wing`, surface.x + awayFromCenter, DL_Y, "7T", "dl");
  };
  addSurface(getFirstLevelSurface("left"), "left");
  addSurface(getFirstLevelSurface("right"), "right");

  push("lb-00", xs[2], LB_Y, "00T", "lb");
  push("lb-left-10", getMidpoint(xs[1], xs[2]), LB_Y, "10T", "lb");
  push("lb-left-20", xs[1], LB_Y, "20T", "lb");
  push("lb-left-30", getMidpoint(xs[0], xs[1]), LB_Y, "30T", "lb");
  push("lb-left-40", xs[0], LB_Y, "40T", "lb");
  push("lb-right-10", getMidpoint(xs[2], xs[3]), LB_Y, "10T", "lb");
  push("lb-right-20", xs[3], LB_Y, "20T", "lb");
  push("lb-right-30", getMidpoint(xs[3], xs[4]), LB_Y, "30T", "lb");
  push("lb-right-40", xs[4], LB_Y, "40T", "lb");

  const inlineLeft = getInlineSurface(formation, "left");
  const inlineRight = getInlineSurface(formation, "right");
  const wingLeft = getWingSurface(formation, "left");
  const wingRight = getWingSurface(formation, "right");
  const inlineTeIds = new Set<string>([inlineLeft?.id, inlineRight?.id].filter(Boolean) as string[]);
  const pairedTeWingIds = new Set<string>([
    ...(inlineLeft && wingLeft ? [inlineLeft.id, wingLeft.id] : []),
    ...(inlineRight && wingRight ? [inlineRight.id, wingRight.id] : []),
  ]);
  const outsideLeft = getOutsideReceiver(formation, "left");
  const outsideRight = getOutsideReceiver(formation, "right");
  const outsideWideIds = new Set<string>(
    [outsideLeft, outsideRight]
      .filter((p): p is PlayerDot => Boolean(p))
      .filter((p) => !inlineTeIds.has(p.id) && !isWingLikePlayer(p) && (p.x < xs[0] || p.x > xs[4]))
      .map((p) => p.id),
  );

  const addLbTeRule = (te: PlayerDot | null, wing: PlayerDot | null, side: Side) => {
    const tackleX = side === "left" ? xs[0] : xs[4];

    if (isBunchFamilyOnSide(formation, side)) {
      const bunch = getBunchNumberedReceivers(formation, side);
      const numberThree = bunch.numberThree;
      const numberTwo = bunch.numberTwo;
      const numberOne = bunch.numberOne;
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      push(`lb-${side}-50t-bunch`, fiveTX, LB_Y, "50T", "lb");
      if (numberThree) push(`lb-${side}-num3-bunch`, numberThree.x, LB_Y, "H", "lb");
      if (numberTwo) push(`lb-${side}-num2-bunch`, numberTwo.x, LB_Y, "H", "lb");
      if (numberOne) push(`lb-${side}-num1-bunch`, numberOne.x, LB_Y, "H", "lb");
      return;
    }

    if (te) {
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      push(`lb-${te.id}-50t`, fiveTX, LB_Y, "50T", "lb");
      const teOutsideX = side === "left" ? te.x - 2.8 : te.x + 2.8;
      push(`lb-${te.id}-60t`, te.x, LB_Y, "60T", "lb");

      if (wing) {
        // 70T = D gap between TE and Wing
        push(`lb-${te.id}-70t`, getMidpoint(te.x, wing.x), LB_Y, "70T", "lb");
        const wingOutsideX = side === "left" ? wing.x - 2.8 : wing.x + 2.8;
        push(`lb-${wing.id}-90t`, wingOutsideX, LB_Y, "90T", "lb");
      } else {
        // 70T = outside shoulder of TE when no wing
        const teOutsideX = side === "left" ? te.x - 2.8 : te.x + 2.8;
        push(`lb-${te.id}-70t`, teOutsideX, LB_Y, "70T", "lb");
      }
      return;
    }

    if (wing) {
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      const wingOutsideX = side === "left" ? wing.x - 2.8 : wing.x + 2.8;
      push(`lb-${wing.id}-50t`, fiveTX, LB_Y, "50T", "lb");
      push(`lb-${wing.id}-60t`, wing.x, LB_Y, "60T", "lb");
      push(`lb-${wing.id}-70t`, wingOutsideX, LB_Y, "70T", "lb");
    } else {
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      push(`lb-${side}-50t-open`, fiveTX, LB_Y, "50T", "lb");
    }
  };

  addLbTeRule(inlineLeft, inlineLeft && wingLeft ? wingLeft : null, "left");
  addLbTeRule(inlineRight, inlineRight && wingRight ? wingRight : null, "right");

  skill.forEach((p, idx) => {
    const spread = 2.8 + (idx % 3) * 0.4;
    const insideX = p.x < 50 ? p.x + spread : p.x - spread;
    const outsideX = p.x < 50 ? p.x - spread : p.x + spread;
    const isInline = inlineTeIds.has(p.id);
    const isWing = isWingLikePlayer(p);
    const isTightSurfacePair = pairedTeWingIds.has(p.id);
    const bunchLeft = isBunchFamilyOnSide(formation, "left") ? getBunchPlayers(formation, "left") : [];
    const bunchRight = isBunchFamilyOnSide(formation, "right") ? getBunchPlayers(formation, "right") : [];
    const bunchPlayers = [...bunchLeft, ...bunchRight];
    const bunchIndex = bunchPlayers.findIndex((bp) => bp.id === p.id);

    if (!isInline && !isWing && bunchIndex === -1 && !outsideWideIds.has(p.id)) {
      push(`lb-${p.id}-i`, insideX, LB_Y, "I", "lb");
      push(`lb-${p.id}-h`, p.x, LB_Y, "H", "lb");
      push(`lb-${p.id}-o`, outsideX, LB_Y, "O", "lb");
    }

    if (bunchIndex !== -1) {
      // bunchIndex 0 = #3, 1 = #2, 2 = #1 by geometry
      if (bunchIndex === 0) {
        push(`cb-${p.id}-i-bunch`, insideX, CB_Y, "I", "cb");
        push(`db-${p.id}-h-bunch`, p.x, DB_Y, "H", "db");
      }
      if (bunchIndex === 1) {
        push(`cb-${p.id}-h-bunch`, p.x, CB_Y, "H", "cb");
      }
      if (bunchIndex === 2) {
        push(`cb-${p.id}-o-bunch`, outsideX, CB_Y, "O", "cb");
      }
      return;
    }

    if (isTightSurfacePair) {
      push(`cb-${p.id}-h`, p.x, CB_Y, "H", "cb");
      push(`db-${p.id}-h`, p.x, DB_Y, "H", "db");

      if (isInline) {
        push(`cb-${p.id}-i`, insideX, CB_Y, "I", "cb");
        push(`db-${p.id}-i`, insideX, DB_Y, "I", "db");
      }

      if (isWing) {
        push(`cb-${p.id}-o`, outsideX, CB_Y, "O", "cb");
        push(`db-${p.id}-o`, outsideX, DB_Y, "O", "db");
      }

      return;
    }

    push(`cb-${p.id}-i`, insideX, CB_Y, "I", "cb");
    push(`cb-${p.id}-h`, p.x, CB_Y, "H", "cb");
    push(`cb-${p.id}-o`, outsideX, CB_Y, "O", "cb");
    if (!outsideWideIds.has(p.id)) {
      push(`db-${p.id}-i`, insideX, DB_Y, "I", "db");
      push(`db-${p.id}-h`, p.x, DB_Y, "H", "db");
      push(`db-${p.id}-o`, outsideX, DB_Y, "O", "db");
    }
  });

  const apexEligibleSkill = formation.players.filter((p) => {
    if (!isEligibleSkillPlayer(p)) return false;
    return p.x < xs[0] || p.x > xs[4];
  });

  const addApex = (side: Side) => {
    const tackleX = side === "left" ? xs[0] : xs[4];
    const sideSkill = apexEligibleSkill
      .filter((p) => (side === "left" ? p.x < 50 : p.x > 50))
      .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
    if (!sideSkill.length) return;

    const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
    const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
    const isWingLike = (p: PlayerDot) => (Math.abs(p.y - WING_Y) < 1.0 || Math.abs(p.y - OFF_Y) < 0.75) && Math.abs(p.x - wingX) <= 4;

    const inlineEmolos = sideSkill.find((p) => Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - attachedX) <= 3.5 && Math.abs(p.x - tackleX) <= 8);
    const firstEligible = sideSkill[0];
    const isWingLikeFirstEligible = Boolean(firstEligible && isWingLike(firstEligible));

    if (!inlineEmolos && isWingLikeFirstEligible) return;

    const emolosX = inlineEmolos ? inlineEmolos.x : tackleX;
    const next =
      sideSkill.find((p) => {
        if (inlineEmolos && p.id === inlineEmolos.id) return false;
        return side === "left" ? p.x < emolosX - 0.1 : p.x > emolosX + 0.1;
      }) || sideSkill.find((p) => !(inlineEmolos && p.id === inlineEmolos.id));

    if (!next || isWingLike(next)) return;
    const apexX = getMidpoint(emolosX, next.x);
    push(`lb-${side}-apex`, apexX, LB_Y, "Apex", "lb");
    push(`db-${side}-apex`, apexX, DB_Y, "Apex", "db");
  };
  addApex("left");
  addApex("right");

  const getEligibles = (side: Side) => apexEligibleSkill.filter((p) => (side === "left" ? p.x < 50 : p.x > 50)).sort((a, b) => a.x - b.x);

  const isTightGroup = (group: PlayerDot[]) => {
    if (group.length < 2) return false;
    for (let i = 0; i < group.length - 1; i++) {
      const dx = Math.abs(group[i].x - group[i + 1].x);
      if (dx > 6) return false;
    }
    return true;
  };

  ["left", "right"].forEach((s) => {
    const side = s as Side;
    const group = getEligibles(side);
    if (isTightGroup(group)) return;

    if (group.length >= 2) {
      const attachedX = side === "left" ? xs[0] - 4 : xs[4] + 4;
      const wingX = side === "left" ? attachedX - (xs[1] - xs[0]) * 0.25 : attachedX + (xs[1] - xs[0]) * 0.25;
      const isWingLike = (p: PlayerDot) => (Math.abs(p.y - WING_Y) < 1.0 || Math.abs(p.y - OFF_Y) < 0.75) && Math.abs(p.x - wingX) <= 4;

      for (let i = 0; i < group.length - 1; i++) {
        const a = group[i];
        const b = group[i + 1];
        if (isWingLike(a) || isWingLike(b)) continue;
        const extraApexX = (a.x + b.x) / 2;
        push(`lb-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, LB_Y, "Apex", "lb");
        push(`db-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, DB_Y, "Apex", "db");
      }
    }
  });

  (["left", "right"] as Side[]).forEach((side) => {
    const numberOne = getOutsideReceiver(formation, side);
    const numberTwo = getNumberTwoReceiver(formation, side);
    if (!numberOne || !numberTwo) return;
    push(`lb-${side}-apex-12`, getMidpoint(numberOne.x, numberTwo.x), LB_Y, "Apex", "lb");
  });

  push("db-left-edge", xs[0], DB_Y, "Edge", "db");
  push("db-left-hash", xs[1], DB_Y, "Hash", "db");
  push("db-mof", xs[2], DB_Y, "MOF", "db");
  push("db-right-hash", xs[3], DB_Y, "Hash", "db");
  push("db-right-edge", xs[4], DB_Y, "Edge", "db");

  return dedupeLandmarks(points);
}

function getOffenseAnswerKeyFromFormation(formation: FormationMeta): Record<string, { x: number; y: number }> {
  const answer: Record<string, { x: number; y: number }> = {};
  formation.players
    .filter((p) => !FIXED_OL_IDS.includes(p.id as (typeof FIXED_OL_IDS)[number]))
    .forEach((p) => {
      answer[p.id] = { x: p.x, y: p.y };
    });
  return answer;
}

function findLandmarkByLabel(landmarks: Landmark[], layer: LandmarkLayer, label: string, side?: Side) {
  let filtered = landmarks.filter((p) => p.layer === layer && p.label === label);
  if (side) filtered = filtered.filter((p) => (side === "left" ? p.x < 50 : p.x > 50));
  if (!filtered.length) return null;
  if (!side) return filtered[0];
  return side === "left"
    ? filtered.reduce((best, p) => (p.x > best.x ? p : best), filtered[0])
    : filtered.reduce((best, p) => (p.x < best.x ? p : best), filtered[0]);
}

function findEligibleOnSide(formation: FormationMeta, side: Side) {
  return formation.players
    .filter((p) => ![...FIXED_OL_IDS, "QB"].includes(p.id as any))
    .filter((p) => (side === "left" ? p.x < 50 : p.x > 50));
}

function findTrueEligiblesOnSide(formation: FormationMeta, side: Side) {
  return findEligibleOnSide(formation, side).filter(countsAsNonBackfieldEligible);
}

function getOrderedReceivers(formation: FormationMeta, side: Side) {
  const players = findTrueEligiblesOnSide(formation, side);
  return [...players].sort((a, b) => (side === "left" ? a.x - b.x : b.x - a.x));
}

function getOutsideReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered[0] || null;
}

function getNumberTwoReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered.length >= 2 ? ordered[1] : null;
}

function getNumberThreeReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered.length >= 3 ? ordered[2] : null;
}

function getSlotReceiver(formation: FormationMeta, side: Side) {
  const numberTwo = getNumberTwoReceiver(formation, side);
  if (!numberTwo) return null;

  const inline = getInlineSurface(formation, side);
  const isInlineNumberTwo = inline?.id === numberTwo.id;
  const isWingNumberTwo = isWingLikePlayer(numberTwo);

  // A slot is defined by his relation to the OL, not by being on or off the ball.
  // So #2 counts as a slot if he is not the inline TE surface and not a wing.
  return !isInlineNumberTwo && !isWingNumberTwo ? numberTwo : null;
}

function getTightSurfaceSlotReceiver(formation: FormationMeta, side: Side) {
  return getSlotReceiver(formation, side);
}

function getInlineSurface(formation: FormationMeta, side: Side) {
  const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
  const players = findEligibleOnSide(formation, side)
    .filter((p) => Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - tackleX) <= 10)
    .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
  return players[0] || null;
}

function getWingSurface(formation: FormationMeta, side: Side) {
  const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
  const players = findEligibleOnSide(formation, side)
    .filter((p) => Math.abs(p.y - WING_Y) < 0.75 && Math.abs(p.x - tackleX) <= 10)
    .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
  return players[0] || null;
}

function getBunchPlayers(formation: FormationMeta, side: Side) {
  const tackleX = side === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4];
  const attachedX = getAttached(side, true);
  const sidePlayers = findEligibleOnSide(formation, side)
    .sort((a, b) => {
      const aScore = Math.abs(a.x - attachedX) + Math.abs(a.x - tackleX) * 0.35;
      const bScore = Math.abs(b.x - attachedX) + Math.abs(b.x - tackleX) * 0.35;
      return aScore - bScore;
    })
    .slice(0, 3)
    .sort((a, b) => Math.abs(a.x - 50) - Math.abs(b.x - 50));
  return sidePlayers;
}

function getBunchNumberedReceivers(formation: FormationMeta, side: Side) {
  const bunch = getBunchPlayers(formation, side);
  return {
    numberThree: bunch[0] || null,
    numberTwo: bunch[1] || null,
    numberOne: bunch[2] || null,
  };
}

function isBunchFamilyOnSide(formation: FormationMeta, side: Side) {
  const name = formation.name.toLowerCase();
  if (!name.includes("bunch")) return false;
  const runSide = formation.runStrength;
  return side === runSide;
}

function hasTrueWideReceiverOnSide(formation: FormationMeta, side: Side) {
  return findEligibleOnSide(formation, side).some((p) => isTrueWideReceiver(p));
}

function getBackfieldOffsetSide(formation: FormationMeta): Side | null {
  const back = formation.players.find((p) => ["RB", "F"].includes(p.id) && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
  if (!back) return null;
  return back.x < 50 ? "left" : "right";
}

function getFullbackOffsetSide(formation: FormationMeta): Side | null {
  const fullback = formation.players.find((p) => p.id === "F" && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
  if (!fullback) return null;
  return fullback.x < 50 ? "left" : "right";
}

function isClosedSurfaceOnlySide(formation: FormationMeta, side: Side) {
  const inline = getInlineSurface(formation, side);
  const wing = getWingSurface(formation, side);
  const slot = getSlotReceiver(formation, side);
  return Boolean(inline || wing) && !hasTrueWideReceiverOnSide(formation, side) && !slot;
}

function shouldBossIlbs(formation: FormationMeta) {
  const leftInline = getInlineSurface(formation, "left");
  const rightInline = getInlineSurface(formation, "right");
  const leftWing = getWingSurface(formation, "left");
  const rightWing = getWingSurface(formation, "right");

  // 🔥 NEW RULE: TE + Wing combo in 4-3 ALWAYS triggers boss
  const hasTEWingLeft = Boolean(leftInline && leftWing);
  const hasTEWingRight = Boolean(rightInline && rightWing);

  if (hasTEWingLeft || hasTEWingRight) return true;

  const leftEligibles = findTrueEligiblesOnSide(formation, "left");
  const rightEligibles = findTrueEligiblesOnSide(formation, "right");
  const leftCount = leftEligibles.length;
  const rightCount = rightEligibles.length;

  const isThreeByOne = (leftCount === 3 && rightCount === 1) || (leftCount === 1 && rightCount === 3);
  const closedThreeByOne = (leftCount === 3 && isClosedSurfaceOnlySide(formation, "right")) || (rightCount === 3 && isClosedSurfaceOnlySide(formation, "left"));
  if (isThreeByOne && !closedThreeByOne) return true;

  const fullbackSide = getFullbackOffsetSide(formation);
  const is21Personnel = formation.personnel === "21";
  const teFbSameSide = is21Personnel && ((leftInline && fullbackSide === "left") || (rightInline && fullbackSide === "right"));
  if (teFbSameSide) return true;

  return false;
}

function shouldWillPlay50InEmpty(formation: FormationMeta, willSide: Side) {
  if (!formation.name.includes("Empty")) return false;

  const leftEligibles = findTrueEligiblesOnSide(formation, "left");
  const rightEligibles = findTrueEligiblesOnSide(formation, "right");
  const isThreeByTwo = (leftEligibles.length === 3 && rightEligibles.length === 2) || (leftEligibles.length === 2 && rightEligibles.length === 3);
  if (!isThreeByTwo) return false;

  return Boolean(getSlotReceiver(formation, willSide));
}

function getThreeByOneStrongSide(formation: FormationMeta): Side | null {
  const leftCount = findTrueEligiblesOnSide(formation, "left").length;
  const rightCount = findTrueEligiblesOnSide(formation, "right").length;
  if (leftCount === 3 && rightCount === 1) return "left";
  if (rightCount === 3 && leftCount === 1) return "right";
  return null;
}

function shouldMikeApexFlexedThree(formation: FormationMeta, mikeSide: Side) {
  const strongSide = getThreeByOneStrongSide(formation);
  if (!strongSide || strongSide !== mikeSide) return false;
  if (isClosedSurfaceOnlySide(formation, mikeSide)) return false;

  const numberThree = getNumberThreeReceiver(formation, mikeSide);
  if (!numberThree) return false;

  const isFlexed = !isWingLikePlayer(numberThree) && Math.abs(numberThree.x - (mikeSide === "left" ? ALIGNMENT_OLINE_X[0] : ALIGNMENT_OLINE_X[4])) > 8;
  return isFlexed;
}

function isAttachedOrWingNumberThree(formation: FormationMeta, side: Side) {
  const numberThree = getNumberThreeReceiver(formation, side);
  if (!numberThree) return false;
  const inline = getInlineSurface(formation, side);
  if (inline?.id === numberThree.id) return true;
  if (isWingLikePlayer(numberThree)) return true;
  return false;
}

function getAlignmentSpecialCases(formation: FormationMeta, frontMode: FrontMode = "4-3"): string[] {
  const notes: string[] = [];
  const passStrength = formation.passStrength;
  const passAway: Side = passStrength === "left" ? "right" : "left";
  const leftCount = findTrueEligiblesOnSide(formation, "left").length;
  const rightCount = findTrueEligiblesOnSide(formation, "right").length;
  const is22 = leftCount === 2 && rightCount === 2;
  const is31 = (leftCount === 3 && rightCount === 1) || (leftCount === 1 && rightCount === 3);
  const is32 = (leftCount === 3 && rightCount === 2) || (leftCount === 2 && rightCount === 3);
  const bossIlbs = shouldBossIlbs(formation);
  const mikeApexFlexedThree = shouldMikeApexFlexedThree(formation, passStrength);
  const willStrengthEligibles = findTrueEligiblesOnSide(formation, passStrength).length;
  const willWeakEligibles = findTrueEligiblesOnSide(formation, passAway).length;
  const strongInline = getInlineSurface(formation, formation.runStrength);
  const strongWing = getWingSurface(formation, formation.runStrength);
  const weakInline = getInlineSurface(formation, passAway);
  const weakWing = getWingSurface(formation, passAway);

  if (formation.name.includes("Quad")) {
    notes.push("Quad: Mike 30T.");
  }

  if (bossIlbs && !mikeApexFlexedThree) {
    notes.push("Boss: Mike to strength, Will away.");
  }

  if (mikeApexFlexedThree) {
    notes.push("Mike: apex flexed #3.");
  }

  const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, passStrength).length;
  const closedAndBoss43Notes = frontMode === "4-3" && Boolean((isClosedSurfaceOnlySide(formation, "left") && !isClosedSurfaceOnlySide(formation, "right")) || (isClosedSurfaceOnlySide(formation, "right") && !isClosedSurfaceOnlySide(formation, "left"))) && bossIlbs;
  if (closedAndBoss43Notes) {
    notes.push("Closed + boss: Mike and Will to 20T toward TE/FB.");
  } else if (mikeStrengthEligibles === 3) {
    notes.push("Mike: to strength. 60T if #3 attached, apex if #3 flexed.");
  } else {
    notes.push("Mike: to strength. 10T with run strength, 30T away.");
  }

  if (formation.name.includes("Empty") && is32) {
    notes.push("3x2 Empty: Ni on #2 WR, Will 50T weak, Mike 60T or apex.");
    notes.push("Empty: BS inside #2 weak.");
  }

  if (willStrengthEligibles === 3) {
    notes.push(willWeakEligibles === 2 ? "Will: 50T weak vs 3x2." : "Will: 00T weak vs 3x1.");
  } else {
    notes.push("Will: apex weak slot, else open gap.");
  }

  if (is22) {
    notes.push("2x2: ILBs in open gap.");
    notes.push("2x2: safeties inside slot #2, outside attached #2.");
  }

  if (is31) {
    notes.push("3x1: FS apex #2 and #3.");
  }

  if (strongWing) {
    notes.push("Wing adjust: DE widens strong.");
  }

  if (weakWing) {
    notes.push("Wing adjust: DE widens weak.");
  }

  if (strongInline && strongWing) {
    notes.push("TE/Wing strong: 7T/9T.");
  }

  if (weakInline && weakWing) {
    notes.push("TE/Wing weak: 7T/9T.");
  }

  if (formation.name.toLowerCase().includes("bunch")) {
    notes.push("Bunch: #3 gets 6i/6/7, #2 gets 9T.");
    notes.push("Bunch: Mike 50T, Ni on #1, FS on #3.");
  }

  return notes;
}

function getAlignmentAnswerKey(formation: FormationMeta, landmarks: Landmark[], frontMode: FrontMode = "4-3"): Record<string, { x: number; y: number }> {
  const answer: Record<string, { x: number; y: number }> = {};
  const runStrength = formation.runStrength;
  const weakSide: Side = runStrength === "left" ? "right" : "left";
  const passStrength = formation.passStrength;
  const passAway: Side = passStrength === "left" ? "right" : "left";

  const getShade = (player: PlayerDot | null, layer: "cb" | "db", label: "I" | "H" | "O") => {
    if (!player) return null;
    const pts = landmarks
      .filter((p) => p.layer === layer && p.label === label && Math.abs(p.x - player.x) <= 6)
      .sort((a, b) => Math.abs(a.x - player.x) - Math.abs(b.x - player.x));
    return pts[0] || null;
  };

  const strongInline = getInlineSurface(formation, runStrength);
  const strongWing = getWingSurface(formation, runStrength);
  const weakInline = getInlineSurface(formation, weakSide);
  const weakWing = getWingSurface(formation, weakSide);
  const multipleTes = Boolean(strongInline && weakInline);

  const tPoint = findLandmarkByLabel(landmarks, "dl", "3T", runStrength);
  const nPoint = findLandmarkByLabel(landmarks, "dl", "2i", weakSide);
  const sdeFive = findLandmarkByLabel(landmarks, "dl", "5T", runStrength);
  const sdeSix = findLandmarkByLabel(landmarks, "dl", "6", runStrength) || findLandmarkByLabel(landmarks, "dl", "6T", runStrength);
  const sdeNine = findLandmarkByLabel(landmarks, "dl", "7T", runStrength) || findLandmarkByLabel(landmarks, "dl", "9T", runStrength);
  const wdeFive = findLandmarkByLabel(landmarks, "dl", "5T", weakSide);
  const wdeSix = findLandmarkByLabel(landmarks, "dl", "6", weakSide) || findLandmarkByLabel(landmarks, "dl", "6T", weakSide);
  const wdeNine = findLandmarkByLabel(landmarks, "dl", "7T", weakSide) || findLandmarkByLabel(landmarks, "dl", "9T", weakSide);

  if (tPoint) answer.T = { x: tPoint.x, y: tPoint.y };
  if (nPoint) answer.N = { x: nPoint.x, y: nPoint.y };

  if (strongInline && strongWing && sdeNine) answer.SDE = { x: sdeNine.x, y: sdeNine.y };
  else if (!strongInline && strongWing && sdeSix) answer.SDE = { x: sdeSix.x, y: sdeSix.y };
  else if (strongInline && sdeSix) answer.SDE = { x: sdeSix.x, y: sdeSix.y };
  else if (sdeFive) answer.SDE = { x: sdeFive.x, y: sdeFive.y };

  if (weakInline && weakWing && wdeNine) answer.WDE = { x: wdeNine.x, y: wdeNine.y };
  else if (weakInline && multipleTes && wdeSix) answer.WDE = { x: wdeSix.x, y: wdeSix.y };
  else if (!weakInline && weakWing && wdeSix) answer.WDE = { x: wdeSix.x, y: wdeSix.y };
  else if (weakWing && wdeSix) answer.WDE = { x: wdeSix.x, y: wdeSix.y };
  else if (wdeFive) answer.WDE = { x: wdeFive.x, y: wdeFive.y };

  const bossIlbs = shouldBossIlbs(formation);
  const mikeSide = passStrength;
  const willSide = passAway;
  const mikeOnRunSide = mikeSide === runStrength;
  const willOnRunSide = willSide === runStrength;

  const leftClosed = isClosedSurfaceOnlySide(formation, "left");
  const rightClosed = isClosedSurfaceOnlySide(formation, "right");
  const cometSide: Side | null = leftClosed && !rightClosed ? "left" : rightClosed && !leftClosed ? "right" : null;
  let cometTe: PlayerDot | null = null;
  let cometWing: PlayerDot | null = null;
  if (cometSide) {
    cometTe = getInlineSurface(formation, cometSide);
    cometWing = getWingSurface(formation, cometSide);
    const cometLabel = !cometTe ? "50T" : cometTe && cometWing ? "90T" : "70T";
    const cometSpot = findLandmarkByLabel(landmarks, "lb", cometLabel, cometSide);
    if (cometSpot) answer.BC = { x: cometSpot.x, y: cometSpot.y };
  }

  const closedThreeByOne = cometSide === passAway && findTrueEligiblesOnSide(formation, passStrength).length === 3;
  const nonClosedBoss43 = frontMode === "4-3" && !cometSide && bossIlbs && findTrueEligiblesOnSide(formation, passStrength).length !== 3;
  const nonClosedBoss44 = frontMode === "4-4" && !cometSide && bossIlbs && findTrueEligiblesOnSide(formation, passStrength).length !== 3;
  const closedAndBoss43 = frontMode === "4-3" && Boolean(cometSide) && bossIlbs;
  const closedAndBoss44 = frontMode === "4-4" && Boolean(cometSide) && bossIlbs;
  const closedNoBoss44 = frontMode === "4-4" && Boolean(cometSide) && !bossIlbs;

  const strongBunch = isBunchFamilyOnSide(formation, mikeSide) ? getBunchNumberedReceivers(formation, mikeSide) : null;

  const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, mikeSide).length;
  const mikeLandmark = (() => {
    if (closedThreeByOne) return findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    if (nonClosedBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (nonClosedBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedAndBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedAndBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedNoBoss44) return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (strongBunch?.numberThree) return findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    if (formation.name.includes("Quad")) return findLandmarkByLabel(landmarks, "lb", "30T", mikeSide);
    if (mikeStrengthEligibles === 3) {
      if (isAttachedOrWingNumberThree(formation, mikeSide)) return findLandmarkByLabel(landmarks, "lb", "60T", mikeSide);
      return findLandmarkByLabel(landmarks, "lb", "Apex", mikeSide);
    }
    return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
  })();
  if (mikeLandmark) answer.M = { x: mikeLandmark.x, y: mikeLandmark.y };

  const willLandmark = (() => {
    const strengthEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;

    // 🔥 FIX: Proper 4-3 Closed Boss behavior (split 20Ts)
    if (closedThreeByOne) {
      return findLandmarkByLabel(landmarks, "lb", "10T", passStrength) || findLandmarkByLabel(landmarks, "lb", "10T", willSide);
    }

    if (nonClosedBoss43) {
      const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
      return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    }

    if (nonClosedBoss44) {
      const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
      return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    }

    if (closedAndBoss43) {
      const will20 = findLandmarkByLabel(landmarks, "lb", "20T", willSide);
      return will20 || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    }

    if (frontMode === "4-4") {
      if (closedAndBoss44) {
        return findLandmarkByLabel(landmarks, "lb", "20T", willSide) || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
      }
      if (closedNoBoss44) {
        return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
      }
      if (strengthEligibleCount === 3) {
        return findLandmarkByLabel(landmarks, "lb", "00T");
      }
      if (bossIlbs) {
        return findLandmarkByLabel(landmarks, "lb", "00T") || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
      }
      return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    }

    const weakEligibleCount = findTrueEligiblesOnSide(formation, willSide).length;
    const willSlot = getSlotReceiver(formation, willSide);

    if (closedThreeByOne) {
      return findLandmarkByLabel(landmarks, "lb", "10T", passStrength) || findLandmarkByLabel(landmarks, "lb", "10T", willSide);
    }

    if (bossIlbs) {
      if (strengthEligibleCount === 3 && weakEligibleCount !== 2) return findLandmarkByLabel(landmarks, "lb", "00T");
      return findLandmarkByLabel(landmarks, "lb", "50T", willSide) || findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
    }

    if (strengthEligibleCount === 3) {
      if (weakEligibleCount === 2) return findLandmarkByLabel(landmarks, "lb", "50T", willSide);
      return findLandmarkByLabel(landmarks, "lb", "00T");
    }

    if (willSlot) return findLandmarkByLabel(landmarks, "lb", "Apex", willSide);

    return findLandmarkByLabel(landmarks, "lb", willOnRunSide ? "10T" : "30T", willSide);
  })();
  if (willLandmark) answer.W = { x: willLandmark.x, y: willLandmark.y };

  const applyOverhangRule = (side: Side, targetId: "Ni" | "BS") => {
    const sideBunch = isBunchFamilyOnSide(formation, side) ? getBunchNumberedReceivers(formation, side) : null;
    const sideSlot = getSlotReceiver(formation, side);
    const sideNumberTwo = getNumberTwoReceiver(formation, side);
    const sideOutside = getOutsideReceiver(formation, side);
    const sideEligibleCount = findTrueEligiblesOnSide(formation, side).length;

    if (sideBunch?.numberOne) {
      answer[targetId] = { x: sideBunch.numberOne.x, y: LB_Y };
      return;
    }

    if (cometSide && cometSide === side) {
      const strongEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;

      // 4-4 weak overhang rule: if the closed side has no TE, treat the tackle like the TE
      // and align BS in the next open gap on that closed side.
      if (targetId === "BS" && frontMode === "4-4" && side === passAway && !cometTe) {
        const bsTackleGap = findLandmarkByLabel(landmarks, "lb", "30T", side);
        if (bsTackleGap) answer[targetId] = { x: bsTackleGap.x, y: bsTackleGap.y };
        return;
      }

      const singleSurfaceCometBump =
        targetId === "BS" &&
        frontMode === "4-4" &&
        side === passAway &&
        strongEligibleCount === 3 &&
        !(cometTe && cometWing) &&
        (Boolean(cometTe) || Boolean(cometWing));

      const bumpLabel = singleSurfaceCometBump ? "30T" : cometTe && cometWing ? "50T" : "40T";
      const bump = findLandmarkByLabel(landmarks, "lb", bumpLabel, side);
      if (bump) answer[targetId] = { x: bump.x, y: bump.y };
      return;
    }

    if ((sideEligibleCount === 2 || sideEligibleCount === 3) && sideNumberTwo) {
      if (sideSlot) {
        answer[targetId] = { x: sideNumberTwo.x, y: LB_Y };
      } else {
        const outsideX = sideOutside?.x ?? sideNumberTwo.x;
        const targetApexX = getMidpoint(outsideX, sideNumberTwo.x);
        const apex = landmarks
          .filter((p) => p.layer === "lb" && p.label === "Apex")
          .sort((a, b) => Math.abs(a.x - targetApexX) - Math.abs(b.x - targetApexX))[0] || findLandmarkByLabel(landmarks, "lb", "Apex", side);
        if (apex) answer[targetId] = { x: apex.x, y: apex.y };
      }
      return;
    }

    const apex = findLandmarkByLabel(landmarks, "lb", "Apex", side);
    if (apex) answer[targetId] = { x: apex.x, y: apex.y };
  };

  applyOverhangRule(passStrength, "Ni");

  const leftElig = findTrueEligiblesOnSide(formation, "left").length;
  const rightElig = findTrueEligiblesOnSide(formation, "right").length;
  const is22 = leftElig === 2 && rightElig === 2;
  const is31 = (leftElig === 3 && rightElig === 1) || (leftElig === 1 && rightElig === 3);
  const is32 = (leftElig === 3 && rightElig === 2) || (leftElig === 2 && rightElig === 3);
  const fsNumberTwo = getNumberTwoReceiver(formation, passStrength);
  const fsNumberThree = getNumberThreeReceiver(formation, passStrength);
  const bsNumberTwo = getNumberTwoReceiver(formation, passAway);
  const fsSlot = getSlotReceiver(formation, passStrength);
  const bsSlot = getSlotReceiver(formation, passAway);
  const fsApex = findLandmarkByLabel(landmarks, "db", "Apex", passStrength);
  const bsApex = findLandmarkByLabel(landmarks, "db", "Apex", passAway);
  const fsInline = getInlineSurface(formation, passStrength);
  const bsInline = getInlineSurface(formation, passAway);
  const fcTarget = getOutsideReceiver(formation, passStrength);
  const bcTarget = getOutsideReceiver(formation, passAway);
  const fsStrengthEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;

  const xReceiver = formation.players.find((p) => p.id === "X") || null;
  if (formation.playbook === "Wing T" && xReceiver) {
    const fc = getShade(xReceiver, "cb", "H");
    if (fc) answer.FC = { x: fc.x, y: fc.y };
  } else if (strongBunch?.numberOne) {
    const fc = getShade(strongBunch.numberOne, "cb", "O");
    if (fc) answer.FC = { x: fc.x, y: fc.y };
  } else if (fcTarget) {
    const fc = getShade(fcTarget, "cb", "H");
    if (fc) answer.FC = { x: fc.x, y: fc.y };
  }

  if (frontMode === "4-4") {
    if (strongBunch?.numberThree) {
      const fs = getShade(strongBunch.numberThree, "db", "H");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (formation.name.includes("Quad")) {
      const post = findLandmarkByLabel(landmarks, "db", "MOF");
      if (post) answer.FS = { x: post.x, y: post.y };
    } else if (is22) {
      if (!cometSide) {
        const post = findLandmarkByLabel(landmarks, "db", "MOF");
        if (post) answer.FS = { x: post.x, y: post.y };
      } else {
        const closedTe = getInlineSurface(formation, cometSide);
        const closedWing = getWingSurface(formation, cometSide);
        if (closedTe && closedWing) {
          const post = findLandmarkByLabel(landmarks, "db", "MOF");
          if (post) answer.FS = { x: post.x, y: post.y };
        } else {
          const closedFirstEligible = getNumberThreeReceiver(formation, cometSide) || getNumberTwoReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
          const fs = getShade(closedFirstEligible, "db", "I");
          if (fs) answer.FS = { x: fs.x, y: fs.y };
        }
      }
    } else if (fsStrengthEligibleCount === 3 && fsNumberThree) {
      if (cometSide && cometSide === passAway) {
        const post = findLandmarkByLabel(landmarks, "db", "MOF");
        if (post) answer.FS = { x: post.x, y: post.y };
      } else {
        const fs = getShade(fsNumberThree, "db", "I");
        if (fs) answer.FS = { x: fs.x, y: fs.y };
      }
    } else {
      const post = findLandmarkByLabel(landmarks, "db", "MOF");
      if (post) answer.FS = { x: post.x, y: post.y };
    }

    if (!answer.BC && bcTarget) {
      const bc = getShade(bcTarget, "cb", "H");
      if (bc) answer.BC = { x: bc.x, y: bc.y };
    }

    applyOverhangRule(passAway, "BS");
  } else {
    if (cometSide && cometSide === passStrength) {
      const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
      const fs = getShade(cometFirstEligible, "db", "I");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (strongBunch?.numberThree) {
      const fs = getShade(strongBunch.numberThree, "db", "H");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (is22) {
      if (fsSlot) {
        const fs = getShade(fsSlot, "db", "I");
        if (fs) answer.FS = { x: fs.x, y: fs.y };
      } else if (fsNumberTwo) {
        const fs = getShade(fsNumberTwo, "db", "O");
        if (fs) answer.FS = { x: fs.x, y: fs.y };
      }
    } else if (fsStrengthEligibleCount === 3 && fsNumberThree && !isAttachedOrWingNumberThree(formation, passStrength)) {
      const fs = getShade(fsNumberThree, "db", "I");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (fsApex && (is31 || is32)) {
      answer.FS = { x: fsApex.x, y: fsApex.y };
    } else if (fsInline && fcTarget) {
      const fs = getShade(fsInline, "db", "O");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passStrength);
      if (edge) answer.FS = { x: edge.x, y: edge.y };
    }

    if (!answer.BC && bcTarget) {
      const bc = getShade(bcTarget, "cb", "H");
      if (bc) answer.BC = { x: bc.x, y: bc.y };
    }

    if (cometSide && cometSide === passAway) {
      const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
      const bs = getShade(cometFirstEligible, "db", "I");
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (formation.name.includes("Empty") && is32) {
      const bs = getShade(bsNumberTwo, "db", "I");
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (is22) {
      if (bsSlot) {
        const bs = getShade(bsSlot, "db", "I");
        if (bs) answer.BS = { x: bs.x, y: bs.y };
      } else if (bsNumberTwo) {
        const bs = getShade(bsNumberTwo, "db", "O");
        if (bs) answer.BS = { x: bs.x, y: bs.y };
      }
    } else if (is31) {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
      if (edge) answer.BS = { x: edge.x, y: edge.y };
    } else if (bsInline && bcTarget) {
      const bs = getShade(bsInline, "db", "O");
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
      if (edge) answer.BS = { x: edge.x, y: edge.y };
    }
  }

  return answer;
}

function getCheckResult(currentPlacements: PlayerDot[], answerKey: Record<string, { x: number; y: number }>, threshold = 0.75): CheckResult {
  const ghosts = Object.entries(answerKey).map(([id, pos]) => ({ id, x: pos.x, y: pos.y }));
  const incorrectIds = currentPlacements
    .filter((p) => {
      const target = answerKey[p.id];
      if (!target) return false;
      return Math.hypot(target.x - p.x, target.y - p.y) > threshold;
    })
    .map((p) => p.id);
  const requiredIds = Object.keys(answerKey);
  const placedIds = new Set(currentPlacements.map((p) => p.id));
  const isCorrect = incorrectIds.length === 0 && requiredIds.every((id) => placedIds.has(id));
  return { incorrectIds, ghosts, isCorrect };
}

function nearestLandmark(x: number, y: number, points: Landmark[]) {
  if (!points.length) return { x, y };
  return points.reduce((best, p) => {
    const bestDist = Math.hypot(best.x - x, best.y - y);
    const currentDist = Math.hypot(p.x - x, p.y - y);
    return currentDist < bestDist ? p : best;
  }, points[0]);
}

function Circle({ player, color = "bg-orange-600", text = "text-white", border = "border-white/30" }: {
  player: PlayerDot;
  color?: string;
  text?: string;
  border?: string;
}) {
  return (
    <div
      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[10px] font-bold shadow ${color} ${text} ${border}`}
      style={{ left: `${player.x}%`, top: `${player.y}%` }}
    >
      {player.id}
    </div>
  );
}

function TrainingField({
  enhancedLandmarks = false,
  offensePlayers,
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
  editableOffense = false,
  editableDefense = false,
  offenseGhostOffset = 0,
  dimOffenseOnAnswers = false,
  lockedOffenseIds = FIXED_OL_IDS as unknown as string[],
  onMoveOffense,
  onMoveDefense,
  onMoveDefenseGhost,
}: {
  enhancedLandmarks?: boolean;
  offensePlayers: PlayerDot[];
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
  editableOffense?: boolean;
  editableDefense?: boolean;
  offenseGhostOffset?: number;
  dimOffenseOnAnswers?: boolean;
  lockedOffenseIds?: string[];
  onMoveOffense?: (id: string, x: number, y: number) => void;
  onMoveDefense?: (id: string, x: number, y: number) => void;
  onMoveDefenseGhost?: (id: string, x: number, y: number) => void;
}) {
  const [drag, setDrag] = useState<{ id: string; type: "offense" | "defense" | "defense_ghost" } | null>(null);
  const maybeFlipY = (y: number, enabled: boolean) => (enabled ? 100 - y : y);

  const getPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 2, 98);
    const rawY = clamp(((e.clientY - rect.top) / rect.height) * 100, 2, 98);
    const y = drag?.type === "offense" && flipOffense ? 100 - rawY : rawY;
    return { x, y };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    const { x, y } = getPointer(e);
    if (drag.type === "offense" && onMoveOffense) onMoveOffense(drag.id, x, y);
    if (drag.type === "defense" && onMoveDefense) onMoveDefense(drag.id, x, y);
    if (drag.type === "defense_ghost" && onMoveDefenseGhost) onMoveDefenseGhost(drag.id, x, y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
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

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border bg-emerald-700"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setDrag(null)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_55%)]" />
      <div className="absolute left-0 right-0 border-t-2 border-dashed border-white/70" style={{ top: `${flipOffense ? 100 - 52 : 52}%` }} />
      {getLineXs(editableDefense).map((x, idx) => (
        <div key={idx} className="absolute bottom-[10%] top-[10%] w-px bg-sky-200/25" style={{ left: `${x}%` }} />
      ))}

      {offenseLandmarks.map((p) => (
        <div key={p.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${maybeFlipY(p.y, flipOffense)}%` }}>
          <div className="h-2 w-2 rounded-full border border-pink-100/80 bg-pink-200/50" />
        </div>
      ))}
      {defenseLandmarks.map((p) => {
        const showingAnswers = defenseGhosts.length > 0;
        const layerStyles = enhancedLandmarks
          ? {
              dl: "bg-red-300/40 border-red-100/50",
              lb: "bg-amber-200/40 border-amber-50/50",
              cb: "bg-blue-300/40 border-blue-100/50",
              db: "bg-violet-300/40 border-violet-100/50",
            }
          : {
              dl: "bg-sky-200/30 border-sky-100/50",
              lb: "bg-sky-200/30 border-sky-100/50",
              cb: "bg-sky-200/30 border-sky-100/50",
              db: "bg-sky-200/30 border-sky-100/50",
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

      {offenseGhosts.map((p) => (
        <div key={`og-${p.id}`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${clamp(p.x + offenseGhostOffset, 2, 98)}%`, top: `${maybeFlipY(p.y, flipOffense)}%` }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-red-300 border-dashed bg-white/80 text-[10px] font-bold text-slate-900">{p.id}</div>
        </div>
      ))}
      {defenseGhosts.map((p) => (
        <div
          key={`dg-${p.id}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onPointerDown={() => {
            if (!editableDefenseGhosts) return;
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
          onPointerDown={() => {
            if (!editableOffense) return;
            if (lockedOffenseIds.includes(p.id)) return;
            setDrag({ id: p.id, type: "offense" });
          }}
        >
          <Circle
            player={{ ...p, y: maybeFlipY(p.y, flipOffense) }}
            color={incorrectOffenseIds.includes(p.id) ? "bg-red-500" : undefined}
            border={incorrectOffenseIds.includes(p.id) ? "border-red-300" : undefined}
          />
        </div>
      ))}
      {defensePlayers.map((p) => {
        const showingAnswers = defenseGhosts.length > 0;
        return (
          <div
            key={p.id}
            onPointerDown={() => {
              if (!editableDefense) return;
              setDrag({ id: p.id, type: "defense" });
            }}
          >
            <Circle
              player={p}
              color={incorrectDefenseIds.includes(p.id) ? "bg-red-500" : "bg-sky-600"}
              text={showingAnswers ? "text-black" : "text-white"}
              border={incorrectDefenseIds.includes(p.id) ? "border-red-300" : "border-sky-200/40"}
            />
          </div>
        );
      })}

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
  const [enhancedLandmarks, setEnhancedLandmarks] = useState(true);
  const [frontMode, setFrontMode] = useState<FrontMode>("4-3");
  const [mode, setMode] = useState<AppMode>("study");
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [scoredAttemptKey, setScoredAttemptKey] = useState<string | null>(null);
  const [attemptStartedAt, setAttemptStartedAt] = useState<number>(Date.now());
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<PlaybookKey[]>(["Foothill", "Pro", "Wing T"]);
  const [personnelFilter, setPersonnelFilter] = useState<string>("Any");
  const [index, setIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers>({ formation: "", runStrength: "", passStrength: "" });
  const [showQuizFeedback, setShowQuizFeedback] = useState(false);
  const [showQuizAnswers, setShowQuizAnswers] = useState(false);
  const [quizReadyForNext, setQuizReadyForNext] = useState(false);
  const [alignmentPlacements, setAlignmentPlacements] = useState<Record<string, PlayerDot[]>>({});
  const [offensePlacements, setOffensePlacements] = useState<Record<string, PlayerDot[]>>({});
  const [showAlignmentCheck, setShowAlignmentCheck] = useState(false);
  const [showOffenseCheck, setShowOffenseCheck] = useState(false);
  const [editorOverrides, setEditorOverrides] = useState<Record<string, FormationMeta>>({});
  const [customAlignmentLandmarks, setCustomAlignmentLandmarks] = useState<Record<string, Landmark[]>>({});
  
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
  });

   useEffect(() => {
  const checkAuth = async () => {
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
  .select("display_name, school, seconds_used")
  .eq("id", user.id)
  .single();

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
};

if (Array.isArray(scoreRows)) {
  for (const row of scoreRows) {
    if (row.mode === "quiz" || row.mode === "offense_build" || row.mode === "alignment") {
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
  baseStats.alignment.points;

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
      const { data: teamProfiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, display_name, school, seconds_used")
        .eq("school", currentUser.teamCode);

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
        if (row.mode !== "quiz" && row.mode !== "offense_build" && row.mode !== "alignment") {
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
          stats.alignment.points;

        return {
          id: profile.id,
          name: profile.display_name || "User",
          teamCode: profile.school || currentUser.teamCode,
          stats,
        };
      });

      setLeaderboardEntries(nextEntries);
    };

    void loadLeaderboard();
  }, [currentUser?.teamCode]);

  useEffect(() => {
    if (!currentUser) return;

    setLeaderboardEntries((prev) => {
      const existing = prev.find((entry) => entry.id === currentUser.id);
      const nextEntry: LeaderboardEntry = {
        id: currentUser.id,
        name: currentUser.name,
        teamCode: currentUser.teamCode,
        stats: currentUser.stats,
      };

      if (!existing) {
        return [...prev, nextEntry];
      }

      return prev.map((entry) => (entry.id === currentUser.id ? nextEntry : entry));
    });
  }, [currentUser]);

  const effectivePlaybooks: PlaybookKey[] = mode === "offense_build" ? ["Foothill"] : selectedPlaybooks;

  const pool = useMemo(() => {
    return ALL_FORMATIONS.filter((f) => effectivePlaybooks.includes(f.playbook) && (personnelFilter === "Any" || f.personnel === personnelFilter));
  }, [effectivePlaybooks, personnelFilter]);
  const current = pool[index % Math.max(pool.length, 1)] ?? ALL_FORMATIONS[0];
  const formationKey = `${current.playbook}::${current.name}`;
  const displayFormation = useMemo(() => {
    let base;

    if (current.playbook === "Wing T" || current.name.startsWith("Wing T")) {
      base = buildWingTFormation(current.name, mode === "alignment");
    } else if (current.playbook === "Foothill") {
      base = buildFoothillFormation(current.name, mode === "alignment");
    } else {
      base = buildProFormation(current.name, mode === "alignment");
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
    { key: "quiz", title: "Quiz" },
    { key: "offense_build", title: "Offensive" },
    { key: "alignment", title: "Alignment" },
  ] as const;
  const leaderboardBoards = useMemo(() => {
    return leaderboardModeMeta.map(({ key, title }) => ({
      key,
      title,
      entries: [...leaderboardEntries]
        .sort((a, b) => {
          const pointDiff = b.stats[key].points - a.stats[key].points;
          if (pointDiff !== 0) return pointDiff;

          const bestA = a.stats[key].bestTimeMs ?? Number.POSITIVE_INFINITY;
          const bestB = b.stats[key].bestTimeMs ?? Number.POSITIVE_INFINITY;
          if (bestA !== bestB) return bestA - bestB;

          return a.name.localeCompare(b.name);
        })
        .slice(0, 5),
    }));
  }, [leaderboardEntries]);

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

  useEffect(() => {
    setShowQuizFeedback(false);
    setShowQuizAnswers(false);
    setQuizReadyForNext(false);
    setShowAlignmentCheck(false);
    setShowOffenseCheck(false);
    setEditingAlignmentAnswers(false);
    setQuizAnswers({ formation: "", runStrength: "", passStrength: "" });
    setScoredAttemptKey(null);
    setAttemptStartedAt(Date.now());
  }, [current.name, mode]);

  useEffect(() => {
    if (!pool.length) return;
    setIndex((prev) => getRandomPoolIndex(pool.length, prev));
  }, [mode]);

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

  const offenseAnswerKey = useMemo(() => getOffenseAnswerKeyFromFormation(displayFormation), [displayFormation]);
  const offenseCheck = useMemo(() => getCheckResult(offenseBuildPlayers, offenseAnswerKey, 0.75), [offenseBuildPlayers, offenseAnswerKey]);
  const alignmentAnswerKey = useMemo(() => {
    return getAlignmentAnswerKey(displayFormation, alignmentLandmarks, frontMode);
  }, [displayFormation, alignmentLandmarks, frontMode]);
  const alignmentCheck = useMemo(() => getCheckResult(alignmentPlayers, alignmentAnswerKey, 1.0), [alignmentPlayers, alignmentAnswerKey]);
  const alignmentSpecialCases = useMemo(() => getAlignmentSpecialCases(displayFormation, frontMode), [displayFormation, frontMode]);


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
  const supabase = createClient();

  if (currentUser?.id) {
    await persistSecondsUsed(currentUser.id, currentSecondsRef.current);
  }
  await supabase.auth.signOut();

  setCurrentUser(null);
  router.push("/login");
};

  const getSpeedBonus = (activeMode: "quiz" | "offense_build" | "alignment", elapsedMs: number) => {
    const seconds = elapsedMs / 1000;
    if (activeMode === "quiz") {
      if (seconds <= 6) return 30;
      if (seconds <= 10) return 20;
      if (seconds <= 15) return 10;
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
    activeMode: "quiz" | "offense_build" | "alignment",
    nextModeStats: ModeScoreStats,
  ) => {
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
      console.error("Failed to save mode score", error);
    }
  };

  const persistSecondsUsed = async (userId: string, secondsUsed: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ seconds_used: secondsUsed })
      .eq("id", userId);

    if (error) {
      console.error("Failed to save total seconds used", error);
    }
  };

  const scoreAttempt = (activeMode: "quiz" | "offense_build" | "alignment", accuracy: number, isCorrect: boolean) => {
    if (!currentUser) return;
    const attemptKey = `${activeMode}::${formationKey}`;
    if (scoredAttemptKey === attemptKey) return;

    const elapsedMs = Math.max(250, Date.now() - attemptStartedAt);
    const accuracyPoints = Math.round(accuracy * 100);
    const speedBonus = activeMode === "alignment"
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

    setScoredAttemptKey(attemptKey);
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

  useEffect(() => {
    if (showQuizFeedback) {
      scoreAttempt("quiz", quizScore / 3, quizScore === 3);
    }
  }, [showQuizFeedback, quizScore, formationKey]);

  useEffect(() => {
    if (showOffenseCheck) {
      const total = Object.keys(offenseAnswerKey).length || 1;
      const wrong = offenseCheck.incorrectIds.length;
      const placedCount = offenseBuildPlayers.length;
      const missing = Math.max(0, total - placedCount);
      const accuracy = Math.max(0, (total - wrong - missing) / total);
      scoreAttempt("offense_build", accuracy, offenseCheck.isCorrect);
    }
  }, [showOffenseCheck, offenseCheck.isCorrect, offenseCheck.incorrectIds.length, formationKey, offenseBuildPlayers.length]);

  useEffect(() => {
    if (showAlignmentCheck) {
      const total = Object.keys(alignmentAnswerKey).length || 1;
      const wrong = alignmentCheck.incorrectIds.length;
      const placedCount = alignmentPlayers.length;
      const missing = Math.max(0, total - placedCount);
      const accuracy = Math.max(0, (total - wrong - missing) / total);
      scoreAttempt("alignment", accuracy, alignmentCheck.isCorrect);
    }
  }, [showAlignmentCheck, alignmentCheck.isCorrect, alignmentCheck.incorrectIds.length, formationKey, alignmentPlayers.length]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl border bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{getModeTitle(mode)}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                                {authChecked ? (
  <Button variant="outline" className="rounded-xl" onClick={handleLogout}>
    Log Out
  </Button>
) : null}

                <div className="min-w-[180px]">
                  <Select value={mode} onValueChange={(value: AppMode) => { setMode(value); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MODE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[220px]">
                  {mode === "offense_build" ? (
                    <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Foothill</div>
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
                {mode === "offense_build" ? null : (
                  <div className="min-w-[120px]">
                    <Select value={personnelFilter} onValueChange={(value: string) => { setPersonnelFilter(value); setIndex(0); }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONNEL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option === "Any" ? "Any" : `${option}P`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button className="rounded-xl" onClick={nextCall}>
                  <Shuffle className="mr-2 h-4 w-4" />
                  Randomize
                </Button>
              </div>
            </div>
            {mode !== "quiz" && mode !== "account" && (
              <div className="rounded-xl border bg-white p-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                {displayFormation.name}
                <div className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{displayFormation.playbook}</div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
           {mode === "account" ? (
  <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        {currentUser ? (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border bg-white p-4">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <User className="h-4 w-4" />
                User
              </div>
              <div className="text-lg font-semibold text-slate-900">{currentUser.name}</div>
              <div className="text-sm text-slate-500">Team: {currentUser.teamCode}</div>
            </div>

            <div className="rounded-xl border bg-white p-4">
              <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
                <Trophy className="h-4 w-4" />
                Points
              </div>
              <div className="text-lg font-semibold text-slate-900">{currentUser.stats.totalPoints}</div>
              <div className="text-sm text-slate-500">
                Quiz {currentUser.stats.quiz.points} • Offense {currentUser.stats.offense_build.points} • Align {currentUser.stats.alignment.points}
              </div>
            </div>

            <div className="rounded-xl border bg-white p-4">
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

    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-slate-900">Mode Leaderboards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboardBoards.map((board) => (
          <div key={board.key} className="space-y-2">
            <div className="text-sm font-semibold text-slate-900">{board.title}</div>
            {board.entries.length ? (
              board.entries.map((entry, idx) => (
                <div key={`${board.key}-${entry.id}`} className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">
                      #{idx + 1} {entry.name}
                    </div>
                    <div className="text-slate-500">
                      {entry.stats[board.key].correct}/{entry.stats[board.key].attempts} correct
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">{entry.stats[board.key].points} pts</div>
                    <div className="text-slate-500">
                      {entry.stats[board.key].bestTimeMs
                        ? `${(entry.stats[board.key].bestTimeMs / 1000).toFixed(1)}s best`
                        : "—"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">
                No scores yet for this team.
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  </div>

            ) : mode === "study" ? (
              <>
                <TrainingField
                  offensePlayers={displayFormation.players}
                  overlayLabel={`${displayFormation.playbook} • ${displayFormation.family} • ${displayFormation.personnel}P • Run ${FIELD_LABELS[displayFormation.runStrength]} • Pass ${FIELD_LABELS[displayFormation.passStrength]}`}
                />
                <div className="grid gap-3 md:grid-cols-4">
                  <Card className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Playbook</div>
                      <div className="mt-1 text-lg font-semibold">{displayFormation.playbook}</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Family</div>
                      <div className="mt-1 text-lg font-semibold">{getQuizFormationFamily(displayFormation.name)}</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Run Strength</div>
                      <div className="mt-1 text-lg font-semibold">{FIELD_LABELS[displayFormation.runStrength]}</div>
                    </CardContent>
                  </Card>
                  <Card className="rounded-xl">
                    <CardContent className="p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Pass Strength</div>
                      <div className="mt-1 text-lg font-semibold">{FIELD_LABELS[displayFormation.passStrength]}</div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : mode === "quiz" ? (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                  <TrainingField offensePlayers={displayFormation.players} />
                  <div className="rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-sm">
                    <div className="mb-4 text-base font-bold text-slate-800">Your Answers</div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Formation</div>
                        <Input className="h-12 border-2 border-slate-300 bg-white text-base" placeholder="Trips, Doubles, B Trey..." value={quizAnswers.formation} onChange={(e) => setQuizAnswers((prev) => ({ ...prev, formation: e.target.value }))} />
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Run Strength</div>
                        <Input className="h-12 border-2 border-slate-300 bg-white text-base" placeholder="Left or Right" value={quizAnswers.runStrength} onChange={(e) => setQuizAnswers((prev) => ({ ...prev, runStrength: e.target.value }))} />
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Pass Strength</div>
                        <Input
                          className="h-12 border-2 border-slate-300 bg-white text-base"
                          placeholder="Left or Right"
                          value={quizAnswers.passStrength}
                          onChange={(e) => setQuizAnswers((prev) => ({ ...prev, passStrength: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (showQuizFeedback && quizScore === 3 && quizReadyForNext) {
                                nextCall();
                              } else {
                                submitQuiz();
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-500">
                      Enter only the formation family for Formation. Example: <span className="font-semibold text-slate-700">B Doubles</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border bg-white p-4">
                  <Button className="h-12 w-full rounded-xl text-base" onClick={submitQuiz}>
                    Check Answers
                  </Button>
                  <Button variant="outline" className="h-12 w-full rounded-xl text-base" onClick={() => { setShowQuizAnswers(true); setShowQuizFeedback(true); setQuizReadyForNext(false); }}>
                    Show Answers
                  </Button>
                  {showQuizAnswers ? (
                    <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                      <div>
                        <span className="font-semibold">Formation:</span> {correctQuizAnswers.formation}
                      </div>
                      <div>
                        <span className="font-semibold">Run Strength:</span> {correctQuizAnswers.runStrength}
                      </div>
                      <div>
                        <span className="font-semibold">Pass Strength:</span> {correctQuizAnswers.passStrength}
                      </div>
                    </div>
                  ) : null}
                  {showQuizFeedback ? (
                    <>
                      <div className="text-sm font-semibold text-slate-700">Score: {quizScore} / 3</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between rounded-lg border p-3"><span>Formation</span>{quizResult.formation ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                        <div className="flex items-center justify-between rounded-lg border p-3"><span>Run Strength</span>{quizResult.runStrength ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                        <div className="flex items-center justify-between rounded-lg border p-3"><span>Pass Strength</span>{quizResult.passStrength ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                      </div>
                      {quizScore === 3 && (
                        <div className="mt-3 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-center text-sm font-semibold text-emerald-700">
                          All 3 correct. Press Enter again for the next formation
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-xl border border-dashed p-3 text-sm text-slate-500">
                      Fill in the three answer boxes below the field, then press <span className="font-semibold">Check Answers</span>.
                    </div>
                  )}
                </div>
              </div>
            ) : mode === "alignment" ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <div className="min-w-[110px]">
                      <Select value={frontMode} onValueChange={(value: FrontMode) => setFrontMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4-3">4-3</SelectItem>
                          <SelectItem value="4-4">4-4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button variant="outline" className="rounded-xl" onClick={() => setEnhancedLandmarks((p) => !p)}>
                      Toggle Landmark Visibility
                    </Button>
                  </div>
                  <TrainingField
                    offensePlayers={displayFormation.players}
                    defensePlayers={alignmentPlayers}
                    defenseLandmarks={alignmentLandmarks}
                    enhancedLandmarks={enhancedLandmarks}
                    editableDefense
                    incorrectDefenseIds={showAlignmentCheck ? alignmentCheck.incorrectIds : []}
                    defenseGhosts={showAlignmentCheck ? alignmentCheck.ghosts : []}
                    overlayLabel="Drag defenders to the defensive landmarks."
                    onMoveDefense={moveDefender}
                  />
                </div>
                <div className="space-y-4">
                  <TokenTray title="Defender Tray" ids={remainingDefenders as unknown as string[]} onAdd={addDefender} />
                  <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                    <div>Drag defenders to the defensive landmarks. Front: {frontMode}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="rounded-xl" onClick={() => setShowAlignmentCheck(true)}>Check</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => setShowAlignmentCheck(false)}>Hide Answers</Button>
                    </div>
                    {showAlignmentCheck ? (
                      <div className="space-y-3">
                        <div>Wrong defenders are highlighted in red. Dashed circles show answer-key spots.</div>
                        {alignmentCheck.isCorrect ? (
                          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" /> Correct Alignment
                          </div>
                        ) : null}
                        {alignmentSpecialCases.length ? (
                          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                            <div className="mb-2 font-semibold">Special-case feedback</div>
                            <div className="space-y-2">
                              {alignmentSpecialCases.map((note, idx) => (
                                <div key={idx}>• {note}</div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
                          ) : mode === "editor" ? (
              currentUser?.isAdmin ? (
                <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                  <TrainingField
                    offensePlayers={displayFormation.players}
                    editableOffense
                    lockedOffenseIds={[]}
                    onMoveOffense={moveEditorPlayer}
                    overlayLabel="Drag any player to edit the formation. Use Save to keep your changes."
                  />
                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="mb-3 text-sm font-semibold text-slate-700">Formation Info</div>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</div>
                          <Input
                            value={editorDraft.name}
                            onChange={(e) =>
                              setEditorDraft((prev) => ({ ...prev, name: e.target.value }))
                            }
                          />
                        </div>

                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Personnel</div>
                          <Input
                            value={editorDraft.personnel}
                            onChange={(e) =>
                              setEditorDraft((prev) => ({ ...prev, personnel: e.target.value }))
                            }
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Run Strength</div>
                            <Select
                              value={editorDraft.runStrength}
                              onValueChange={(value: Side) =>
                                setEditorDraft((prev) => ({ ...prev, runStrength: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pass Strength</div>
                            <Select
                              value={editorDraft.passStrength}
                              onValueChange={(value: Side) =>
                                setEditorDraft((prev) => ({ ...prev, passStrength: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Backfield</div>
                          <Input
                            value={editorDraft.backfield}
                            onChange={(e) =>
                              setEditorDraft((prev) => ({ ...prev, backfield: e.target.value }))
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-white p-4 text-sm text-slate-600">
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="rounded-xl" onClick={saveEditorChanges}>
                          Save
                        </Button>
                        <Button variant="outline" className="rounded-xl" onClick={resetEditorChanges}>
                          Reset
                        </Button>
                      </div>
                      <div className="mt-3">
                        This editor updates the current formation&apos;s saved name, personnel, strengths, backfield, and player locations.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border bg-white p-6 text-center text-slate-700">
                  <div className="text-lg font-semibold">Admin Access Required</div>
                  <div className="mt-2 text-sm text-slate-500">
                    You do not have permission to edit formations.
                  </div>
                </div>
              )

            ) : (
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <TrainingField
                  offensePlayers={[...baseLine(false), ...offenseBuildPlayers]}
                  offenseLandmarks={offenseLandmarks}
                  offenseGhostOffset={showOffenseCheck ? 1.6 : 0}
                  dimOffenseOnAnswers={showOffenseCheck}
                  editableOffense
                  flipOffense
                  onMoveOffense={moveOffense}
                  incorrectOffenseIds={showOffenseCheck ? offenseCheck.incorrectIds : []}
                  offenseGhosts={showOffenseCheck ? offenseCheck.ghosts : []}
                  overlayLabel="Drag QB, RB, X, Y, H, Z to the offensive landmarks."
                />
                <div className="space-y-4">
                  <TokenTray title="Offense Tray" ids={remainingOffense as unknown as string[]} onAdd={addOffense} />
                  <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                    <div>Drag offensive pieces to the shared landmark grid.</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button className="rounded-xl" onClick={() => setShowOffenseCheck(true)}>Check</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => setShowOffenseCheck(false)}>Hide Answers</Button>
                    </div>
                    {showOffenseCheck ? (
                      <div className="space-y-2">
                        <div>Wrong players are highlighted in red. Dashed circles show the correct spots.</div>
                        {offenseCheck.isCorrect ? (
                          <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700">
                            <CheckCircle2 className="h-5 w-5" /> Correct Formation
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
