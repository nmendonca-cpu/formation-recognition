"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectDivider, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Shuffle, XCircle } from "lucide-react";
import { FIELD_LABELS, type Side } from "@/lib/formation/formationLogic";
import {
  FILM_FORMATION_KEY_TAG_GROUPS,
  FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS,
  FILM_GAP_PULLER_COUNT_OPTIONS,
  FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS,
  FILM_MAN_CONCEPT_OPTIONS,
  FILM_RUN_SCHEME_OPTIONS,
  deriveFilmClipBucket,
  formatVideoTimestamp,
  type FilmGapOnePullerConcept,
  type FilmGapPullerCount,
  type FilmGapTwoPullerConcept,
  type FilmManConcept,
  type FilmPassType,
  type FilmRunScheme,
  type FilmSubmode,
  type FilmViewMode,
  type FilmZoneType,
} from "@/lib/film/filmLogic";

export function FilmPlayer(props: any) {
  const {
    filmSubmode,
    setFilmSubmode,
    filmViewMode,
    setFilmViewMode,
    selectedFilmClip,
    filmQuizStarted,
    filmQuizFinished,
    filmQuizVideoRef,
    filmPlaybackNonce,
    filmQuizPlaybackUrl,
    setFilmQuizFinished,
    showFilmQuizFeedback,
    filmStudyVideoRef,
    setFilmStudyDuration,
    setFilmStudyCurrentTime,
    currentUser,
    showFilmAdminTools,
    setShowFilmAdminTools,
    filmAdminPanelMode,
    setFilmAdminPanelMode,
    filmDraft,
    setFilmDraft,
    filmTeamTagSelectOptions,
    filmStudyCurrentTime,
    filmUploadResetKey,
    addFilmClip,
    filmSaveNotice,
    filmEditDraft,
    setFilmEditDraft,
    saveFilmMetadata,
    filmFormationFilter,
    setFilmFormationFilter,
    safeFilmFormationFilter,
    filmFormationKeyOptions,
    filmTeamFilter,
    setFilmTeamFilter,
    safeFilmTeamFilter,
    filmTeamTagOptions,
    filmClipGroups,
    setSelectedFilmClipId,
    setFilmStarted,
    setFilmPlaybackNonce,
    filmStudyDuration,
    filmQuizAnswers,
    setFilmQuizAnswers,
    showFilmQuizRunFields,
    showFilmQuizPassFields,
    showFilmQuizZoneFields,
    showFilmQuizGapFields,
    startFilmQuizClip,
    filmQuizPlaysUsed,
    filmQuizTotalPlaysAllowed,
    filmQuizReplaysRemaining,
    submitFilmQuiz,
    showFilmQuizAnswers,
    setShowFilmQuizAnswers,
    filmQuizNeedsPassType,
    filmQuizNeedsRunScheme,
    filmQuizNeedsZoneType,
    filmQuizNeedsGapDetails,
    selectedFilmGapConcept,
    filmQuizScore,
    filmQuizQuestionCount,
    lastScoreSummary,
    filmQuizResult,
    filmQuizIsPass,
    nextFilmQuizClip,
    nextCall,
  } = props;

  return (
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
                  {lastScoreSummary.film.alreadyScored ? (
                    <div className="mt-2 font-semibold text-amber-800">No points awarded because this rep was already scored.</div>
                  ) : null}
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
  );
}
