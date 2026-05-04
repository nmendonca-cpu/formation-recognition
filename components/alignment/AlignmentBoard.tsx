"use client";

import React from "react";
import { Select, SelectContent, SelectDivider, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shuffle } from "lucide-react";

type FrontMode = "4-3" | "4-4";
type AlignmentViewMode = "study" | "quiz";

export function AlignmentBoard(props: any) {
  const {
    TrainingFieldComponent: TrainingField,
    TokenTrayComponent: TokenTray,
    displayFormation,
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
    nextCall,
    remainingDefenders,
    addDefender,
    lastScoreSummary,
    current,
    index,
    pool,
    formationSelectGroups,
    setIndex,
  } = props;

  return (
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
            <Select
              value={frontMode}
              onValueChange={(value: FrontMode) => {
                setFrontMode(value);
                setShowAlignmentCheck(false);
                setAttemptStartedAt(Date.now());
                setLastScoreSummary((prev) => {
                  const { alignment, ...rest } = prev;
                  return rest;
                });
              }}
            >
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
                      {lastScoreSummary.alignment.alreadyScored ? (
                        <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
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
  );
}
