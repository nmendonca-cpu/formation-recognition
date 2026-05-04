import {
  buildFoothillFormation,
  type PlayerDot,
  type Side,
} from "@/lib/formation/formationLogic";

export type PassConceptViewMode = "study" | "quiz";
export type PassConceptPlayerId = "X" | "H" | "Y" | "Z";
export type PassConceptBoardKind = "2x2" | "3x1";
export type PassConceptFamilyFilter = "2x2" | "3x1" | "all";
export type PassConceptQuizMode = "build" | "identify";

export type YardReferenceLine = {
  id: string;
  yards: number;
  label?: string;
};

export type RouteOverlay = {
  id: string;
  label: string;
  color: string;
  path: { x: number; y: number }[];
  labelX?: number;
  labelY?: number;
  strokeWidth?: number;
  dashed?: boolean;
  endCap?: "arrow" | "square" | "circle";
};

export const PASS_CONCEPT_ROUTE_OPTIONS = [
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

export type TwoByTwoConcept = {
  id: string;
  name: string;
  outsideRoute: (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number];
  insideRoute: (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number];
  detail?: string;
};

export type ThreeByOneConcept = {
  id: string;
  name: string;
  routes: Partial<Record<PassConceptPlayerId, (typeof PASS_CONCEPT_ROUTE_OPTIONS)[number]>>;
  detail?: string;
};

export type PassConceptCard = {
  label: string;
  name: string;
  assignments: { player: PassConceptPlayerId; roleLabel: string; route: string }[];
  detail?: string;
};

export type PassConceptDefinition = {
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

export type PassConceptPreview = PassConceptDefinition & {
  formationPlayers: PlayerDot[];
  routesPreview: RouteOverlay[];
  yardLines: YardReferenceLine[];
  losY: number;
};

export type PassConceptIdentifyResult = {
  frontsideNameResult: boolean;
  backsideNameResult: boolean;
  nameResult: boolean;
  identifyScore: number;
  identifyQuestionCount: number;
};

export const TWO_BY_TWO_CONCEPTS: TwoByTwoConcept[] = [
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

export const THREE_BY_ONE_CONCEPTS: ThreeByOneConcept[] = [
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

export const DEFAULT_ROUTE_TEMPLATES: Record<(typeof PASS_CONCEPT_ROUTE_OPTIONS)[number], { lateral: number; depth: number }[]> = {
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

export function buildRoutePath(
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

export function buildTwoByTwoPassConceptPreview(
  frontsideConcept: TwoByTwoConcept,
  backsideConcept: TwoByTwoConcept,
): PassConceptPreview {
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

export function buildThreeByOnePassConceptPreview(
  concept: ThreeByOneConcept,
): PassConceptPreview {
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

export function buildPassConceptQuizRoutePreview(
  passConceptViewMode: PassConceptViewMode,
  passConceptQuizMode: PassConceptQuizMode,
  showPassConceptAnswers: boolean,
  passConceptPreview: PassConceptPreview,
  passConceptAnswers: Record<PassConceptPlayerId, string>,
) {
  if (passConceptViewMode !== "quiz") return [];
  if (passConceptQuizMode === "identify") return passConceptPreview.routesPreview;
  if (showPassConceptAnswers) return passConceptPreview.routesPreview;

  return passConceptPreview.activePlayers.flatMap((playerId) => {
    const selectedRoute = passConceptAnswers[playerId];
    const player = passConceptPreview.formationPlayers.find((entry) => entry.id === playerId);
    if (!selectedRoute || !player) return [];

    const side: Side =
      passConceptPreview.boardKind === "2x2"
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
}

export function getPassConceptRouteResult(
  passConceptDefinition: PassConceptDefinition,
  passConceptAnswers: Record<PassConceptPlayerId, string>,
) {
  return Object.fromEntries(
    (["X", "H", "Y", "Z"] as PassConceptPlayerId[]).map((playerId) => [
      playerId,
      !passConceptDefinition.activePlayers.includes(playerId)
        ? true
        : passConceptAnswers[playerId].trim().toLowerCase() === (passConceptDefinition.routes[playerId] ?? "").toLowerCase(),
    ]),
  ) as Record<PassConceptPlayerId, boolean>;
}

export function getPassConceptScore(
  passConceptDefinition: PassConceptDefinition,
  passConceptResult: Record<PassConceptPlayerId, boolean>,
) {
  return passConceptDefinition.activePlayers.filter((playerId) => passConceptResult[playerId]).length;
}

export function getAvailablePassConceptNames(effectivePassConceptBoardKind: PassConceptBoardKind) {
  return effectivePassConceptBoardKind === "2x2"
    ? TWO_BY_TWO_CONCEPTS.map((concept) => concept.name)
    : THREE_BY_ONE_CONCEPTS.map((concept) => concept.name);
}

export function getPassConceptIdentifyResult(
  passConceptDefinition: PassConceptDefinition,
  passConceptNameAnswer: string,
  passConceptFrontsideNameAnswer: string,
  passConceptBacksideNameAnswer: string,
): PassConceptIdentifyResult {
  const frontsideNameResult =
    passConceptDefinition.boardKind === "2x2"
      ? passConceptFrontsideNameAnswer.trim().toLowerCase() === (passConceptDefinition.frontsideConceptName ?? "").toLowerCase()
      : true;
  const backsideNameResult =
    passConceptDefinition.boardKind === "2x2"
      ? passConceptBacksideNameAnswer.trim().toLowerCase() === (passConceptDefinition.backsideConceptName ?? "").toLowerCase()
      : true;
  const nameResult =
    passConceptDefinition.boardKind === "2x2"
      ? frontsideNameResult && backsideNameResult
      : passConceptNameAnswer.trim().toLowerCase() === passConceptDefinition.conceptName.toLowerCase();
  const identifyScore =
    passConceptDefinition.boardKind === "2x2"
      ? Number(frontsideNameResult) + Number(backsideNameResult)
      : Number(nameResult);
  const identifyQuestionCount = passConceptDefinition.boardKind === "2x2" ? 2 : 1;

  return {
    frontsideNameResult,
    backsideNameResult,
    nameResult,
    identifyScore,
    identifyQuestionCount,
  };
}
