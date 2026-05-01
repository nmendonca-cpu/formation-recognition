"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectDivider, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock3, Shuffle, Trophy, User, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type AppMode = "study" | "alignment" | "offense_build" | "film" | "quiz" | "editor" | "account" | "leaderboard" | "concept" | "run_fit" | "blitz";
type AppSection = "offense" | "defense" | "admin";
type LeaderboardMode = "quiz" | "offense_build" | "alignment" | "film" | "concept";
type LeaderboardSection = "offense" | "defense";
type FrontMode = "4-3" | "4-4";
type AlignmentViewMode = "study" | "quiz";
type OffenseBuildViewMode = "study" | "quiz";
type FilmViewMode = "study" | "quiz";
type FilmSubmode = "read_key" | "formation_key" | "team_key";
type FormationTrainerViewMode = "study" | "quiz";
type PassConceptViewMode = "study" | "quiz";
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

type RouteOverlay = {
  id: string;
  label: string;
  color: string;
  path: { x: number; y: number }[];
  labelX?: number;
  labelY?: number;
  endCap?: "arrow" | "square" | "circle";
  pathway?: {
    defenderId: string;
    pathwayId: BlitzPathwayId | RunFitPathwayId;
    layer?: "pressure" | "coverage" | "dl";
  };
};

type FieldTag = {
  id: string;
  label: string;
  x: number;
  y: number;
  tone?: "default" | "gold" | "cyan" | "sky";
};

type RunFitEditorTool = "arrow" | "tag";
type RunFitArrowColor = "gold" | "cyan" | "sky" | "white" | "red";
type RunFitLineEnd = "square" | "circle" | "arrow";
type RunFitSavedPathway = {
  id: string;
  name: string;
  positionId: string;
  label: string;
  color: RunFitArrowColor;
  endCap: RunFitLineEnd;
  offsets: { x: number; y: number }[];
};
type RunFitPathwayId =
  | "a_gap_fit"
  | "b_gap_fit"
  | "c_gap_fit"
  | "d_gap_fit"
  | "strong_a_gap_fit"
  | "strong_b_gap_fit"
  | "strong_c_gap_fit"
  | "strong_d_gap_fit"
  | "weak_a_gap_fit"
  | "weak_b_gap_fit"
  | "weak_c_gap_fit"
  | "weak_d_gap_fit"
  | "box_fit"
  | "spill_fit"
  | "under_box_fit"
  | "over_spill_fit";
type RunFitSavedBoard = {
  id: string;
  title: string;
  routeOverlays: RouteOverlay[];
  fieldTags: FieldTag[];
  baseBoardId?: BlitzBaseBoardId;
};
type BlitzBaseBoardId = "double" | "trey" | "quad" | "dog" | "trips" | "troop";
type BlitzBoardSpot = "mof" | "hash";
type BlitzCallId =
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
  | "boston";
type BlitzCallFamilyId = "newton" | "fields" | "brees" | "bradshaw" | "carr" | "allen" | "brady";
type BlitzCallType = "last_name" | "team_name" | "location_name";
type BlitzPathwayId =
  | "a_gap_blitz"
  | "weak_a_gap_blitz"
  | "b_gap_blitz"
  | "c_gap_blitz"
  | "d_gap_blitz"
  | "edge_pressure"
  | "strong_edge_pressure"
  | "weak_edge_pressure"
  | "one_gap_slant_left"
  | "one_gap_slant_right"
  | "two_gap_slant_left"
  | "two_gap_slant_right"
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
  | "quarter"
  | "drop_hook"
  | "drop_curl_flat"
  | "mof"
  | "deep_third_left"
  | "deep_third_middle"
  | "deep_third_right";
type BlitzSavedBoard = RunFitSavedBoard & {
  baseBoardId: BlitzBaseBoardId;
  frontMode?: FrontMode;
  callId?: BlitzCallId;
  boardSpot?: BlitzBoardSpot;
};

type YardReferenceLine = {
  id: string;
  yards: number;
  label?: string;
};

type PassConceptPlayerId = "X" | "H" | "Y" | "Z";
type PassConceptBoardKind = "2x2" | "3x1";
type PassConceptFamilyFilter = "2x2" | "3x1" | "all";
type PassConceptQuizMode = "build" | "identify";

type TwoByTwoConcept = {
  id: string;
  name: string;
  outsideRoute: (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number];
  insideRoute: (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number];
  detail?: string;
};

type ThreeByOneConcept = {
  id: string;
  name: string;
  routes: Partial<Record<PassConceptPlayerId, (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number]>>;
  detail?: string;
};

type PassConceptCard = {
  label: string;
  name: string;
  assignments: { player: PassConceptPlayerId; roleLabel: string; route: string }[];
  detail?: string;
};

type PassConceptDefinition = {
  boardKind: PassConceptBoardKind;
  formation: string;
  title: string;
  conceptName: string;
  frontsideConceptName?: string;
  backsideConceptName?: string;
  routes: Partial<Record<PassConceptPlayerId, string>>;
  activePlayers: PassConceptPlayerId[];
  cards: PassConceptCard[];
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
  film: ModeScoreStats;
  concept: ModeScoreStats;
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
};

type FilmQuizAnswers = {
  runPass: string;
  passType: string;
  direction: string;
  runScheme: string;
  zoneType: string;
  gapPullerCount: string;
  pullerConcept: string;
};

type FilmSaveStatus = {
  tone: "success" | "error" | "warning";
  message: string;
};

type FilmAdminPanelMode = "upload" | "edit";

type FilmSourceType = "Personal" | "Drive" | "Hudl" | "Other";
type FilmRunScheme = "gap" | "zone" | "man" | "";
type FilmZoneType = "normal" | "split" | "jet" | "";
type FilmPassType = "normal" | "screen" | "play_action" | "";
type FilmGapPullerCount = "1" | "2" | "";
type FilmGapOnePullerConcept = "Power" | "Dart (Tackle Power)" | "G Lead" | "Trap" | "Center Pull" | "Pin N Pull" | "";
type FilmGapTwoPullerConcept = "GT" | "GY/GH" | "CG/CT" | "Buck Sweep" | "";
type FilmManConcept = "Duo" | "Lead" | "";

type FilmClip = {
  id: string;
  title: string;
  clipBucket: string;
  formationKey: string;
  teamTag: string;
  sourceType: FilmSourceType;
  runPass: "run" | "pass";
  direction: Side;
  passType: FilmPassType;
  runScheme: FilmRunScheme;
  zoneType: FilmZoneType;
  gapPullerCount: FilmGapPullerCount;
  gapOnePullerConcept: FilmGapOnePullerConcept;
  gapTwoPullerConcept: FilmGapTwoPullerConcept;
  manConcept: FilmManConcept;
  studyUrl: string;
  quizUrl?: string | null;
  quizStartSeconds?: number | null;
  quizEndSeconds?: number | null;
  studyStoragePath?: string | null;
  quizStoragePath?: string | null;
  kind: "remote" | "local" | "supabase";
  studyFileName?: string;
  quizFileName?: string;
  studyFileSize?: number | null;
  quizFileSize?: number | null;
};

type FilmClipDraft = {
  sourceType: FilmSourceType;
  formationKey: string;
  teamTag: string;
  runPass: "run" | "pass";
  direction: Side;
  passType: FilmPassType;
  runScheme: FilmRunScheme;
  zoneType: FilmZoneType;
  gapPullerCount: FilmGapPullerCount;
  gapOnePullerConcept: FilmGapOnePullerConcept;
  gapTwoPullerConcept: FilmGapTwoPullerConcept;
  manConcept: FilmManConcept;
  quizStartSeconds: string;
  quizEndSeconds: string;
  remoteStudyUrl: string;
  remoteQuizUrl: string;
  studyFile: File | null;
  quizFile: File | null;
};


type CustomLandmarkDraft = {
  label: string;
  layer: "dl" | "lb" | "cb" | "db";
  side: Side;
  x: string;
  y: string;
};

type AnswerOverrideMap = Record<string, { x: number; y: number }>;

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
  { value: "editor", label: "Formation Editor", title: "FORMATION EDITOR", section: "admin" },
  { value: "account", label: "Account", title: "ACCOUNT", section: "admin", hiddenFromNav: true },
  { value: "leaderboard", label: "Leaderboard", title: "LEADERBOARD", section: "admin", hiddenFromNav: true },
];
const VIEW_STATE_STORAGE_KEY = "formation-recognition-view-state";
const FILM_CLIPS_STORAGE_KEY = "formation-recognition-film-clips";
const RUN_FIT_BOARDS_STORAGE_KEY = "formation-recognition-run-fit-boards-v3";
const BLITZ_BOARDS_STORAGE_KEY = "formation-recognition-blitz-boards-v1";
const DEMO_SESSION_STORAGE_KEY = "formation-recognition-demo-session";
const DEMO_USER_ID = "demo-user";
const FILM_BUCKET = "film-clips";
const AVATAR_BUCKET = "profile-pics";
const FILM_RUN_SCHEME_OPTIONS: Exclude<FilmRunScheme, "">[] = ["gap", "zone", "man"];
const FILM_ZONE_TYPE_OPTIONS: Exclude<FilmZoneType, "">[] = ["normal", "split", "jet"];
const FILM_PASS_TYPE_OPTIONS: Exclude<FilmPassType, "">[] = ["normal", "screen", "play_action"];
const FILM_GAP_PULLER_COUNT_OPTIONS: Exclude<FilmGapPullerCount, "">[] = ["1", "2"];
const RUN_FIT_PATHWAY_OPTIONS: { value: RunFitPathwayId; label: string }[] = [
  { value: "a_gap_fit", label: "A-Gap Fit" },
  { value: "b_gap_fit", label: "B-Gap Fit" },
  { value: "c_gap_fit", label: "C-Gap Fit" },
  { value: "d_gap_fit", label: "D-Gap Fit" },
  { value: "strong_a_gap_fit", label: "Strong A-Gap Fit" },
  { value: "strong_b_gap_fit", label: "Strong B-Gap Fit" },
  { value: "strong_c_gap_fit", label: "Strong C-Gap Fit" },
  { value: "strong_d_gap_fit", label: "Strong D-Gap Fit" },
  { value: "weak_a_gap_fit", label: "Weak A-Gap Fit" },
  { value: "weak_b_gap_fit", label: "Weak B-Gap Fit" },
  { value: "weak_c_gap_fit", label: "Weak C-Gap Fit" },
  { value: "weak_d_gap_fit", label: "Weak D-Gap Fit" },
  { value: "box_fit", label: "Box" },
  { value: "spill_fit", label: "Spill" },
  { value: "under_box_fit", label: "Under Box" },
  { value: "over_spill_fit", label: "Over Spill" },
];
const BLITZ_BASE_BOARD_OPTIONS: { value: BlitzBaseBoardId; label: string; call: string }[] = [
  { value: "double", label: "Double", call: "Doubles Right" },
  { value: "trey", label: "Trey", call: "Trey Right" },
  { value: "quad", label: "Quad", call: "Quad Right" },
  { value: "dog", label: "Dog", call: "Dog Right" },
  { value: "trips", label: "Trips", call: "Trips Right" },
  { value: "troop", label: "Troop", call: "Troop Right" },
];
const BLITZ_BOARD_STRUCTURE: Record<BlitzBaseBoardId, "2x2" | "3x1"> = {
  double: "2x2",
  dog: "2x2",
  quad: "2x2",
  trey: "3x1",
  trips: "3x1",
  troop: "3x1",
};
const BLITZ_BOARD_SPOT_OPTIONS: { value: BlitzBoardSpot; label: string }[] = [
  { value: "mof", label: "MOF" },
  { value: "hash", label: "Hash" },
];
const BLITZ_CALL_OPTIONS: { value: BlitzCallId; label: string; family: string; detail: string }[] = [
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
];
const BLITZ_CALL_FAMILY_OPTIONS: { value: BlitzCallFamilyId; label: string }[] = [
  { value: "newton", label: "Newton" },
  { value: "fields", label: "Fields" },
  { value: "brees", label: "Brees" },
  { value: "bradshaw", label: "Bradshaw" },
  { value: "carr", label: "Carr" },
  { value: "allen", label: "Allen" },
  { value: "brady", label: "Brady" },
];
const BLITZ_CALL_TYPE_LABELS: Record<BlitzCallType, string> = {
  last_name: "4 Man (QB)",
  team_name: "5 Man (Team)",
  location_name: "6 Man (Location)",
};
const BLITZ_CALL_MATRIX: Record<BlitzCallFamilyId, Record<BlitzCallType, BlitzCallId>> = {
  newton: { last_name: "newton", team_name: "panthers", location_name: "carolina" },
  fields: { last_name: "fields", team_name: "bears", location_name: "chicago" },
  brees: { last_name: "brees", team_name: "saints", location_name: "nola" },
  bradshaw: { last_name: "bradshaw", team_name: "steelers", location_name: "pitt" },
  carr: { last_name: "carr", team_name: "raiders", location_name: "oakland" },
  allen: { last_name: "allen", team_name: "bills", location_name: "buffalo" },
  brady: { last_name: "brady", team_name: "patriots", location_name: "boston" },
};
const BLITZ_PATHWAY_OPTIONS: { value: BlitzPathwayId; label: string }[] = [
  { value: "a_gap_blitz", label: "A-Gap Blitz" },
  { value: "weak_a_gap_blitz", label: "Weak A-Gap Blitz" },
  { value: "b_gap_blitz", label: "B-Gap Blitz" },
  { value: "c_gap_blitz", label: "C-Gap Blitz" },
  { value: "d_gap_blitz", label: "D-Gap Blitz" },
  { value: "edge_pressure", label: "Edge Pressure" },
  { value: "strong_edge_pressure", label: "Strong Edge Pressure" },
  { value: "weak_edge_pressure", label: "Weak Edge Pressure" },
  { value: "one_gap_slant_left", label: "1-Gap Slant Left" },
  { value: "one_gap_slant_right", label: "1-Gap Slant Right" },
  { value: "two_gap_slant_left", label: "2-Gap Slant Left" },
  { value: "two_gap_slant_right", label: "2-Gap Slant Right" },
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
  { value: "quarter", label: "1/4" },
  { value: "drop_hook", label: "DE Drop Hook" },
  { value: "drop_curl_flat", label: "DE Drop C/F" },
  { value: "mof", label: "MOF" },
  { value: "deep_third_left", label: "1/3 Left" },
  { value: "deep_third_middle", label: "1/3 Middle" },
  { value: "deep_third_right", label: "1/3 Right" },
];
const getBlitzCallFamilyId = (callId: BlitzCallId): BlitzCallFamilyId => (
  (Object.entries(BLITZ_CALL_MATRIX).find(([, calls]) => (
    Object.values(calls).includes(callId)
  ))?.[0] as BlitzCallFamilyId | undefined) ?? "newton"
);
const getBlitzCallType = (callId: BlitzCallId): BlitzCallType => (
  (Object.values(BLITZ_CALL_MATRIX).flatMap((calls) => (
    Object.entries(calls) as [BlitzCallType, BlitzCallId][]
  )).find(([, candidateCallId]) => candidateCallId === callId)?.[0]) ?? "last_name"
);
const getBlitzCallId = (familyId: BlitzCallFamilyId, callType: BlitzCallType) => BLITZ_CALL_MATRIX[familyId][callType];
const getBlitzCallLabel = (callId: BlitzCallId) => BLITZ_CALL_OPTIONS.find((option) => option.value === callId)?.label ?? "Blitz";
const FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS: Exclude<FilmGapOnePullerConcept, "">[] = ["Power", "Dart (Tackle Power)", "G Lead", "Trap", "Center Pull", "Pin N Pull"];
const FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS: Exclude<FilmGapTwoPullerConcept, "">[] = ["GT", "GY/GH", "CG/CT", "Buck Sweep"];
const FILM_MAN_CONCEPT_OPTIONS: Exclude<FilmManConcept, "">[] = ["Duo", "Lead"];
const PASS_CONCEPT_ROUTE_OPTIONS = [
  "Hitch",
  "Corner",
  "Fade",
  "12 Yard Out",
  "5 Yard Out",
  "5 Yard In",
  "Shallow Cross",
  "Seam",
  "Dig",
  "Post",
  "Bender",
  "Wheel",
  "Matt Curl",
  "Flat",
  "Slant",
  "Quick Out",
  "Fadestop",
] as const;
const TWO_BY_TWO_CONCEPTS: TwoByTwoConcept[] = [
  { id: "spartan", name: "Spartan", outsideRoute: "Hitch", insideRoute: "Corner" },
  { id: "wolf", name: "Wolf", outsideRoute: "Fade", insideRoute: "12 Yard Out" },
  { id: "quinn", name: "Quinn", outsideRoute: "Fade", insideRoute: "5 Yard Out" },
  { id: "vegas", name: "Vegas", outsideRoute: "Fade", insideRoute: "Seam" },
  { id: "dagger", name: "Dagger", outsideRoute: "Dig", insideRoute: "Seam" },
  { id: "falcon", name: "Falcon", outsideRoute: "Post", insideRoute: "Bender", detail: "Deep crosser for the inside route." },
  { id: "malone", name: "Malone", outsideRoute: "Post", insideRoute: "Wheel" },
  { id: "matt", name: "Matt", outsideRoute: "Matt Curl", insideRoute: "Flat", detail: "Curl: 8-yard stem, 45-degree post stem to 12, then back to the ball at 10." },
  { id: "matt-smoke", name: "Matt Smoke", outsideRoute: "Matt Curl", insideRoute: "Wheel" },
  { id: "dusty", name: "Dusty", outsideRoute: "Slant", insideRoute: "Slant", detail: "Double slant: 4 yards vertical, then 45-degree cut inside." },
  { id: "duncan", name: "Duncan", outsideRoute: "Slant", insideRoute: "Quick Out", detail: "Quick out is a speed cut rolled out by 5 yards max." },
  { id: "harry", name: "Harry", outsideRoute: "Hitch", insideRoute: "Hitch" },
  { id: "hector", name: "Hector", outsideRoute: "Hitch", insideRoute: "Seam" },
  { id: "must", name: "Must", outsideRoute: "Fadestop", insideRoute: "Seam", detail: "Fadestop pushes to 15 and comes back to 12." },
];
const THREE_BY_ONE_CONCEPTS: ThreeByOneConcept[] = [
  {
    id: "h-wolf",
    name: "H Wolf",
    routes: { Z: "Fade", H: "12 Yard Out", Y: "Quick Out" },
    detail: "Tagged H gets the 12-yard out. #3 runs the quick out.",
  },
  {
    id: "z-wolf",
    name: "Y Wolf",
    routes: { Z: "Fade", H: "5 Yard Out", Y: "12 Yard Out" },
    detail: "Tagged Y gets the 12-yard out. H runs the 5-yard out.",
  },
  {
    id: "h-grizz",
    name: "H Grizz",
    routes: { Z: "Post", H: "Dig", Y: "5 Yard In" },
    detail: "Tagged H gets the dig. #3 works the 5-yard in.",
  },
  {
    id: "z-grizz",
    name: "Y Grizz",
    routes: { Z: "Post", H: "5 Yard In", Y: "Dig" },
    detail: "Tagged Y gets the dig. H works the 5-yard in.",
  },
  {
    id: "vegas-z",
    name: "Vegas",
    routes: { Z: "Fade", H: "Seam", Y: "Bender" },
    detail: "Trips version from the deck: outside fade, middle seam, tagged Z on the bender.",
  },
  {
    id: "dagger-z",
    name: "Dagger",
    routes: { Z: "Dig", H: "Seam", Y: "Bender" },
    detail: "Trips Dagger from the deck: X dig, middle seam, tagged Z on the bender.",
  },
  {
    id: "td-special",
    name: "TD Special",
    routes: { Z: "Slant", H: "Slant", Y: "Quick Out" },
    detail: "Both outside eligibles work slant stems while #3 speed-cuts out.",
  },
  {
    id: "scrape",
    name: "Scrape",
    routes: { Z: "5 Yard In", H: "Seam", Y: "Bender" },
    detail: "Outside settles on the 5-yard in with seam plus bender stacked inside.",
  },
];
const DEFAULT_ROUTE_TEMPLATES: Record<(typeof PASS_CONCEPT_ROUTE_OPTIONS)[number], { lateral: number; depth: number }[]> = {
  Hitch: [
    { lateral: 0, depth: 7 },
    { lateral: -2.1, depth: 5.8 },
  ],
  Corner: [
    { lateral: 0, depth: 10 },
    { lateral: 4.8, depth: 13.4 },
    { lateral: 10.2, depth: 18.6 },
  ],
  Fade: [
    { lateral: 0.15, depth: 20 },
  ],
  "12 Yard Out": [
    { lateral: 0.1, depth: 12 },
    { lateral: 18.2, depth: 12 },
  ],
  "5 Yard Out": [
    { lateral: 0.1, depth: 5.2 },
    { lateral: 18.2, depth: 5.2 },
  ],
  "5 Yard In": [
    { lateral: 0.1, depth: 5.2 },
    { lateral: -12.8, depth: 5.2 },
  ],
  "Shallow Cross": [
    { lateral: -3.2, depth: 4.6 },
    { lateral: -9.4, depth: 5.15 },
    { lateral: -18.6, depth: 5.15 },
  ],
  Seam: [
    { lateral: 0.15, depth: 20 },
  ],
  Dig: [
    { lateral: 0, depth: 12 },
    { lateral: -12.2, depth: 12 },
  ],
  Post: [
    { lateral: 0.2, depth: 8.2 },
    { lateral: -3.8, depth: 14.6 },
    { lateral: -8.9, depth: 20 },
  ],
  Bender: [
    { lateral: 0, depth: 9.5 },
    { lateral: -2.2, depth: 12.4 },
    { lateral: -6.8, depth: 15.1 },
    { lateral: -11.8, depth: 16.6 },
    { lateral: -15.2, depth: 17.2 },
  ],
  Wheel: [
    { lateral: 2.1, depth: 4.1 },
    { lateral: 8.6, depth: 5.2 },
    { lateral: 12.8, depth: 8.4 },
    { lateral: 13.8, depth: 20 },
  ],
  "Matt Curl": [
    { lateral: 0.2, depth: 7.7 },
    { lateral: -4.2, depth: 12.9 },
    { lateral: -5.6, depth: 10.8 },
  ],
  Flat: [
    { lateral: 2.0, depth: 4.1 },
    { lateral: 6.6, depth: 5.1 },
    { lateral: 17.2, depth: 5.1 },
  ],
  Slant: [
    { lateral: 0, depth: 4.2 },
    { lateral: -7.4, depth: 10.6 },
  ],
  "Quick Out": [
    { lateral: 0, depth: 3 },
    { lateral: 2.3, depth: 4.6 },
    { lateral: 6.8, depth: 5.15 },
    { lateral: 12.0, depth: 5.15 },
    { lateral: 16.0, depth: 5.15 },
  ],
  Fadestop: [
    { lateral: 2.2, depth: 4.6 },
    { lateral: 2.4, depth: 15.2 },
    { lateral: 6.2, depth: 12.4 },
  ],
};
const PLAYBOOK_OPTIONS: PlaybookKey[] = ["Foothill", "Pro", "Wing T"];
const PERSONNEL_OPTIONS = ["Any", "11", "12", "21"] as const;
const ALIGNMENT_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch", "B Trips", "B Trey", "B Doubles", "Quad", "Dog"] as const;
const ALIGNMENT_EMPTY_BASE_CALLS = ["Doubles", "Trips", "Trey", "Troop", "Bunch"] as const;
const CUSTOM_ALIGNMENT_LAYERS = ["dl", "lb", "cb", "db"] as const;
const DEFAULT_FILM_CLIPS: FilmClip[] = [];
const ALIGNMENT_CALLS = [
  ...ALIGNMENT_BASE_CALLS.flatMap((base) => [
    `${base} Left`, `${base} Right`, `${base} Left King`, `${base} Right King`, `${base} Left Queen`, `${base} Right Queen`,
  ]),
  ...ALIGNMENT_EMPTY_BASE_CALLS.flatMap((base) => [`${base} Empty Left`, `${base} Empty Right`]),
  "Bunch Closed Left", "Bunch Closed Right",
] as const;
const WING_T_CALLS = [
  "Wing T Far Right", "Wing T Far Left",
  "Wing T Near Right", "Wing T Near Left",
  "Wing T Unbalanced Far Right", "Wing T Unbalanced Far Left",
  "Wing T Unbalanced Near Right", "Wing T Unbalanced Near Left",
  "Double Wing Right", "Double Wing Left",
  "Wing T Closed Far Right", "Wing T Closed Far Left",
  "Wing T Closed Near Right", "Wing T Closed Near Left",
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
  film: { ...DEFAULT_MODE_STATS },
  concept: { ...DEFAULT_MODE_STATS },
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

function normalizeFilmFormationFamily(value: string) {
  return value
    .replace(/\b(left|right|king|queen)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

const FILM_FORMATION_KEY_TAG_GROUPS = [
  {
    label: "Foothill",
    options: Array.from(new Set(ALIGNMENT_CALLS.map((call) => normalizeFilmFormationFamily(call)))).sort((a, b) => a.localeCompare(b)),
  },
  {
    label: "Pro",
    options: Array.from(new Set(PRO_CALLS.map((call) => normalizeFilmFormationFamily(call)))).sort((a, b) => a.localeCompare(b)),
  },
  {
    label: "Wing T",
    options: Array.from(new Set(WING_T_CALLS.map((call) => normalizeFilmFormationFamily(call)))).sort((a, b) => a.localeCompare(b)),
  },
  {
    label: "Custom",
    options: ["Grenade", "Heavy"],
  },
] as const;

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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getLineXs(wide = false) {
  return wide ? ALIGNMENT_OLINE_X : TIGHT_OLINE_X;
}

function getFormationLineXs(formation: FormationMeta): number[] {
  const fallback = ALIGNMENT_OLINE_X;
  return FIXED_OL_IDS.map((id, index) => formation.players.find((player) => player.id === id)?.x ?? fallback[index]);
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

function getBunchWing(side: Side, wide = false) {
  return getAttached(side, wide);
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

function getHash(side: Side, wide = false) {
  return getSlot(side, wide);
}

function getBlitzHash(side: Side) {
  return side === "right" ? 64 : 36;
}

function getOppositeSide(side: Side): Side {
  return side === "left" ? "right" : "left";
}

function flipCallSide(call: string) {
  if (call.includes("Right")) return call.replace("Right", "Left");
  if (call.includes("Left")) return call.replace("Left", "Right");
  return call;
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
        add("H", getBunchWing(side, wide), OFF_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
        add("RB", getSlot(other, wide), OFF_Y);
      } else {
        add("H", getBunchWing(side, wide), OFF_Y);
        add("Y", getBunchMiddle(side, wide), LOS_Y);
        add("Z", getBunchOutside(side, wide), OFF_Y);
        add("X", getWide(other), LOS_Y);
      }
      break;
    case "Bunch Closed":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getBunchWing(other, wide), OFF_Y);
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
      const hX = getAttached(other, wide);
      add("Y", getAttached(side, wide), LOS_Y);
      add("Z", getWide(side), OFF_Y);
      add("H", hX, WING_Y);
      add("X", getWide(other), LOS_Y);
      break;
    }
    case "B Trips":
      add("Y", getAttached(side, wide), LOS_Y);
      add("H", getAttached(other, wide), WING_Y);
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
    add("RB", getSlot(other, wide), OFF_Y);
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
    { id: "o-slot-left-on", x: leftSlot, y: LOS_Y, layer: "offense" },
    { id: "o-slot-right-on", x: rightSlot, y: LOS_Y, layer: "offense" },
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

function getOffenseAnswerKeyFromFormation(formation: FormationMeta): Record<string, { x: number; y: number }> {
  const answer: Record<string, { x: number; y: number }> = {};
  formation.players
    .filter((p) => !FIXED_OL_IDS.includes(p.id as (typeof FIXED_OL_IDS)[number]))
    .forEach((p) => {
      answer[p.id] = { x: p.x, y: p.y };
    });
  return answer;
}

function getDefensePlayersFromAnswerKey(answerKey: Record<string, { x: number; y: number }>): PlayerDot[] {
  return DEFENDER_TOKENS
    .filter((id) => Boolean(answerKey[id]))
    .map((id) => ({
      id,
      x: answerKey[id].x,
      y: answerKey[id].y,
    }));
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
  const xs = getFormationLineXs(formation);
  const tackleX = side === "left" ? xs[0] : xs[4];
  const players = findEligibleOnSide(formation, side)
    .filter((p) => Math.abs(p.y - LOS_Y) < 0.5 && Math.abs(p.x - tackleX) <= 10)
    .sort((a, b) => Math.abs(a.x - tackleX) - Math.abs(b.x - tackleX));
  return players[0] || null;
}

function getWingSurface(formation: FormationMeta, side: Side) {
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

function getBunchPlayers(formation: FormationMeta, side: Side) {
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
  return side === formation.passStrength;
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

function isWingTUnbalancedFormation(formation: FormationMeta) {
  return formation.playbook === "Wing T" && formation.name.includes("Unbalanced");
}

function isAceTreyFormation(formation: FormationMeta) {
  return formation.playbook === "Pro" && formation.name.startsWith("Ace Trey");
}

function getNextClosedBumpLabel(label: "30T" | "40T" | "50T") {
  if (label === "30T") return "40T";
  if (label === "40T") return "50T";
  return "60T";
}

function isClosedSurfaceOnlySide(formation: FormationMeta, side: Side) {
  if (isWingTUnbalancedFormation(formation) && findTrueEligiblesOnSide(formation, side).length === 0) {
    return true;
  }
  const inline = getInlineSurface(formation, side);
  const wing = getWingSurface(formation, side);
  const slot = getSlotReceiver(formation, side);
  return Boolean(inline || wing) && !hasTrueWideReceiverOnSide(formation, side) && !slot;
}

function shouldBossIlbs(formation: FormationMeta) {
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

  const xs = getFormationLineXs(formation);
  const tackleX = mikeSide === "left" ? xs[0] : xs[4];
  const isFlexed = !isWingLikePlayer(numberThree) && Math.abs(numberThree.x - tackleX) > 8;
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
  const closedThreeByOne44Notes =
    frontMode === "4-4" &&
    ((isClosedSurfaceOnlySide(formation, "left") && !isClosedSurfaceOnlySide(formation, "right") && findTrueEligiblesOnSide(formation, "right").length === 3) ||
      (isClosedSurfaceOnlySide(formation, "right") && !isClosedSurfaceOnlySide(formation, "left") && findTrueEligiblesOnSide(formation, "left").length === 3));
  if (closedAndBoss43Notes) {
    notes.push("Closed + boss: Mike and Will to 20T toward TE/FB.");
  } else if (closedThreeByOne44Notes) {
    notes.push("Closed 3x1 in 4-4: Mike 60T and Will 30T to pass strength, BS 10T weak.");
  } else if ((leftCount === 3 && isClosedSurfaceOnlySide(formation, "right")) || (rightCount === 3 && isClosedSurfaceOnlySide(formation, "left"))) {
    notes.push("Closed 3x1: Mike 60T if #3 is attached, Apex if #3 is flexed.");
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

  const mikeStrengthEligibles = findTrueEligiblesOnSide(formation, mikeSide).length;
  const mikeLandmark = (() => {
    if (shouldMikeApexFlexedThree(formation, mikeSide)) {
      return getLbApexBetween(mikeSide, mikeNumberThree, mikeTackleX) || findLandmarkByLabel(landmarks, "lb", "Apex", mikeSide);
    }
    if (frontMode === "4-4" && closedThreeByOne) {
      return findLandmarkByLabel(landmarks, "lb", "60T", mikeSide) || findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    }
    if (closedThreeByOne) {
      return findLandmarkByLabel(landmarks, "lb", "60T", mikeSide) || findLandmarkByLabel(landmarks, "lb", "50T", mikeSide);
    }
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

function buildRoutePath(
  player: PlayerDot,
  routeName: string,
  previewLosY: number,
  yardsToPct: number,
  side: Side,
) {
  const start = { x: player.x, y: player.y - 2.2 };
  const outsideDir = side === "right" ? 1 : -1;
  const atDepth = (yards: number) => previewLosY + yards * yardsToPct;
  const defaultTemplate = DEFAULT_ROUTE_TEMPLATES[routeName as keyof typeof DEFAULT_ROUTE_TEMPLATES];
  const template = defaultTemplate ?? [{ lateral: 0, depth: 10 }];

  return [
    start,
    ...template.map((point) => ({
      x: start.x + point.lateral * outsideDir,
      y: atDepth(point.depth),
    })),
  ];
}

function buildTwoByTwoPassConceptPreview(
  frontsideConcept: TwoByTwoConcept,
  backsideConcept: TwoByTwoConcept,
): PassConceptDefinition & { formationPlayers: PlayerDot[]; routesPreview: RouteOverlay[]; yardLines: YardReferenceLine[]; losY: number } {
  const previewLosY = 28;
  const yardsToPct = 3;
  const formation = buildFoothillFormation("Quad King Left", false);
  const receiverDepths: Record<string, number> = {
    X: previewLosY,
    Y: previewLosY,
    H: previewLosY - 7,
    Z: previewLosY - 7,
  };
  const previewPlayers = formation.players
    .filter((player) => ["X", "H", "Y", "Z"].includes(player.id))
    .map((player) => ({
      ...player,
      y: receiverDepths[player.id] ?? player.y,
    }));
  const byId = Object.fromEntries(previewPlayers.map((player) => [player.id, player])) as Record<string, PlayerDot>;
  const routesByPlayer: Record<PassConceptPlayerId, string> = {
    X: frontsideConcept.outsideRoute,
    H: frontsideConcept.insideRoute,
    Z: backsideConcept.outsideRoute,
    Y: backsideConcept.insideRoute,
  };
  const xConceptName = `X ${frontsideConcept.name}`;
  const zConceptName = `Z ${backsideConcept.name}`;

  const routes: RouteOverlay[] = [
    {
      id: `${frontsideConcept.id}-x-${routesByPlayer.X.toLowerCase().replace(/\s+/g, "-")}`,
      label: routesByPlayer.X,
      color: "#f6d36b",
      path: buildRoutePath(byId.X, routesByPlayer.X, previewLosY, yardsToPct, "right"),
      labelX: byId.X.x,
      labelY: byId.X.y - 8.5,
    },
    {
      id: `${frontsideConcept.id}-h-${routesByPlayer.H.toLowerCase().replace(/\s+/g, "-")}`,
      label: routesByPlayer.H,
      color: "#f2b35d",
      path: buildRoutePath(byId.H, routesByPlayer.H, previewLosY, yardsToPct, "right"),
      labelX: byId.H.x,
      labelY: byId.H.y - 8.5,
    },
    {
      id: `${backsideConcept.id}-y-${routesByPlayer.Y.toLowerCase().replace(/\s+/g, "-")}`,
      label: routesByPlayer.Y,
      color: "#7be0d4",
      path: buildRoutePath(byId.Y, routesByPlayer.Y, previewLosY, yardsToPct, "left"),
      labelX: byId.Y.x,
      labelY: byId.Y.y - 8.5,
    },
    {
      id: `${backsideConcept.id}-z-${routesByPlayer.Z.toLowerCase().replace(/\s+/g, "-")}`,
      label: routesByPlayer.Z,
      color: "#89c6ff",
      path: buildRoutePath(byId.Z, routesByPlayer.Z, previewLosY, yardsToPct, "left"),
      labelX: byId.Z.x,
      labelY: byId.Z.y - 8.5,
    },
  ];

  const yardLines: YardReferenceLine[] = [
    { id: "yard-0", yards: 0 },
    { id: "yard-5", yards: 5 },
    { id: "yard-10", yards: 10, label: "10" },
    { id: "yard-15", yards: 15 },
    { id: "yard-20", yards: 20, label: "20" },
  ];

  return {
    boardKind: "2x2",
    formation: formation.name,
    title: `${xConceptName} / ${zConceptName}`,
    conceptName: `${xConceptName} / ${zConceptName}`,
    frontsideConceptName: frontsideConcept.name,
    backsideConceptName: backsideConcept.name,
    routes: routesByPlayer,
    activePlayers: ["X", "H", "Y", "Z"],
    cards: [
      {
        label: "X Concept",
        name: xConceptName,
        assignments: [
          { player: "X", roleLabel: "#1", route: routesByPlayer.X },
          { player: "H", roleLabel: "#2", route: routesByPlayer.H },
        ],
        detail: frontsideConcept.detail,
      },
      {
        label: "Z Concept",
        name: zConceptName,
        assignments: [
          { player: "Z", roleLabel: "#1", route: routesByPlayer.Z },
          { player: "Y", roleLabel: "#2", route: routesByPlayer.Y },
        ],
        detail: backsideConcept.detail,
      },
    ],
    formationPlayers: previewPlayers,
    routesPreview: routes,
    yardLines,
    losY: previewLosY,
  };
}

function buildThreeByOnePassConceptPreview(
  concept: ThreeByOneConcept,
): PassConceptDefinition & { formationPlayers: PlayerDot[]; routesPreview: RouteOverlay[]; yardLines: YardReferenceLine[]; losY: number } {
  const previewLosY = 28;
  const yardsToPct = 3;
  const previewPlayers: PlayerDot[] = [
    { id: "Y", x: 58, y: previewLosY },
    { id: "H", x: 72, y: previewLosY - 7 },
    { id: "Z", x: 86, y: previewLosY - 7 },
  ];
  const byId = Object.fromEntries(previewPlayers.map((player) => [player.id, player])) as Record<string, PlayerDot>;
  const activePlayers = (["Z", "H", "Y"] as PassConceptPlayerId[]).filter((playerId) => Boolean(concept.routes[playerId]));
  const routes: RouteOverlay[] = activePlayers.map((playerId) => ({
    id: `${concept.id}-${playerId.toLowerCase()}-${String(concept.routes[playerId]).toLowerCase().replace(/\s+/g, "-")}`,
    label: String(concept.routes[playerId]),
    color:
      playerId === "Z" ? "#f6d36b"
      : playerId === "H" ? "#f2b35d"
      : "#89c6ff",
    path: buildRoutePath(byId[playerId], String(concept.routes[playerId]), previewLosY, yardsToPct, "right"),
    labelX: byId[playerId].x,
    labelY: byId[playerId].y - 8.5,
  }));
  const yardLines: YardReferenceLine[] = [
    { id: "yard-0", yards: 0 },
    { id: "yard-5", yards: 5 },
    { id: "yard-10", yards: 10, label: "10" },
    { id: "yard-15", yards: 15 },
    { id: "yard-20", yards: 20, label: "20" },
  ];

  return {
    boardKind: "3x1",
    formation: "Trips",
    title: concept.name,
    conceptName: concept.name,
    frontsideConceptName: concept.name,
    routes: concept.routes,
    activePlayers,
    cards: [
      {
        label: "Trips Side",
        name: concept.name,
        assignments: [
          ...(concept.routes.Z ? [{ player: "Z" as PassConceptPlayerId, roleLabel: "#1", route: concept.routes.Z }] : []),
          ...(concept.routes.H ? [{ player: "H" as PassConceptPlayerId, roleLabel: "#2", route: concept.routes.H }] : []),
          ...(concept.routes.Y ? [{ player: "Y" as PassConceptPlayerId, roleLabel: "#3", route: concept.routes.Y }] : []),
        ],
        detail: concept.detail,
      },
    ],
    formationPlayers: previewPlayers,
    routesPreview: routes,
    yardLines,
    losY: previewLosY,
  };
}

function buildSingleHighRunFitMockup() {
  const baseFormation = buildProFormation("I Dot Right", true);
  const runFitSpreadX: Record<string, number> = {
    X: 10,
    LT: 34,
    LG: 42,
    C: 50,
    RG: 58,
    RT: 66,
    Y: 74,
    Z: 90,
  };
  const formation = {
    ...baseFormation,
    players: baseFormation.players.map((player) => ({
      ...player,
      x: runFitSpreadX[player.id] ?? player.x,
    })),
  };
  const offensePlayers = formation.players.map((player) => {
    if (player.id === "QB") return { ...player, y: 39 };
    if (player.id === "RB") return { ...player, id: "R", y: 18 };
    if (player.id === "F") return { ...player, id: "FB", x: 46, y: 28 };
    return player;
  });
  const alignmentLandmarks = getAlignmentLandmarks(formation);
  const answerKey = getAlignmentAnswerKey(formation, alignmentLandmarks, "4-4");
  const ySurface = formation.players.find((player) => player.id === "Y");
  const defenders = getDefensePlayersFromAnswerKey(answerKey).map((defender) => (
    defender.id === "SDE" && ySurface
      ? { ...defender, x: ySurface.x, y: DL_Y }
      : defender
  ));

  const routeOverlays: RouteOverlay[] = [];
  const fieldTags: FieldTag[] = [];

  return {
    title: "Single High vs Power Strong",
    subtitle: "(11p) Power Strong teaching shell built from the Single High board style.",
    offensePlayers,
    defensePlayers: defenders,
    routeOverlays,
    fieldTags,
    notes: [
      {
        title: "Why This Slide",
        body: "This style translates best because the shell stays consistent and the board teaches with repeated fit pills instead of full paragraphs. It feels like your PowerPoint boards, just cleaner for the app.",
      },
      {
        title: "Offensive Picture",
        body: "I Dot Right gives us the clean power surface: backside guard pulls, fullback reads the puller and wraps if the edge spills, the RB tracks downhill into the front-side C-gap picture, and the backside tackle hinges.",
      },
      {
        title: "Defensive Language",
        body: "The short pills are the key: HK, C/F, SPILL, FORCE, DEEP 1/3, POST / SEAM, and BOOT / REVERSE. That is the right visual vocabulary for the mode because it mirrors how your teaching slides repeat the same shell and just change the assignment tags.",
      },
      {
        title: "Implementation Path",
        body: "The clean version of Run Fit Mode would build each rep from four layers: offensive shell, defensive shell, play arrows, and fit pills. Then quiz mode can ask who owns force, spill, hook, or cutback without redrawing the whole board every time.",
      },
    ],
  };
}

function buildBlitzBoardShell(baseBoardId: BlitzBaseBoardId, frontMode: FrontMode = "4-4", boardSpot: BlitzBoardSpot = "mof") {
  const boardOption = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId) ?? BLITZ_BASE_BOARD_OPTIONS[0];
  const call = boardOption.call;
  const baseFormation = buildFoothillFormation(call, true);
  const fieldCall = boardSpot === "hash" && baseFormation.passStrength !== "left" ? flipCallSide(call) : call;
  const fieldFormation = fieldCall === call ? baseFormation : buildFoothillFormation(fieldCall, true);
  const ballX = boardSpot === "hash" ? getBlitzHash("right") : 50;
  const horizontalShift = ballX - 50;
  const shiftX = (player: PlayerDot) => ({ ...player, x: clamp(player.x + horizontalShift, 3, 97) });
  const alignmentLandmarks = getAlignmentLandmarks(fieldFormation);
  const answerKey = getAlignmentAnswerKey(fieldFormation, alignmentLandmarks, frontMode);
  const ySurface = fieldFormation.players.find((player) => player.id === "Y");
  const verticalShift = -14;
  const blitzLosY = LOS_Y + verticalShift;
  const blitzWingY = WING_Y + verticalShift;
  const shiftY = (player: PlayerDot) => ({ ...player, y: clamp(player.y + verticalShift, 3, 97) });
  const shiftBoard = (player: PlayerDot) => shiftY(shiftX(player));
  const lineXs = getFormationLineXs(fieldFormation);
  const yTackleX = ySurface ? (ySurface.x < 50 ? lineXs[0] : lineXs[4]) : null;
  const yAttachedToSurface = Boolean(ySurface && yTackleX !== null && Math.abs(ySurface.y - LOS_Y) < 1.25 && Math.abs(ySurface.x - yTackleX) <= 8);
  const defensePlayers = getDefensePlayersFromAnswerKey(answerKey).map((defender) => (
    defender.id === "SDE" && ySurface && yAttachedToSurface
      ? { ...defender, x: ySurface.x, y: DL_Y }
      : defender
  )).map(shiftBoard);

  return {
    id: baseBoardId,
    title: `Newton ${frontMode} vs ${boardOption.label}${boardSpot === "hash" ? " on Hash" : ""}`,
    subtitle: `Default Newton ${frontMode} install board against ${boardOption.label}${boardSpot === "hash" ? " with the ball on the right hash" : ""}.`,
    boardSpot,
    hashXs: boardSpot === "hash" ? [getBlitzHash("left"), getBlitzHash("right")] : undefined,
    runStrength: fieldFormation.runStrength,
    passStrength: fieldFormation.passStrength,
    losY: blitzLosY,
    wingY: blitzWingY,
    offensePlayers: fieldFormation.players.map(shiftBoard),
    defensePlayers,
    routeOverlays: [] as RouteOverlay[],
    fieldTags: [] as FieldTag[],
  };
}

function buildRunFitBoardShell(baseBoardId: BlitzBaseBoardId) {
  const shell = buildBlitzBoardShell(baseBoardId, "4-4");
  const originX = getBlitzOriginX(shell.offensePlayers);
  const widenFromBall = (x: number) => clamp(originX + (x - originX) * 1.1, 3, 97);
  const deepenFromLos = (y: number) => (
    Math.abs(y - shell.losY) < 1.25
      ? y
      : clamp(shell.losY + (y - shell.losY) * 1.1, 3, 97)
  );
  const expandPlayer = (player: PlayerDot) => ({
    ...player,
    x: widenFromBall(player.x),
    y: deepenFromLos(player.y),
  });

  return {
    ...shell,
    offensePlayers: shell.offensePlayers.map(expandPlayer),
    defensePlayers: shell.defensePlayers.map((player) => ({
      ...expandPlayer(player),
      y: clamp(deepenFromLos(player.y) + 4.5, 3, 97),
    })),
  };
}

function getBlitzPathwayLabel(pathwayId: BlitzPathwayId) {
  return BLITZ_PATHWAY_OPTIONS.find((option) => option.value === pathwayId)?.label ?? "Pathway";
}

function isCoverageBlitzPathway(pathwayId: BlitzPathwayId) {
  return ["curl_flat", "weak_curl_flat", "wall_flat", "weak_wall_flat", "strong_hook", "weak_hook", "hole", "eyes", "strong_eyes", "weak_eyes", "vert_hook", "cb_flat", "quarter", "drop_hook", "drop_curl_flat", "mof", "deep_third_left", "deep_third_middle", "deep_third_right"].includes(pathwayId);
}

function isDeepCoverageBlitzPathway(pathwayId: BlitzPathwayId) {
  return ["mof", "deep_third_left", "deep_third_middle", "deep_third_right", "quarter"].includes(pathwayId);
}

function getBlitzPathwayStroke(pathwayId: BlitzPathwayId, layer?: "pressure" | "coverage" | "dl") {
  if (layer === "dl") return "#39ff88";
  if (isDeepCoverageBlitzPathway(pathwayId)) return "#a855f7";
  if (isCoverageBlitzPathway(pathwayId)) return "#f4cf63";
  return "#ef4444";
}

function getBlitzCoverageLabel(pathwayId: BlitzPathwayId) {
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
    quarter: "1/4",
    drop_hook: "Drop Hk",
    drop_curl_flat: "Drop C/F",
    mof: "MOF",
    deep_third_left: "1/3",
    deep_third_middle: "1/3",
    deep_third_right: "1/3",
  };
  return labels[pathwayId] ?? "";
}

function getBlitzGapTargetX(offensePlayers: PlayerDot[], gap: "A" | "B" | "C", side: Side) {
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

function getBlitzOriginX(offensePlayers: PlayerDot[]) {
  return offensePlayers.find((player) => player.id === "C")?.x ?? 50;
}

function getBlitzRelativeX(offensePlayers: PlayerDot[], centeredX: number) {
  return clamp(getBlitzOriginX(offensePlayers) + centeredX - 50, 3, 97);
}

function getBlitzCoverageHashX(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  if (Math.abs(originX - getBlitzHash("right")) < 1.5) return getBlitzHash(side);
  return getHash(side, true);
}

function getBlitzEdgePressureTargetX(offensePlayers: PlayerDot[], side: Side, losY = LOS_Y, wingY = WING_Y) {
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

function getBlitzOrderedEligibles(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  return offensePlayers
    .filter((player) => ![...FIXED_OL_IDS, "QB"].includes(player.id as any))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => side === "left" ? a.x - b.x : b.x - a.x);
}

function getBlitzBackfieldEligible(offensePlayers: PlayerDot[], side: Side) {
  const originX = getBlitzOriginX(offensePlayers);
  return offensePlayers
    .filter((player) => ["RB", "R", "F", "FB"].includes(player.id))
    .filter((player) => side === "left" ? player.x < originX : player.x > originX)
    .sort((a, b) => Math.abs(a.x - originX) - Math.abs(b.x - originX))[0] ?? null;
}

function getBlitzEyesTargetX(offensePlayers: PlayerDot[], side: Side, passStrength: Side) {
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

function buildBlitzPathwayOverlay({
  id,
  defender,
  offensePlayers,
  pathwayId,
  runStrength,
  passStrength,
  losY = LOS_Y,
  wingY = WING_Y,
  frontMode = "4-4",
  layer,
}: {
  id?: string;
  defender: PlayerDot;
  offensePlayers: PlayerDot[];
  pathwayId: BlitzPathwayId;
  runStrength?: Side;
  passStrength: Side;
  losY?: number;
  wingY?: number;
  frontMode?: FrontMode;
  layer?: "pressure" | "coverage" | "dl";
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

  if (pathwayId === "a_gap_blitz" || pathwayId === "weak_a_gap_blitz") {
    const gapSide = pathwayId === "weak_a_gap_blitz" ? runWeak : side;
    path = makePressurePath(getBlitzGapTargetX(offensePlayers, "A", gapSide));
  } else if (pathwayId === "b_gap_blitz") {
    path = makePressurePath(getBlitzGapTargetX(offensePlayers, "B", side));
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
  } else if (pathwayId === "curl_flat" || pathwayId === "weak_curl_flat") {
    const targetX = getBlitzCoverageHashX(offensePlayers, pathwayId === "weak_curl_flat" ? passAway : side);
    const isSafety = ["FS", "BS"].includes(defender.id);
    path = makeCoveragePath(targetX, isSafety && frontMode === "4-3" ? getMidpoint(defender.y, losY) : defender.y + 15);
  } else if (pathwayId === "wall_flat" || pathwayId === "weak_wall_flat") {
    path = makeCoveragePath(getBlitzCoverageHashX(offensePlayers, pathwayId === "weak_wall_flat" ? passAway : side), defender.y + 16);
  } else if (pathwayId === "strong_hook" || pathwayId === "weak_hook") {
    const hookSide = pathwayId === "strong_hook" ? passStrength : passAway;
    const targetX = getBlitzRelativeX(offensePlayers, hookSide === "left" ? 42 : 58);
    const isSafety = ["FS", "BS"].includes(defender.id);
    path = makeCoveragePath(targetX, isSafety && frontMode === "4-3" ? getMidpoint(defender.y, losY) : defender.y + 14);
  } else if (pathwayId === "hole") {
    path = makeCoveragePath(originX, getMidpoint(losY, 88));
  } else if (pathwayId === "eyes" || pathwayId === "strong_eyes" || pathwayId === "weak_eyes") {
    const eyesSide = pathwayId === "strong_eyes" ? passStrength : pathwayId === "weak_eyes" ? passAway : side;
    const targetX = getBlitzEyesTargetX(offensePlayers, eyesSide, passStrength);
    path = makeCoveragePath(targetX, defender.y + 14);
  } else if (pathwayId === "vert_hook") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, side === "left" ? 43 : 57), defender.y + 17);
  } else if (pathwayId === "cb_flat") {
    path = makeCoveragePath(getBlitzCoverageHashX(offensePlayers, side), getMidpoint(defender.y, losY));
  } else if (pathwayId === "quarter") {
    path = makeCoveragePath(getBlitzRelativeX(offensePlayers, side === "left" ? 25 : 75), 88);
  } else if (pathwayId === "drop_hook") {
    const targetX = getBlitzRelativeX(offensePlayers, side === "left" ? 36 : 64);
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
      const targetX = getBlitzCoverageHashX(offensePlayers, side);
      path = makeCoveragePath(targetX, defender.y + 13);
    }
  } else if (pathwayId === "mof") {
    path = makeCoveragePath(originX, 88);
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

  return {
    id: id ?? `blitz-pathway-${pathwayId}-${defender.id}-${Date.now()}`,
    label: getBlitzCoverageLabel(pathwayId),
    color: stroke,
    path,
    labelX: getBlitzCoverageLabel(pathwayId) ? getCoverageLabelPoint().x : undefined,
    labelY: getBlitzCoverageLabel(pathwayId) ? getCoverageLabelPoint().y - 2.5 : undefined,
    endCap,
    pathway: {
      defenderId: defender.id,
      pathwayId,
      layer,
    },
  };
}

function getBlitzPathwayMetaFromOverlay(overlay: RouteOverlay) {
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

function getBlitzTemplateAssignments({
  callId,
  defensePlayers,
  offensePlayers,
  runStrength,
  passStrength,
  frontMode = "4-4",
}: {
  callId: BlitzCallId;
  defensePlayers: PlayerDot[];
  offensePlayers: PlayerDot[];
  runStrength?: Side;
  passStrength: Side;
  frontMode?: FrontMode;
}): { defenderId: string; pathwayId: BlitzPathwayId; layer?: "pressure" | "coverage" | "dl" }[] {
  const assignments: { defenderId: string; pathwayId: BlitzPathwayId; layer?: "pressure" | "coverage" | "dl" }[] = [];
  const usedDefenders = new Set<string>();
  const originX = getBlitzOriginX(offensePlayers);
  const defenderSide = (defenderId: string): Side => {
    const defender = defensePlayers.find((player) => player.id === defenderId);
    return defender && defender.x < originX ? "left" : "right";
  };
  const oppositeEnd = (side: Side) => (
    ["WDE", "SDE"].find((defenderId) => defenderSide(defenderId) !== side) ?? (side === "left" ? "SDE" : "WDE")
  );
  const slantAway = (side: Side): BlitzPathwayId => side === "left" ? "one_gap_slant_right" : "one_gap_slant_left";
  const add = (defenderId: string, pathwayId: BlitzPathwayId, layer?: "pressure" | "coverage" | "dl") => {
    if (usedDefenders.has(defenderId)) return;
    assignments.push({ defenderId, pathwayId, layer });
    usedDefenders.add(defenderId);
  };
  const addCornerThirds = () => {
    add("FC", defenderSide("FC") === "left" ? "deep_third_left" : "deep_third_right", "coverage");
    add("BC", defenderSide("BC") === "left" ? "deep_third_left" : "deep_third_right", "coverage");
  };
  const addDlSlants = (pressureSide: Side, dropperId?: string) => {
    const slantPathway = slantAway(pressureSide);
    ["N", "T", "WDE", "SDE"].forEach((defenderId) => {
      if (defenderId !== dropperId) add(defenderId, slantPathway, "dl");
    });
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
  const boundarySide: Side | null = Math.abs(originX - getBlitzHash("right")) < 1.5
    ? "right"
    : Math.abs(originX - getBlitzHash("left")) < 1.5
      ? "left"
      : null;
  const getDropperPathway = (dropperId: string, pressureSide: Side): BlitzPathwayId => {
    const dropperSide = pressureSide === "left" ? "right" : "left";
    if (boundarySide && defenderSide(dropperId) === boundarySide) return "drop_curl_flat";
    return passAway === dropperSide && weakSideEligibleCount <= 1 ? "drop_curl_flat" : "drop_hook";
  };
  const hasThreeWrSide = ["left", "right"].some((side) => getBlitzOrderedEligibles(offensePlayers, side as Side).length >= 3);
  const addLastNameCoverage = (blitzerId: string, dropperId: string, pressureSide: Side) => {
    const dropperPathway = getDropperPathway(dropperId, pressureSide);
    const dropperHasCurlFlat = dropperPathway === "drop_curl_flat";

    if (frontMode === "4-3") {
      if (blitzerId === "Ni") {
        add("FS", "curl_flat", "coverage");
        add("BS", "mof", "coverage");
        add("M", "strong_hook", "coverage");
        add("W", "weak_hook", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "M") {
        add("FS", "strong_hook", "coverage");
        add("BS", "mof", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("W", "weak_hook", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "W") {
        add("BS", "curl_flat", "coverage");
        add("FS", "mof", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("M", "strong_hook", "coverage");
        add(dropperId, dropperPathway, "coverage");
      } else if (blitzerId === "BS") {
        if (dropperHasCurlFlat) {
          add(dropperId, dropperPathway, "coverage");
          add("W", "strong_hook", "coverage");
        } else {
          add("W", "curl_flat", "coverage");
          add(dropperId, "strong_hook", "coverage");
        }
        add("M", "weak_hook", "coverage");
        add("Ni", "curl_flat", "coverage");
        add("FS", "mof", "coverage");
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

    add(dropperId, dropperPathway, "coverage");
    add("FS", frontMode === "4-4" ? "mof" : "curl_flat", "coverage");

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
    const dropperId = forcedDropperId ?? oppositeEnd(pressureSide);
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
        add("BS", "wall_flat", "coverage");
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

  if (callId === "newton") runQbNamePressure("Ni", "edge_pressure");
  if (callId === "panthers") runTeamNamePressure("Ni", "edge_pressure");
  if (callId === "carolina" && hasThreeWrSide) runCityNamePressure("M", "edge_pressure", "W", "weak_a_gap_blitz");
  else if (callId === "carolina") runCityNamePressure("Ni", "edge_pressure", "M", "weak_a_gap_blitz");
  if (callId === "fields") runQbNamePressure("M", "edge_pressure");
  if (callId === "bears") runTeamNamePressure("M", "edge_pressure");
  if (callId === "chicago") runCityNamePressure("M", "edge_pressure", "W", "weak_a_gap_blitz");
  if (callId === "brees") runQbNamePressure("W", "edge_pressure");
  if (callId === "saints") runTeamNamePressure("W", "edge_pressure");
  if (callId === "nola") runCityNamePressure("W", "edge_pressure", "M", "weak_a_gap_blitz");
  if (callId === "bradshaw") runQbNamePressure("BS", "edge_pressure");
  if (callId === "steelers") runTeamNamePressure("BS", "edge_pressure");
  if (callId === "pitt") runCityNamePressure("BS", "edge_pressure", "W", "weak_a_gap_blitz");
  if (callId === "carr") runQbNamePressure("BC", "edge_pressure");
  if (callId === "raiders") runTeamNamePressure("BC", "edge_pressure");
  if (callId === "oakland") runCityNamePressure("BC", "edge_pressure", "M", "weak_a_gap_blitz");
  if (callId === "allen") runQbNamePressure("M", "a_gap_blitz", passStrength === "left" ? "WDE" : "SDE");
  if (callId === "bills") runTeamNamePressure("M", "a_gap_blitz");
  if (callId === "buffalo") runCityNamePressure("M", "a_gap_blitz", "W", "weak_a_gap_blitz");
  if (callId === "brady") runQbNamePressure("W", "b_gap_blitz");
  if (callId === "patriots") runTeamNamePressure("W", "b_gap_blitz");
  if (callId === "boston") runCityNamePressure("W", "b_gap_blitz", "M", "b_gap_blitz");

  return assignments;
}

function buildBlitzTemplateOverlays({
  callId,
  defensePlayers,
  offensePlayers,
  runStrength,
  passStrength,
  losY,
  wingY,
  frontMode = "4-4",
}: {
  callId: BlitzCallId;
  defensePlayers: PlayerDot[];
  offensePlayers: PlayerDot[];
  runStrength?: Side;
  passStrength: Side;
  losY: number;
  wingY: number;
  frontMode?: FrontMode;
}) {
  return getBlitzTemplateAssignments({ callId, defensePlayers, offensePlayers, passStrength, frontMode }).flatMap((assignment) => {
    const defender = defensePlayers.find((player) => player.id === assignment.defenderId);
    if (!defender) return [];
    return buildBlitzPathwayOverlay({
      defender,
      offensePlayers,
      pathwayId: assignment.pathwayId,
      runStrength,
      passStrength,
      losY,
      wingY,
      frontMode,
      layer: assignment.layer,
    });
  });
}

function getRunFitArrowStroke(color: RunFitArrowColor) {
  if (color === "gold") return "#f4cf63";
  if (color === "cyan") return "#78dfd0";
  if (color === "sky") return "#89c6ff";
  if (color === "red") return "#ef4444";
  return "#ffffff";
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
  onFieldClick?: (x: number, y: number) => void;
  onFieldDoubleClick?: (x: number, y: number) => void;
}) {
  const [drag, setDrag] = useState<{ id: string; type: "offense" | "defense" | "defense_ghost" } | null>(null);
  const maybeFlipX = (x: number, enabled: boolean) => (enabled ? 100 - x : x);
  const maybeFlipY = (y: number, enabled: boolean) => (enabled ? 100 - y : y);
  const fieldWide = editableDefense || wideFieldMarks;
  const hashXs = fieldHashXs ?? [getHash("left", fieldWide), getHash("right", fieldWide)];
  const losY = flipOffense ? 100 - losReferenceY : losReferenceY;
  const hashMarkRows = [13, 28, 43, 61, 76, 91];
  const sidelineInset = 1.5;
  const numberInset = 12;
  const annotationScale = compactAnnotations ? 0.72 : 1;

  const getRawPoint = (clientX: number, clientY: number, rect: DOMRect) => {
    const x = clamp(((clientX - rect.left) / rect.width) * 100, 2, 98);
    const rawY = clamp(((clientY - rect.top) / rect.height) * 100, 2, 98);
    return { x, rawY };
  };

  const getPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { x: rawX, rawY } = getRawPoint(e.clientX, e.clientY, rect);
    const x = drag?.type === "offense" && flipHorizontalPerspective ? 100 - rawX : rawX;
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
          <polyline
            points={route.path.map((point) => `${maybeFlipX(point.x, flipHorizontalPerspective)},${maybeFlipY(point.y, flipOffense)}`).join(" ")}
            fill="none"
            stroke={route.color}
            strokeWidth={0.7 * annotationScale}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={`url(#marker-${route.id})`}
            opacity="0.95"
          />
          {route.labelX !== undefined && route.labelY !== undefined ? (
            <>
              <rect
                x={maybeFlipX(route.labelX, flipHorizontalPerspective) - 2.8 * annotationScale}
                y={maybeFlipY(route.labelY, flipOffense) - 2.45 * annotationScale}
                width={7.2 * annotationScale}
                height={4.2 * annotationScale}
                rx={1.15 * annotationScale}
                fill="rgba(15,23,42,0.68)"
              />
              <text
                x={maybeFlipX(route.labelX, flipHorizontalPerspective) + 0.8 * annotationScale}
                y={maybeFlipY(route.labelY, flipOffense)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={1.25 * annotationScale}
                letterSpacing="0.04em"
                fontWeight="700"
                fill="white"
              >
                {route.label}
              </text>
            </>
          ) : null}
        </g>
      ))}
    </svg>
  ) : null;

  return (
    <div
      className="relative aspect-[19/9] w-full overflow-hidden rounded-2xl border bg-emerald-700"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setDrag(null)}
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
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded border px-1.5 py-0.5 ${compactAnnotations ? "text-[7px]" : "text-[10px]"} font-black uppercase tracking-[0.10em] shadow-sm ${toneClass}`}
            style={{ left: `${maybeFlipX(tag.x, flipHorizontalPerspective)}%`, top: `${maybeFlipY(tag.y, flipOffense)}%` }}
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
            player={{ ...p, x: maybeFlipX(p.x, flipHorizontalPerspective), y: maybeFlipY(p.y, flipOffense) }}
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function slugifyFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "clip";
}

function formatFilmDirection(direction: Side) {
  return direction === "left" ? "Left" : "Right";
}

function parseTrimSeconds(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

function formatVideoTimestamp(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  const hundredths = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 100);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function inferLegacyFilmRunMetadata(
  clipBucket: string,
  runScheme: FilmRunScheme,
  zoneType: FilmZoneType,
) {
  const normalizedBucket = clipBucket.trim().toLowerCase();
  const bucketImpliesZone = normalizedBucket.includes("zone") || normalizedBucket.includes("jet sweep");
  const nextRunScheme: FilmRunScheme = runScheme ? runScheme : bucketImpliesZone ? "zone" : "";

  if (nextRunScheme !== "zone") {
    return {
      runScheme: nextRunScheme,
      zoneType,
    };
  }

  const nextZoneType: FilmZoneType =
    normalizedBucket.includes("jet sweep")
      ? "jet"
      : normalizedBucket.includes("split zone")
        ? "split"
        : zoneType;

  return {
    runScheme: nextRunScheme,
    zoneType: nextZoneType,
  };
}

function deriveFilmClipBucket(metadata: {
  runPass: "run" | "pass";
  direction: Side;
  passType: FilmPassType;
  runScheme: FilmRunScheme;
  zoneType: FilmZoneType;
  gapPullerCount: FilmGapPullerCount;
  gapOnePullerConcept: FilmGapOnePullerConcept;
  gapTwoPullerConcept: FilmGapTwoPullerConcept;
  manConcept: FilmManConcept;
}) {
  const sideLabel = formatFilmDirection(metadata.direction);

  if (metadata.runPass === "pass") {
    if (metadata.passType === "screen") return "Screen Pass";
    if (metadata.passType === "play_action") return "Play Action Pass";
    if (metadata.passType === "normal") return "Normal Pass";
    return "Pass";
  }

  if (metadata.runScheme === "zone") {
    if (metadata.zoneType === "split") return `Split Zone ${sideLabel}`;
    if (metadata.zoneType === "jet") return `Jet Sweep ${sideLabel}`;
    return `Zone ${sideLabel}`;
  }

  if (metadata.runScheme === "man") {
    if (metadata.manConcept) return `${metadata.manConcept} ${sideLabel}`;
    return `Man ${sideLabel}`;
  }

  if (metadata.runScheme === "gap") {
    if (metadata.gapPullerCount === "1" && metadata.gapOnePullerConcept) {
      return `${metadata.gapOnePullerConcept} ${sideLabel}`;
    }
    if (metadata.gapPullerCount === "2" && metadata.gapTwoPullerConcept) {
      return `${metadata.gapTwoPullerConcept} ${sideLabel}`;
    }
    return `Gap ${sideLabel}`;
  }

  return `Unsorted ${sideLabel}`;
}

export default function FormationRecognitionWorkingApp() {
  const router = useRouter();
  const currentSecondsRef = useRef(0);
  const filmStudyTimeRafRef = useRef<number | null>(null);
  const didHydrateViewStateRef = useRef(false);
  const skipNextModeRandomizeRef = useRef(false);
  const previousModeRef = useRef<AppMode>("study");
  const previousAlignmentViewModeRef = useRef<AlignmentViewMode>("study");
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
  const [lastScoreSummary, setLastScoreSummary] = useState<Partial<Record<"quiz" | "offense_build" | "alignment" | "film" | "concept", ScoreSummary>>>({});
  const [scoredAttemptKey, setScoredAttemptKey] = useState<string | null>(null);
  const [revealedAttemptKeys, setRevealedAttemptKeys] = useState<Set<string>>(() => new Set());
  const [attemptStartedAt, setAttemptStartedAt] = useState<number>(Date.now());
  const [selectedPlaybooks, setSelectedPlaybooks] = useState<PlaybookKey[]>(["Foothill", "Pro", "Wing T"]);
  const [personnelFilter, setPersonnelFilter] = useState<string>("Any");
  const [appSection, setAppSection] = useState<AppSection>("offense");
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
  const [showBlitzAdminTools, setShowBlitzAdminTools] = useState(false);
  const [showRunFitAdminTools, setShowRunFitAdminTools] = useState(false);
  const [runFitTitle, setRunFitTitle] = useState("Single High vs Power Strong");
  const [runFitEditorTool, setRunFitEditorTool] = useState<RunFitEditorTool>("arrow");
  const [runFitArrowColor, setRunFitArrowColor] = useState<RunFitArrowColor>("gold");
  const [runFitLineEnd, setRunFitLineEnd] = useState<RunFitLineEnd>("square");
  const [runFitArrowLabel, setRunFitArrowLabel] = useState("PULL / KICK");
  const [runFitDraftPoints, setRunFitDraftPoints] = useState<{ x: number; y: number }[]>([]);
  const [runFitFieldTags, setRunFitFieldTags] = useState<FieldTag[]>([]);
  const [runFitRouteOverlays, setRunFitRouteOverlays] = useState<RouteOverlay[]>([]);
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
  const [selectedBlitzBaseBoardId, setSelectedBlitzBaseBoardId] = useState<BlitzBaseBoardId>("double");
  const [selectedBlitzFrontMode, setSelectedBlitzFrontMode] = useState<FrontMode>("4-4");
  const [selectedBlitzBoardSpot, setSelectedBlitzBoardSpot] = useState<BlitzBoardSpot>("mof");
  const [selectedBlitzCallId, setSelectedBlitzCallId] = useState<BlitzCallId>("newton");
  const [selectedBlitzCallFamilyId, setSelectedBlitzCallFamilyId] = useState<BlitzCallFamilyId>("newton");
  const [selectedBlitzCallType, setSelectedBlitzCallType] = useState<BlitzCallType>("last_name");
  const [blitzTitle, setBlitzTitle] = useState("Newton vs Double");
  const [blitzEditorTool, setBlitzEditorTool] = useState<RunFitEditorTool>("arrow");
  const [blitzLineColor, setBlitzLineColor] = useState<RunFitArrowColor>("red");
  const [blitzLineEnd, setBlitzLineEnd] = useState<RunFitLineEnd>("arrow");
  const [blitzLineLabel, setBlitzLineLabel] = useState("BLITZ");
  const [blitzDraftPoints, setBlitzDraftPoints] = useState<{ x: number; y: number }[]>([]);
  const [blitzFieldTags, setBlitzFieldTags] = useState<FieldTag[]>([]);
  const [blitzRouteOverlays, setBlitzRouteOverlays] = useState<RouteOverlay[]>([]);
  const [blitzTagLabel, setBlitzTagLabel] = useState("NEWTON");
  const [blitzTagTone, setBlitzTagTone] = useState<FieldTag["tone"]>("gold");
  const [blitzSavedBoards, setBlitzSavedBoards] = useState<BlitzSavedBoard[]>([]);
  const [selectedBlitzBoardId, setSelectedBlitzBoardId] = useState("working");
  const [blitzSaveNotice, setBlitzSaveNotice] = useState<string | null>(null);
  const [blitzBoardsHydrated, setBlitzBoardsHydrated] = useState(false);
  const [selectedBlitzPathwayDefenderId, setSelectedBlitzPathwayDefenderId] = useState("M");
  const [selectedBlitzPathwayId, setSelectedBlitzPathwayId] = useState<BlitzPathwayId>("a_gap_blitz");
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
  const [filmQuizAnswers, setFilmQuizAnswers] = useState<FilmQuizAnswers>({
    runPass: "",
    passType: "",
    direction: "",
    runScheme: "",
    zoneType: "",
    gapPullerCount: "",
    pullerConcept: "",
  });
  const [showFilmQuizFeedback, setShowFilmQuizFeedback] = useState(false);
  const [showFilmQuizAnswers, setShowFilmQuizAnswers] = useState(false);
  const [filmQuizStarted, setFilmQuizStarted] = useState(false);
  const [filmQuizFinished, setFilmQuizFinished] = useState(false);
  const [filmQuizPlaysUsed, setFilmQuizPlaysUsed] = useState(0);
  const [filmStudyCurrentTime, setFilmStudyCurrentTime] = useState(0);
  const [filmStudyDuration, setFilmStudyDuration] = useState(0);
  const [filmDraft, setFilmDraft] = useState<FilmClipDraft>({
    sourceType: "Other",
    formationKey: "",
    teamTag: "",
    runPass: "run",
    direction: "right",
    passType: "",
    runScheme: "zone",
    zoneType: "normal",
    gapPullerCount: "",
    gapOnePullerConcept: "",
    gapTwoPullerConcept: "",
    manConcept: "",
    quizStartSeconds: "",
    quizEndSeconds: "",
    remoteStudyUrl: "",
    remoteQuizUrl: "",
    studyFile: null,
    quizFile: null,
  });
  const [filmEditDraft, setFilmEditDraft] = useState<Omit<FilmClipDraft, "remoteStudyUrl" | "remoteQuizUrl" | "studyFile" | "quizFile">>({
    sourceType: "Other",
    formationKey: "",
    teamTag: "",
    runPass: "run",
    direction: "right",
    passType: "",
    runScheme: "zone",
    zoneType: "normal",
    gapPullerCount: "",
    gapOnePullerConcept: "",
    gapTwoPullerConcept: "",
    manConcept: "",
    quizStartSeconds: "",
    quizEndSeconds: "",
  });
  
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

      if (savedViewState.mode === "quiz") {
        setMode("study");
        setAppSection("offense");
        setFormationTrainerViewMode("quiz");
        skipNextModeRandomizeRef.current = true;
      } else if (savedViewState.mode && MODE_OPTIONS.some((option) => option.value === savedViewState.mode)) {
        setMode(savedViewState.mode);
        setAppSection(savedViewState.appSection ?? getSectionForMode(savedViewState.mode));
        skipNextModeRandomizeRef.current = true;
      }

      if (savedViewState.appSection && APP_SECTION_OPTIONS.some((option) => option.value === savedViewState.appSection)) {
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
        ["quiz", "offense_build", "alignment", "film", "concept"].includes(savedViewState.selectedLeaderboardMode)
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
    try {
      const raw = window.localStorage.getItem(FILM_CLIPS_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as FilmClip[];
      if (!Array.isArray(saved)) return;
      const remoteClips = saved.filter(
        (clip) =>
          clip &&
          typeof clip.id === "string" &&
          typeof clip.title === "string" &&
          typeof clip.clipBucket === "string" &&
          typeof clip.formationKey === "string" &&
          typeof clip.teamTag === "string" &&
          Boolean(clip.sourceType) &&
          (clip.runPass === "run" || clip.runPass === "pass") &&
          (clip.direction === "left" || clip.direction === "right") &&
          typeof clip.studyUrl === "string" &&
          clip.kind === "remote",
      );
      if (remoteClips.length) setFilmClips((prev) => [...remoteClips, ...prev.filter((clip) => clip.kind === "local")]);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const remoteClips = filmClips.filter((clip) => clip.kind === "remote");
      window.localStorage.setItem(FILM_CLIPS_STORAGE_KEY, JSON.stringify(remoteClips));
    } catch {}
  }, [filmClips]);

  useEffect(() => {
    const loadFilmClips = async () => {
      if (!currentUser) return;

      const supabase = createClient();
      const baseSelect = "id, title, clip_bucket, formation_key, team_tag, source_type, source_label, run_pass, direction, pass_type, run_scheme, gap_puller_count, gap_one_puller_concept, gap_two_puller_concept, man_concept, study_url, quiz_url, quiz_start_seconds, quiz_end_seconds, study_storage_path, quiz_storage_path, study_file_name, quiz_file_name, study_file_size, quiz_file_size";
      const primaryResult = await supabase
        .from("film_clips")
        .select(`${baseSelect}, zone_type`)
        .eq("submode", "read_key")
        .order("created_at", { ascending: false });
      let data = primaryResult.data as any[] | null;
      let error = primaryResult.error;

      if (error?.code === "PGRST204" || error?.message?.includes("zone_type") || error?.message?.includes("formation_key") || error?.message?.includes("team_tag")) {
        const fallbackResult = await supabase
          .from("film_clips")
          .select("id, title, clip_bucket, source_type, source_label, run_pass, direction, pass_type, run_scheme, gap_puller_count, gap_one_puller_concept, gap_two_puller_concept, man_concept, study_url, quiz_url, quiz_start_seconds, quiz_end_seconds, study_storage_path, quiz_storage_path, study_file_name, quiz_file_name")
          .eq("submode", "read_key")
          .order("created_at", { ascending: false });
        data = fallbackResult.data as any[] | null;
        error = fallbackResult.error;
      }

      if (error) {
        console.error("Failed to load film clips", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        return;
      }

      const remoteClips: FilmClip[] = (data ?? []).flatMap((row) => {
        if (!row.study_url || (row.run_pass !== "run" && row.run_pass !== "pass")) return [];
        if (row.direction !== "left" && row.direction !== "right") return [];
        const normalizedPassType: FilmPassType =
          row.run_pass === "pass"
            ? FILM_PASS_TYPE_OPTIONS.includes(row.pass_type) ? row.pass_type : "normal"
            : "";
        const normalizedClipBucket =
          row.run_pass === "pass" && (!row.clip_bucket || row.clip_bucket === "Pass")
            ? deriveFilmClipBucket({
                runPass: row.run_pass,
                direction: "right",
                passType: normalizedPassType,
                runScheme: "",
                zoneType: "",
                gapPullerCount: "",
                gapOnePullerConcept: "",
                gapTwoPullerConcept: "",
                manConcept: "",
              })
            : row.clip_bucket ?? row.title ?? "Unsorted";
        const normalizedTitle =
          row.run_pass === "pass" && (!row.title || row.title === "Pass")
            ? normalizedClipBucket
            : row.title ?? normalizedClipBucket ?? "Untitled Clip";
        const normalizedRunScheme = FILM_RUN_SCHEME_OPTIONS.includes(row.run_scheme) ? row.run_scheme : "";
        const normalizedZoneType =
          row.zone_type === "split_zone"
            ? "split"
            : FILM_ZONE_TYPE_OPTIONS.includes(row.zone_type)
              ? row.zone_type
              : "";
        const inferredRunMetadata = inferLegacyFilmRunMetadata(
          normalizedClipBucket,
          normalizedRunScheme,
          normalizedZoneType,
        );
        return [
          {
            id: row.id,
            title: normalizedTitle,
            clipBucket: normalizedClipBucket,
            formationKey: typeof row.formation_key === "string" ? normalizeFilmFormationFamily(row.formation_key) : "",
            teamTag: typeof row.team_tag === "string" ? row.team_tag : "",
            sourceType: row.source_type || row.source_label || "Other",
            runPass: row.run_pass,
            direction: row.run_pass === "pass" ? "right" : row.direction,
            passType: normalizedPassType,
            runScheme: inferredRunMetadata.runScheme,
            zoneType: inferredRunMetadata.zoneType,
            gapPullerCount: FILM_GAP_PULLER_COUNT_OPTIONS.includes(String(row.gap_puller_count) as Exclude<FilmGapPullerCount, "">)
              ? (String(row.gap_puller_count) as Exclude<FilmGapPullerCount, "">)
              : "",
            gapOnePullerConcept: FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS.includes(row.gap_one_puller_concept)
              ? row.gap_one_puller_concept
              : "",
            gapTwoPullerConcept: FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS.includes(row.gap_two_puller_concept)
              ? row.gap_two_puller_concept
              : "",
            manConcept: FILM_MAN_CONCEPT_OPTIONS.includes(row.man_concept) ? row.man_concept : "",
            studyUrl: row.study_url,
            quizUrl: row.quiz_url ?? null,
            quizStartSeconds: typeof row.quiz_start_seconds === "number" ? row.quiz_start_seconds : null,
            quizEndSeconds: typeof row.quiz_end_seconds === "number" ? row.quiz_end_seconds : null,
            studyStoragePath: row.study_storage_path ?? null,
            quizStoragePath: row.quiz_storage_path ?? null,
            kind: "supabase",
            studyFileName: row.study_file_name ?? undefined,
            quizFileName: row.quiz_file_name ?? undefined,
            studyFileSize: typeof row.study_file_size === "number" ? row.study_file_size : null,
            quizFileSize: typeof row.quiz_file_size === "number" ? row.quiz_file_size : null,
          },
        ];
      });

      setFilmClips((prev) => [...remoteClips, ...prev.filter((clip) => clip.kind === "local")]);
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
};

if (Array.isArray(scoreRows)) {
  for (const row of scoreRows) {
    if (row.mode === "quiz" || row.mode === "offense_build" || row.mode === "alignment" || row.mode === "film" || row.mode === "concept") {
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
  baseStats.concept.points;

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
        if (row.mode !== "quiz" && row.mode !== "offense_build" && row.mode !== "alignment" && row.mode !== "film" && row.mode !== "concept") {
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
          stats.concept.points;

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
        if (row.mode !== "quiz" && row.mode !== "offense_build" && row.mode !== "alignment" && row.mode !== "film" && row.mode !== "concept") {
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
          stats.concept.points;

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
    const shell = buildRunFitBoardShell(selectedRunFitBaseBoardId);
    const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedRunFitBaseBoardId)?.label ?? "Formation";
    return {
      ...shell,
      title: `Run Fit 4-4 vs ${boardLabel}`,
      notes: [] as { title: string; body: string }[],
    };
  }, [selectedRunFitBaseBoardId]);
  const blitzPreview = useMemo(
    () => buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot),
    [selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzFrontMode],
  );
  const passConceptDefinition = passConceptPreview;
  const runFitDraftOverlay = useMemo<RouteOverlay[]>(() => {
    if (runFitDraftPoints.length < 2) return [];
    return [{
      id: "run-fit-draft",
      label: runFitArrowLabel.trim() || "Draft",
      color: getRunFitArrowStroke(runFitArrowColor),
      path: runFitDraftPoints,
      labelX: runFitDraftPoints[runFitDraftPoints.length - 1]?.x ?? 50,
      labelY: (runFitDraftPoints[runFitDraftPoints.length - 1]?.y ?? 50) - 3,
      endCap: runFitLineEnd,
    }];
  }, [runFitArrowColor, runFitArrowLabel, runFitDraftPoints, runFitLineEnd]);
  const runFitDisplayOverlays = useMemo(
    () => [...runFitRouteOverlays, ...runFitDraftOverlay],
    [runFitRouteOverlays, runFitDraftOverlay],
  );
  const blitzDraftOverlay = useMemo<RouteOverlay[]>(() => {
    if (blitzDraftPoints.length < 2) return [];
    return [{
      id: "blitz-draft",
      label: blitzLineLabel.trim() || "Draft",
      color: getRunFitArrowStroke(blitzLineColor),
      path: blitzDraftPoints,
      labelX: blitzDraftPoints[blitzDraftPoints.length - 1]?.x ?? 50,
      labelY: (blitzDraftPoints[blitzDraftPoints.length - 1]?.y ?? 50) - 3,
      endCap: blitzLineEnd,
    }];
  }, [blitzDraftPoints, blitzLineColor, blitzLineEnd, blitzLineLabel]);
  const blitzDisplayOverlays = useMemo(
    () => [
      ...blitzRouteOverlays.map((overlay) => {
        const pathway = getBlitzPathwayMetaFromOverlay(overlay);
        if (!pathway) return overlay;
        const defender = blitzPreview.defensePlayers.find((player) => player.id === pathway.defenderId);
        if (!defender) return overlay;
        return buildBlitzPathwayOverlay({
          id: overlay.id,
          defender,
          offensePlayers: blitzPreview.offensePlayers,
          pathwayId: pathway.pathwayId as BlitzPathwayId,
          runStrength: blitzPreview.runStrength,
          passStrength: blitzPreview.passStrength,
          losY: blitzPreview.losY,
          wingY: blitzPreview.wingY,
          frontMode: selectedBlitzFrontMode,
          layer: pathway.layer,
        });
      }),
      ...blitzDraftOverlay,
    ],
    [blitzDraftOverlay, blitzPreview, blitzRouteOverlays, selectedBlitzFrontMode],
  );
  const selectedBlitzCallOption = useMemo(() => (
    BLITZ_CALL_OPTIONS.find((option) => option.value === selectedBlitzCallId) ?? BLITZ_CALL_OPTIONS[0]
  ), [selectedBlitzCallId]);
  const selectedStructuredBlitzBoard = useMemo(() => (
    blitzSavedBoards.find((board) => (
      board.frontMode === selectedBlitzFrontMode
      && board.callId === selectedBlitzCallId
      && board.baseBoardId === selectedBlitzBaseBoardId
      && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
    ))
  ), [blitzSavedBoards, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(RUN_FIT_BOARDS_STORAGE_KEY);
      if (!raw) {
        setRunFitTitle(runFitPreview.title);
        setRunFitRouteOverlays(runFitPreview.routeOverlays);
        setRunFitFieldTags(runFitPreview.fieldTags);
        return;
      }

      const parsed = JSON.parse(raw) as {
        working?: { title?: string; routeOverlays?: RouteOverlay[]; fieldTags?: FieldTag[] };
        boards?: RunFitSavedBoard[];
        savedPathways?: RunFitSavedPathway[];
      };

      setRunFitTitle(parsed.working?.title || runFitPreview.title);
      setRunFitRouteOverlays(parsed.working?.routeOverlays || runFitPreview.routeOverlays);
      setRunFitFieldTags(parsed.working?.fieldTags || runFitPreview.fieldTags);
      setRunFitSavedBoards(Array.isArray(parsed.boards) ? parsed.boards : []);
      setRunFitSavedPathways(Array.isArray(parsed.savedPathways) ? parsed.savedPathways : []);
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
        JSON.stringify({
          working: {
            title: runFitTitle,
            routeOverlays: runFitRouteOverlays,
            fieldTags: runFitFieldTags,
          },
          boards: runFitSavedBoards,
          savedPathways: runFitSavedPathways,
        }),
      );
    } catch {}
  }, [runFitFieldTags, runFitRouteOverlays, runFitSavedBoards, runFitSavedPathways, runFitTitle]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BLITZ_BOARDS_STORAGE_KEY);
      if (!raw) {
        setBlitzTitle(blitzPreview.title);
        setBlitzRouteOverlays(blitzPreview.routeOverlays);
        setBlitzFieldTags(blitzPreview.fieldTags);
        setBlitzBoardsHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        selectedBaseBoardId?: BlitzBaseBoardId;
        selectedFrontMode?: FrontMode;
        selectedBoardSpot?: BlitzBoardSpot;
        selectedCallId?: BlitzCallId;
        working?: { title?: string; routeOverlays?: RouteOverlay[]; fieldTags?: FieldTag[] };
        boards?: BlitzSavedBoard[];
      };

      const savedBaseId = BLITZ_BASE_BOARD_OPTIONS.some((option) => option.value === parsed.selectedBaseBoardId)
        ? parsed.selectedBaseBoardId as BlitzBaseBoardId
        : "double";
      const savedFrontMode: FrontMode = parsed.selectedFrontMode === "4-3" ? "4-3" : "4-4";
      const savedBoardSpot: BlitzBoardSpot = parsed.selectedBoardSpot === "hash" ? "hash" : "mof";
      const savedCallId: BlitzCallId = BLITZ_CALL_OPTIONS.some((option) => option.value === parsed.selectedCallId)
        ? parsed.selectedCallId as BlitzCallId
        : "newton";
      setSelectedBlitzBaseBoardId(savedBaseId);
      setSelectedBlitzFrontMode(savedFrontMode);
      setSelectedBlitzBoardSpot(savedBoardSpot);
      setSelectedBlitzCallId(savedCallId);
      setSelectedBlitzCallFamilyId(getBlitzCallFamilyId(savedCallId));
      setSelectedBlitzCallType(getBlitzCallType(savedCallId));
      const savedPreview = buildBlitzBoardShell(savedBaseId, savedFrontMode, savedBoardSpot);
      setBlitzTitle(parsed.working?.title || savedPreview.title);
      setBlitzRouteOverlays(parsed.working?.routeOverlays || savedPreview.routeOverlays);
      setBlitzFieldTags(parsed.working?.fieldTags || savedPreview.fieldTags);
      setBlitzSavedBoards(Array.isArray(parsed.boards) ? parsed.boards : []);
      setBlitzBoardsHydrated(true);
    } catch {
      setBlitzTitle(blitzPreview.title);
      setBlitzRouteOverlays(blitzPreview.routeOverlays);
      setBlitzFieldTags(blitzPreview.fieldTags);
      setBlitzBoardsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!blitzBoardsHydrated) return;
    try {
      window.localStorage.setItem(
        BLITZ_BOARDS_STORAGE_KEY,
        JSON.stringify({
          selectedBaseBoardId: selectedBlitzBaseBoardId,
          selectedFrontMode: selectedBlitzFrontMode,
          selectedBoardSpot: selectedBlitzBoardSpot,
          selectedCallId: selectedBlitzCallId,
          working: {
            title: blitzTitle,
            routeOverlays: blitzRouteOverlays,
            fieldTags: blitzFieldTags,
          },
          boards: blitzSavedBoards,
        }),
      );
    } catch {}
  }, [blitzBoardsHydrated, blitzFieldTags, blitzRouteOverlays, blitzSavedBoards, blitzTitle, selectedBlitzBaseBoardId, selectedBlitzBoardSpot, selectedBlitzCallId, selectedBlitzFrontMode]);
  const passConceptQuizRoutePreview = useMemo(() => {
    if (passConceptViewMode !== "quiz") return [];
    if (passConceptQuizMode === "identify") return passConceptPreview.routesPreview;
    if (showPassConceptAnswers) return passConceptPreview.routesPreview;

    return passConceptDefinition.activePlayers.flatMap((playerId) => {
      const selectedRoute = passConceptAnswers[playerId];
      const player = passConceptPreview.formationPlayers.find((entry) => entry.id === playerId);
      if (!selectedRoute || !player) return [];

      const side: Side =
        passConceptDefinition.boardKind === "2x2"
          ? (playerId === "X" || playerId === "H" ? "right" : "left")
          : "right";

      return [{
        id: `quiz-preview-${playerId}-${selectedRoute.toLowerCase().replace(/\s+/g, "-")}`,
        label: selectedRoute,
        color:
          playerId === "X" || playerId === "Z" ? "#f6d36b"
          : playerId === "H" ? "#f2b35d"
          : "#89c6ff",
        path: buildRoutePath(player, selectedRoute, passConceptPreview.losY, 3, side),
        labelX: player.x,
        labelY: player.y - 8.5,
      }];
    });
  }, [passConceptAnswers, passConceptDefinition.activePlayers, passConceptDefinition.boardKind, passConceptPreview, passConceptQuizMode, passConceptViewMode, showPassConceptAnswers]);
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
  const activeFilmClips = useMemo(() => {
    if (filmSubmode === "formation_key") {
      if (filmFormationFilter === "all") return filmClips;
      return filmClips.filter((clip) => normalizeFilmFormationFamily(clip.formationKey) === filmFormationFilter);
    }
    if (filmSubmode === "team_key") {
      if (filmTeamFilter === "all") return filmClips;
      return filmClips.filter((clip) => clip.teamTag === filmTeamFilter);
    }
    return filmClips;
  }, [filmClips, filmSubmode, filmFormationFilter, filmTeamFilter]);
  const filmFormationKeyOptions = useMemo(() => {
    const grouped = new Map<string, string[]>();

    filmClips
      .map((clip) => normalizeFilmFormationFamily(clip.formationKey.trim()))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .forEach((formationKey) => {
        const matchingGroup = FILM_FORMATION_KEY_TAG_GROUPS.find((group) => group.options.some((option) => option === formationKey));
        const groupLabel = matchingGroup?.label ?? "Other";
        const next = grouped.get(groupLabel) ?? [];
        if (!next.includes(formationKey)) next.push(formationKey);
        grouped.set(groupLabel, next);
      });

    return Array.from(grouped.entries()).map(([label, options]) => ({
      label,
      options,
    }));
  }, [filmClips]);
  const filmTeamTagOptions = useMemo(() => {
    return filmClips
      .map((clip) => clip.teamTag.trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .filter((teamTag, index, arr) => arr.indexOf(teamTag) === index);
  }, [filmClips]);
  const filmTeamTagSelectOptions = useMemo(() => {
    const optionSet = new Set<string>();

    if (currentUser?.teamCode?.trim()) {
      optionSet.add(currentUser.teamCode.trim());
    }

    filmTeamTagOptions.forEach((teamTag) => optionSet.add(teamTag));

    if (filmDraft.teamTag.trim()) {
      optionSet.add(filmDraft.teamTag.trim());
    }

    if (filmEditDraft.teamTag.trim()) {
      optionSet.add(filmEditDraft.teamTag.trim());
    }

    return Array.from(optionSet).sort((a, b) => a.localeCompare(b));
  }, [currentUser?.teamCode, filmDraft.teamTag, filmEditDraft.teamTag, filmTeamTagOptions]);
  const safeFilmFormationFilter = filmFormationFilter === "all" || filmFormationKeyOptions.some((group) => group.options.includes(filmFormationFilter))
    ? filmFormationFilter
    : "all";
  const safeFilmTeamFilter = filmTeamFilter === "all" || filmTeamTagOptions.includes(filmTeamFilter)
    ? filmTeamFilter
    : "all";
  const filmClipGroups = useMemo(() => {
    type ClipOption = { value: string; label: string };
    type BucketGroup = { bucket: string; options: ClipOption[] };
    type SectionGroup = { section: string; buckets: BucketGroup[] };

    const grouped = new Map<"run" | "pass", Map<string, Map<string, ClipOption[]>>>();

    const getRunSection = (clip: FilmClip) => {
      if (clip.runScheme === "zone") return "Zone";
      if (clip.runScheme === "man") return "Man";
      if (clip.runScheme === "gap") return "Gap";
      return "Other Runs";
    };

    const getPassSection = (clip: FilmClip) => {
      if (clip.passType === "screen") return "Screen";
      if (clip.passType === "play_action") return "Play Action";
      if (clip.passType === "normal") return "Normal";
      return "Pass";
    };

    activeFilmClips.forEach((clip) => {
      const sectionLabel = clip.runPass === "run" ? getRunSection(clip) : getPassSection(clip);
      const runPassSections = grouped.get(clip.runPass) ?? new Map<string, Map<string, ClipOption[]>>();
      const sectionBuckets = runPassSections.get(sectionLabel) ?? new Map<string, ClipOption[]>();
      const bucketClips = sectionBuckets.get(clip.clipBucket) ?? [];
      const nextCount = bucketClips.length + 1;

      bucketClips.push({
        value: clip.id,
        label: `Clip ${nextCount}`,
      });

      sectionBuckets.set(clip.clipBucket, bucketClips);
      runPassSections.set(sectionLabel, sectionBuckets);
      grouped.set(clip.runPass, runPassSections);
    });

    const runSectionOrder = ["Zone", "Man", "Gap", "Other Runs"];
    const passSectionOrder = ["Normal", "Screen", "Play Action", "Pass"];

    return (["run", "pass"] as const)
      .map((runPass) => {
        const sectionOrder = runPass === "run" ? runSectionOrder : passSectionOrder;
        const sections: SectionGroup[] = Array.from(grouped.get(runPass)?.entries() ?? [])
          .map(([section, buckets]) => ({
            section,
            buckets: Array.from(buckets.entries())
              .map(([bucket, options]) => ({
                bucket,
                options,
              }))
              .sort((a, b) => a.bucket.localeCompare(b.bucket)),
          }))
          .sort((a, b) => sectionOrder.indexOf(a.section) - sectionOrder.indexOf(b.section));

        return {
          runPass,
          label: runPass === "run" ? "Run" : "Pass",
          sections,
        };
      })
      .filter((group) => group.sections.length > 0);
  }, [activeFilmClips]);
  const selectedFilmClip = useMemo(
    () => activeFilmClips.find((clip) => clip.id === selectedFilmClipId) ?? activeFilmClips[0] ?? null,
    [activeFilmClips, selectedFilmClipId],
  );
  const passConceptResult = Object.fromEntries(
    (["X", "H", "Y", "Z"] as PassConceptPlayerId[]).map((playerId) => [
      playerId,
      !passConceptDefinition.activePlayers.includes(playerId)
        ? true
        : passConceptAnswers[playerId].trim().toLowerCase() === (passConceptDefinition.routes[playerId] ?? "").toLowerCase(),
    ]),
  ) as Record<PassConceptPlayerId, boolean>;
  const passConceptScore = passConceptDefinition.activePlayers.filter((playerId) => passConceptResult[playerId]).length;
  const availablePassConceptNames = useMemo(
    () =>
      effectivePassConceptBoardKind === "2x2"
        ? TWO_BY_TWO_CONCEPTS.map((concept) => concept.name)
        : THREE_BY_ONE_CONCEPTS.map((concept) => concept.name),
    [effectivePassConceptBoardKind],
  );
  const passConceptFrontsideNameResult =
    passConceptDefinition.boardKind === "2x2"
      ? passConceptFrontsideNameAnswer.trim().toLowerCase() === (passConceptDefinition.frontsideConceptName ?? "").toLowerCase()
      : true;
  const passConceptBacksideNameResult =
    passConceptDefinition.boardKind === "2x2"
      ? passConceptBacksideNameAnswer.trim().toLowerCase() === (passConceptDefinition.backsideConceptName ?? "").toLowerCase()
      : true;
  const passConceptNameResult =
    passConceptDefinition.boardKind === "2x2"
      ? passConceptFrontsideNameResult && passConceptBacksideNameResult
      : passConceptNameAnswer.trim().toLowerCase() === passConceptDefinition.conceptName.toLowerCase();
  const passConceptIdentifyScore =
    passConceptDefinition.boardKind === "2x2"
      ? Number(passConceptFrontsideNameResult) + Number(passConceptBacksideNameResult)
      : Number(passConceptNameResult);
  const passConceptIdentifyQuestionCount = passConceptDefinition.boardKind === "2x2" ? 2 : 1;

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
    setFilmQuizAnswers({
      runPass: "",
      passType: "",
      direction: "",
      runScheme: "",
      zoneType: "",
      gapPullerCount: "",
      pullerConcept: "",
    });
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
    setFilmEditDraft({
      sourceType: selectedFilmClip.sourceType,
      formationKey: selectedFilmClip.formationKey ?? "",
      teamTag: selectedFilmClip.teamTag ?? "",
      runPass: selectedFilmClip.runPass,
      direction: selectedFilmClip.direction,
      passType: selectedFilmClip.passType ?? "",
      runScheme: selectedFilmClip.runScheme ?? "",
      zoneType: selectedFilmClip.zoneType ?? "",
      gapPullerCount: selectedFilmClip.gapPullerCount ?? "",
      gapOnePullerConcept: selectedFilmClip.gapOnePullerConcept ?? "",
      gapTwoPullerConcept: selectedFilmClip.gapTwoPullerConcept ?? "",
      manConcept: selectedFilmClip.manConcept ?? "",
      quizStartSeconds: selectedFilmClip.quizStartSeconds?.toString() ?? "",
      quizEndSeconds: selectedFilmClip.quizEndSeconds?.toString() ?? "",
    });
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

  useEffect(() => {
    setShowQuizFeedback(false);
    setShowQuizAnswers(false);
    setQuizReadyForNext(false);
    setShowPassConceptFeedback(false);
    setShowPassConceptAnswers(false);
    setPassConceptAnswers({ X: "", H: "", Y: "", Z: "" });
    setShowAlignmentCheck(false);
    setShowOffenseCheck(false);
    setLastScoreSummary({});
    setEditingAlignmentAnswers(false);
    setQuizAnswers({ formation: "", runStrength: "", passStrength: "" });
    setScoredAttemptKey(null);
    setAttemptStartedAt(Date.now());
  }, [current.name, mode, formationTrainerViewMode]);

  useEffect(() => {
    if (passConceptFamilyFilter !== "all") {
      setPassConceptBoardKind(passConceptFamilyFilter);
    }
  }, [passConceptFamilyFilter]);

  useEffect(() => {
    if (passConceptViewMode !== "quiz" || passConceptQuizMode !== "build") return;

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
    setScoredAttemptKey(null);
    setAttemptStartedAt(Date.now());
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
      setIndex((prev) => getRandomPoolIndex(pool.length, prev));
    }

    previousModeRef.current = mode;
    previousAlignmentViewModeRef.current = alignmentViewMode;
  }, [mode, formationTrainerViewMode, alignmentViewMode, pool.length]);

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
    const currentIndex = selectedFilmClip ? clipPool.findIndex((clip) => clip.id === selectedFilmClip.id) : undefined;
    const nextIndex = getRandomPoolIndex(clipPool.length, currentIndex >= 0 ? currentIndex : undefined);
    setSelectedFilmClipId(clipPool[nextIndex].id);
    setFilmQuizAnswers({
      runPass: "",
      passType: "",
      direction: "",
      runScheme: "",
      zoneType: "",
      gapPullerCount: "",
      pullerConcept: "",
    });
    setShowFilmQuizFeedback(false);
    setShowFilmQuizAnswers(false);
    setFilmQuizStarted(false);
    setFilmQuizFinished(false);
    setFilmQuizPlaysUsed(0);
    setScoredAttemptKey(null);
    setAttemptStartedAt(Date.now());
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

  const getFilmDuplicateCandidate = (draft: FilmClipDraft) => {
    const normalizedFormation = normalizeFilmFormationFamily(draft.formationKey);
    const normalizedTeam = draft.teamTag.trim().toLowerCase();
    const normalizedStudyName = draft.studyFile?.name.trim().toLowerCase() ?? "";
    const normalizedStudySize = draft.studyFile?.size ?? null;
    const normalizedStudyUrl = draft.remoteStudyUrl.trim().toLowerCase();
    const expectedDirection = draft.runPass === "pass" ? "right" : draft.direction;
    const expectedBucket = deriveFilmClipBucket(draft);

    return filmClips.find((clip) => {
      if (clip.clipBucket !== expectedBucket) return false;
      if ((clip.formationKey || "") !== normalizedFormation) return false;
      if ((clip.teamTag || "").trim().toLowerCase() !== normalizedTeam) return false;
      if (clip.runPass !== draft.runPass) return false;
      if (clip.direction !== expectedDirection) return false;
      if ((clip.passType || "") !== (draft.runPass === "pass" ? draft.passType : "")) return false;
      if ((clip.runScheme || "") !== (draft.runPass === "run" ? draft.runScheme : "")) return false;
      if ((clip.zoneType || "") !== (draft.runPass === "run" && draft.runScheme === "zone" ? draft.zoneType : "")) return false;
      if ((clip.gapPullerCount || "") !== (draft.runPass === "run" && draft.runScheme === "gap" ? draft.gapPullerCount : "")) return false;
      if ((clip.gapOnePullerConcept || "") !== (draft.runPass === "run" && draft.runScheme === "gap" && draft.gapPullerCount === "1" ? draft.gapOnePullerConcept : "")) return false;
      if ((clip.gapTwoPullerConcept || "") !== (draft.runPass === "run" && draft.runScheme === "gap" && draft.gapPullerCount === "2" ? draft.gapTwoPullerConcept : "")) return false;
      if ((clip.manConcept || "") !== (draft.runPass === "run" && draft.runScheme === "man" ? draft.manConcept : "")) return false;

      const clipStudyName = clip.studyFileName?.trim().toLowerCase() ?? "";
      const clipStudySize = typeof clip.studyFileSize === "number" ? clip.studyFileSize : null;
      const clipStudyUrl = clip.studyUrl.trim().toLowerCase();
      return Boolean(
        (normalizedStudyName && normalizedStudySize !== null && clipStudyName && clipStudySize !== null && normalizedStudyName === clipStudyName && normalizedStudySize === clipStudySize) ||
        (normalizedStudyUrl && clipStudyUrl && normalizedStudyUrl === clipStudyUrl),
      );
    });
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

      const duplicateCandidate = getFilmDuplicateCandidate(filmDraft);
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
          const nextClip: FilmClip = {
            id: clipId,
            title,
            clipBucket,
            formationKey: normalizeFilmFormationFamily(filmDraft.formationKey),
            teamTag: filmDraft.teamTag.trim(),
            sourceType,
            runPass: filmDraft.runPass,
            direction: filmDraft.runPass === "pass" ? "right" : filmDraft.direction,
            passType: filmDraft.runPass === "pass" ? filmDraft.passType : "",
            runScheme: filmDraft.runPass === "run" ? filmDraft.runScheme : "",
            zoneType: filmDraft.runPass === "run" && filmDraft.runScheme === "zone" ? filmDraft.zoneType : "",
            gapPullerCount: filmDraft.runPass === "run" && filmDraft.runScheme === "gap" ? filmDraft.gapPullerCount : "",
            gapOnePullerConcept:
              filmDraft.runPass === "run" && filmDraft.runScheme === "gap" && filmDraft.gapPullerCount === "1"
                ? filmDraft.gapOnePullerConcept
                : "",
            gapTwoPullerConcept:
              filmDraft.runPass === "run" && filmDraft.runScheme === "gap" && filmDraft.gapPullerCount === "2"
                ? filmDraft.gapTwoPullerConcept
                : "",
            manConcept: filmDraft.runPass === "run" && filmDraft.runScheme === "man" ? filmDraft.manConcept : "",
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
          };

          let { error: insertError } = await supabase.from("film_clips").insert({
            id: clipId,
            title,
            clip_bucket: nextClip.clipBucket,
            formation_key: nextClip.formationKey || null,
            team_tag: nextClip.teamTag || null,
            source_type: nextClip.sourceType,
            source_label: nextClip.sourceType,
            submode: "read_key",
            run_pass: nextClip.runPass,
            direction: nextClip.direction,
            pass_type: nextClip.passType || null,
            run_scheme: nextClip.runScheme || null,
            zone_type: nextClip.zoneType || null,
            gap_puller_count: nextClip.gapPullerCount ? Number(nextClip.gapPullerCount) : null,
            gap_one_puller_concept: nextClip.gapOnePullerConcept || null,
            gap_two_puller_concept: nextClip.gapTwoPullerConcept || null,
            man_concept: nextClip.manConcept || null,
            study_url: nextClip.studyUrl,
            quiz_url: nextClip.quizUrl,
            quiz_start_seconds: nextClip.quizStartSeconds,
            quiz_end_seconds: nextClip.quizEndSeconds,
            study_storage_path: nextClip.studyStoragePath,
            quiz_storage_path: nextClip.quizStoragePath,
            study_file_name: nextClip.studyFileName ?? null,
            quiz_file_name: nextClip.quizFileName ?? null,
            study_file_size: nextClip.studyFileSize ?? null,
            quiz_file_size: nextClip.quizFileSize ?? null,
            created_by: currentUser.id,
          });

          if (insertError?.code === "PGRST204" || insertError?.message?.includes("formation_key") || insertError?.message?.includes("team_tag")) {
            const fallbackResult = await supabase.from("film_clips").insert({
              id: clipId,
              title,
              clip_bucket: nextClip.clipBucket,
              source_type: nextClip.sourceType,
              source_label: nextClip.sourceType,
              submode: "read_key",
              run_pass: nextClip.runPass,
              direction: nextClip.direction,
              pass_type: nextClip.passType || null,
              run_scheme: nextClip.runScheme || null,
              zone_type: nextClip.zoneType || null,
              gap_puller_count: nextClip.gapPullerCount ? Number(nextClip.gapPullerCount) : null,
              gap_one_puller_concept: nextClip.gapOnePullerConcept || null,
              gap_two_puller_concept: nextClip.gapTwoPullerConcept || null,
              man_concept: nextClip.manConcept || null,
              study_url: nextClip.studyUrl,
              quiz_url: nextClip.quizUrl,
              quiz_start_seconds: nextClip.quizStartSeconds,
              quiz_end_seconds: nextClip.quizEndSeconds,
              study_storage_path: nextClip.studyStoragePath,
              quiz_storage_path: nextClip.quizStoragePath,
              study_file_name: nextClip.studyFileName ?? null,
              quiz_file_name: nextClip.quizFileName ?? null,
              created_by: currentUser.id,
            });
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

        const nextClip: FilmClip = {
          id: `film-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          clipBucket,
          formationKey: normalizeFilmFormationFamily(filmDraft.formationKey),
          teamTag: filmDraft.teamTag.trim(),
          sourceType,
          runPass: filmDraft.runPass,
          direction: filmDraft.runPass === "pass" ? "right" : filmDraft.direction,
          passType: filmDraft.runPass === "pass" ? filmDraft.passType : "",
          runScheme: filmDraft.runPass === "run" ? filmDraft.runScheme : "",
          zoneType: filmDraft.runPass === "run" && filmDraft.runScheme === "zone" ? filmDraft.zoneType : "",
          gapPullerCount: filmDraft.runPass === "run" && filmDraft.runScheme === "gap" ? filmDraft.gapPullerCount : "",
          gapOnePullerConcept:
            filmDraft.runPass === "run" && filmDraft.runScheme === "gap" && filmDraft.gapPullerCount === "1"
              ? filmDraft.gapOnePullerConcept
              : "",
          gapTwoPullerConcept:
            filmDraft.runPass === "run" && filmDraft.runScheme === "gap" && filmDraft.gapPullerCount === "2"
              ? filmDraft.gapTwoPullerConcept
              : "",
          manConcept: filmDraft.runPass === "run" && filmDraft.runScheme === "man" ? filmDraft.manConcept : "",
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
        };

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
      setFilmDraft({
        sourceType: "Hudl",
        formationKey: "",
        teamTag: "",
        runPass: "run",
        direction: "right",
        passType: "",
        runScheme: "zone",
        zoneType: "normal",
        gapPullerCount: "",
        gapOnePullerConcept: "",
        gapTwoPullerConcept: "",
        manConcept: "",
        quizStartSeconds: "",
        quizEndSeconds: "",
        remoteStudyUrl: "",
        remoteQuizUrl: "",
        studyFile: null,
        quizFile: null,
      });
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
      const nextClip: FilmClip = {
        ...selectedFilmClip,
        title: clipBucket,
        clipBucket,
        formationKey: normalizeFilmFormationFamily(filmEditDraft.formationKey),
        teamTag: filmEditDraft.teamTag.trim(),
        sourceType: filmEditDraft.sourceType,
        runPass: filmEditDraft.runPass,
        direction: filmEditDraft.runPass === "pass" ? "right" : filmEditDraft.direction,
        passType: filmEditDraft.runPass === "pass" ? filmEditDraft.passType : "",
        runScheme: filmEditDraft.runPass === "run" ? filmEditDraft.runScheme : "",
        zoneType: filmEditDraft.runPass === "run" && filmEditDraft.runScheme === "zone" ? filmEditDraft.zoneType : "",
        gapPullerCount: filmEditDraft.runPass === "run" && filmEditDraft.runScheme === "gap" ? filmEditDraft.gapPullerCount : "",
        gapOnePullerConcept:
          filmEditDraft.runPass === "run" && filmEditDraft.runScheme === "gap" && filmEditDraft.gapPullerCount === "1"
            ? filmEditDraft.gapOnePullerConcept
            : "",
        gapTwoPullerConcept:
          filmEditDraft.runPass === "run" && filmEditDraft.runScheme === "gap" && filmEditDraft.gapPullerCount === "2"
            ? filmEditDraft.gapTwoPullerConcept
            : "",
        manConcept: filmEditDraft.runPass === "run" && filmEditDraft.runScheme === "man" ? filmEditDraft.manConcept : "",
        quizStartSeconds,
        quizEndSeconds,
      };

      try {
        if (selectedFilmClip.kind === "supabase") {
          const supabase = createClient();
          const updatePayload = {
            title: nextClip.title,
            clip_bucket: nextClip.clipBucket,
            formation_key: nextClip.formationKey || null,
            team_tag: nextClip.teamTag || null,
            source_type: nextClip.sourceType,
            source_label: nextClip.sourceType,
            run_pass: nextClip.runPass,
            direction: nextClip.direction,
            pass_type: nextClip.passType || null,
            run_scheme: nextClip.runScheme || null,
            zone_type: nextClip.zoneType || null,
            gap_puller_count: nextClip.gapPullerCount ? Number(nextClip.gapPullerCount) : null,
            gap_one_puller_concept: nextClip.gapOnePullerConcept || null,
            gap_two_puller_concept: nextClip.gapTwoPullerConcept || null,
            man_concept: nextClip.manConcept || null,
            quiz_start_seconds: nextClip.quizStartSeconds,
            quiz_end_seconds: nextClip.quizEndSeconds,
          };
          let updateResult = await supabase
            .from("film_clips")
            .update(updatePayload)
            .eq("id", selectedFilmClip.id)
            .select("id")
            .maybeSingle();
          let error = updateResult.error;
          let updatedRow = updateResult.data;

          if (error?.code === "PGRST204" || error?.message?.includes("zone_type") || error?.message?.includes("formation_key") || error?.message?.includes("team_tag")) {
            const { zone_type: _zoneType, formation_key: _formationKey, team_tag: _teamTag, ...fallbackPayload } = updatePayload;
            updateResult = await supabase
              .from("film_clips")
              .update(fallbackPayload)
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
  const filmQuizIsPass = selectedFilmClip?.runPass === "pass";
  const filmQuizNeedsPassType = filmQuizIsPass;
  const selectedFilmGapConcept = selectedFilmClip?.gapPullerCount === "1"
    ? selectedFilmClip.gapOnePullerConcept
    : selectedFilmClip?.gapPullerCount === "2"
      ? selectedFilmClip.gapTwoPullerConcept
      : "";
  const filmQuizNeedsRunScheme = selectedFilmClip?.runPass === "run";
  const filmQuizNeedsZoneType = filmQuizNeedsRunScheme && selectedFilmClip?.runScheme === "zone";
  const filmQuizNeedsGapDetails = filmQuizNeedsRunScheme && selectedFilmClip?.runScheme === "gap";
  const filmQuizChecks = [
    normalize(filmQuizAnswers.runPass) === normalize(selectedFilmClip?.runPass === "run" ? "Run" : "Pass"),
    ...(filmQuizNeedsPassType
      ? [normalize(filmQuizAnswers.passType) === normalize(selectedFilmClip?.passType ?? "")]
      : []),
    ...(filmQuizNeedsRunScheme
      ? [normalize(filmQuizAnswers.runScheme) === normalize(selectedFilmClip?.runScheme ?? "")]
      : []),
    ...(!filmQuizIsPass
      ? [normalizeStrength(filmQuizAnswers.direction) === normalize(selectedFilmClip?.direction ?? "")]
      : []),
    ...(filmQuizNeedsZoneType
      ? [normalize(filmQuizAnswers.zoneType) === normalize(selectedFilmClip?.zoneType ?? "")]
      : []),
    ...(filmQuizNeedsGapDetails
      ? [
          normalize(filmQuizAnswers.gapPullerCount) === normalize(selectedFilmClip?.gapPullerCount ?? ""),
          normalize(filmQuizAnswers.pullerConcept) === normalize(selectedFilmGapConcept),
        ]
      : []),
  ];
  const filmQuizResult = {
    runPass: normalize(filmQuizAnswers.runPass) === normalize(selectedFilmClip?.runPass === "run" ? "Run" : "Pass"),
    passType: filmQuizNeedsPassType
      ? normalize(filmQuizAnswers.passType) === normalize(selectedFilmClip?.passType ?? "")
      : true,
    direction: filmQuizIsPass
      ? true
      : normalizeStrength(filmQuizAnswers.direction) === normalize(selectedFilmClip?.direction ?? ""),
    runScheme: filmQuizNeedsRunScheme
      ? normalize(filmQuizAnswers.runScheme) === normalize(selectedFilmClip?.runScheme ?? "")
      : true,
    zoneType: filmQuizNeedsZoneType
      ? normalize(filmQuizAnswers.zoneType) === normalize(selectedFilmClip?.zoneType ?? "")
      : true,
    gapPullerCount: filmQuizNeedsGapDetails
      ? normalize(filmQuizAnswers.gapPullerCount) === normalize(selectedFilmClip?.gapPullerCount ?? "")
      : true,
    pullerConcept: filmQuizNeedsGapDetails
      ? normalize(filmQuizAnswers.pullerConcept) === normalize(selectedFilmGapConcept)
      : true,
  };
  const filmQuizQuestionCount = filmQuizChecks.length;
  const filmQuizScore = filmQuizChecks.filter(Boolean).length;
  const filmQuizIsPerfect = filmQuizChecks.every(Boolean);
  const filmQuizAllowedReplays = 0;
  const filmQuizTotalPlaysAllowed = 1 + filmQuizAllowedReplays;
  const filmQuizReplaysRemaining = Math.max(0, filmQuizTotalPlaysAllowed - filmQuizPlaysUsed);
  const filmQuizPlaybackUrl =
    selectedFilmClip && (selectedFilmClip.quizStartSeconds !== null && selectedFilmClip.quizStartSeconds !== undefined || selectedFilmClip.quizEndSeconds !== null && selectedFilmClip.quizEndSeconds !== undefined)
      ? selectedFilmClip.studyUrl
      : selectedFilmClip?.quizUrl || selectedFilmClip?.studyUrl || "";
  const showFilmQuizRunFields = normalize(filmQuizAnswers.runPass) === "run";
  const showFilmQuizPassFields = normalize(filmQuizAnswers.runPass) === "pass";
  const showFilmQuizZoneFields = showFilmQuizRunFields && normalize(filmQuizAnswers.runScheme) === "zone";
  const showFilmQuizGapFields = showFilmQuizRunFields && normalize(filmQuizAnswers.runScheme) === "gap";

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

  const handleRunFitFieldClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin) return;

    if (runFitEditorTool === "tag") {
      const cleanLabel = runFitTagLabel.trim();
      if (!cleanLabel) return;
      setRunFitFieldTags((prev) => [
        ...prev,
        {
          id: `tag-${Date.now()}-${prev.length}`,
          label: cleanLabel,
          x,
          y,
          tone: runFitTagTone,
        },
      ]);
      setRunFitSaveNotice("Placed tag on the board.");
      return;
    }

    setRunFitDraftPoints((prev) => [...prev, { x, y }]);
    setRunFitSaveNotice(null);
  };

  const commitRunFitLine = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return;
    const cleanLabel = runFitArrowLabel.trim();
    setRunFitRouteOverlays((prev) => [
      ...prev,
      {
        id: `run-fit-arrow-${Date.now()}-${prev.length}`,
        label: cleanLabel,
        color: getRunFitArrowStroke(runFitArrowColor),
        path: points,
        labelX: cleanLabel ? points[points.length - 1]?.x ?? 50 : undefined,
        labelY: cleanLabel ? (points[points.length - 1]?.y ?? 50) - 3 : undefined,
        endCap: runFitLineEnd,
      },
    ]);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice("Line added to the board.");
  };

  const finishRunFitArrow = () => {
    commitRunFitLine(runFitDraftPoints);
  };

  const handleRunFitFieldDoubleClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin || runFitEditorTool !== "arrow") return;
    commitRunFitLine([...runFitDraftPoints, { x, y }]);
  };

  const saveRunFitDraftAsPathway = () => {
    if (!currentUser?.isAdmin) return;
    const defender = runFitPreview.defensePlayers.find((player) => player.id === selectedRunFitPathwayDefenderId);
    if (!defender || runFitDraftPoints.length < 2) {
      setRunFitSaveNotice("Draw at least two points and choose the position this pathway belongs to.");
      return;
    }

    const cleanName = runFitSavedPathwayName.trim() || runFitArrowLabel.trim() || `${defender.id} Pathway`;
    const savedPathway: RunFitSavedPathway = {
      id: `run-fit-saved-pathway-${Date.now()}`,
      name: cleanName,
      positionId: defender.id,
      label: runFitArrowLabel.trim(),
      color: runFitArrowColor,
      endCap: runFitLineEnd,
      offsets: runFitDraftPoints.map((point) => ({
        x: point.x - defender.x,
        y: point.y - defender.y,
      })),
    };

    setRunFitSavedPathways((prev) => [...prev, savedPathway]);
    setSelectedRunFitSavedPathwayId(savedPathway.id);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Saved ${cleanName} as a reusable ${defender.id} pathway.`);
  };

  const stampSavedRunFitPathway = () => {
    if (!currentUser?.isAdmin) return;
    const savedPathway = runFitSavedPathways.find((pathway) => pathway.id === selectedRunFitSavedPathwayId);
    const defender = runFitPreview.defensePlayers.find((player) => player.id === selectedRunFitPathwayDefenderId);
    if (!savedPathway || !defender) {
      setRunFitSaveNotice("Choose a saved pathway and defender first.");
      return;
    }

    const path = savedPathway.offsets.map((offset) => ({
      x: clamp(defender.x + offset.x, 2, 98),
      y: clamp(defender.y + offset.y, 2, 98),
    }));

    setRunFitRouteOverlays((prev) => [
      ...prev.filter((existing) => existing.pathway?.defenderId !== defender.id),
      {
        id: `run-fit-custom-${savedPathway.id}-${defender.id}-${Date.now()}`,
        label: savedPathway.label,
        color: getRunFitArrowStroke(savedPathway.color),
        path,
        labelX: savedPathway.label ? path[path.length - 1]?.x : undefined,
        labelY: savedPathway.label ? (path[path.length - 1]?.y ?? LOS_Y) - 3 : undefined,
        endCap: savedPathway.endCap,
      },
    ]);
    setRunFitSaveNotice(`Added ${savedPathway.name} for ${defender.id}.`);
  };

  const deleteSavedRunFitPathway = () => {
    if (!currentUser?.isAdmin || !selectedRunFitSavedPathwayId) return;
    const deletedPathway = runFitSavedPathways.find((pathway) => pathway.id === selectedRunFitSavedPathwayId);
    setRunFitSavedPathways((prev) => prev.filter((pathway) => pathway.id !== selectedRunFitSavedPathwayId));
    setSelectedRunFitSavedPathwayId("");
    setRunFitSaveNotice(deletedPathway ? `Deleted saved pathway ${deletedPathway.name}.` : "Deleted saved pathway.");
  };

  const loadRunFitBaseBoard = (baseBoardId: BlitzBaseBoardId) => {
    const shell = buildRunFitBoardShell(baseBoardId);
    const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId)?.label ?? "Formation";
    setSelectedRunFitBaseBoardId(baseBoardId);
    setSelectedRunFitBoardId("working");
    setRunFitTitle(`Run Fit 4-4 vs ${boardLabel}`);
    setRunFitRouteOverlays(shell.routeOverlays);
    setRunFitFieldTags(shell.fieldTags);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Loaded Run Fit 4-4 vs ${boardLabel}.`);
  };

  const applyRunFitPowerWeakTemplate = () => {
    if (!currentUser?.isAdmin) return;
    const shell = buildRunFitBoardShell("dog");
    const offenseById = Object.fromEntries(shell.offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
    const defenseById = Object.fromEntries(shell.defensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
    const point = (player: PlayerDot | undefined, fallback: { x: number; y: number }) => ({
      x: player?.x ?? fallback.x,
      y: player?.y ?? fallback.y,
    });
    const makeOverlay = (
      id: string,
      label: string,
      color: string,
      path: { x: number; y: number }[],
      endCap: RunFitLineEnd = "circle",
    ): RouteOverlay => ({
      id,
      label,
      color,
      path,
      labelX: path[path.length - 1]?.x,
      labelY: (path[path.length - 1]?.y ?? shell.losY) - 3,
      endCap,
    });
    const weakSide: Side = getOppositeSide(shell.runStrength);
    const weakDirection = weakSide === "left" ? -1 : 1;
    const qb = point(offenseById.QB, { x: 50, y: shell.losY - 12 });
    const rb = point(offenseById.RB ?? offenseById.R, { x: 50, y: shell.losY - 24 });
    const hWing = point(offenseById.H, { x: getBlitzGapTargetX(shell.offensePlayers, "C", weakSide), y: shell.wingY });
    const nose = point(defenseById.N, { x: getBlitzGapTargetX(shell.offensePlayers, "A", weakSide), y: shell.losY + 3 });
    const threeTech = point(defenseById.T, { x: getBlitzGapTargetX(shell.offensePlayers, "B", shell.runStrength), y: shell.losY + 3 });
    const weakEnd = point(defenseById.WDE, { x: getBlitzEdgePressureTargetX(shell.offensePlayers, weakSide, shell.losY, shell.wingY), y: shell.losY + 3 });
    const strongEnd = point(defenseById.SDE, { x: getBlitzEdgePressureTargetX(shell.offensePlayers, shell.runStrength, shell.losY, shell.wingY), y: shell.losY + 3 });
    const puller = point(offenseById.RG ?? offenseById.LG, { x: shell.runStrength === "right" ? 58 : 42, y: shell.losY });
    const weakAGap = getBlitzGapTargetX(shell.offensePlayers, "A", weakSide);
    const weakBGap = getBlitzGapTargetX(shell.offensePlayers, "B", weakSide);
    const strongBGap = getBlitzGapTargetX(shell.offensePlayers, "B", shell.runStrength);
    const strongAGap = getBlitzGapTargetX(shell.offensePlayers, "A", shell.runStrength);
    const strongCGap = getBlitzGapTargetX(shell.offensePlayers, "C", shell.runStrength);
    const bs = point(defenseById.BS, { x: shell.runStrength === "right" ? 72 : 28, y: shell.losY + 18 });
    const bsTargetBGap = Math.abs(bs.x - weakBGap) <= Math.abs(bs.x - strongBGap) ? weakBGap : strongBGap;
    const frontSideClimbPoint = {
      x: weakEnd.x + weakDirection * 5,
      y: shell.losY - 13,
    };
    const pullerFit = {
      x: weakEnd.x + weakDirection * 2,
      y: getMidpoint(weakEnd.y, qb.y),
    };
    const overSpillFit = {
      x: pullerFit.x + weakDirection * 4,
      y: getMidpoint(pullerFit.y, rb.y),
    };
    const overlays: RouteOverlay[] = [
      makeOverlay("power-weak-lt-combo", "Combo", "#f4cf63", [
        point(offenseById.LT, { x: 34, y: shell.losY }),
        nose,
      ], "square"),
      makeOverlay("power-weak-lg-combo", "Combo", "#f4cf63", [
        point(offenseById.LG, { x: 42, y: shell.losY }),
        nose,
      ], "square"),
      makeOverlay("power-weak-center-down", "Down", "#f4cf63", [
        point(offenseById.C, { x: 50, y: shell.losY }),
        threeTech,
      ], "square"),
      makeOverlay("power-weak-rt-base", "Base", "#f4cf63", [
        point(offenseById.RT, { x: 66, y: shell.losY }),
        { x: strongCGap, y: shell.losY - 5 },
      ], "square"),
      makeOverlay("power-weak-y-base", "Base", "#f4cf63", [
        point(offenseById.Y, { x: 74, y: shell.losY }),
        strongEnd,
      ], "square"),
      makeOverlay("power-weak-h-climb", "Climb", "#f4cf63", [
        hWing,
        frontSideClimbPoint,
      ], "square"),
      makeOverlay("power-weak-guard-pull", "Pull", "#f4cf63", [
        puller,
        { x: puller.x + weakDirection * 10, y: shell.losY - 8 },
        pullerFit,
      ], "arrow"),
      makeOverlay("power-weak-rb-track", "RB Track", "#f4cf63", [
        rb,
        { x: getMidpoint(rb.x, weakBGap), y: getMidpoint(rb.y, qb.y) },
        { x: weakBGap, y: shell.losY - 9 },
      ], "arrow"),
      makeOverlay("power-weak-ni-force", "Force", "#ef4444", [
        point(defenseById.Ni, { x: weakEnd.x + weakDirection * 10, y: shell.losY + 16 }),
        { x: weakEnd.x + weakDirection * 9, y: shell.losY - 9 },
      ], "circle"),
      makeOverlay("power-weak-wde-spill", "Spill", "#ef4444", [
        point(defenseById.WDE, weakEnd),
        { x: weakEnd.x + weakDirection * 1.5, y: shell.losY - 4 },
        pullerFit,
      ], "circle"),
      makeOverlay("power-weak-m-over-spill", "Over Spill", "#ef4444", [
        point(defenseById.M, { x: 44, y: shell.losY + 12 }),
        { x: weakEnd.x + weakDirection * 1.5, y: shell.losY - 5 },
        overSpillFit,
      ], "circle"),
      makeOverlay("power-weak-w-a-gap", "A Gap", "#ef4444", [
        point(defenseById.W, { x: 56, y: shell.losY + 12 }),
        { x: strongAGap, y: shell.losY - 7 },
      ], "circle"),
      makeOverlay("power-weak-n-a-gap", "A Gap", "#ef4444", [
        point(defenseById.N, nose),
        { x: weakAGap, y: shell.losY - 6 },
      ], "circle"),
      makeOverlay("power-weak-t-c-gap", "C Gap", "#ef4444", [
        point(defenseById.T, threeTech),
        { x: strongCGap, y: shell.losY - 6 },
      ], "circle"),
      makeOverlay("power-weak-sde-c-gap", "C Gap", "#ef4444", [
        point(defenseById.SDE, strongEnd),
        { x: strongCGap + (shell.runStrength === "left" ? -3 : 3), y: shell.losY - 6 },
      ], "circle"),
      makeOverlay("power-weak-bs-fold", "Fold B", "#ef4444", [
        bs,
        { x: bsTargetBGap, y: shell.losY - 6 },
      ], "circle"),
    ];

    setSelectedRunFitBaseBoardId("dog");
    setSelectedRunFitBoardId("working");
    setRunFitTitle("11p Power Weak vs Dog 4-4");
    setRunFitRouteOverlays(overlays);
    setRunFitFieldTags([
      { id: "power-weak-tag", label: "11p Power Weak", x: 50, y: shell.losY - 18, tone: "gold" },
      { id: "power-weak-fit-tag", label: "1 Puller = Spill + Overlap", x: 50, y: shell.losY + 30, tone: "cyan" },
    ]);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice("Applied 11p Power Weak template.");
  };

  const addRunFitPathway = () => {
    if (!currentUser?.isAdmin) return;
    const defender = runFitPreview.defensePlayers.find((player) => player.id === selectedRunFitPathwayDefenderId);
    if (!defender) {
      setRunFitSaveNotice("Choose a defender that exists on this board.");
      return;
    }

    const originX = getBlitzOriginX(runFitPreview.offensePlayers);
    const side: Side = defender.x < originX ? "left" : "right";
    const strongSide = runFitPreview.runStrength;
    const weakSide = getOppositeSide(strongSide);
    const qbDepth = runFitPreview.offensePlayers.find((player) => player.id === "QB")?.y ?? runFitPreview.losY - 12;
    const capToQbDepth = (path: { x: number; y: number }[]) => path.map((point) => ({
      ...point,
      y: point.y < qbDepth ? qbDepth : point.y,
    }));
    const getRunFitSurface = (targetSide: Side) => {
      const byId = Object.fromEntries(runFitPreview.offensePlayers.map((player) => [player.id, player])) as Record<string, PlayerDot | undefined>;
      const tackle = targetSide === "left" ? byId.LT : byId.RT;
      const tackleX = tackle?.x ?? getBlitzGapTargetX(runFitPreview.offensePlayers, "C", targetSide);
      const sidePlayers = runFitPreview.offensePlayers.filter((player) => (
        ![...FIXED_OL_IDS, "QB", "RB", "R", "F", "FB"].includes(player.id as any)
        && (targetSide === "left" ? player.x < originX : player.x > originX)
      ));
      const tightLineSurface = sidePlayers
        .filter((player) => Math.abs(player.y - runFitPreview.losY) < 1.25 && Math.abs(player.x - tackleX) <= 9)
        .sort((a, b) => targetSide === "left" ? a.x - b.x : b.x - a.x)[0] ?? tackle;
      const tightWingSurface = sidePlayers
        .filter((player) => Math.abs(player.y - runFitPreview.wingY) < 1.75)
        .filter((player) => Math.abs(player.x - (tightLineSurface?.x ?? tackleX)) <= 12)
        .sort((a, b) => targetSide === "left" ? a.x - b.x : b.x - a.x)[0];
      const edgeSurface = tightWingSurface ?? tightLineSurface;

      return { edgeSurface, tackleX };
    };
    const getRunFitDGapX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const outside = targetSide === "left" ? -1 : 1;
      return clamp((edgeSurface?.x ?? tackleX) + outside * 3.4, 3, 97);
    };
    const getRunFitInsideEdgeX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const inside = targetSide === "left" ? 1 : -1;
      return clamp((edgeSurface?.x ?? tackleX) + inside * 2.2, 3, 97);
    };
    const getRunFitOutsideEdgeX = (targetSide: Side) => {
      const { edgeSurface, tackleX } = getRunFitSurface(targetSide);
      const outside = targetSide === "left" ? -1 : 1;
      return clamp((edgeSurface?.x ?? tackleX) + outside * 2.6, 3, 97);
    };
    const makeGapFitPath = (gap: "A" | "B" | "C", targetSide: Side) => capToQbDepth([
      { x: defender.x, y: defender.y },
      {
        x: getMidpoint(defender.x, getBlitzGapTargetX(runFitPreview.offensePlayers, gap, targetSide)),
        y: getMidpoint(defender.y, runFitPreview.losY),
      },
      { x: getBlitzGapTargetX(runFitPreview.offensePlayers, gap, targetSide), y: runFitPreview.losY - 4 },
    ]);
    const makeDGapFitPath = (targetSide: Side) => {
      const targetX = getRunFitDGapX(targetSide);
      return capToQbDepth([
        { x: defender.x, y: defender.y },
        {
          x: getMidpoint(defender.x, targetX),
          y: getMidpoint(defender.y, runFitPreview.losY),
        },
        { x: targetX, y: runFitPreview.losY - 4 },
      ]);
    };
    const makeBoxSpillPath = (targetSide: Side) => {
      const targetX = getRunFitInsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        {
          x: getMidpoint(defender.x, targetX),
          y: getMidpoint(defender.y, qbDepth),
        },
        { x: targetX, y: qbDepth },
      ];
    };
    const makeFitOffBoxPath = (targetSide: Side) => {
      const boxX = getRunFitInsideEdgeX(targetSide);
      const insideX = clamp(boxX + (targetSide === "left" ? 3 : -3), 3, 97);
      const overEdgeX = getRunFitOutsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        { x: overEdgeX, y: getMidpoint(defender.y, runFitPreview.losY) },
        { x: insideX, y: qbDepth },
      ];
    };
    const makeFitOffSpillPath = (targetSide: Side) => {
      const spillX = getRunFitInsideEdgeX(targetSide);
      const outsideX = clamp(spillX + (targetSide === "left" ? -3 : 3), 3, 97);
      const overEdgeX = getRunFitOutsideEdgeX(targetSide);
      return [
        { x: defender.x, y: defender.y },
        { x: overEdgeX, y: getMidpoint(defender.y, runFitPreview.losY) },
        { x: outsideX, y: qbDepth },
      ];
    };
    const fitPathwayMap: Partial<Record<RunFitPathwayId, BlitzPathwayId>> = {
      a_gap_fit: "a_gap_blitz",
      b_gap_fit: "b_gap_blitz",
      c_gap_fit: "c_gap_blitz",
    };
    const buildFromBlitzPathway = (pathwayId: BlitzPathwayId) => capToQbDepth(buildBlitzPathwayOverlay({
      defender,
      offensePlayers: runFitPreview.offensePlayers,
      pathwayId,
      runStrength: runFitPreview.runStrength,
      passStrength: runFitPreview.passStrength,
      losY: runFitPreview.losY,
      wingY: runFitPreview.wingY,
      frontMode: "4-4",
      layer: "pressure",
    }).path);
    const pathwayConfig: Record<RunFitPathwayId, { label: string; color: RunFitArrowColor; path: { x: number; y: number }[]; endCap: RunFitLineEnd }> = {
      a_gap_fit: {
        label: "A Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.a_gap_fit!),
        endCap: "circle",
      },
      b_gap_fit: {
        label: "B Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.b_gap_fit!),
        endCap: "circle",
      },
      c_gap_fit: {
        label: "C Fit",
        color: "gold",
        path: buildFromBlitzPathway(fitPathwayMap.c_gap_fit!),
        endCap: "circle",
      },
      d_gap_fit: {
        label: "D Fit",
        color: "gold",
        path: makeDGapFitPath(side),
        endCap: "circle",
      },
      strong_a_gap_fit: {
        label: "Str A",
        color: "gold",
        path: makeGapFitPath("A", strongSide),
        endCap: "circle",
      },
      strong_b_gap_fit: {
        label: "Str B",
        color: "gold",
        path: makeGapFitPath("B", strongSide),
        endCap: "circle",
      },
      strong_c_gap_fit: {
        label: "Str C",
        color: "gold",
        path: makeGapFitPath("C", strongSide),
        endCap: "circle",
      },
      strong_d_gap_fit: {
        label: "Str D",
        color: "gold",
        path: makeDGapFitPath(strongSide),
        endCap: "circle",
      },
      weak_a_gap_fit: {
        label: "Wk A",
        color: "gold",
        path: makeGapFitPath("A", weakSide),
        endCap: "circle",
      },
      weak_b_gap_fit: {
        label: "Wk B",
        color: "gold",
        path: makeGapFitPath("B", weakSide),
        endCap: "circle",
      },
      weak_c_gap_fit: {
        label: "Wk C",
        color: "gold",
        path: makeGapFitPath("C", weakSide),
        endCap: "circle",
      },
      weak_d_gap_fit: {
        label: "Wk D",
        color: "gold",
        path: makeDGapFitPath(weakSide),
        endCap: "circle",
      },
      box_fit: {
        label: "Box",
        color: "red",
        path: makeBoxSpillPath(side),
        endCap: "circle",
      },
      spill_fit: {
        label: "Spill",
        color: "red",
        path: makeBoxSpillPath(side),
        endCap: "circle",
      },
      under_box_fit: {
        label: "Under Box",
        color: "red",
        path: makeFitOffBoxPath(side),
        endCap: "circle",
      },
      over_spill_fit: {
        label: "Over Spill",
        color: "red",
        path: makeFitOffSpillPath(side),
        endCap: "circle",
      },
    };
    const config = pathwayConfig[selectedRunFitPathwayId];
    setRunFitRouteOverlays((prev) => [
      ...prev.filter((existing) => existing.pathway?.defenderId !== defender.id),
      {
        id: `run-fit-pathway-${selectedRunFitPathwayId}-${defender.id}-${Date.now()}`,
        label: config.label,
        color: getRunFitArrowStroke(config.color),
        path: config.path,
        labelX: config.path[config.path.length - 1]?.x,
        labelY: (config.path[config.path.length - 1]?.y ?? LOS_Y) - 3,
        endCap: config.endCap,
        pathway: {
          defenderId: defender.id,
          pathwayId: selectedRunFitPathwayId,
        },
      },
    ]);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Added ${RUN_FIT_PATHWAY_OPTIONS.find((option) => option.value === selectedRunFitPathwayId)?.label ?? "run fit"} for ${defender.id}.`);
  };

  const loadRunFitBoard = (boardId: string) => {
    if (boardId === "working") {
      setSelectedRunFitBoardId("working");
      return;
    }
    const selectedBoard = runFitSavedBoards.find((board) => board.id === boardId);
    if (!selectedBoard) return;
    setSelectedRunFitBoardId(boardId);
    setSelectedRunFitBaseBoardId(selectedBoard.baseBoardId ?? "double");
    setRunFitTitle(selectedBoard.title);
    setRunFitRouteOverlays(selectedBoard.routeOverlays);
    setRunFitFieldTags(selectedBoard.fieldTags);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice(`Loaded ${selectedBoard.title}.`);
  };

  const saveRunFitBoard = () => {
    const cleanTitle = runFitTitle.trim() || "Untitled Run Fit";
    if (selectedRunFitBoardId !== "working") {
      setRunFitSavedBoards((prev) => prev.map((board) => (
        board.id === selectedRunFitBoardId
          ? { ...board, title: cleanTitle, baseBoardId: selectedRunFitBaseBoardId, routeOverlays: runFitRouteOverlays, fieldTags: runFitFieldTags }
          : board
      )));
      setRunFitSaveNotice(`Updated ${cleanTitle}.`);
      return;
    }

    const nextBoard: RunFitSavedBoard = {
      id: `run-fit-${Date.now()}`,
      title: cleanTitle,
      routeOverlays: runFitRouteOverlays,
      fieldTags: runFitFieldTags,
      baseBoardId: selectedRunFitBaseBoardId,
    };
    setRunFitSavedBoards((prev) => [...prev, nextBoard]);
    setSelectedRunFitBoardId(nextBoard.id);
    setRunFitSaveNotice(`Saved ${cleanTitle}.`);
  };

  const resetRunFitSample = () => {
    setSelectedRunFitBoardId("working");
    setRunFitTitle(runFitPreview.title);
    setRunFitRouteOverlays(runFitPreview.routeOverlays);
    setRunFitFieldTags(runFitPreview.fieldTags);
    setRunFitDraftPoints([]);
    setRunFitSaveNotice("Reset to the sample board.");
  };

  const loadBlitzStructuredSelection = ({
    familyId = selectedBlitzCallFamilyId,
    callType = selectedBlitzCallType,
    baseBoardId = selectedBlitzBaseBoardId,
    frontMode = selectedBlitzFrontMode,
    boardSpot = selectedBlitzBoardSpot,
  }: {
    familyId?: BlitzCallFamilyId;
    callType?: BlitzCallType;
    baseBoardId?: BlitzBaseBoardId;
    frontMode?: FrontMode;
    boardSpot?: BlitzBoardSpot;
  }) => {
    const nextCallId = getBlitzCallId(familyId, callType);
    const selectedBoard = blitzSavedBoards.find((board) => (
      board.frontMode === frontMode
      && board.callId === nextCallId
      && board.baseBoardId === baseBoardId
      && (board.boardSpot ?? "mof") === boardSpot
    ));

    setSelectedBlitzCallFamilyId(familyId);
    setSelectedBlitzCallType(callType);
    setSelectedBlitzCallId(nextCallId);
    setSelectedBlitzBaseBoardId(baseBoardId);
    setSelectedBlitzFrontMode(frontMode);
    setSelectedBlitzBoardSpot(boardSpot);

    if (selectedBoard) {
      setSelectedBlitzBoardId(selectedBoard.id);
      setBlitzTitle(selectedBoard.title);
      setBlitzRouteOverlays(selectedBoard.routeOverlays);
      setBlitzFieldTags(selectedBoard.fieldTags);
      setBlitzDraftPoints([]);
      setBlitzSaveNotice(`Loaded ${selectedBoard.title}.`);
      return;
    }

    const nextPreview = buildBlitzBoardShell(baseBoardId, frontMode, boardSpot);
    const routeOverlays = buildBlitzTemplateOverlays({
      callId: nextCallId,
      defensePlayers: nextPreview.defensePlayers,
      offensePlayers: nextPreview.offensePlayers,
      runStrength: nextPreview.runStrength,
      passStrength: nextPreview.passStrength,
      losY: nextPreview.losY,
      wingY: nextPreview.wingY,
      frontMode,
    });
    const boardLabel = BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === baseBoardId)?.label ?? "Formation";
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === boardSpot)?.label ?? "MOF";
    setSelectedBlitzBoardId("working");
    setBlitzTitle(`${getBlitzCallLabel(nextCallId)} ${frontMode} ${spotLabel} vs ${boardLabel}`);
    setBlitzRouteOverlays(routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Generated ${getBlitzCallLabel(nextCallId)} ${frontMode} ${spotLabel} vs ${boardLabel}. Save it if you want to keep edits.`);
  };

  const loadBlitzFrontMode = (nextFrontMode: FrontMode) => {
    loadBlitzStructuredSelection({ frontMode: nextFrontMode });
  };

  const handleBlitzFieldClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin) return;

    if (blitzEditorTool === "tag") {
      const cleanLabel = blitzTagLabel.trim();
      if (!cleanLabel) return;
      setBlitzFieldTags((prev) => [
        ...prev,
        {
          id: `blitz-tag-${Date.now()}-${prev.length}`,
          label: cleanLabel,
          x,
          y,
          tone: blitzTagTone,
        },
      ]);
      setBlitzSaveNotice("Placed tag on the board.");
      return;
    }

    setBlitzDraftPoints((prev) => [...prev, { x, y }]);
    setBlitzSaveNotice(null);
  };

  const commitBlitzLine = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return;
    const cleanLabel = blitzLineLabel.trim();
    setBlitzRouteOverlays((prev) => [
      ...prev,
      {
        id: `blitz-line-${Date.now()}-${prev.length}`,
        label: cleanLabel,
        color: getRunFitArrowStroke(blitzLineColor),
        path: points,
        labelX: cleanLabel ? points[points.length - 1]?.x ?? 50 : undefined,
        labelY: cleanLabel ? (points[points.length - 1]?.y ?? 50) - 3 : undefined,
        endCap: blitzLineEnd,
      },
    ]);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice("Line added to the board.");
  };

  const finishBlitzLine = () => {
    commitBlitzLine(blitzDraftPoints);
  };

  const handleBlitzFieldDoubleClick = (x: number, y: number) => {
    if (!currentUser?.isAdmin || blitzEditorTool !== "arrow") return;
    commitBlitzLine([...blitzDraftPoints, { x, y }]);
  };

  const addBlitzPathway = () => {
    if (!currentUser?.isAdmin) return;
    const defender = blitzPreview.defensePlayers.find((player) => player.id === selectedBlitzPathwayDefenderId);
    if (!defender) {
      setBlitzSaveNotice("Choose a defender that exists on this board.");
      return;
    }

    const overlay = buildBlitzPathwayOverlay({
      defender,
      offensePlayers: blitzPreview.offensePlayers,
      pathwayId: selectedBlitzPathwayId,
      runStrength: blitzPreview.runStrength,
      passStrength: blitzPreview.passStrength,
      losY: blitzPreview.losY,
      wingY: blitzPreview.wingY,
      frontMode: selectedBlitzFrontMode,
    });
    setBlitzRouteOverlays((prev) => prev
      .filter((existing) => getBlitzPathwayMetaFromOverlay(existing)?.defenderId !== defender.id)
      .concat(overlay));
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Added ${getBlitzPathwayLabel(selectedBlitzPathwayId)} for ${defender.id}.`);
  };

  const applyBlitzCallTemplate = () => {
    if (!currentUser?.isAdmin) return;
    const overlays = buildBlitzTemplateOverlays({
      callId: selectedBlitzCallId,
      defensePlayers: blitzPreview.defensePlayers,
      offensePlayers: blitzPreview.offensePlayers,
      runStrength: blitzPreview.runStrength,
      passStrength: blitzPreview.passStrength,
      losY: blitzPreview.losY,
      wingY: blitzPreview.wingY,
      frontMode: selectedBlitzFrontMode,
    });
    const templateDefenderIds = new Set(overlays.map((overlay) => overlay.pathway?.defenderId).filter(Boolean));

    setBlitzRouteOverlays((prev) => [
      ...prev.filter((existing) => {
        const meta = getBlitzPathwayMetaFromOverlay(existing);
        return !meta || !templateDefenderIds.has(meta.defenderId);
      }),
      ...overlays,
    ]);
    setBlitzDraftPoints([]);
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === selectedBlitzBoardSpot)?.label ?? "MOF";
    setBlitzTitle(`${getBlitzCallLabel(selectedBlitzCallId)} ${selectedBlitzFrontMode} ${spotLabel} vs ${BLITZ_BASE_BOARD_OPTIONS.find((option) => option.value === selectedBlitzBaseBoardId)?.label ?? "Formation"}`);
    setBlitzSaveNotice(`Applied ${getBlitzCallLabel(selectedBlitzCallId)} template.`);
  };

  const buildSavedBlitzBoard = (callId: BlitzCallId, boardOption: typeof BLITZ_BASE_BOARD_OPTIONS[number], index: number): BlitzSavedBoard => {
    const callLabel = getBlitzCallLabel(callId);
    const spotLabel = BLITZ_BOARD_SPOT_OPTIONS.find((option) => option.value === selectedBlitzBoardSpot)?.label ?? "MOF";
    const preview = buildBlitzBoardShell(boardOption.value, selectedBlitzFrontMode, selectedBlitzBoardSpot);
    const routeOverlays = buildBlitzTemplateOverlays({
      callId,
      defensePlayers: preview.defensePlayers,
      offensePlayers: preview.offensePlayers,
      runStrength: preview.runStrength,
      passStrength: preview.passStrength,
      losY: preview.losY,
      wingY: preview.wingY,
      frontMode: selectedBlitzFrontMode,
    });

    return {
      id: `blitz-${callId}-${selectedBlitzFrontMode}-${selectedBlitzBoardSpot}-${boardOption.value}-${Date.now()}-${index}`,
      title: `${callLabel} ${selectedBlitzFrontMode} ${spotLabel} vs ${boardOption.label}`,
      baseBoardId: boardOption.value,
      frontMode: selectedBlitzFrontMode,
      callId,
      boardSpot: selectedBlitzBoardSpot,
      routeOverlays,
      fieldTags: preview.fieldTags,
    };
  };

  const applyBlitzCallTemplateToAllBoards = () => {
    if (!currentUser?.isAdmin) return;
    const callLabel = getBlitzCallLabel(selectedBlitzCallId);
    const stampedBoards = BLITZ_BASE_BOARD_OPTIONS.map((boardOption, index) => (
      buildSavedBlitzBoard(selectedBlitzCallId, boardOption, index)
    ));

    const firstBoard = stampedBoards[0];
    setBlitzSavedBoards((prev) => [
      ...prev.filter((board) => !(
        board.callId === selectedBlitzCallId
        && board.frontMode === selectedBlitzFrontMode
        && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
      )),
      ...stampedBoards,
    ]);
    setSelectedBlitzBoardId(firstBoard.id);
    setSelectedBlitzBaseBoardId(firstBoard.baseBoardId);
    setSelectedBlitzBoardSpot(firstBoard.boardSpot ?? "mof");
    setBlitzTitle(firstBoard.title);
    setBlitzRouteOverlays(firstBoard.routeOverlays);
    setBlitzFieldTags(firstBoard.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Applied ${callLabel} to all ${selectedBlitzFrontMode} base boards.`);
  };

  const applyEveryBlitzTemplateToAllBoards = () => {
    if (!currentUser?.isAdmin) return;
    const stampedBoards = BLITZ_CALL_OPTIONS.flatMap((callOption, callIndex) => (
      BLITZ_BASE_BOARD_OPTIONS.map((boardOption, boardIndex) => (
        buildSavedBlitzBoard(callOption.value, boardOption, callIndex * BLITZ_BASE_BOARD_OPTIONS.length + boardIndex)
      ))
    ));

    const activeBoard = stampedBoards.find((board) => (
      board.callId === selectedBlitzCallId
      && board.baseBoardId === selectedBlitzBaseBoardId
      && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
    )) ?? stampedBoards[0];
    setBlitzSavedBoards((prev) => [
      ...prev.filter((board) => !(
        board.frontMode === selectedBlitzFrontMode
        && (board.boardSpot ?? "mof") === selectedBlitzBoardSpot
      )),
      ...stampedBoards,
    ]);
    setSelectedBlitzBoardId(activeBoard.id);
    setSelectedBlitzBaseBoardId(activeBoard.baseBoardId);
    setSelectedBlitzBoardSpot(activeBoard.boardSpot ?? "mof");
    setBlitzTitle(activeBoard.title);
    setBlitzRouteOverlays(activeBoard.routeOverlays);
    setBlitzFieldTags(activeBoard.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(`Applied all loaded blitzes to all ${selectedBlitzFrontMode} base boards.`);
  };

  const saveBlitzBoard = () => {
    const cleanTitle = blitzTitle.trim() || "Untitled Blitz";
    if (selectedBlitzBoardId !== "working") {
      setBlitzSavedBoards((prev) => prev.map((board) => (
        board.id === selectedBlitzBoardId
          ? { ...board, title: cleanTitle, baseBoardId: selectedBlitzBaseBoardId, frontMode: selectedBlitzFrontMode, callId: selectedBlitzCallId, boardSpot: selectedBlitzBoardSpot, routeOverlays: blitzRouteOverlays, fieldTags: blitzFieldTags }
          : board
      )));
      setBlitzSaveNotice(`Updated ${cleanTitle}.`);
      return;
    }

    const nextBoard: BlitzSavedBoard = {
      id: `blitz-${Date.now()}`,
      title: cleanTitle,
      baseBoardId: selectedBlitzBaseBoardId,
      frontMode: selectedBlitzFrontMode,
      callId: selectedBlitzCallId,
      boardSpot: selectedBlitzBoardSpot,
      routeOverlays: blitzRouteOverlays,
      fieldTags: blitzFieldTags,
    };
    setBlitzSavedBoards((prev) => [...prev, nextBoard]);
    setSelectedBlitzBoardId(nextBoard.id);
    setBlitzSaveNotice(`Saved ${cleanTitle}.`);
  };

  const deleteBlitzBoard = () => {
    if (selectedBlitzBoardId === "working") return;
    const deletedBoard = blitzSavedBoards.find((board) => board.id === selectedBlitzBoardId);
    setBlitzSavedBoards((prev) => prev.filter((board) => board.id !== selectedBlitzBoardId));
    const nextPreview = buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot);
    setSelectedBlitzBoardId("working");
    setBlitzTitle(nextPreview.title);
    setBlitzRouteOverlays(nextPreview.routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice(deletedBoard ? `Deleted ${deletedBoard.title}.` : "Deleted saved board.");
  };

  const resetBlitzSample = () => {
    const nextPreview = buildBlitzBoardShell(selectedBlitzBaseBoardId, selectedBlitzFrontMode, selectedBlitzBoardSpot);
    setSelectedBlitzBoardId("working");
    setBlitzTitle(nextPreview.title);
    setBlitzRouteOverlays(nextPreview.routeOverlays);
    setBlitzFieldTags(nextPreview.fieldTags);
    setBlitzDraftPoints([]);
    setBlitzSaveNotice("Reset to the selected blitz board.");
  };

  const getSpeedBonus = (activeMode: "quiz" | "offense_build" | "alignment" | "film" | "concept", elapsedMs: number) => {
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
    activeMode: "quiz" | "offense_build" | "alignment" | "film" | "concept",
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
      console.error("Failed to save mode score", {
        mode: activeMode,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
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
    activeMode: "quiz" | "offense_build" | "alignment" | "film" | "concept",
    accuracy: number,
    isCorrect: boolean,
    customAttemptKey?: string,
  ) => {
    if (!currentUser) return;
    const attemptKey = customAttemptKey ?? `${activeMode}::${formationKey}`;
    if (revealedAttemptKeys.has(attemptKey)) {
      setScoredAttemptKey(attemptKey);
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
    activeMode: "quiz" | "offense_build" | "alignment" | "film" | "concept",
    customAttemptKey?: string,
  ) => {
    const attemptKey = customAttemptKey ?? `${activeMode}::${formationKey}`;
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
      scoreAttempt("quiz", quizScore / 3, quizScore === 3);
    }
  }, [showQuizFeedback, quizScore, formationKey]);

  useEffect(() => {
    if (mode === "film" && filmViewMode === "quiz" && showFilmQuizFeedback && selectedFilmClip) {
      scoreAttempt("film", filmQuizScore / Math.max(1, filmQuizQuestionCount), filmQuizIsPerfect, `film::${selectedFilmClip.id}`);
    }
  }, [mode, filmViewMode, showFilmQuizFeedback, filmQuizScore, filmQuizQuestionCount, filmQuizIsPerfect, selectedFilmClip?.id]);

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
      `concept::${passConceptQuizMode}::${passConceptDefinition.boardKind}::${attemptIdentity}`,
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
  ]);

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
    if (mode === "alignment" && alignmentViewMode === "quiz" && showAlignmentCheck) {
      const total = Object.keys(alignmentAnswerKey).length || 1;
      const wrong = alignmentCheck.incorrectIds.length;
      const placedCount = alignmentPlayers.length;
      const missing = Math.max(0, total - placedCount);
      const accuracy = Math.max(0, (total - wrong - missing) / total);
      scoreAttempt("alignment", accuracy, alignmentCheck.isCorrect, `alignment::${formationKey}::${frontMode}`);
    }
  }, [mode, alignmentViewMode, showAlignmentCheck, alignmentCheck.isCorrect, alignmentCheck.incorrectIds.length, formationKey, frontMode, alignmentPlayers.length]);

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-transparent">
        <div className="rounded-2xl border border-[#d8ddcf] bg-white/88 px-6 py-4 text-sm text-slate-600 shadow-[0_18px_50px_rgba(43,81,61,0.08)] backdrop-blur-sm">
          Loading...
        </div>
      </div>
    );
  }

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
                  ) : mode === "film" || mode === "concept" || mode === "run_fit" || mode === "blitz" ? (
                    <div className="rounded-md border bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                      {mode === "film" ? "Film Library" : mode === "concept" ? "Concept Board" : mode === "run_fit" ? "Fit Board" : "Blitz Board"}
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
                {mode === "offense_build" || mode === "film" || mode === "concept" || mode === "leaderboard" || mode === "run_fit" || mode === "blitz" ? null : (
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
                Quiz {currentUser.stats.quiz.points} • Offense {currentUser.stats.offense_build.points} • Concept {currentUser.stats.concept.points} • Align {currentUser.stats.alignment.points} • Film {currentUser.stats.film.points}
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
                </div>
                <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_72px_90px] items-center border-b border-[#b7b09a] bg-[#ddd4bc] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#5a5646]">
                  <div className="px-2">User</div>
                  <div className="px-2">Email</div>
                  <div className="px-2 text-center">Points</div>
                  <div className="px-2 text-center">Time</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {accountDirectoryEntries.length ? (
                    accountDirectoryEntries.map((entry, idx) => (
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
              <div className="space-y-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <div className="min-w-[140px]">
                    <Select
                      value={formationTrainerViewMode}
                      onValueChange={(value: FormationTrainerViewMode) => {
                        setFormationTrainerViewMode(value);
                        setShowQuizFeedback(false);
                        setShowQuizAnswers(false);
                        setQuizReadyForNext(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formationTrainerViewMode === "study" ? (
              <>
              <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <div className="space-y-4">
                  <TrainingField
                    offensePlayers={displayFormation.players}
                    overlayLabel={`${displayFormation.playbook} • ${displayFormation.family} • ${displayFormation.personnel}P • Run ${FIELD_LABELS[displayFormation.runStrength]} • Pass ${FIELD_LABELS[displayFormation.passStrength]}`}
                  />
                  <div className="grid gap-3 md:grid-cols-5">
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
                        <div className="text-xs uppercase tracking-wide text-slate-500">Personnel</div>
                        <div className="mt-1 text-lg font-semibold">{displayFormation.personnel}P</div>
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
                </div>
                <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                  <Button className="rounded-xl" onClick={nextCall}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Randomize
                  </Button>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</div>
                    <Select
                      value={`${current.playbook}::${current.name}::${current.personnel}::${index % Math.max(pool.length, 1)}`}
                      onValueChange={(value) => {
                        const selected = formationSelectGroups
                          .flatMap((group) => group.options)
                          .find((option) => option.value === value);
                        if (selected) setIndex(selected.index);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        {formationSelectGroups.map((group) => (
                          <React.Fragment key={group.personnel}>
                            <SelectGroup>
                              <SelectLabel>{group.personnel}P</SelectLabel>
                              {group.options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                            {group.personnel !== formationSelectGroups[formationSelectGroups.length - 1]?.personnel ? (
                              <SelectDivider />
                            ) : null}
                          </React.Fragment>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>Study the formation menu and recognition information for this look.</div>
                </div>
              </div>
              </>
                ) : (
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
                  <Button variant="outline" className="h-12 w-full rounded-xl text-base" onClick={nextCall}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Randomize
                  </Button>
                  <Button className="h-12 w-full rounded-xl text-base" onClick={submitQuiz}>
                    Check Answers
                  </Button>
                      <Button variant="outline" className="h-12 w-full rounded-xl text-base" onClick={() => { markAttemptRevealed("quiz"); setShowQuizAnswers(true); setShowQuizFeedback(false); setQuizReadyForNext(false); }}>
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
                          {lastScoreSummary.quiz ? (
                            <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                              <span className="font-semibold">Points earned:</span> {lastScoreSummary.quiz.awarded}
                              <div>
                                <span className="font-semibold">Quiz total:</span> {lastScoreSummary.quiz.total}
                              </div>
                              {lastScoreSummary.quiz.blockedByReveal ? (
                                <div className="mt-2 font-semibold text-amber-800">No points awarded because answers were revealed first.</div>
                              ) : null}
                            </div>
                          ) : null}
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
                )}
              </div>
            ) : mode === "run_fit" ? (
              currentUser?.isAdmin ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="mb-3">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Run Fit</div>
                      <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{runFitTitle}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Build run-fit answer boards from the same formation shells we use in Blitz Mode.
                      </div>
                    </div>
                    <TrainingField
                      offensePlayers={runFitPreview.offensePlayers}
                      defensePlayers={runFitPreview.defensePlayers}
                      routeOverlays={runFitDisplayOverlays}
                      routeOverlaysOnTop
                      fieldTags={runFitFieldTags}
                      compactAnnotations
                      enhancedLandmarks
                      onFieldClick={showRunFitAdminTools ? handleRunFitFieldClick : undefined}
                      onFieldDoubleClick={showRunFitAdminTools ? handleRunFitFieldDoubleClick : undefined}
                    />
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</div>
                    <Select value={selectedRunFitBaseBoardId} onValueChange={(value: BlitzBaseBoardId) => loadRunFitBaseBoard(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        {(["2x2", "3x1"] as const).map((structure) => (
                          <SelectGroup key={structure}>
                            <SelectLabel>{structure}</SelectLabel>
                            {BLITZ_BASE_BOARD_OPTIONS
                              .filter((option) => BLITZ_BOARD_STRUCTURE[option.value] === structure)
                              .sort((a, b) => a.label.localeCompare(b.label))
                              .map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Boards</div>
                    <Select value={selectedRunFitBoardId} onValueChange={loadRunFitBoard}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        <SelectItem value="working">Working Board</SelectItem>
                        {runFitSavedBoards.map((board) => (
                          <SelectItem key={board.id} value={board.id}>
                            {board.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant={showRunFitAdminTools ? "default" : "outline"}
                    className="w-full rounded-xl"
                    onClick={() => setShowRunFitAdminTools((prev) => !prev)}
                  >
                    {showRunFitAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
                  </Button>
                  {showRunFitAdminTools ? (
                    <>
                      <div className="rounded-xl border bg-slate-50 p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Title</div>
                        <Input value={runFitTitle} onChange={(e) => setRunFitTitle(e.target.value)} />
                      </div>
                      <div className="rounded-xl border bg-slate-50 p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tool</div>
                        <Select value={runFitEditorTool} onValueChange={(value: RunFitEditorTool) => setRunFitEditorTool(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="arrow">Line</SelectItem>
                            <SelectItem value="tag">Tag</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="mt-2 text-xs text-slate-500">
                          {runFitEditorTool === "arrow"
                            ? "Click once to start, click for each new angle, and double-click the endpoint to finish."
                            : "Click anywhere on the field to drop the current fit pill."}
                        </div>
                      </div>
                      <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">Premade Run Fit Pathway</div>
                          <div className="text-xs leading-5 text-emerald-950/80">
                            Stamp common fits for DL/LBs: gap fits plus Box and Spill at the EMOLOS.
                          </div>
                        </div>
                        <Button variant="outline" className="w-full rounded-xl border-emerald-700 text-emerald-900" onClick={applyRunFitPowerWeakTemplate}>
                          Apply 11p Power Weak Template
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defender</div>
                            <Select value={selectedRunFitPathwayDefenderId} onValueChange={setSelectedRunFitPathwayDefenderId}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                {runFitPreview.defensePlayers.map((defender) => (
                                  <SelectItem key={defender.id} value={defender.id}>
                                    {defender.id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pathway</div>
                            <Select value={selectedRunFitPathwayId} onValueChange={(value: RunFitPathwayId) => setSelectedRunFitPathwayId(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                {RUN_FIT_PATHWAY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button className="w-full rounded-xl bg-emerald-700 text-white hover:bg-emerald-800" onClick={addRunFitPathway}>
                          Add Run Fit Pathway
                        </Button>
                      </div>
                      <div className="space-y-3 rounded-xl border border-red-200 bg-red-50/70 p-3">
                        <div>
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-800">Saved Custom Pathways</div>
                          <div className="text-xs leading-5 text-red-950/80">
                            Draw a pathway once, save it for a position, then stamp that exact shape onto future boards.
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pathway Name</div>
                          <Input value={runFitSavedPathwayName} onChange={(e) => setRunFitSavedPathwayName(e.target.value)} />
                        </div>
                        <Button variant="outline" className="w-full rounded-xl border-red-700 text-red-900" onClick={saveRunFitDraftAsPathway} disabled={runFitDraftPoints.length < 2}>
                          Save Current Draft as Pathway
                        </Button>
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Pathway</div>
                          <Select
                            value={selectedRunFitSavedPathwayId || "none"}
                            onValueChange={(value) => setSelectedRunFitSavedPathwayId(value === "none" ? "" : value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              <SelectItem value="none">Choose saved pathway</SelectItem>
                              {runFitSavedPathways.map((pathway) => (
                                <SelectItem key={pathway.id} value={pathway.id}>
                                  {pathway.positionId}: {pathway.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Apply To Position</div>
                          <Select value={selectedRunFitPathwayDefenderId} onValueChange={setSelectedRunFitPathwayDefenderId}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {runFitPreview.defensePlayers.map((defender) => (
                                <SelectItem key={`saved-pathway-${defender.id}`} value={defender.id}>
                                  {defender.id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="mt-1 text-xs text-red-950/70">
                            Stamp the saved pathway onto this selected defender.
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button className="rounded-xl bg-red-700 text-white hover:bg-red-800" onClick={stampSavedRunFitPathway} disabled={!selectedRunFitSavedPathwayId}>
                            Stamp Saved
                          </Button>
                          <Button variant="outline" className="rounded-xl" onClick={deleteSavedRunFitPathway} disabled={!selectedRunFitSavedPathwayId}>
                            Delete Saved
                          </Button>
                        </div>
                      </div>
                      {runFitEditorTool === "arrow" ? (
                        <div className="rounded-xl border bg-slate-50 p-3 space-y-3">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Line Label</div>
                            <Input value={runFitArrowLabel} onChange={(e) => setRunFitArrowLabel(e.target.value)} />
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Line Color</div>
                            <Select value={runFitArrowColor} onValueChange={(value: RunFitArrowColor) => setRunFitArrowColor(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="cyan">Cyan</SelectItem>
                                <SelectItem value="sky">Sky</SelectItem>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="white">White</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Line End</div>
                            <Select value={runFitLineEnd} onValueChange={(value: RunFitLineEnd) => setRunFitLineEnd(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="square">Square</SelectItem>
                                <SelectItem value="circle">Circle</SelectItem>
                                <SelectItem value="arrow">Arrow</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button className="rounded-xl" onClick={finishRunFitArrow} disabled={runFitDraftPoints.length < 2}>
                              Finish Line
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={() => setRunFitDraftPoints([])}>
                              Cancel Draft
                            </Button>
                          </div>
                          <div className="text-xs text-slate-500">Draft points: {runFitDraftPoints.length}</div>
                        </div>
                      ) : (
                        <div className="rounded-xl border bg-slate-50 p-3 space-y-3">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tag Label</div>
                            <Input value={runFitTagLabel} onChange={(e) => setRunFitTagLabel(e.target.value)} />
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tag Tone</div>
                            <Select value={runFitTagTone} onValueChange={(value: FieldTag["tone"]) => setRunFitTagTone(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="cyan">Cyan</SelectItem>
                                <SelectItem value="sky">Sky</SelectItem>
                                <SelectItem value="default">Default</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="rounded-xl" onClick={saveRunFitBoard}>
                          Save Board
                        </Button>
                        <Button variant="outline" className="rounded-xl" onClick={resetRunFitSample}>
                          Reset Sample
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setRunFitRouteOverlays((prev) => prev.slice(0, -1))}
                          disabled={!runFitRouteOverlays.length}
                        >
                          Undo Line
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setRunFitFieldTags((prev) => prev.slice(0, -1))}
                          disabled={!runFitFieldTags.length}
                        >
                          Undo Tag
                        </Button>
                      </div>
                    </>
                  ) : null}
                  {runFitSaveNotice ? (
                    <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                      {runFitSaveNotice}
                    </div>
                  ) : null}
                </div>
              </div>
              ) : (
                <div className="rounded-2xl border bg-white p-6 text-center text-slate-700">
                  <div className="text-lg font-semibold">Admin Access Required</div>
                  <div className="mt-2 text-sm text-slate-500">
                    Run Fit Mode is still being built and is hidden from players for now.
                  </div>
                </div>
              )
            ) : mode === "blitz" ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-4">
                  <div className="rounded-2xl border bg-white p-4">
                    <div className="mb-3">
                      <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Blitz Mode</div>
                      <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{blitzTitle}</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Pick a formation, defensive shell, and blitz call, then stamp premade pathways to build the answer key.
                      </div>
                    </div>
                    <TrainingField
                      offensePlayers={blitzPreview.offensePlayers}
                      defensePlayers={blitzPreview.defensePlayers}
                      routeOverlays={blitzDisplayOverlays}
                      routeOverlaysOnTop
                      fieldTags={blitzFieldTags}
                      enhancedLandmarks
                      wideFieldMarks
                      fieldHashXs={blitzPreview.hashXs}
                      losReferenceY={blitzPreview.losY}
                    />
                  </div>
                </div>
                <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defense</div>
                    <Select value={selectedBlitzFrontMode} onValueChange={(value: FrontMode) => loadBlitzFrontMode(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4-4">4-4</SelectItem>
                        <SelectItem value="4-3">4-3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Spot</div>
                    <Select value={selectedBlitzBoardSpot} onValueChange={(value: BlitzBoardSpot) => loadBlitzStructuredSelection({ boardSpot: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BLITZ_BOARD_SPOT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-xl border bg-slate-50 p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Saved Blitz Boards</div>
                    <div className="grid gap-2">
                      <Select value={selectedBlitzCallFamilyId} onValueChange={(value: BlitzCallFamilyId) => loadBlitzStructuredSelection({ familyId: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          {BLITZ_CALL_FAMILY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedBlitzCallType} onValueChange={(value: BlitzCallType) => loadBlitzStructuredSelection({ callType: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(Object.entries(BLITZ_CALL_MATRIX[selectedBlitzCallFamilyId]) as [BlitzCallType, BlitzCallId][]).map(([callType, callId]) => (
                            <SelectItem key={callType} value={callType}>
                              {getBlitzCallLabel(callId)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedBlitzBaseBoardId} onValueChange={(value: BlitzBaseBoardId) => loadBlitzStructuredSelection({ baseBoardId: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          {(["2x2", "3x1"] as const).map((structure) => (
                            <SelectGroup key={structure}>
                              <SelectLabel>{structure}</SelectLabel>
                              {BLITZ_BASE_BOARD_OPTIONS
                                .filter((option) => BLITZ_BOARD_STRUCTURE[option.value] === structure)
                                .sort((a, b) => a.label.localeCompare(b.label))
                                .map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="rounded-lg border bg-white p-2 text-xs leading-5 text-slate-600">
                        {selectedStructuredBlitzBoard ? `Loaded: ${selectedStructuredBlitzBoard.title}` : "No saved board yet for this family / type / formation."}
                      </div>
                    </div>
                  </div>
                  {currentUser?.isAdmin ? (
                    <>
                      <Button
                        variant={showBlitzAdminTools ? "default" : "outline"}
                        className="w-full rounded-xl"
                        onClick={() => setShowBlitzAdminTools((prev) => !prev)}
                      >
                        {showBlitzAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
                      </Button>
                      {showBlitzAdminTools ? (
                        <>
                          <div className="rounded-xl border bg-slate-50 p-3">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Title</div>
                            <Input value={blitzTitle} onChange={(e) => setBlitzTitle(e.target.value)} />
                          </div>
                          <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                            <div>
                              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">Blitz Call Template</div>
                              <div className="text-xs leading-5 text-amber-950/80">
                                Apply the full call, then tweak individual defenders below if needed.
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Select value={selectedBlitzCallFamilyId} onValueChange={(value: BlitzCallFamilyId) => loadBlitzStructuredSelection({ familyId: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  {BLITZ_CALL_FAMILY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Select value={selectedBlitzCallType} onValueChange={(value: BlitzCallType) => loadBlitzStructuredSelection({ callType: value })}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {(Object.entries(BLITZ_CALL_MATRIX[selectedBlitzCallFamilyId]) as [BlitzCallType, BlitzCallId][]).map(([callType, callId]) => (
                                    <SelectItem key={callType} value={callType}>
                                      {getBlitzCallLabel(callId)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="rounded-lg border border-amber-200 bg-white/70 p-2 text-xs leading-5 text-amber-950">
                              <div className="font-semibold">{selectedBlitzCallOption.family} • {BLITZ_CALL_TYPE_LABELS[selectedBlitzCallType]}</div>
                              <div>{selectedBlitzCallOption.detail}</div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Button className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400" onClick={applyBlitzCallTemplate}>
                                Apply Current
                              </Button>
                              <Button variant="outline" className="rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-amber-100" onClick={applyBlitzCallTemplateToAllBoards}>
                                Apply Call
                              </Button>
                              <Button variant="outline" className="rounded-xl border-amber-300 bg-white/70 text-amber-950 hover:bg-amber-100" onClick={applyEveryBlitzTemplateToAllBoards}>
                                Apply All
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-3 rounded-xl border border-red-100 bg-red-50/60 p-3">
                            <div>
                              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">Premade Pathway</div>
                              <div className="text-xs leading-5 text-red-900/80">
                                Stamp a structured assignment onto the board. These are the first gradeable pathway building blocks.
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defender</div>
                                <Select value={selectedBlitzPathwayDefenderId} onValueChange={setSelectedBlitzPathwayDefenderId}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80 overflow-y-auto">
                                    {blitzPreview.defensePlayers.map((defender) => (
                                      <SelectItem key={defender.id} value={defender.id}>
                                        {defender.id}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Pathway</div>
                                <Select value={selectedBlitzPathwayId} onValueChange={(value: BlitzPathwayId) => setSelectedBlitzPathwayId(value)}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80 overflow-y-auto">
                                    {BLITZ_PATHWAY_OPTIONS.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button className="w-full rounded-xl bg-red-600 text-white hover:bg-red-700" onClick={addBlitzPathway}>
                              Add Pathway
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button className="rounded-xl" onClick={saveBlitzBoard}>
                              Save Board
                            </Button>
                            <Button variant="outline" className="rounded-xl" onClick={resetBlitzSample}>
                              Reset Board
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => setBlitzRouteOverlays((prev) => prev.slice(0, -1))}
                              disabled={!blitzRouteOverlays.length}
                            >
                              Undo Line
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                              onClick={deleteBlitzBoard}
                              disabled={selectedBlitzBoardId === "working"}
                            >
                              Delete Board
                            </Button>
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : (
                    <div className="rounded-xl border bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      Blitz Mode will let players study each defender&apos;s assignment once the answer keys are built.
                    </div>
                  )}
                  {blitzSaveNotice ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                      {blitzSaveNotice}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : mode === "concept" ? (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-end gap-2">
                  <div className="min-w-[140px]">
                    <Select
                      value={passConceptViewMode}
                      onValueChange={(value: PassConceptViewMode) => {
                        setPassConceptViewMode(value);
                        setShowPassConceptFeedback(false);
                        setShowPassConceptAnswers(false);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-80 overflow-y-auto">
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {passConceptViewMode === "quiz" ? (
                    <div className="min-w-[190px]">
                      <Select value={passConceptQuizMode} onValueChange={(value: PassConceptQuizMode) => setPassConceptQuizMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="build">Build the Concept</SelectItem>
                          <SelectItem value="identify">Name the Concept</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-4">
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="mb-3">
                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Pass Concept</div>
                        <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                          {passConceptViewMode === "study" ? passConceptDefinition.title : "Quiz Rep"}
                        </div>
                        {passConceptViewMode === "quiz" ? (
                          <div className="mt-1 text-sm text-slate-600">
                            {passConceptQuizMode === "build"
                              ? <>Choose the correct route for each active eligible based on the concept name.</>
                              : <>Study the routes on the field, then choose the correct concept name.</>}
                          </div>
                        ) : null}
                      </div>
                      <TrainingField
                        offensePlayers={passConceptPreview.formationPlayers}
                        routeOverlays={passConceptViewMode === "study" ? passConceptPreview.routesPreview : passConceptQuizRoutePreview}
                        yardReferenceLines={passConceptPreview.yardLines}
                        yardReferenceScale={3}
                        subtleHashMarks
                        losReferenceY={passConceptPreview.losY}
                        flipOffense
                      />
                    </div>
                  </div>
                  <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Concept Family</div>
                      <Select value={passConceptFamilyFilter} onValueChange={(value: PassConceptFamilyFilter) => setPassConceptFamilyFilter(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="2x2">2x2</SelectItem>
                          <SelectItem value="3x1">3x1</SelectItem>
                          <SelectItem value="all">All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {passConceptViewMode === "study" ? (
                      effectivePassConceptBoardKind === "2x2" ? (
                        <>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">X Concept</div>
                            <Select value={selectedFrontsideConceptId} onValueChange={setSelectedFrontsideConceptId}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                {TWO_BY_TWO_CONCEPTS.map((concept) => (
                                  <SelectItem key={`front-${concept.id}`} value={concept.id}>
                                    X {concept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Z Concept</div>
                            <Select value={selectedBacksideConceptId} onValueChange={setSelectedBacksideConceptId}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                {TWO_BY_TWO_CONCEPTS.map((concept) => (
                                  <SelectItem key={`back-${concept.id}`} value={concept.id}>
                                    Z {concept.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : (
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Trips Concept</div>
                          <Select value={selectedThreeByOneConceptId} onValueChange={setSelectedThreeByOneConceptId}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {THREE_BY_ONE_CONCEPTS.map((concept) => (
                                <SelectItem key={`trips-${concept.id}`} value={concept.id}>
                                  {concept.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )
                    ) : null}
                    {passConceptViewMode === "study" ? (
                      <>
                        {passConceptDefinition.cards.map((card) => (
                          <div key={`${card.label}-${card.name}`} className="rounded-xl border bg-slate-50 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
                            <div className="mt-1 text-lg font-semibold text-slate-900">{card.name}</div>
                            {card.assignments.length ? (
                              <div className="mt-2 space-y-1 text-sm text-slate-700">
                                {card.assignments.map((assignment) => (
                                  <div key={`${card.name}-${assignment.player}`}>
                                    <span className="font-semibold">{assignment.player} {assignment.roleLabel}:</span> {assignment.route}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-2 text-sm text-slate-700">No tagged route on this side for the base board.</div>
                            )}
                            {card.detail ? (
                              <div className="mt-2 text-xs text-slate-500">{card.detail}</div>
                            ) : null}
                          </div>
                        ))}
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                          This is the base concept-board model we can now build future pass concepts off of.
                        </div>
                        <Button variant="outline" className="rounded-xl" onClick={nextCall}>
                          <Shuffle className="mr-2 h-4 w-4" />
                          Random Concept
                        </Button>
                      </>
                    ) : (
                      <>
                        {passConceptQuizMode === "build" ? (
                          passConceptDefinition.cards.map((card) => (
                            <div key={`quiz-${card.label}-${card.name}`} className="rounded-xl border bg-slate-50 p-3">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
                              <div className="mt-1 text-lg font-semibold text-slate-900">{card.name}</div>
                              <div className="mt-2 text-sm text-slate-700">
                                {card.assignments.length
                                  ? `Assign the correct route to ${card.assignments.map((assignment) => assignment.player).join(", ")}.`
                                  : "No quiz answer needed on this side for this board."}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-xl border bg-slate-50 p-3">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Identify the Concept</div>
                            <div className="mt-2 text-sm text-slate-700">
                              Use the field routes to identify the concept name. Only the answer dropdown is shown in this mode.
                            </div>
                          </div>
                        )}
                        {passConceptQuizMode === "build" ? (
                          passConceptDefinition.activePlayers.map((playerId) => (
                            <div key={playerId}>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{playerId} Route</div>
                              <Select
                                value={passConceptAnswers[playerId]}
                                onValueChange={(value) => setPassConceptAnswers((prev) => ({ ...prev, [playerId]: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose route" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  {[...PASS_CONCEPT_ROUTE_OPTIONS].sort((a, b) => a.localeCompare(b)).map((route) => (
                                    <SelectItem key={`${playerId}-${route}`} value={route}>
                                      {route}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))
                        ) : (
                          passConceptDefinition.boardKind === "2x2" ? (
                            <>
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Frontside Concept</div>
                                <Select value={passConceptFrontsideNameAnswer} onValueChange={setPassConceptFrontsideNameAnswer}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose frontside concept" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80 overflow-y-auto">
                                    {availablePassConceptNames.map((conceptName) => (
                                      <SelectItem key={`identify-front-${conceptName}`} value={conceptName}>
                                        {conceptName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Backside Concept</div>
                                <Select value={passConceptBacksideNameAnswer} onValueChange={setPassConceptBacksideNameAnswer}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Choose backside concept" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-80 overflow-y-auto">
                                    {availablePassConceptNames.map((conceptName) => (
                                      <SelectItem key={`identify-back-${conceptName}`} value={conceptName}>
                                        {conceptName}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </>
                          ) : (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Concept Name</div>
                              <Select value={passConceptNameAnswer} onValueChange={setPassConceptNameAnswer}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose concept" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  {availablePassConceptNames.map((conceptName) => (
                                    <SelectItem key={conceptName} value={conceptName}>
                                      {conceptName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )
                        )}
                        <div className="grid gap-2">
                          <Button variant="outline" className="rounded-xl w-full" onClick={nextCall}>
                            <Shuffle className="mr-2 h-4 w-4" />
                            Random Concept
                          </Button>
                          <Button className="rounded-xl w-full" onClick={() => setShowPassConceptFeedback(true)}>
                            Check Answers
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl w-full"
                            onClick={() => {
                              setShowPassConceptAnswers(true);
                              setShowPassConceptFeedback(true);
                            }}
                          >
                            Show Answers
                          </Button>
                        </div>
                        {showPassConceptAnswers ? (
                          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                            {passConceptQuizMode === "build" ? (
                              passConceptDefinition.activePlayers.map((playerId) => (
                                <div key={`answer-${playerId}`}>
                                  <span className="font-semibold">{playerId}:</span> {passConceptDefinition.routes[playerId]}
                                </div>
                              ))
                            ) : (
                              passConceptDefinition.boardKind === "2x2" ? (
                                <>
                                  <div><span className="font-semibold">Frontside:</span> {passConceptDefinition.frontsideConceptName}</div>
                                  <div><span className="font-semibold">Backside:</span> {passConceptDefinition.backsideConceptName}</div>
                                </>
                              ) : (
                                <div><span className="font-semibold">Concept:</span> {passConceptDefinition.conceptName}</div>
                              )
                            )}
                          </div>
                        ) : null}
                        {showPassConceptFeedback ? (
                          <>
                            {passConceptQuizMode === "build" ? (
                              <>
                                <div className="text-sm font-semibold text-slate-700">Score: {passConceptScore} / {passConceptDefinition.activePlayers.length}</div>
                                {lastScoreSummary.concept ? (
                                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                                    <span className="font-semibold">Points earned:</span> {lastScoreSummary.concept.awarded}
                                    <div>
                                      <span className="font-semibold">Pass Concept total:</span> {lastScoreSummary.concept.total}
                                    </div>
                                  </div>
                                ) : null}
                                <div className="space-y-2 text-sm">
                                  {passConceptDefinition.activePlayers.map((playerId) => (
                                    <div key={`result-${playerId}`} className="flex items-center justify-between rounded-lg border p-3">
                                      <span>{playerId} Route</span>
                                      {passConceptResult[playerId] ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm font-semibold text-slate-700">Score: {passConceptIdentifyScore} / {passConceptIdentifyQuestionCount}</div>
                                {lastScoreSummary.concept ? (
                                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                                    <span className="font-semibold">Points earned:</span> {lastScoreSummary.concept.awarded}
                                    <div>
                                      <span className="font-semibold">Pass Concept total:</span> {lastScoreSummary.concept.total}
                                    </div>
                                  </div>
                                ) : null}
                                <div className="space-y-2 text-sm">
                                  {passConceptDefinition.boardKind === "2x2" ? (
                                    <>
                                      <div className="flex items-center justify-between rounded-lg border p-3">
                                        <span>Frontside Concept</span>
                                        {passConceptFrontsideNameResult ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-600" />
                                        )}
                                      </div>
                                      <div className="flex items-center justify-between rounded-lg border p-3">
                                        <span>Backside Concept</span>
                                        {passConceptBacksideNameResult ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-600" />
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                      <span>Concept Name</span>
                                      {passConceptNameResult ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                      ) : (
                                        <XCircle className="h-4 w-4 text-red-600" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="rounded-xl border border-dashed p-3 text-sm text-slate-500">
                            {passConceptQuizMode === "build"
                              ? <>Choose a route for each active eligible, then press <span className="font-semibold">Check Answers</span>.</>
                              : <>Study the routes on the field, choose the concept name, then press <span className="font-semibold">Check Answers</span>.</>}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : mode === "film" ? (
              <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <div className="min-w-[160px]">
                      <Select value={filmSubmode} onValueChange={(value: FilmSubmode) => setFilmSubmode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="read_key">Read Key</SelectItem>
                          <SelectItem value="formation_key">Formation Key</SelectItem>
                          <SelectItem value="team_key">Team Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[140px]">
                      <Select value={filmViewMode} onValueChange={(value: FilmViewMode) => setFilmViewMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border bg-slate-950">
                    {filmViewMode === "quiz" ? (
                      selectedFilmClip ? (
                        filmQuizStarted && !filmQuizFinished ? (
                          <video
                            ref={filmQuizVideoRef}
                            key={`${selectedFilmClip.id}-${filmPlaybackNonce}-quiz`}
                            className="aspect-video w-full bg-black"
                            src={filmQuizPlaybackUrl}
                            autoPlay
                            playsInline
                            preload="metadata"
                            controls={false}
                            onLoadedMetadata={(e) => {
                              const start = selectedFilmClip.quizStartSeconds ?? 0;
                              if (start > 0) {
                                e.currentTarget.currentTime = start;
                              }
                              void e.currentTarget.play().catch(() => {});
                            }}
                            onTimeUpdate={(e) => {
                              const end = selectedFilmClip.quizEndSeconds;
                              if (typeof end === "number" && e.currentTarget.currentTime >= end) {
                                e.currentTarget.pause();
                                setFilmQuizFinished(true);
                              }
                            }}
                            onEnded={() => setFilmQuizFinished(true)}
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center px-8 text-center text-sm text-slate-300">
                            {showFilmQuizFeedback
                              ? "The clip is complete. Review your result on the right and move to the next rep when ready."
                              : "Press Start Clip to play the rep. The preview stays hidden in quiz mode."}
                          </div>
                        )
                      ) : (
                        <div className="flex aspect-video items-center justify-center px-8 text-center text-sm text-slate-300">
                          Add a clip on the right to begin building Film Mode.
                        </div>
                      )
                    ) : selectedFilmClip ? (
                      <video
                        ref={filmStudyVideoRef}
                        key={`${selectedFilmClip.id}-${filmPlaybackNonce}`}
                        className="aspect-video w-full bg-black"
                        src={selectedFilmClip.studyUrl}
                        controls
                        playsInline
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          setFilmStudyDuration(e.currentTarget.duration || 0);
                          setFilmStudyCurrentTime(e.currentTarget.currentTime || 0);
                        }}
                        onTimeUpdate={(e) => {
                          setFilmStudyCurrentTime(e.currentTarget.currentTime || 0);
                        }}
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center px-8 text-center text-sm text-slate-300">
                        Add a clip on the right to begin building Film Mode.
                      </div>
                    )}
                  </div>

                  {currentUser?.isAdmin && filmViewMode === "study" ? (
                    <div className="space-y-4 rounded-2xl border bg-white p-4">
                      <div className="flex justify-end">
                        <Button
                          variant={showFilmAdminTools ? "default" : "outline"}
                          className="min-w-[180px] rounded-xl"
                          onClick={() => setShowFilmAdminTools((prev) => !prev)}
                        >
                          {showFilmAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
                        </Button>
                      </div>

                      {showFilmAdminTools ? (
                        <>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant={filmAdminPanelMode === "upload" ? "default" : "outline"}
                              className="rounded-xl"
                              onClick={() => setFilmAdminPanelMode("upload")}
                            >
                              Upload
                            </Button>
                            <Button
                              variant={filmAdminPanelMode === "edit" ? "default" : "outline"}
                              className="rounded-xl"
                              onClick={() => setFilmAdminPanelMode("edit")}
                              disabled={!selectedFilmClip}
                            >
                              Edit
                            </Button>
                          </div>

                          {filmAdminPanelMode === "upload" ? (
                          <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                            <div className="text-sm font-semibold text-slate-900">Add Study Clip</div>
                            <div className="grid gap-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation Key</div>
                                  <Select value={filmDraft.formationKey || "__none"} onValueChange={(value) => setFilmDraft((prev) => ({ ...prev, formationKey: value === "__none" ? "" : value }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80 overflow-y-auto">
                                      <SelectItem value="__none">No Formation Key</SelectItem>
                                      {FILM_FORMATION_KEY_TAG_GROUPS.map((group) => (
                                        <SelectGroup key={group.label}>
                                          <SelectLabel>{group.label}</SelectLabel>
                                          {group.options.map((option) => (
                                            <SelectItem key={`${group.label}-${option}`} value={option}>
                                              {option}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      ))}
                                    </SelectContent>
                                    </Select>
                                  </div>
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Team Tag</div>
                                  <Select value={filmDraft.teamTag || "__none"} onValueChange={(value) => setFilmDraft((prev) => ({ ...prev, teamTag: value === "__none" ? "" : value }))}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80 overflow-y-auto">
                                      <SelectItem value="__none">No Team Tag</SelectItem>
                                      {filmTeamTagSelectOptions.map((teamTag) => (
                                        <SelectItem key={`film-team-upload-${teamTag}`} value={teamTag}>
                                          {teamTag}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Run / Pass</div>
                                  <Select
                                    value={filmDraft.runPass}
                                    onValueChange={(value: "run" | "pass") =>
                                      setFilmDraft((prev) => ({
                                        ...prev,
                                        runPass: value,
                                        direction: value === "run" ? prev.direction : "right",
                                        passType: value === "pass" ? prev.passType || "normal" : "",
                                        runScheme: value === "run" ? prev.runScheme : "",
                                        zoneType: value === "run" ? prev.zoneType : "",
                                        gapPullerCount: value === "run" ? prev.gapPullerCount : "",
                                        gapOnePullerConcept: value === "run" ? prev.gapOnePullerConcept : "",
                                        gapTwoPullerConcept: value === "run" ? prev.gapTwoPullerConcept : "",
                                        manConcept: value === "run" ? prev.manConcept : "",
                                      }))
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-80 overflow-y-auto">
                                      <SelectItem value="run">Run</SelectItem>
                                        <SelectItem value="pass">Pass</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                {filmDraft.runPass === "run" ? (
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Direction</div>
                                    <Select value={filmDraft.direction} onValueChange={(value: Side) => setFilmDraft((prev) => ({ ...prev, direction: value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : null}
                              </div>
                              {filmDraft.runPass === "pass" ? (
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pass Type</div>
                                    <Select value={filmDraft.passType} onValueChange={(value: Exclude<FilmPassType, "">) => setFilmDraft((prev) => ({ ...prev, passType: value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="screen">Screen</SelectItem>
                                        <SelectItem value="play_action">Play Action</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                              ) : null}
                              <div className="rounded-xl border bg-slate-50 p-3">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clip Bucket</div>
                                <div className="mt-1 text-sm font-semibold text-slate-900">{deriveFilmClipBucket(filmDraft)}</div>
                              </div>
                              {filmDraft.runPass === "run" ? (
                                <>
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Run Scheme</div>
                                    <Select value={filmDraft.runScheme} onValueChange={(value: Exclude<FilmRunScheme, "">) => setFilmDraft((prev) => ({
                                      ...prev,
                                      runScheme: value,
                                      zoneType: value === "zone" ? prev.zoneType || "normal" : "",
                                      gapPullerCount: value === "gap" ? prev.gapPullerCount : "",
                                      gapOnePullerConcept: value === "gap" ? prev.gapOnePullerConcept : "",
                                      gapTwoPullerConcept: value === "gap" ? prev.gapTwoPullerConcept : "",
                                      manConcept: value === "man" ? prev.manConcept : "",
                                    }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        {FILM_RUN_SCHEME_OPTIONS.map((option) => (
                                          <SelectItem key={option} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  {filmDraft.runScheme === "zone" ? (
                                    <div>
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Zone Type</div>
                                      <Select value={filmDraft.zoneType} onValueChange={(value: Exclude<FilmZoneType, "">) => setFilmDraft((prev) => ({ ...prev, zoneType: value }))}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-80 overflow-y-auto">
                                          <SelectItem value="normal">Normal</SelectItem>
                                          <SelectItem value="split">Split</SelectItem>
                                          <SelectItem value="jet">Jet Sweep</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ) : null}
                                  {filmDraft.runScheme === "gap" ? (
                                    <>
                                      <div>
                                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Puller Count</div>
                                        <Select value={filmDraft.gapPullerCount} onValueChange={(value: Exclude<FilmGapPullerCount, "">) => setFilmDraft((prev) => ({
                                          ...prev,
                                          gapPullerCount: value,
                                          gapOnePullerConcept: value === "1" ? prev.gapOnePullerConcept : "",
                                          gapTwoPullerConcept: value === "2" ? prev.gapTwoPullerConcept : "",
                                        }))}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="max-h-80 overflow-y-auto">
                                            {FILM_GAP_PULLER_COUNT_OPTIONS.map((option) => (
                                              <SelectItem key={option} value={option}>
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      {filmDraft.gapPullerCount === "1" ? (
                                        <div>
                                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">One Puller Concept</div>
                                          <Select value={filmDraft.gapOnePullerConcept} onValueChange={(value: Exclude<FilmGapOnePullerConcept, "">) => setFilmDraft((prev) => ({ ...prev, gapOnePullerConcept: value }))}>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80 overflow-y-auto">
                                              {FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                  {option}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      ) : null}
                                      {filmDraft.gapPullerCount === "2" ? (
                                        <div>
                                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Two Puller Concept</div>
                                          <Select value={filmDraft.gapTwoPullerConcept} onValueChange={(value: Exclude<FilmGapTwoPullerConcept, "">) => setFilmDraft((prev) => ({ ...prev, gapTwoPullerConcept: value }))}>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80 overflow-y-auto">
                                              {FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                  {option}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      ) : null}
                                    </>
                                  ) : null}
                                  {filmDraft.runScheme === "man" ? (
                                    <div>
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Man Concept</div>
                                      <Select value={filmDraft.manConcept} onValueChange={(value: Exclude<FilmManConcept, "">) => setFilmDraft((prev) => ({ ...prev, manConcept: value }))}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-80 overflow-y-auto">
                                          {FILM_MAN_CONCEPT_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={option}>
                                              {option}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ) : null}
                                </>
                              ) : null}
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz Start (sec)</div>
                                  <Input
                                    value={filmDraft.quizStartSeconds}
                                    placeholder="0.00"
                                    onChange={(e) => setFilmDraft((prev) => ({ ...prev, quizStartSeconds: e.target.value }))}
                                  />
                                </div>
                                <div>
                                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz End (sec)</div>
                                  <Input
                                    value={filmDraft.quizEndSeconds}
                                    placeholder="1.50"
                                    onChange={(e) => setFilmDraft((prev) => ({ ...prev, quizEndSeconds: e.target.value }))}
                                  />
                                </div>
                              </div>
                              {selectedFilmClip ? (
                                <div className="grid grid-cols-2 gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() =>
                                      setFilmDraft((prev) => ({
                                        ...prev,
                                        quizStartSeconds: filmStudyCurrentTime.toFixed(2),
                                      }))
                                    }
                                  >
                                    Use Current for Start
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl"
                                    onClick={() =>
                                      setFilmDraft((prev) => ({
                                        ...prev,
                                        quizEndSeconds: filmStudyCurrentTime.toFixed(2),
                                      }))
                                    }
                                  >
                                    Use Current for End
                                  </Button>
                                </div>
                              ) : null}
                              <div>
                                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Upload Study Clip</div>
                                <Input
                                  key={`film-study-file-${filmUploadResetKey}`}
                                  type="file"
                                  accept="video/mp4,video/quicktime,video/webm"
                                  onChange={(e) =>
                                    setFilmDraft((prev) => ({
                                      ...prev,
                                      studyFile: e.target.files?.[0] ?? null,
                                    }))
                                  }
                                />
                              </div>
                              <Button className="rounded-xl" onClick={addFilmClip}>
                                Save Clip
                              </Button>
                              {filmSaveNotice ? (
                                <div
                                  className={
                                    filmSaveNotice.tone === "success"
                                      ? "rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
                                      : filmSaveNotice.tone === "warning"
                                        ? "rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
                                        : "rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900"
                                  }
                                >
                                  {filmSaveNotice.message}
                                  <div
                                    className={
                                      filmSaveNotice.tone === "success"
                                        ? "mt-1 text-xs text-emerald-700"
                                        : filmSaveNotice.tone === "warning"
                                          ? "mt-1 text-xs text-amber-700"
                                          : "mt-1 text-xs text-rose-700"
                                    }
                                  >
                                    {filmSaveNotice.tone === "success"
                                      ? "The upload form has been reset and is ready for the next clip."
                                      : filmSaveNotice.tone === "warning"
                                        ? "Nothing has been saved yet. Save again only if this is truly a new rep."
                                      : "Nothing was saved, so the current metadata and files are still in place."}
                                  </div>
                                </div>
                              ) : null}
                              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                                Uploaded study clips are sent to Supabase Storage and clip metadata is saved to the <span className="font-semibold">film_clips</span> table. Quiz mode uses that same study clip plus the quiz start/end trim window.
                              </div>
                            </div>
                          </div>
                          ) : selectedFilmClip ? (
                            <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                              <div className="text-sm font-semibold text-slate-900">Edit Clip Metadata</div>
                              <div className="grid gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation Key</div>
                                    <Select value={filmEditDraft.formationKey || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, formationKey: value === "__none" ? "" : value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="__none">No Formation Key</SelectItem>
                                        {FILM_FORMATION_KEY_TAG_GROUPS.map((group) => (
                                          <SelectGroup key={group.label}>
                                            <SelectLabel>{group.label}</SelectLabel>
                                            {group.options.map((option) => (
                                              <SelectItem key={`${group.label}-${option}`} value={option}>
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectGroup>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Team Tag</div>
                                    <Select value={filmEditDraft.teamTag || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, teamTag: value === "__none" ? "" : value }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="__none">No Team Tag</SelectItem>
                                        {filmTeamTagSelectOptions.map((teamTag) => (
                                          <SelectItem key={`film-team-edit-${teamTag}`} value={teamTag}>
                                            {teamTag}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Run / Pass</div>
                                    <Select
                                      value={filmEditDraft.runPass}
                                      onValueChange={(value: "run" | "pass") =>
                                        setFilmEditDraft((prev) => ({
                                          ...prev,
                                          runPass: value,
                                          direction: value === "run" ? prev.direction : "right",
                                          passType: value === "pass" ? prev.passType || "normal" : "",
                                          runScheme: value === "run" ? prev.runScheme : "",
                                          zoneType: value === "run" ? prev.zoneType : "",
                                          gapPullerCount: value === "run" ? prev.gapPullerCount : "",
                                          gapOnePullerConcept: value === "run" ? prev.gapOnePullerConcept : "",
                                          gapTwoPullerConcept: value === "run" ? prev.gapTwoPullerConcept : "",
                                          manConcept: value === "run" ? prev.manConcept : "",
                                        }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="run">Run</SelectItem>
                                          <SelectItem value="pass">Pass</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  {filmEditDraft.runPass === "run" ? (
                                    <div>
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Direction</div>
                                      <Select value={filmEditDraft.direction} onValueChange={(value: Side) => setFilmEditDraft((prev) => ({ ...prev, direction: value }))}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-80 overflow-y-auto">
                                          <SelectItem value="left">Left</SelectItem>
                                          <SelectItem value="right">Right</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  ) : null}
                                </div>
                                {filmEditDraft.runPass === "pass" ? (
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Pass Type</div>
                                    <Select value={filmEditDraft.passType || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, passType: value === "__none" ? "" : value as Exclude<FilmPassType, ""> }))}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="max-h-80 overflow-y-auto">
                                        <SelectItem value="__none">Unspecified</SelectItem>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="screen">Screen</SelectItem>
                                        <SelectItem value="play_action">Play Action</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                ) : null}
                                <div className="rounded-xl border bg-slate-50 p-3">
                                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clip Bucket</div>
                                  <div className="mt-1 text-sm font-semibold text-slate-900">{deriveFilmClipBucket(filmEditDraft)}</div>
                                </div>
                                {filmEditDraft.runPass === "run" ? (
                                  <>
                                    <div>
                                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Run Scheme</div>
                                      <Select value={filmEditDraft.runScheme || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({
                                        ...prev,
                                        runScheme: value === "__none" ? "" : value as Exclude<FilmRunScheme, "">,
                                        zoneType: value === "zone" ? prev.zoneType : "",
                                        gapPullerCount: value === "gap" ? prev.gapPullerCount : "",
                                        gapOnePullerConcept: value === "gap" ? prev.gapOnePullerConcept : "",
                                        gapTwoPullerConcept: value === "gap" ? prev.gapTwoPullerConcept : "",
                                        manConcept: value === "man" ? prev.manConcept : "",
                                      }))}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-80 overflow-y-auto">
                                          <SelectItem value="__none">Unspecified</SelectItem>
                                          {FILM_RUN_SCHEME_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={option}>
                                              {option.charAt(0).toUpperCase() + option.slice(1)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    {filmEditDraft.runScheme === "zone" ? (
                                      <div>
                                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Zone Type</div>
                                        <Select value={filmEditDraft.zoneType || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, zoneType: value === "__none" ? "" : value as Exclude<FilmZoneType, ""> }))}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="max-h-80 overflow-y-auto">
                                            <SelectItem value="__none">Unspecified</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
                                            <SelectItem value="split">Split</SelectItem>
                                            <SelectItem value="jet">Jet Sweep</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    ) : null}
                                    {filmEditDraft.runScheme === "gap" ? (
                                      <>
                                        <div>
                                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Puller Count</div>
                                          <Select value={filmEditDraft.gapPullerCount || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({
                                            ...prev,
                                            gapPullerCount: value === "__none" ? "" : value as Exclude<FilmGapPullerCount, "">,
                                            gapOnePullerConcept: value === "1" ? prev.gapOnePullerConcept : "",
                                            gapTwoPullerConcept: value === "2" ? prev.gapTwoPullerConcept : "",
                                          }))}>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-80 overflow-y-auto">
                                              <SelectItem value="__none">Unspecified</SelectItem>
                                              {FILM_GAP_PULLER_COUNT_OPTIONS.map((option) => (
                                                <SelectItem key={option} value={option}>
                                                  {option}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        {filmEditDraft.gapPullerCount === "1" ? (
                                          <div>
                                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">One Puller Concept</div>
                                            <Select value={filmEditDraft.gapOnePullerConcept || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, gapOnePullerConcept: value === "__none" ? "" : value as Exclude<FilmGapOnePullerConcept, ""> }))}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent className="max-h-80 overflow-y-auto">
                                                <SelectItem value="__none">Unspecified</SelectItem>
                                                {FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS.map((option) => (
                                                  <SelectItem key={option} value={option}>
                                                    {option}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        ) : null}
                                        {filmEditDraft.gapPullerCount === "2" ? (
                                          <div>
                                            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Two Puller Concept</div>
                                            <Select value={filmEditDraft.gapTwoPullerConcept || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, gapTwoPullerConcept: value === "__none" ? "" : value as Exclude<FilmGapTwoPullerConcept, ""> }))}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent className="max-h-80 overflow-y-auto">
                                                <SelectItem value="__none">Unspecified</SelectItem>
                                                {FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS.map((option) => (
                                                  <SelectItem key={option} value={option}>
                                                    {option}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        ) : null}
                                      </>
                                    ) : null}
                                    {filmEditDraft.runScheme === "man" ? (
                                      <div>
                                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Man Concept</div>
                                        <Select value={filmEditDraft.manConcept || "__none"} onValueChange={(value) => setFilmEditDraft((prev) => ({ ...prev, manConcept: value === "__none" ? "" : value as Exclude<FilmManConcept, ""> }))}>
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent className="max-h-80 overflow-y-auto">
                                            <SelectItem value="__none">Unspecified</SelectItem>
                                            {FILM_MAN_CONCEPT_OPTIONS.map((option) => (
                                              <SelectItem key={option} value={option}>
                                                {option}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    ) : null}
                                  </>
                                ) : null}
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz Start (sec)</div>
                                    <Input
                                      value={filmEditDraft.quizStartSeconds}
                                      placeholder="0.00"
                                      onChange={(e) => setFilmEditDraft((prev) => ({ ...prev, quizStartSeconds: e.target.value }))}
                                    />
                                  </div>
                                  <div>
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Quiz End (sec)</div>
                                    <Input
                                      value={filmEditDraft.quizEndSeconds}
                                      placeholder="1.50"
                                      onChange={(e) => setFilmEditDraft((prev) => ({ ...prev, quizEndSeconds: e.target.value }))}
                                    />
                                  </div>
                                </div>
                                {selectedFilmClip ? (
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="rounded-xl"
                                      onClick={() =>
                                        setFilmEditDraft((prev) => ({
                                          ...prev,
                                          quizStartSeconds: filmStudyCurrentTime.toFixed(2),
                                        }))
                                      }
                                    >
                                      Use Current for Start
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="rounded-xl"
                                      onClick={() =>
                                        setFilmEditDraft((prev) => ({
                                          ...prev,
                                          quizEndSeconds: filmStudyCurrentTime.toFixed(2),
                                        }))
                                      }
                                    >
                                      Use Current for End
                                    </Button>
                                  </div>
                                ) : null}
                                <Button className="rounded-xl" onClick={saveFilmMetadata}>
                                  Save Metadata
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-2xl border bg-white p-4 text-sm text-slate-500">
                              Select a clip to edit its metadata.
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  ) : null}

                  {filmViewMode === "quiz" && showFilmQuizFeedback && selectedFilmClip ? (
                    <div className="overflow-hidden rounded-2xl border bg-white">
                      <div className="border-b bg-slate-50 px-4 py-3">
                        <div className="text-sm font-semibold text-slate-900">Full Clip Review</div>
                        <div className="mt-1 text-sm text-slate-600">
                          Watch the full study clip as many times as you want before moving to the next rep.
                        </div>
                      </div>
                      <video
                        className="aspect-video w-full bg-black"
                        src={selectedFilmClip.studyUrl}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                    <Button variant="outline" className="rounded-xl" onClick={nextCall}>
                      <Shuffle className="mr-2 h-4 w-4" />
                      Random Clip
                    </Button>
                    {filmSubmode === "formation_key" ? (
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation Key</div>
                        <Select value={safeFilmFormationFilter} onValueChange={setFilmFormationFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-y-auto">
                            <SelectItem value="all">All Tagged Formations</SelectItem>
                            {filmFormationKeyOptions.length ? (
                              filmFormationKeyOptions.map((group) => (
                                <SelectGroup key={group.label}>
                                  <SelectLabel>{group.label}</SelectLabel>
                                  {group.options.map((option) => (
                                    <SelectItem key={`${group.label}-${option}`} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              ))
                            ) : (
                              <SelectGroup>
                                <SelectLabel>No Formation Keys Yet</SelectLabel>
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : filmSubmode === "team_key" ? (
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Team</div>
                        <Select value={safeFilmTeamFilter} onValueChange={setFilmTeamFilter}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-y-auto">
                            <SelectItem value="all">All Tagged Teams</SelectItem>
                            {filmTeamTagOptions.length ? (
                              filmTeamTagOptions.map((teamTag) => (
                                <SelectItem key={teamTag} value={teamTag}>
                                  {teamTag}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectGroup>
                                <SelectLabel>No Team Tags Yet</SelectLabel>
                              </SelectGroup>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                    {filmViewMode === "study" ? (
                      <>
                        <div>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Clip</div>
                          <Select
                            value={selectedFilmClip?.id ?? ""}
                            onValueChange={(value) => {
                              setSelectedFilmClipId(value);
                              setFilmStarted(false);
                            }}
                            disabled={!filmClipGroups.length}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={filmClipGroups.length ? "Select a clip" : "No clips added yet"} />
                            </SelectTrigger>
                            <SelectContent className="max-h-80 overflow-y-auto">
                              {filmClipGroups.map((group) => (
                                <React.Fragment key={group.runPass}>
                                  <SelectGroup>
                                    <SelectLabel className="sticky top-0 z-10 bg-white/95 backdrop-blur">
                                      {group.label}
                                    </SelectLabel>
                                    {group.sections.map((sectionGroup) => (
                                      <React.Fragment key={`${group.runPass}-${sectionGroup.section}`}>
                                        <div className="sticky top-7 z-10 px-2 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 bg-white/95 backdrop-blur">
                                          {sectionGroup.section}
                                        </div>
                                        {sectionGroup.buckets.map((bucketGroup) => (
                                          <React.Fragment key={`${group.runPass}-${sectionGroup.section}-${bucketGroup.bucket}`}>
                                            <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                              {bucketGroup.bucket}
                                            </div>
                                            {bucketGroup.options.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </React.Fragment>
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </SelectGroup>
                                  {group.runPass !== filmClipGroups[filmClipGroups.length - 1]?.runPass ? (
                                    <SelectDivider />
                                  ) : null}
                                </React.Fragment>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-xl border bg-slate-50 p-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Film Quiz</div>
                        <div className="mt-1 text-sm text-slate-700">
                          {filmSubmode === "formation_key"
                            ? "Formation Key quiz cycles random clips from the selected tagged formation family."
                            : filmSubmode === "team_key"
                              ? "Team Key quiz cycles random clips from the selected tagged team cutup."
                            : <>Film quiz gives players <span className="font-semibold">0 replays</span>. Pass clips ask for <span className="font-semibold">Run / Pass</span> and <span className="font-semibold">Pass Type</span>, while run clips ask for <span className="font-semibold">Run / Pass</span>, <span className="font-semibold">Scheme</span>, <span className="font-semibold">Direction</span>, and extra zone or gap detail when needed.</>}
                        </div>
                      </div>
                    )}

                      <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                        {filmSubmode === "formation_key"
                          ? <>Film Mode is set up for <span className="font-semibold">Formation Key</span>. Pick a tagged formation family to study or quiz only that bucket of clips.</>
                          : filmSubmode === "team_key"
                            ? <>Film Mode is set up for <span className="font-semibold">Team Key</span>. Pick a team tag to study or quiz only that cutup.</>
                          : <>Film Mode is set up for <span className="font-semibold">Read Key</span>. Study mode shows the full clip immediately, while quiz mode hides the preview until the rep starts.</>}
                      </div>

                    {filmViewMode === "study" && selectedFilmClip ? (
                      <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Player Time</div>
                        <div className="mt-1 font-semibold text-slate-900">
                          {formatVideoTimestamp(filmStudyCurrentTime)}
                          {filmStudyDuration > 0 ? ` / ${formatVideoTimestamp(filmStudyDuration)}` : ""}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800">
                          {filmStudyCurrentTime.toFixed(2)}s
                          {filmStudyDuration > 0 ? ` / ${filmStudyDuration.toFixed(2)}s` : ""}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          Quiz trim fields accept decimal seconds, so values like <span className="font-semibold">1.24</span> or <span className="font-semibold">2.68</span> are valid.
                        </div>
                      </div>
                    ) : null}

                    {filmViewMode === "study" && selectedFilmClip ? (
                      <div className="space-y-3 rounded-xl border bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Answer Key</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="rounded-lg border bg-white px-3 py-2">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Run / Pass</div>
                            <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.runPass === "run" ? "Run" : "Pass"}</div>
                          </div>
                          {selectedFilmClip.runPass === "pass" ? (
                            <div className="rounded-lg border bg-white px-3 py-2">
                              <div className="text-xs uppercase tracking-wide text-slate-500">Pass Type</div>
                              <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.passType === "screen" ? "Screen" : selectedFilmClip.passType === "play_action" ? "Play Action" : selectedFilmClip.passType === "normal" ? "Normal" : "—"}</div>
                            </div>
                          ) : null}
                          <div className="rounded-lg border bg-white px-3 py-2">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Formation Key</div>
                            <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.formationKey || "—"}</div>
                          </div>
                          <div className="rounded-lg border bg-white px-3 py-2">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Team Tag</div>
                            <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.teamTag || "—"}</div>
                          </div>
                          {selectedFilmClip.runPass === "run" ? (
                            <div className="rounded-lg border bg-white px-3 py-2">
                              <div className="text-xs uppercase tracking-wide text-slate-500">Direction</div>
                              <div className="mt-1 font-semibold text-slate-900">{FIELD_LABELS[selectedFilmClip.direction]}</div>
                            </div>
                          ) : null}
                          <div className="rounded-lg border bg-white px-3 py-2">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Bucket</div>
                            <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.clipBucket}</div>
                          </div>
                        </div>
                        {selectedFilmClip.runPass === "run" ? (
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="rounded-lg border bg-white px-3 py-2">
                              <div className="text-xs uppercase tracking-wide text-slate-500">Scheme</div>
                              <div className="mt-1 font-semibold capitalize text-slate-900">{selectedFilmClip.runScheme || "—"}</div>
                            </div>
                            <div className="rounded-lg border bg-white px-3 py-2">
                              <div className="text-xs uppercase tracking-wide text-slate-500">{selectedFilmClip.runScheme === "zone" ? "Zone Type" : "Concept"}</div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {selectedFilmClip.runScheme === "gap"
                                  ? selectedFilmClip.gapPullerCount === "1"
                                    ? selectedFilmClip.gapOnePullerConcept || "—"
                                    : selectedFilmClip.gapTwoPullerConcept || "—"
                                  : selectedFilmClip.runScheme === "zone"
                                    ? selectedFilmClip.zoneType === "split"
                                      ? "Split"
                                      : selectedFilmClip.zoneType === "jet"
                                        ? "Jet Sweep"
                                      : selectedFilmClip.zoneType === "normal"
                                        ? "Normal"
                                        : "—"
                                  : selectedFilmClip.runScheme === "man"
                                    ? selectedFilmClip.manConcept || "—"
                                    : `${selectedFilmClip.clipBucket}`}
                              </div>
                            </div>
                            {selectedFilmClip.runScheme === "gap" ? (
                              <div className="rounded-lg border bg-white px-3 py-2 sm:col-span-2">
                                <div className="text-xs uppercase tracking-wide text-slate-500">Pullers</div>
                                <div className="mt-1 font-semibold text-slate-900">
                                  {selectedFilmClip.gapPullerCount
                                    ? `${selectedFilmClip.gapPullerCount} puller${selectedFilmClip.gapPullerCount === "1" ? "" : "s"}`
                                    : "—"}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="text-xs text-slate-500">
                          {selectedFilmClip.studyFileName ? ` • Study: ${selectedFilmClip.studyFileName}` : ""}
                          {selectedFilmClip.quizFileName ? ` • Quiz: ${selectedFilmClip.quizFileName}` : ""}
                          {(selectedFilmClip.quizStartSeconds !== null && selectedFilmClip.quizStartSeconds !== undefined) ||
                          (selectedFilmClip.quizEndSeconds !== null && selectedFilmClip.quizEndSeconds !== undefined)
                            ? ` • Quiz Window: ${selectedFilmClip.quizStartSeconds ?? 0}s to ${selectedFilmClip.quizEndSeconds ?? "end"}s`
                            : ""}
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            className="rounded-xl"
                            onClick={() => {
                              setFilmPlaybackNonce((prev) => prev + 1);
                            }}
                          >
                            Restart Clip
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {filmViewMode === "quiz" ? (
                      <div className="space-y-3 rounded-xl border bg-slate-50 p-3">
                        <div className="text-sm font-semibold text-slate-900">Your Answers</div>
                        <div className="grid gap-3">
                          <div>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Run / Pass</div>
                            <Select
                              value={filmQuizAnswers.runPass}
                              onValueChange={(value: "run" | "pass") =>
                                setFilmQuizAnswers((prev) => ({
                                  ...prev,
                                  runPass: value,
                                  passType: value === "pass" ? prev.passType : "",
                                  direction: value === "run" ? prev.direction : "",
                                  runScheme: value === "run" ? prev.runScheme : "",
                                  zoneType: value === "run" ? prev.zoneType : "",
                                  gapPullerCount: value === "run" ? prev.gapPullerCount : "",
                                  pullerConcept: value === "run" ? prev.pullerConcept : "",
                                }))
                              }
                            >
                              <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                <SelectValue placeholder="Run or Pass" />
                              </SelectTrigger>
                              <SelectContent className="max-h-80 overflow-y-auto">
                                <SelectItem value="run">Run</SelectItem>
                                <SelectItem value="pass">Pass</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {showFilmQuizPassFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Pass Type</div>
                              <Select
                                value={filmQuizAnswers.passType}
                                onValueChange={(value: Exclude<FilmPassType, "">) => setFilmQuizAnswers((prev) => ({ ...prev, passType: value }))}
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="Normal, Screen, or Play Action" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="screen">Screen</SelectItem>
                                  <SelectItem value="play_action">Play Action</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          {showFilmQuizRunFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Direction</div>
                              <Select
                                value={filmQuizAnswers.direction}
                                onValueChange={(value: Side) => setFilmQuizAnswers((prev) => ({ ...prev, direction: value }))}
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="Left or Right" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  <SelectItem value="left">Left</SelectItem>
                                  <SelectItem value="right">Right</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          {showFilmQuizRunFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Scheme</div>
                              <Select
                                value={filmQuizAnswers.runScheme}
                                onValueChange={(value: Exclude<FilmRunScheme, "">) =>
                                  setFilmQuizAnswers((prev) => ({
                                    ...prev,
                                    runScheme: value,
                                    zoneType: value === "zone" ? prev.zoneType : "",
                                    gapPullerCount: value === "gap" ? prev.gapPullerCount : "",
                                    pullerConcept: value === "gap" ? prev.pullerConcept : "",
                                  }))
                                }
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="Gap, Zone, or Man" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  <SelectItem value="gap">Gap</SelectItem>
                                  <SelectItem value="zone">Zone</SelectItem>
                                  <SelectItem value="man">Man</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          {showFilmQuizZoneFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Zone Type</div>
                              <Select
                                value={filmQuizAnswers.zoneType}
                                onValueChange={(value: Exclude<FilmZoneType, "">) => setFilmQuizAnswers((prev) => ({ ...prev, zoneType: value }))}
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="Normal, Split, or Jet Sweep" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="split">Split</SelectItem>
                                  <SelectItem value="jet">Jet Sweep</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          {showFilmQuizGapFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Puller Count</div>
                              <Select
                                value={filmQuizAnswers.gapPullerCount}
                                onValueChange={(value: Exclude<FilmGapPullerCount, "">) =>
                                  setFilmQuizAnswers((prev) => ({
                                    ...prev,
                                    gapPullerCount: value,
                                    pullerConcept: "",
                                  }))
                                }
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="1 or 2" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                          {showFilmQuizGapFields ? (
                            <div>
                              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Who Pulled / Concept</div>
                              <Select
                                value={filmQuizAnswers.pullerConcept}
                                onValueChange={(value) => setFilmQuizAnswers((prev) => ({ ...prev, pullerConcept: value }))}
                              >
                                <SelectTrigger className="h-12 border-2 border-slate-300 bg-white text-base">
                                  <SelectValue placeholder="Choose concept" />
                                </SelectTrigger>
                                <SelectContent className="max-h-80 overflow-y-auto">
                                  {filmQuizAnswers.gapPullerCount === "1"
                                    ? FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS.map((option) => (
                                        <SelectItem key={option} value={option}>
                                          {option}
                                        </SelectItem>
                                      ))
                                    : filmQuizAnswers.gapPullerCount === "2"
                                      ? FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS.map((option) => (
                                          <SelectItem key={option} value={option}>
                                            {option}
                                          </SelectItem>
                                        ))
                                      : null}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : null}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Button
                            className="h-12 rounded-xl text-base"
                            onClick={startFilmQuizClip}
                            disabled={(filmQuizStarted && !filmQuizFinished) || filmQuizPlaysUsed >= filmQuizTotalPlaysAllowed || showFilmQuizFeedback}
                          >
                            {filmQuizPlaysUsed === 0
                              ? "Start Clip"
                              : filmQuizPlaysUsed >= filmQuizTotalPlaysAllowed
                                ? "No Replays Left"
                                : `Replay Clip (${filmQuizReplaysRemaining} left)`}
                          </Button>
                          <Button
                            variant="outline"
                            className="h-12 rounded-xl text-base"
                            onClick={submitFilmQuiz}
                            disabled={!filmQuizFinished}
                          >
                            Check Answers
                          </Button>
                        </div>
                        {showFilmQuizAnswers && selectedFilmClip ? (
                          <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                            <div><span className="font-semibold">Run / Pass:</span> {selectedFilmClip.runPass === "run" ? "Run" : "Pass"}</div>
                            {filmQuizNeedsPassType ? (
                              <div><span className="font-semibold">Pass Type:</span> {selectedFilmClip.passType === "screen" ? "Screen" : selectedFilmClip.passType === "play_action" ? "Play Action" : selectedFilmClip.passType === "normal" ? "Normal" : "—"}</div>
                            ) : null}
                            {selectedFilmClip.runPass === "run" ? (
                              <div><span className="font-semibold">Direction:</span> {FIELD_LABELS[selectedFilmClip.direction]}</div>
                            ) : null}
                            {filmQuizNeedsRunScheme ? (
                              <div><span className="font-semibold">Scheme:</span> {selectedFilmClip.runScheme ? selectedFilmClip.runScheme.charAt(0).toUpperCase() + selectedFilmClip.runScheme.slice(1) : "—"}</div>
                            ) : null}
                            {filmQuizNeedsZoneType ? (
                              <div><span className="font-semibold">Zone Type:</span> {selectedFilmClip.zoneType === "split" ? "Split" : selectedFilmClip.zoneType === "jet" ? "Jet Sweep" : selectedFilmClip.zoneType === "normal" ? "Normal" : "—"}</div>
                            ) : null}
                            {filmQuizNeedsGapDetails ? (
                              <>
                                <div><span className="font-semibold">Pullers:</span> {selectedFilmClip.gapPullerCount || "—"}</div>
                                <div><span className="font-semibold">Who Pulled / Concept:</span> {selectedFilmGapConcept || "—"}</div>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                        {showFilmQuizFeedback ? (
                          <>
                            <div className="text-sm font-semibold text-slate-700">Score: {filmQuizScore} / {filmQuizQuestionCount}</div>
                            {lastScoreSummary.film ? (
                              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                                <span className="font-semibold">Points earned:</span> {lastScoreSummary.film.awarded}
                                <div>
                                  <span className="font-semibold">Film total:</span> {lastScoreSummary.film.total}
                                </div>
                              </div>
                            ) : null}
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between rounded-lg border p-3"><span>Run / Pass</span>{filmQuizResult.runPass ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              {filmQuizNeedsPassType ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Pass Type</span>{filmQuizResult.passType ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                              {!filmQuizIsPass ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Direction</span>{filmQuizResult.direction ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                              {filmQuizNeedsRunScheme ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Scheme</span>{filmQuizResult.runScheme ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                              {filmQuizNeedsZoneType ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Zone Type</span>{filmQuizResult.zoneType ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                              {filmQuizNeedsGapDetails ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Puller Count</span>{filmQuizResult.gapPullerCount ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                              {filmQuizNeedsGapDetails ? (
                                <div className="flex items-center justify-between rounded-lg border p-3"><span>Who Pulled / Concept</span>{filmQuizResult.pullerConcept ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <XCircle className="h-4 w-4 text-red-600" />}</div>
                              ) : null}
                            </div>
                            <Button
                              variant="outline"
                              className="h-12 w-full rounded-xl text-base"
                              onClick={() => setShowFilmQuizAnswers((prev) => !prev)}
                            >
                              {showFilmQuizAnswers ? "Hide Answers" : "Show Answers"}
                            </Button>
                            <div className="rounded-xl border border-slate-200 bg-white p-3 text-center text-sm text-slate-700">
                              Press <span className="font-semibold">Enter</span> to move onto next clip.
                            </div>
                            {selectedFilmClip ? (
                              <div className="space-y-3 rounded-xl border border-sky-200 bg-sky-50 p-3">
                                <div className="text-sm font-semibold text-slate-900">Teaching Panel</div>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  <div className="rounded-lg border bg-white px-3 py-2">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Run / Pass</div>
                                    <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.runPass === "run" ? "Run" : "Pass"}</div>
                                  </div>
                                  {selectedFilmClip.runPass === "pass" ? (
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                      <div className="text-xs uppercase tracking-wide text-slate-500">Pass Type</div>
                                      <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.passType === "screen" ? "Screen" : selectedFilmClip.passType === "play_action" ? "Play Action" : selectedFilmClip.passType === "normal" ? "Normal" : "—"}</div>
                                    </div>
                                  ) : null}
                                  {selectedFilmClip.runPass === "run" ? (
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                      <div className="text-xs uppercase tracking-wide text-slate-500">Direction</div>
                                      <div className="mt-1 font-semibold text-slate-900">{FIELD_LABELS[selectedFilmClip.direction]}</div>
                                    </div>
                                  ) : null}
                                  <div className="rounded-lg border bg-white px-3 py-2">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Bucket</div>
                                    <div className="mt-1 font-semibold text-slate-900">{selectedFilmClip.clipBucket}</div>
                                  </div>
                                </div>
                                {selectedFilmClip.runPass === "run" ? (
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                      <div className="text-xs uppercase tracking-wide text-slate-500">Scheme</div>
                                      <div className="mt-1 font-semibold capitalize text-slate-900">{selectedFilmClip.runScheme || "—"}</div>
                                    </div>
                                    <div className="rounded-lg border bg-white px-3 py-2">
                                      <div className="text-xs uppercase tracking-wide text-slate-500">{selectedFilmClip.runScheme === "zone" ? "Zone Type" : "Concept"}</div>
                                      <div className="mt-1 font-semibold text-slate-900">
                                        {selectedFilmClip.runScheme === "gap"
                                          ? selectedFilmClip.gapPullerCount === "1"
                                            ? selectedFilmClip.gapOnePullerConcept || "—"
                                            : selectedFilmClip.gapTwoPullerConcept || "—"
                                          : selectedFilmClip.runScheme === "zone"
                                            ? selectedFilmClip.zoneType === "split"
                                              ? "Split"
                                              : selectedFilmClip.zoneType === "jet"
                                                ? "Jet Sweep"
                                              : selectedFilmClip.zoneType === "normal"
                                                ? "Normal"
                                                : "—"
                                          : selectedFilmClip.runScheme === "man"
                                            ? selectedFilmClip.manConcept || "—"
                                            : `${selectedFilmClip.clipBucket}`}
                                      </div>
                                    </div>
                                    {selectedFilmClip.runScheme === "gap" ? (
                                      <div className="rounded-lg border bg-white px-3 py-2 sm:col-span-2">
                                        <div className="text-xs uppercase tracking-wide text-slate-500">Pullers</div>
                                        <div className="mt-1 font-semibold text-slate-900">
                                          {selectedFilmClip.gapPullerCount
                                            ? `${selectedFilmClip.gapPullerCount} puller${selectedFilmClip.gapPullerCount === "1" ? "" : "s"}`
                                            : "—"}
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                ) : null}
                                <div className="text-xs text-slate-500">
                                  {selectedFilmClip.studyFileName ? ` • Study: ${selectedFilmClip.studyFileName}` : ""}
                                  {selectedFilmClip.quizFileName ? ` • Quiz: ${selectedFilmClip.quizFileName}` : ""}
                                  {(selectedFilmClip.quizStartSeconds !== null && selectedFilmClip.quizStartSeconds !== undefined) ||
                                  (selectedFilmClip.quizEndSeconds !== null && selectedFilmClip.quizEndSeconds !== undefined)
                                    ? ` • Quiz Window: ${selectedFilmClip.quizStartSeconds ?? 0}s to ${selectedFilmClip.quizEndSeconds ?? "end"}s`
                                    : ""}
                                </div>
                              </div>
                            ) : null}
                            <Button className="h-12 w-full rounded-xl text-base" onClick={nextFilmQuizClip}>
                              Next Clip
                            </Button>
                          </>
                        ) : (
                          <div className="rounded-xl border border-dashed p-3 text-sm text-slate-500">
                            Press <span className="font-semibold">Start Clip</span>, let the rep finish, then check your answers.
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>

                </div>
              </div>
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
                  <Button variant="outline" className="h-12 w-full rounded-xl text-base" onClick={nextCall}>
                    <Shuffle className="mr-2 h-4 w-4" />
                    Randomize
                  </Button>
                  <Button className="h-12 w-full rounded-xl text-base" onClick={submitQuiz}>
                    Check Answers
                  </Button>
                  <Button variant="outline" className="h-12 w-full rounded-xl text-base" onClick={() => { markAttemptRevealed("quiz"); setShowQuizAnswers(true); setShowQuizFeedback(false); setQuizReadyForNext(false); }}>
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
                      {lastScoreSummary.quiz ? (
                        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                          <span className="font-semibold">Points earned:</span> {lastScoreSummary.quiz.awarded}
                          <div>
                            <span className="font-semibold">Quiz total:</span> {lastScoreSummary.quiz.total}
                          </div>
                          {lastScoreSummary.quiz.blockedByReveal ? (
                            <div className="mt-2 font-semibold text-amber-800">No points awarded because answers were revealed first.</div>
                          ) : null}
                        </div>
                      ) : null}
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
                    <div className="min-w-[140px]">
                      <Select value={alignmentViewMode} onValueChange={(value: AlignmentViewMode) => { setAlignmentViewMode(value); setShowAlignmentCheck(false); }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-[110px]">
                      <Select value={frontMode} onValueChange={(value: FrontMode) => setFrontMode(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
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
                    defensePlayers={alignmentViewMode === "study" ? alignmentStudyPlayers : alignmentPlayers}
                    defenseLandmarks={alignmentLandmarks}
                    enhancedLandmarks={enhancedLandmarks}
                    editableDefense={alignmentViewMode === "quiz"}
                    incorrectDefenseIds={alignmentViewMode === "quiz" && showAlignmentCheck ? alignmentCheck.incorrectIds : []}
                    defenseGhosts={alignmentViewMode === "quiz" && showAlignmentCheck ? alignmentCheck.ghosts : []}
                    overlayLabel={alignmentViewMode === "study" ? "Study the defensive alignments for this formation." : "Drag defenders to the defensive landmarks."}
                    onMoveDefense={alignmentViewMode === "quiz" ? moveDefender : undefined}
                  />
                </div>
                <div className="space-y-4">
                  {alignmentViewMode === "quiz" ? (
                    <>
                      <Button variant="outline" className="rounded-xl w-full" onClick={nextCall}>
                        <Shuffle className="mr-2 h-4 w-4" />
                        Randomize
                      </Button>
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
                            {lastScoreSummary.alignment ? (
                              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                                <span className="font-semibold">Points earned:</span> {lastScoreSummary.alignment.awarded}
                                <div>
                                  <span className="font-semibold">Alignment total:</span> {lastScoreSummary.alignment.total}
                                </div>
                                {lastScoreSummary.alignment.blockedByReveal ? (
                                  <div className="mt-2 font-semibold text-amber-800">No points awarded because answers were revealed first.</div>
                                ) : null}
                              </div>
                            ) : null}
                            {alignmentCheck.isCorrect ? (
                              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700">
                                <CheckCircle2 className="h-5 w-5" /> Correct Alignment
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                      <Button className="rounded-xl" onClick={nextCall}>
                        <Shuffle className="mr-2 h-4 w-4" />
                        Randomize
                      </Button>
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</div>
                        <Select
                          value={`${current.playbook}::${current.name}::${current.personnel}::${index % Math.max(pool.length, 1)}`}
                          onValueChange={(value) => {
                            const selected = formationSelectGroups
                              .flatMap((group) => group.options)
                              .find((option) => option.value === value);
                            if (selected) setIndex(selected.index);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-y-auto">
                            {formationSelectGroups.map((group) => (
                              <React.Fragment key={group.personnel}>
                                <SelectGroup>
                                  <SelectLabel>{group.personnel}P</SelectLabel>
                                  {group.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                {group.personnel !== formationSelectGroups[formationSelectGroups.length - 1]?.personnel ? (
                                  <SelectDivider />
                                ) : null}
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>Study the answer-key alignment for this formation. Front: {frontMode}</div>
                      <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                        The blue defenders are already placed on their correct alignments for study mode.
                      </div>
                    </div>
                  )}
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
                              <SelectContent className="max-h-80 overflow-y-auto">
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
                              <SelectContent className="max-h-80 overflow-y-auto">
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
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-end gap-2">
                    <div className="min-w-[140px]">
                      <Select value={offenseBuildViewMode} onValueChange={(value: OffenseBuildViewMode) => { setOffenseBuildViewMode(value); setShowOffenseCheck(false); }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-80 overflow-y-auto">
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="quiz">Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <TrainingField
                    offensePlayers={offenseBuildViewMode === "study" ? displayFormation.players : [...baseLine(false), ...offenseBuildPlayers]}
                    offenseLandmarks={offenseLandmarks}
                    offenseGhostOffset={showOffenseCheck ? 1.6 : 0}
                    dimOffenseOnAnswers={showOffenseCheck}
                    editableOffense={offenseBuildViewMode === "quiz"}
                    flipOffense
                    flipHorizontalPerspective
                    onMoveOffense={offenseBuildViewMode === "quiz" ? moveOffense : undefined}
                    incorrectOffenseIds={offenseBuildViewMode === "quiz" && showOffenseCheck ? offenseCheck.incorrectIds : []}
                    offenseGhosts={offenseBuildViewMode === "quiz" && showOffenseCheck ? offenseCheck.ghosts : []}
                    overlayLabel={offenseBuildViewMode === "study" ? "Study the offensive alignments for this formation." : "Drag QB, RB, X, Y, H, Z to the offensive landmarks."}
                  />
                </div>
                <div className="space-y-4">
                  {offenseBuildViewMode === "quiz" ? (
                    <>
                      <Button variant="outline" className="rounded-xl w-full" onClick={nextCall}>
                        <Shuffle className="mr-2 h-4 w-4" />
                        Randomize
                      </Button>
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
                            {lastScoreSummary.offense_build ? (
                              <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                                <span className="font-semibold">Points earned:</span> {lastScoreSummary.offense_build.awarded}
                                <div>
                                  <span className="font-semibold">Offensive total:</span> {lastScoreSummary.offense_build.total}
                                </div>
                              </div>
                            ) : null}
                            {offenseCheck.isCorrect ? (
                              <div className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-100 p-3 text-sm font-semibold text-emerald-700">
                                <CheckCircle2 className="h-5 w-5" /> Correct Formation
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3 rounded-2xl border bg-white p-4 text-sm text-slate-600">
                      <Button className="rounded-xl" onClick={nextCall}>
                        <Shuffle className="mr-2 h-4 w-4" />
                        Randomize
                      </Button>
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Formation</div>
                        <Select
                          value={`${current.playbook}::${current.name}::${current.personnel}::${index % Math.max(pool.length, 1)}`}
                          onValueChange={(value) => {
                            const selected = formationSelectGroups
                              .flatMap((group) => group.options)
                              .find((option) => option.value === value);
                            if (selected) setIndex(selected.index);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-h-80 overflow-y-auto">
                            {formationSelectGroups.map((group) => (
                              <React.Fragment key={group.personnel}>
                                <SelectGroup>
                                  <SelectLabel>{group.personnel}P</SelectLabel>
                                  {group.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                {group.personnel !== formationSelectGroups[formationSelectGroups.length - 1]?.personnel ? (
                                  <SelectDivider />
                                ) : null}
                              </React.Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>Study the offensive alignment landmarks for this formation.</div>
                      <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
                        The offense is already placed on the answer-key landmarks for study mode.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
