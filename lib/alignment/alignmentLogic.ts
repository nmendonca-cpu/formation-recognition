import { type FrontMode } from "@/lib/blitz/blitzLogic";
import {
  CB_Y,
  DB_Y,
  DEFENDER_TOKENS,
  DL_Y,
  FIXED_OL_IDS,
  LB_Y,
  LOS_Y,
  OFF_Y,
  WING_Y,
  countsAsNonBackfieldEligible,
  dedupeLandmarks,
  getAttached,
  getFormationLineXs,
  getMidpoint,
  isEligibleSkillPlayer,
  isSplitOutWideEligible,
  isTrueWideReceiver,
  isWingLikePlayer,
  type CheckResult,
  type FormationMeta,
  type Landmark,
  type LandmarkLayer,
  type PlayerDot,
  type Side,
} from "@/lib/formation/formationLogic";

export function getAlignmentLandmarks(formation: FormationMeta): Landmark[] {

  const offense = formation.players;
  const skill = offense.filter((p) => isEligibleSkillPlayer(p));
  const points: Landmark[] = [];
  const push = (id: string, x: number, y: number, label: string, layer: LandmarkLayer) => points.push({ id, x, y, label, layer });
  const xs = getFormationLineXs(formation);

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
        push(`dl-${side}-9t-bunch`, numberTwo.x + awayFromCenter, DL_Y, "9T", "dl");
      }
      return;
    }

    if (!surfaceInfo) return;

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
    const outsideTightStep = 3.4;

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
      push(`lb-${te.id}-60t`, te.x, LB_Y, "60T", "lb");

      if (wing) {
        // 70T tracks the same outside alignment family as a 7T so it sits directly behind that edge landmark.
        const teOutsideX = side === "left" ? te.x - 2.2 : te.x + 2.2;
        push(`lb-${te.id}-70t`, teOutsideX, LB_Y, "70T", "lb");
        const wingOutsideX = side === "left" ? wing.x - outsideTightStep : wing.x + outsideTightStep;
        push(`lb-${wing.id}-90t`, wingOutsideX, LB_Y, "90T", "lb");
      } else {
        // 70T = outside shoulder of TE when no wing
        const teOutsideX = side === "left" ? te.x - outsideTightStep : te.x + outsideTightStep;
        push(`lb-${te.id}-70t`, teOutsideX, LB_Y, "70T", "lb");
      }
      return;
    }

    if (wing) {
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      const wingOutsideX = side === "left" ? wing.x - outsideTightStep : wing.x + outsideTightStep;
      push(`lb-${wing.id}-50t`, fiveTX, LB_Y, "50T", "lb");
      push(`lb-${wing.id}-60t`, wing.x, LB_Y, "60T", "lb");
      push(`lb-${wing.id}-70t`, wingOutsideX, LB_Y, "70T", "lb");
    } else {
      const fiveTX = side === "left" ? xs[0] - 2.2 : xs[4] + 2.2;
      push(`lb-${side}-50t-open`, fiveTX, LB_Y, "50T", "lb");
    }
  };

  addLbTeRule(inlineLeft, wingLeft, "left");
  addLbTeRule(inlineRight, wingRight, "right");

  const isLbApexPlayer = (p: PlayerDot) => !inlineTeIds.has(p.id) && !isWingLikePlayer(p);
  const hasConsiderableApexSpace = (a: PlayerDot | number, b: PlayerDot | number) => {
    const aX = typeof a === "number" ? a : a.x;
    const bX = typeof b === "number" ? b : b.x;
    return Math.abs(aX - bX) >= 6;
  };
  const isTightTeWingCombo = (a: PlayerDot | null, b: PlayerDot | null) => {
    if (!a || !b) return false;
    const aInline = inlineTeIds.has(a.id);
    const bInline = inlineTeIds.has(b.id);
    const aWing = isWingLikePlayer(a);
    const bWing = isWingLikePlayer(b);
    return (aInline && bWing) || (bInline && aWing);
  };

  skill.forEach((p, idx) => {
    const spread = 1.9 + (idx % 3) * 0.25;
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
    const bunchOnSide = isBunchFamilyOnSide(formation, side);
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
    if (!bunchOnSide && isLbApexPlayer(next)) {
      push(`lb-${side}-apex`, apexX, LB_Y, "Apex", "lb");
    }
    if (hasConsiderableApexSpace(emolosX, next) && !(inlineEmolos && isTightTeWingCombo(inlineEmolos, next))) {
      push(`db-${side}-apex`, apexX, DB_Y, "Apex", "db");
    }
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
    const bunchOnSide = isBunchFamilyOnSide(formation, side);
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
        if (!hasConsiderableApexSpace(a, b)) continue;
        const extraApexX = (a.x + b.x) / 2;
        if (!bunchOnSide && isLbApexPlayer(a) && isLbApexPlayer(b)) {
          push(`lb-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, LB_Y, "Apex", "lb");
        }
        push(`db-${side}-apex-extra-${a.id}-${b.id}`, extraApexX, DB_Y, "Apex", "db");
      }
    }
  });

  if (isWingTUnbalancedFormation(formation)) {
    const strongSide = formation.passStrength;
    const strongWing = getWingSurface(formation, strongSide);
    const strongWide = getOutsideReceiver(formation, strongSide);
    if (strongWing && strongWide && hasConsiderableApexSpace(strongWing, strongWide)) {
      push(`lb-${strongSide}-unbalanced-wing-wide-apex`, getMidpoint(strongWing.x, strongWide.x), LB_Y, "Apex", "lb");
    }
  }

  (["left", "right"] as Side[]).forEach((side) => {
    const bunchOnSide = isBunchFamilyOnSide(formation, side);
    const numberOne = getOutsideReceiver(formation, side);
    const numberTwo = getNumberTwoReceiver(formation, side);
    if (!numberOne || !numberTwo) return;
    if (!bunchOnSide && hasConsiderableApexSpace(numberOne, numberTwo) && !isTightTeWingCombo(numberOne, numberTwo)) {
      push(`lb-${side}-apex-12`, getMidpoint(numberOne.x, numberTwo.x), LB_Y, "Apex", "lb");
    }
    if (hasConsiderableApexSpace(numberOne, numberTwo) && !isTightTeWingCombo(numberOne, numberTwo)) {
      push(`db-${side}-apex-12`, getMidpoint(numberOne.x, numberTwo.x), DB_Y, "Apex", "db");
    }
  });

  push("db-left-edge", xs[0], DB_Y, "Edge", "db");
  push("db-left-hash", xs[1], DB_Y, "Hash", "db");
  push("db-mof", xs[2], DB_Y, "MOF", "db");
  push("db-right-hash", xs[3], DB_Y, "Hash", "db");
  push("db-right-edge", xs[4], DB_Y, "Edge", "db");

  return dedupeLandmarks(points);
}

export function getDefensePlayersFromAnswerKey(answerKey: Record<string, { x: number; y: number }>): PlayerDot[] {
  return DEFENDER_TOKENS
    .filter((id) => Boolean(answerKey[id]))
    .map((id) => ({
      id,
      x: answerKey[id].x,
      y: answerKey[id].y,
    }));
}

export function findLandmarkByLabel(landmarks: Landmark[], layer: LandmarkLayer, label: string, side?: Side) {
  let filtered = landmarks.filter((p) => p.layer === layer && p.label === label);
  if (side) filtered = filtered.filter((p) => (side === "left" ? p.x < 50 : p.x > 50));
  if (!filtered.length) return null;
  if (!side) return filtered[0];
  return side === "left"
    ? filtered.reduce((best, p) => (p.x > best.x ? p : best), filtered[0])
    : filtered.reduce((best, p) => (p.x < best.x ? p : best), filtered[0]);
}

export function findEligibleOnSide(formation: FormationMeta, side: Side) {
  return formation.players
    .filter((p) => ![...FIXED_OL_IDS, "QB"].includes(p.id as any))
    .filter((p) => (side === "left" ? p.x < 50 : p.x > 50));
}

export function findTrueEligiblesOnSide(formation: FormationMeta, side: Side) {
  return findEligibleOnSide(formation, side).filter(countsAsNonBackfieldEligible);
}

export function getOrderedReceivers(formation: FormationMeta, side: Side) {
  const players = findTrueEligiblesOnSide(formation, side);
  return [...players].sort((a, b) => (side === "left" ? a.x - b.x : b.x - a.x));
}

export function getOutsideReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered[0] || null;
}

export function getNumberTwoReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered.length >= 2 ? ordered[1] : null;
}

export function getNumberThreeReceiver(formation: FormationMeta, side: Side) {
  const ordered = getOrderedReceivers(formation, side);
  return ordered.length >= 3 ? ordered[2] : null;
}

export function getSlotReceiver(formation: FormationMeta, side: Side) {
  const numberTwo = getNumberTwoReceiver(formation, side);
  if (!numberTwo) return null;

  const inline = getInlineSurface(formation, side);
  const isInlineNumberTwo = inline?.id === numberTwo.id;
  const isWingNumberTwo = isWingLikePlayer(numberTwo);

  // A slot is defined by his relation to the OL, not by being on or off the ball.
  // So #2 counts as a slot if he is not the inline TE surface and not a wing.
  return !isInlineNumberTwo && !isWingNumberTwo ? numberTwo : null;
}

export function getTightSurfaceSlotReceiver(formation: FormationMeta, side: Side) {
  return getSlotReceiver(formation, side);
}

export function getInlineSurface(formation: FormationMeta, side: Side) {
  const xs = getFormationLineXs(formation);
  const tackleX = side === "left" ? xs[0] : xs[4];
  const players = findEligibleOnSide(formation, side)
    .filter((p) => Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - tackleX) <= 10)
    .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
  return players[0] || null;
}

export function getWingSurface(formation: FormationMeta, side: Side) {
  const xs = getFormationLineXs(formation);
  const tackleX = side === "left" ? xs[0] : xs[4];
  const players = findEligibleOnSide(formation, side)
    .filter((p) => Math.abs(p.y - WING_Y) < 0.75 && Math.abs(p.x - tackleX) <= 10)
    .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
  if (!players.length && formation.name.includes("B Trips")) {
    const attachedWing = findEligibleOnSide(formation, side)
      .filter((p) => p.id === "H" && Math.abs(p.y - WING_Y) < 1.25 && Math.abs(p.x - tackleX) <= 10)
      .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
    return attachedWing[0] || null;
  }
  return players[0] || null;
}

export function getBunchPlayers(formation: FormationMeta, side: Side) {
  const xs = getFormationLineXs(formation);
  const tackleX = side === "left" ? xs[0] : xs[4];
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

export function getBunchNumberedReceivers(formation: FormationMeta, side: Side) {
  const bunch = getBunchPlayers(formation, side);
  return {
    numberThree: bunch[0] || null,
    numberTwo: bunch[1] || null,
    numberOne: bunch[2] || null,
  };
}

export function isBunchFamilyOnSide(formation: FormationMeta, side: Side) {
  const name = formation.name.toLowerCase();
  if (!name.includes("bunch")) return false;
  return side === formation.passStrength;
}

export function hasTrueWideReceiverOnSide(formation: FormationMeta, side: Side) {
  return findEligibleOnSide(formation, side).some((p) => isTrueWideReceiver(p));
}

export function getBackfieldOffsetSide(formation: FormationMeta): Side | null {
  const back = formation.players.find((p) => ["RB", "F"].includes(p.id) && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
  if (!back) return null;
  return back.x < 50 ? "left" : "right";
}

export function getFullbackOffsetSide(formation: FormationMeta): Side | null {
  const fullback = formation.players.find((p) => p.id === "F" && Math.abs(p.y - OFF_Y) > 1 && p.x !== 50);
  if (!fullback) return null;
  return fullback.x < 50 ? "left" : "right";
}

export function isWingTUnbalancedFormation(formation: FormationMeta) {
  return formation.playbook === "Wing T" && formation.name.includes("Unbalanced");
}

export function isAceTreyFormation(formation: FormationMeta) {
  return formation.playbook === "Pro" && formation.name.startsWith("Ace Trey");
}

export function getNextClosedBumpLabel(label: "30T" | "40T" | "50T") {
  if (label === "30T") return "40T";
  if (label === "40T") return "50T";
  return "60T";
}

export function isClosedSurfaceOnlySide(formation: FormationMeta, side: Side) {
  if (isWingTUnbalancedFormation(formation) && findTrueEligiblesOnSide(formation, side).length === 0) {
    return true;
  }
  const inline = getInlineSurface(formation, side);
  const wing = getWingSurface(formation, side);
  const slot = getSlotReceiver(formation, side);
  return Boolean(inline || wing) && !hasTrueWideReceiverOnSide(formation, side) && !slot;
}

export function shouldBossIlbs(formation: FormationMeta) {
  if (formation.playbook === "Wing T" || formation.family === "Wing T" || formation.name.startsWith("Wing T") || formation.name.startsWith("Double Wing")) {
    if (formation.name.includes("Near")) return true;
    return false;
  }

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

export function shouldWillPlay50InEmpty(formation: FormationMeta, willSide: Side) {
  if (!formation.name.includes("Empty")) return false;

  const leftEligibles = findTrueEligiblesOnSide(formation, "left");
  const rightEligibles = findTrueEligiblesOnSide(formation, "right");
  const isThreeByTwo = (leftEligibles.length === 3 && rightEligibles.length === 2) || (leftEligibles.length === 2 && rightEligibles.length === 3);
  if (!isThreeByTwo) return false;

  return Boolean(getSlotReceiver(formation, willSide));
}

export function getThreeByOneStrongSide(formation: FormationMeta): Side | null {
  const leftCount = findTrueEligiblesOnSide(formation, "left").length;
  const rightCount = findTrueEligiblesOnSide(formation, "right").length;
  if (leftCount === 3 && rightCount === 1) return "left";
  if (rightCount === 3 && leftCount === 1) return "right";
  return null;
}

export function shouldMikeApexFlexedThree(formation: FormationMeta, mikeSide: Side) {
  const strongSide = getThreeByOneStrongSide(formation);
  if (!strongSide || strongSide !== mikeSide) return false;
  if (isClosedSurfaceOnlySide(formation, mikeSide)) return false;

  const numberThree = getNumberThreeReceiver(formation, mikeSide);
  if (!numberThree) return false;

  const xs = getFormationLineXs(formation);
  const tackleX = mikeSide === "left" ? xs[0] : xs[4];
  const isFlexed = !isWingLikePlayer(numberThree) && Math.abs(numberThree.x - tackleX) > 8;
  return isFlexed;
}

export function isAttachedOrWingNumberThree(formation: FormationMeta, side: Side) {
  const numberThree = getNumberThreeReceiver(formation, side);
  if (!numberThree) return false;
  const inline = getInlineSurface(formation, side);
  if (inline?.id === numberThree.id) return true;
  if (isWingLikePlayer(numberThree)) return true;
  return false;
}

export function hasTeAndWingSurface(formation: FormationMeta, side: Side) {
  return Boolean(getInlineSurface(formation, side) && getWingSurface(formation, side));
}

export function getAlignmentSpecialCases(formation: FormationMeta, frontMode: FrontMode = "4-3"): string[] {
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
  const closedThreeByOne44Notes =
    frontMode === "4-4" &&
    ((isClosedSurfaceOnlySide(formation, "left") && !isClosedSurfaceOnlySide(formation, "right") && findTrueEligiblesOnSide(formation, "right").length === 3) ||
      (isClosedSurfaceOnlySide(formation, "right") && !isClosedSurfaceOnlySide(formation, "left") && findTrueEligiblesOnSide(formation, "left").length === 3));
  if (closedAndBoss43Notes) {
    notes.push("Closed + boss: Mike and Will to 20T toward TE/FB.");
  } else if (closedThreeByOne44Notes) {
    notes.push("Closed 3x1 in 4-4: Mike 6T vs TE+Wing, otherwise 70T; Will 30T to pass strength, BS 10T weak.");
  } else if ((leftCount === 3 && isClosedSurfaceOnlySide(formation, "right")) || (rightCount === 3 && isClosedSurfaceOnlySide(formation, "left"))) {
    notes.push("Closed 3x1: Mike 6T vs TE+Wing, 70T if #3 is attached, Apex if #3 is flexed.");
  } else if (mikeStrengthEligibles === 3) {
    notes.push("Mike: to strength. 6T vs TE+Wing, 70T if #3 attached, apex if #3 flexed.");
  } else {
    notes.push("Mike: to strength. 10T with run strength, 30T away.");
  }

  if (formation.name.includes("Empty") && is32) {
    notes.push("3x2 Empty: Ni on #2 WR, Will 50T weak, Mike 6T/70T or apex.");
    notes.push("Empty: BS inside #2 weak.");
  }

  if (willStrengthEligibles === 3) {
    notes.push(willWeakEligibles === 2 ? "Will: 50T weak vs 3x2." : "Will: 00T weak vs 3x1.");
  } else {
    notes.push("Will: apex weak slot, else open gap.");
  }

  if (is22) {
    notes.push("2x2: ILBs in open gap.");
    notes.push("2-eligible side: safety inside #2 if on hash/wider, outside if inside hash.");
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
    notes.push("Bunch: Mike 50T, Ni on #1, FS on Edge.");
  }

  return notes;
}

export function getAlignmentAnswerKey(formation: FormationMeta, landmarks: Landmark[], frontMode: FrontMode = "4-3"): Record<string, { x: number; y: number }> {
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
  const getDbApexBetween = (side: Side, a: PlayerDot | null, b: PlayerDot | null) => {
    if (!a || !b) return null;
    const targetX = getMidpoint(a.x, b.x);
    const pts = landmarks
      .filter((p) => p.layer === "db" && p.label === "Apex")
      .filter((p) => (side === "left" ? p.x < 50 : p.x > 50))
      .sort((pA, pB) => Math.abs(pA.x - targetX) - Math.abs(pB.x - targetX));
    return pts[0] || null;
  };
  const getLbApexBetween = (side: Side, a: PlayerDot | number | null, b: PlayerDot | number | null) => {
    if (a == null || b == null) return null;
    const aX = typeof a === "number" ? a : a.x;
    const bX = typeof b === "number" ? b : b.x;
    const targetX = getMidpoint(aX, bX);
    const pts = landmarks
      .filter((p) => p.layer === "lb" && p.label === "Apex")
      .filter((p) => (side === "left" ? p.x < 50 : p.x > 50))
      .sort((pA, pB) => Math.abs(pA.x - targetX) - Math.abs(pB.x - targetX));
    return pts[0] || null;
  };
  const getSafetyShadeForTwoEligibleSide = (side: Side, numberTwo: PlayerDot | null) => {
    if (!numberTwo) return null;
    const hash = findLandmarkByLabel(landmarks, "db", "Hash", side);
    if (!hash) return getShade(numberTwo, "db", "I");

    const onHashOrWider = side === "left" ? numberTwo.x <= hash.x + 0.2 : numberTwo.x >= hash.x - 0.2;
    return getShade(numberTwo, "db", onHashOrWider ? "I" : "O");
  };

  const hasTrueInlineTe = Boolean(getInlineSurface(formation, "left") || getInlineSurface(formation, "right"));
  const emptyUnderFront = (formation.backfield === "Empty" || formation.name.includes("Empty")) && !hasTrueInlineTe;
  const threeTechSide: Side = emptyUnderFront ? passAway : runStrength;
  const noseSide: Side = emptyUnderFront ? passStrength : weakSide;
  const sdeSide: Side = emptyUnderFront ? passAway : runStrength;
  const wdeSide: Side = emptyUnderFront ? passStrength : weakSide;

  const strongInline = getInlineSurface(formation, sdeSide);
  const strongWing = getWingSurface(formation, sdeSide);
  const weakInline = getInlineSurface(formation, wdeSide);
  const weakWing = getWingSurface(formation, wdeSide);
  const multipleTes = Boolean(strongInline && weakInline);

  const tPoint = findLandmarkByLabel(landmarks, "dl", "3T", threeTechSide);
  const nPoint = findLandmarkByLabel(landmarks, "dl", "2i", noseSide);
  const sdeFive = findLandmarkByLabel(landmarks, "dl", "5T", sdeSide);
  const sdeSix = findLandmarkByLabel(landmarks, "dl", "6", sdeSide) || findLandmarkByLabel(landmarks, "dl", "6T", sdeSide);
  const sdeNine = findLandmarkByLabel(landmarks, "dl", "7T", sdeSide) || findLandmarkByLabel(landmarks, "dl", "9T", sdeSide);
  const wdeFive = findLandmarkByLabel(landmarks, "dl", "5T", wdeSide);
  const wdeSix = findLandmarkByLabel(landmarks, "dl", "6", wdeSide) || findLandmarkByLabel(landmarks, "dl", "6T", wdeSide);
  const wdeNine = findLandmarkByLabel(landmarks, "dl", "7T", wdeSide) || findLandmarkByLabel(landmarks, "dl", "9T", wdeSide);

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
  const fullbackSide = getFullbackOffsetSide(formation);
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
  const aceTreyFourFour = frontMode === "4-4" && isAceTreyFormation(formation);

  const strongBunch = isBunchFamilyOnSide(formation, mikeSide) ? getBunchNumberedReceivers(formation, mikeSide) : null;
  const mikeNumberThree = getNumberThreeReceiver(formation, mikeSide);
  const answerLineXs = getFormationLineXs(formation);
  const mikeTackleX = mikeSide === "left" ? answerLineXs[0] : answerLineXs[4];
  const mikeTeWingLandmark = () => (
    hasTeAndWingSurface(formation, mikeSide)
      ? findLandmarkByLabel(landmarks, "lb", "60T", mikeSide) || findLandmarkByLabel(landmarks, "lb", "70T", mikeSide)
      : findLandmarkByLabel(landmarks, "lb", "70T", mikeSide)
  );

  const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, mikeSide).length;
  const mikeLandmark = (() => {
    if (shouldMikeApexFlexedThree(formation, mikeSide)) {
      return getLbApexBetween(mikeSide, mikeNumberThree, mikeTackleX) || findLandmarkByLabel(landmarks, "lb", "Apex", mikeSide);
    }
    if (frontMode === "4-4" && closedThreeByOne) {
      return mikeTeWingLandmark() || findLandmarkByLabel(landmarks, "lb", "60T", mikeSide) || findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    }
    if (closedThreeByOne) {
      return mikeTeWingLandmark() || findLandmarkByLabel(landmarks, "lb", "60T", mikeSide) || findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    }
    if (nonClosedBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (nonClosedBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedAndBoss43) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedAndBoss44) return findLandmarkByLabel(landmarks, "lb", "20T", mikeSide) || findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (closedNoBoss44) return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
    if (strongBunch?.numberThree) return findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    if (formation.name.includes("Quad")) return findLandmarkByLabel(landmarks, "lb", "30T", mikeSide);
    if (mikeStrengthEligibles === 3) {
      if (isAttachedOrWingNumberThree(formation, mikeSide)) return mikeTeWingLandmark() || findLandmarkByLabel(landmarks, "lb", "60T", mikeSide);
      return findLandmarkByLabel(landmarks, "lb", "Apex", mikeSide);
    }
    return findLandmarkByLabel(landmarks, "lb", mikeOnRunSide ? "10T" : "30T", mikeSide);
  })();
  if (mikeLandmark) answer.M = { x: mikeLandmark.x, y: mikeLandmark.y };

  const willLandmark = (() => {
    const strengthEligibleCount = findTrueEligiblesOnSide(formation, passStrength).length;

    if (aceTreyFourFour) {
      return findLandmarkByLabel(landmarks, "lb", "20T", passStrength)
        || findLandmarkByLabel(landmarks, "lb", "30T", passStrength);
    }

    // 🔥 FIX: Proper 4-3 Closed Boss behavior (split 20Ts)
    if (frontMode === "4-4" && closedThreeByOne) {
      return findLandmarkByLabel(landmarks, "lb", "30T", passStrength) || findLandmarkByLabel(landmarks, "lb", "30T", willSide);
    }

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
      const closedBossBsBump =
        targetId === "BS" &&
        bossIlbs &&
        fullbackSide === side &&
        Boolean(cometTe);

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

      const baseBumpLabel = singleSurfaceCometBump ? "30T" : cometTe && cometWing ? "50T" : "40T";
      const bumpLabel = closedBossBsBump ? getNextClosedBumpLabel(baseBumpLabel) : baseBumpLabel;
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
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passStrength);
      if (edge) answer.FS = { x: edge.x, y: edge.y };
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

    if (aceTreyFourFour) {
      const bs = findLandmarkByLabel(landmarks, "lb", "20T", passAway)
        || findLandmarkByLabel(landmarks, "lb", "10T", passAway);
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (closedThreeByOne) {
      const bs = findLandmarkByLabel(landmarks, "lb", "10T", passAway);
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else {
      applyOverhangRule(passAway, "BS");
    }
  } else {
    if (strongBunch?.numberThree) {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passStrength);
      if (edge) answer.FS = { x: edge.x, y: edge.y };
    } else if (cometSide && cometSide === passStrength) {
      const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
      const fs = getShade(cometFirstEligible, "db", "I");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (fsStrengthEligibleCount === 3 && fsNumberTwo && fsNumberThree) {
      const fs = getDbApexBetween(passStrength, fsNumberTwo, fsNumberThree) || (fsApex && (is31 || is32) ? fsApex : null);
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (is22 && fsStrengthEligibleCount === 2 && fsNumberTwo && (isWingLikePlayer(fsNumberTwo) || getInlineSurface(formation, passStrength)?.id === fsNumberTwo.id)) {
      const fs = getShade(fsNumberTwo, "db", "O");
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else if (fsStrengthEligibleCount === 2) {
      const fs = getSafetyShadeForTwoEligibleSide(passStrength, fsNumberTwo);
      if (fs) answer.FS = { x: fs.x, y: fs.y };
    } else {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passStrength);
      if (edge) answer.FS = { x: edge.x, y: edge.y };
    }

    if (!answer.BC && bcTarget) {
      const bc = getShade(bcTarget, "cb", "H");
      if (bc) answer.BC = { x: bc.x, y: bc.y };
    }

    const bsWeakEligibleCount = findTrueEligiblesOnSide(formation, passAway).length;
    if (isWingTUnbalancedFormation(formation) && bsWeakEligibleCount === 0) {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
      if (edge) answer.BS = { x: edge.x, y: edge.y };
    } else if (cometSide && cometSide === passAway) {
      const cometFirstEligible = getNumberTwoReceiver(formation, cometSide) || getOutsideReceiver(formation, cometSide) || getInlineSurface(formation, cometSide) || getWingSurface(formation, cometSide);
      const bs = getShade(cometFirstEligible, "db", "I");
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (fsStrengthEligibleCount === 3 && bsWeakEligibleCount === 2 && bsSlot) {
      const bs = bsApex || findLandmarkByLabel(landmarks, "db", "Apex", passAway);
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (is22 && bsWeakEligibleCount === 2 && bsNumberTwo && (isWingLikePlayer(bsNumberTwo) || getInlineSurface(formation, passAway)?.id === bsNumberTwo.id)) {
      const bs = getShade(bsNumberTwo, "db", "O");
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (bsWeakEligibleCount === 2) {
      const bs = getSafetyShadeForTwoEligibleSide(passAway, bsNumberTwo);
      if (bs) answer.BS = { x: bs.x, y: bs.y };
    } else if (is31) {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
      if (edge) answer.BS = { x: edge.x, y: edge.y };
    } else {
      const edge = findLandmarkByLabel(landmarks, "db", "Edge", passAway);
      if (edge) answer.BS = { x: edge.x, y: edge.y };
    }
  }

  return answer;
}

export function getCheckResult(currentPlacements: PlayerDot[], answerKey: Record<string, { x: number; y: number }>, threshold = 0.75): CheckResult {
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

export function nearestLandmark(x: number, y: number, points: Landmark[]) {
  if (!points.length) return { x, y };
  return points.reduce((best, p) => {
    const bestDist = Math.hypot(best.x - x, best.y - y);
    const currentDist = Math.hypot(p.x - x, p.y - y);
    return currentDist < bestDist ? p : best;
  }, points[0]);
}
