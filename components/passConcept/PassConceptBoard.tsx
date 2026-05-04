"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Shuffle, XCircle } from "lucide-react";
import {
  PASS_CONCEPT_ROUTE_OPTIONS,
  THREE_BY_ONE_CONCEPTS,
  TWO_BY_TWO_CONCEPTS,
  type PassConceptFamilyFilter,
  type PassConceptQuizMode,
  type PassConceptViewMode,
} from "@/lib/passConcept/passConceptLogic";

export function PassConceptBoard(props: any) {
  const {
    passConceptViewMode,
    setPassConceptViewMode,
    setShowPassConceptFeedback,
    setShowPassConceptAnswers,
    passConceptQuizMode,
    setPassConceptQuizMode,
    passConceptDefinition,
    TrainingFieldComponent: TrainingField,
    passConceptPreview,
    passConceptQuizRoutePreview,
    passConceptFamilyFilter,
    setPassConceptFamilyFilter,
    effectivePassConceptBoardKind,
    selectedFrontsideConceptId,
    setSelectedFrontsideConceptId,
    selectedBacksideConceptId,
    setSelectedBacksideConceptId,
    selectedThreeByOneConceptId,
    setSelectedThreeByOneConceptId,
    nextCall,
    passConceptAnswers,
    setPassConceptAnswers,
    passConceptFrontsideNameAnswer,
    setPassConceptFrontsideNameAnswer,
    availablePassConceptNames,
    passConceptBacksideNameAnswer,
    setPassConceptBacksideNameAnswer,
    passConceptNameAnswer,
    setPassConceptNameAnswer,
    showPassConceptAnswers,
    showPassConceptFeedback,
    passConceptScore,
    lastScoreSummary,
    passConceptResult,
    passConceptIdentifyScore,
    passConceptIdentifyQuestionCount,
    passConceptFrontsideNameResult,
    passConceptBacksideNameResult,
    passConceptNameResult,
  } = props;

  return (
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
              {passConceptDefinition.cards.map((card: any) => (
                <div key={`${card.label}-${card.name}`} className="rounded-xl border bg-slate-50 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{card.name}</div>
                  {card.assignments.length ? (
                    <div className="mt-2 space-y-1 text-sm text-slate-700">
                      {card.assignments.map((assignment: any) => (
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
                passConceptDefinition.cards.map((card: any) => (
                  <div key={`quiz-${card.label}-${card.name}`} className="rounded-xl border bg-slate-50 p-3">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{card.name}</div>
                    <div className="mt-2 text-sm text-slate-700">
                      {card.assignments.length
                        ? `Assign the correct route to ${card.assignments.map((assignment: any) => assignment.player).join(", ")}.`
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
                passConceptDefinition.activePlayers.map((playerId: any) => (
                  <div key={playerId}>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{playerId} Route</div>
                    <Select
                      value={passConceptAnswers[playerId]}
                      onValueChange={(value) => setPassConceptAnswers((prev: any) => ({ ...prev, [playerId]: value }))}
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
                          {availablePassConceptNames.map((conceptName: string) => (
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
                          {availablePassConceptNames.map((conceptName: string) => (
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
                        {availablePassConceptNames.map((conceptName: string) => (
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
                    passConceptDefinition.activePlayers.map((playerId: any) => (
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
                          {lastScoreSummary.concept.alreadyScored ? (
                            <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                          ) : null}
                        </div>
                      ) : null}
                      <div className="space-y-2 text-sm">
                        {passConceptDefinition.activePlayers.map((playerId: any) => (
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
                          {lastScoreSummary.concept.alreadyScored ? (
                            <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                          ) : null}
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
  );
}
