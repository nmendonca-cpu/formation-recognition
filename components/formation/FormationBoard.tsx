"use client";

import React from "react";
import { AlignmentBoard } from "@/components/alignment/AlignmentBoard";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectDivider, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Shuffle, XCircle } from "lucide-react";
import { FIELD_LABELS, baseLine, type Side } from "@/lib/formation/formationLogic";

type FrontMode = "4-3" | "4-4";
type AlignmentViewMode = "study" | "quiz";
type OffenseBuildViewMode = "study" | "quiz";
type FormationTrainerViewMode = "study" | "quiz";

export function FormationBoard(props: any) {
  const {
    mode,
    formationTrainerViewMode,
    setFormationTrainerViewMode,
    setShowQuizFeedback,
    setShowQuizAnswers,
    setQuizReadyForNext,
    TrainingFieldComponent: TrainingField,
    TokenTrayComponent: TokenTray,
    displayFormation,
    getQuizFormationFamily,
    nextCall,
    current,
    index,
    pool,
    formationSelectGroups,
    setIndex,
    quizAnswers,
    setQuizAnswers,
    showQuizFeedback,
    quizScore,
    quizReadyForNext,
    submitQuiz,
    markAttemptRevealed,
    showQuizAnswers,
    correctQuizAnswers,
    lastScoreSummary,
    quizResult,
    alignmentViewMode,
    setAlignmentViewMode,
    setShowAlignmentCheck,
    frontMode,
    setFrontMode,
    setAttemptStartedAt,
    setLastScoreSummary,
    setEnhancedLandmarks,
    alignmentStudyPlayers,
    alignmentPlayers,
    alignmentLandmarks,
    enhancedLandmarks,
    showAlignmentCheck,
    alignmentCheck,
    moveDefender,
    remainingDefenders,
    addDefender,
    currentUser,
    moveEditorPlayer,
    editorDraft,
    setEditorDraft,
    saveEditorChanges,
    resetEditorChanges,
    offenseBuildViewMode,
    setOffenseBuildViewMode,
    setShowOffenseCheck,
    offenseBuildPlayers,
    offenseLandmarks,
    showOffenseCheck,
    moveOffense,
    offenseCheck,
    remainingOffense,
    addOffense,
  } = props;

  return mode === "study" ? (
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
                              {lastScoreSummary.quiz.alreadyScored ? (
                                <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
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
                          {lastScoreSummary.quiz.alreadyScored ? (
                            <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
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
              <AlignmentBoard {...props} />
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
                                {lastScoreSummary.offense_build.alreadyScored ? (
                                  <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                                ) : null}
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
            );
}
