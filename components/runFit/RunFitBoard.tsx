"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BLITZ_BASE_BOARD_OPTIONS,
  BLITZ_BOARD_STRUCTURE,
  type BlitzBaseBoardId,
} from "@/lib/blitz/blitzLogic";
import { LOS_Y } from "@/lib/formation/formationLogic";
import {
  RUN_FIT_PATHWAY_OPTIONS,
  getRunFitArrowStroke,
  getRunFitLineStrokeWidth,
  type FieldTag,
  type RunFitArrowColor,
  type RunFitEditorTool,
  type RunFitLineEnd,
  type RunFitLineStyle,
  type RunFitPathwayId,
} from "@/lib/runFit/runFitLogic";

export function RunFitBoard(props: any) {
  const {
    currentUser,
    TrainingFieldComponent: TrainingField,
    runFitTitle,
    showRunFitAdminTools,
    setShowRunFitAdminTools,
    runFitEditorTool,
    setRunFitEditorTool,
    runFitArrowLabel,
    setRunFitArrowLabel,
    runFitArrowColor,
    setRunFitArrowColor,
    runFitLineWeight,
    setRunFitLineWeight,
    runFitLineStyle,
    setRunFitLineStyle,
    runFitLineEnd,
    setRunFitLineEnd,
    finishRunFitArrow,
    runFitDraftPoints,
    setRunFitDraftPoints,
    runFitTagLabel,
    setRunFitTagLabel,
    runFitTagTone,
    setRunFitTagTone,
    selectedRunFitOverlay,
    selectedRunFitTag,
    updateSelectedRunFitOverlay,
    updateSelectedRunFitTag,
    duplicateSelectedRunFitObject,
    deleteSelectedRunFitObject,
    runFitPreview,
    runFitDisplayOverlays,
    runFitFieldTags,
    handleRunFitFieldClick,
    handleRunFitFieldDoubleClick,
    selectedRunFitOverlayId,
    selectedRunFitTagId,
    selectRunFitOverlay,
    selectRunFitTag,
    selectedRunFitBaseBoardId,
    loadRunFitBaseBoard,
    selectedRunFitBoardId,
    loadRunFitBoard,
    runFitSavedBoards,
    setRunFitTitle,
    selectedRunFitPathwayDefenderId,
    setSelectedRunFitPathwayDefenderId,
    selectedRunFitPathwayId,
    setSelectedRunFitPathwayId,
    addRunFitPathway,
    runFitSavedPathwayName,
    setRunFitSavedPathwayName,
    saveRunFitDraftAsPathway,
    selectedRunFitSavedPathwayId,
    setSelectedRunFitSavedPathwayId,
    runFitSavedPathways,
    stampSavedRunFitPathway,
    deleteSavedRunFitPathway,
    nudgeSelectedRunFitObject,
    sendSelectedRunFitLineBackward,
    bringSelectedRunFitLineForward,
    saveRunFitBoard,
    resetRunFitSample,
    setRunFitRouteOverlays,
    setRunFitFieldTags,
    runFitRouteOverlays,
    runFitSaveNotice,
  } = props;

  return currentUser?.isAdmin ? (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="min-w-0 space-y-4">
        <div className="rounded-2xl border bg-white p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Run Fit</div>
            <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{runFitTitle}</div>
            <div className="mt-1 text-sm text-slate-600">
              Build run-fit answer boards from the same formation shells we use in Blitz Mode.
            </div>
          </div>
          {showRunFitAdminTools ? (
            <div className="mb-3 rounded-xl border bg-slate-50 p-2.5">
              <div className="mb-2 grid gap-2 xl:grid-cols-[150px_1fr]">
                <div className="min-w-0">
                  <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Tool</div>
                  <Select value={runFitEditorTool} onValueChange={(value: RunFitEditorTool) => setRunFitEditorTool(value)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="select">Select / Edit</SelectItem>
                      <SelectItem value="line">Polyline</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {runFitEditorTool === "line" ? (
                  <div className="grid min-w-0 gap-2 md:grid-cols-[64px_repeat(4,minmax(86px,1fr))_auto]">
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Label</div>
                      <Input className="h-9 px-2 text-sm" value={runFitArrowLabel} onChange={(e) => setRunFitArrowLabel(e.target.value)} />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Color</div>
                      <Select value={runFitArrowColor} onValueChange={(value: RunFitArrowColor) => setRunFitArrowColor(value)}>
                        <SelectTrigger className="h-9 text-sm">
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
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Weight</div>
                      <Select value={runFitLineWeight} onValueChange={setRunFitLineWeight}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thin">Thin</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="thick">Thick</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Style</div>
                      <Select value={runFitLineStyle} onValueChange={(value: RunFitLineStyle) => setRunFitLineStyle(value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="min-w-0">
                      <div className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">End</div>
                      <Select value={runFitLineEnd} onValueChange={(value: RunFitLineEnd) => setRunFitLineEnd(value)}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="square">Square</SelectItem>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="arrow">Arrow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-2">
                      <Button className="h-9 rounded-xl px-3 text-sm" onClick={finishRunFitArrow} disabled={runFitDraftPoints.length < 2}>Finish</Button>
                      <Button variant="outline" className="h-9 rounded-xl px-3 text-sm" onClick={() => setRunFitDraftPoints([])}>Cancel</Button>
                    </div>
                  </div>
                ) : runFitEditorTool === "tag" ? (
                  <div className="grid gap-2 md:grid-cols-[1fr_150px]">
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Tag Label</div>
                      <Input value={runFitTagLabel} onChange={(e) => setRunFitTagLabel(e.target.value)} />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Tone</div>
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
                ) : (
                  <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Selected Object</div>
                      <Input
                        value={selectedRunFitOverlay?.label ?? selectedRunFitTag?.label ?? ""}
                        placeholder={selectedRunFitOverlay || selectedRunFitTag ? "Label" : "Click a line or tag to edit it"}
                        disabled={!selectedRunFitOverlay && !selectedRunFitTag}
                        onChange={(e) => {
                          if (selectedRunFitOverlay) updateSelectedRunFitOverlay({
                            label: e.target.value,
                            labelX: e.target.value ? selectedRunFitOverlay.path[selectedRunFitOverlay.path.length - 1]?.x : undefined,
                            labelY: e.target.value ? (selectedRunFitOverlay.path[selectedRunFitOverlay.path.length - 1]?.y ?? LOS_Y) - 3 : undefined,
                          });
                          if (selectedRunFitTag) updateSelectedRunFitTag({ label: e.target.value });
                        }}
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={duplicateSelectedRunFitObject} disabled={!selectedRunFitOverlay && !selectedRunFitTag}>Duplicate</Button>
                      <Button variant="outline" className="rounded-xl border-red-300 text-red-700" onClick={deleteSelectedRunFitObject} disabled={!selectedRunFitOverlay && !selectedRunFitTag}>Delete</Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-[11px] leading-4 text-slate-500">
                {runFitEditorTool === "select"
                  ? "Select a finished line/tag, then edit it here. Empty grass clears selection."
                  : runFitEditorTool === "line"
                    ? `Draft points: ${runFitDraftPoints.length}. Click for angles, double-click or Finish to complete.`
                    : "Click the board to place the tag."}
              </div>
            </div>
          ) : null}
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
            selectedRouteOverlayId={selectedRunFitOverlayId}
            selectedFieldTagId={selectedRunFitTagId}
            onRouteOverlayClick={showRunFitAdminTools ? selectRunFitOverlay : undefined}
            onFieldTagClick={showRunFitAdminTools ? selectRunFitTag : undefined}
          />
        </div>
      </div>
      <div className="max-h-[calc(100vh-220px)] min-w-0 space-y-3 overflow-y-auto overflow-x-hidden rounded-2xl border bg-white p-4 pr-3 text-sm text-slate-600">
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
              {runFitSavedBoards.map((board: any) => (
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
          onClick={() => setShowRunFitAdminTools((prev: boolean) => !prev)}
        >
          {showRunFitAdminTools ? "Hide Admin Tools" : "Show Admin Tools"}
        </Button>
        {showRunFitAdminTools ? (
          <>
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Board Title</div>
              <Input value={runFitTitle} onChange={(e) => setRunFitTitle(e.target.value)} />
            </div>
            <div className="hidden rounded-xl border bg-slate-50 p-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tool</div>
              <Select value={runFitEditorTool} onValueChange={(value: RunFitEditorTool) => setRunFitEditorTool(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">Select / Edit</SelectItem>
                  <SelectItem value="line">Polyline</SelectItem>
                  <SelectItem value="tag">Tag</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-xs text-slate-500">
                {runFitEditorTool === "select"
                  ? "Click a finished line or tag to select it. Click empty grass to clear the selection."
                  : runFitEditorTool === "line"
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
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Defender</div>
                  <Select value={selectedRunFitPathwayDefenderId} onValueChange={setSelectedRunFitPathwayDefenderId}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {runFitPreview.defensePlayers.map((defender: any) => (
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
              <Button variant="outline" className="w-full rounded-xl border-red-700 text-red-900" onClick={saveRunFitDraftAsPathway} disabled={runFitDraftPoints.length < 2 && !selectedRunFitOverlay}>
                Save Draft / Selected Line as Pathway
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
                    {runFitSavedPathways.map((pathway: any) => (
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
                    {runFitPreview.defensePlayers.map((defender: any) => (
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
            {false && runFitEditorTool === "line" ? (
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
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Weight</div>
                    <Select value={runFitLineWeight} onValueChange={setRunFitLineWeight}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thin">Thin</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="thick">Thick</SelectItem>
                        <SelectItem value="heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Style</div>
                    <Select value={runFitLineStyle} onValueChange={(value: RunFitLineStyle) => setRunFitLineStyle(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
            ) : runFitEditorTool === "tag" ? (
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
            ) : (
              <div className="space-y-3 rounded-xl border bg-slate-50 p-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Selected Object</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">
                    {selectedRunFitOverlay ? `Line: ${selectedRunFitOverlay.label || "Unlabeled"}` : selectedRunFitTag ? `Tag: ${selectedRunFitTag.label}` : "Nothing selected"}
                  </div>
                </div>
                {selectedRunFitOverlay ? (
                  <>
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Line Label</div>
                      <Input value={selectedRunFitOverlay.label} onChange={(e) => updateSelectedRunFitOverlay({
                        label: e.target.value,
                        labelX: e.target.value ? selectedRunFitOverlay.path[selectedRunFitOverlay.path.length - 1]?.x : undefined,
                        labelY: e.target.value ? (selectedRunFitOverlay.path[selectedRunFitOverlay.path.length - 1]?.y ?? LOS_Y) - 3 : undefined,
                      })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Color</div>
                        <Select
                          value={(Object.entries({
                            gold: getRunFitArrowStroke("gold"),
                            cyan: getRunFitArrowStroke("cyan"),
                            sky: getRunFitArrowStroke("sky"),
                            red: getRunFitArrowStroke("red"),
                            white: getRunFitArrowStroke("white"),
                          }).find(([, stroke]) => stroke === selectedRunFitOverlay.color)?.[0] as RunFitArrowColor | undefined) ?? "gold"}
                          onValueChange={(value: RunFitArrowColor) => updateSelectedRunFitOverlay({ color: getRunFitArrowStroke(value) })}
                        >
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
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">End</div>
                        <Select value={selectedRunFitOverlay.endCap ?? "circle"} onValueChange={(value: RunFitLineEnd) => updateSelectedRunFitOverlay({ endCap: value })}>
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
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={
                          (selectedRunFitOverlay.strokeWidth ?? 0.7) <= 0.56 ? "thin"
                          : (selectedRunFitOverlay.strokeWidth ?? 0.7) >= 1.15 ? "heavy"
                          : (selectedRunFitOverlay.strokeWidth ?? 0.7) >= 0.9 ? "thick"
                          : "normal"
                        }
                        onValueChange={(value) => updateSelectedRunFitOverlay({ strokeWidth: getRunFitLineStrokeWidth(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="thin">Thin</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="thick">Thick</SelectItem>
                          <SelectItem value="heavy">Heavy</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={selectedRunFitOverlay.dashed ? "dashed" : "solid"} onValueChange={(value: RunFitLineStyle) => updateSelectedRunFitOverlay({ dashed: value === "dashed" })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : selectedRunFitTag ? (
                  <>
                    <div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Tag Label</div>
                      <Input value={selectedRunFitTag.label} onChange={(e) => updateSelectedRunFitTag({ label: e.target.value })} />
                    </div>
                    <Select value={selectedRunFitTag.tone ?? "default"} onValueChange={(value: FieldTag["tone"]) => updateSelectedRunFitTag({ tone: value })}>
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
                  </>
                ) : null}
                {(selectedRunFitOverlay || selectedRunFitTag) ? (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => nudgeSelectedRunFitObject(0, -1)}>Up</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => nudgeSelectedRunFitObject(-1, 0)}>Left</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => nudgeSelectedRunFitObject(1, 0)}>Right</Button>
                      <Button variant="outline" className="rounded-xl" onClick={() => nudgeSelectedRunFitObject(0, 1)}>Down</Button>
                      <Button variant="outline" className="rounded-xl" onClick={duplicateSelectedRunFitObject}>Duplicate</Button>
                      <Button variant="outline" className="rounded-xl border-red-300 text-red-700" onClick={deleteSelectedRunFitObject}>Delete</Button>
                    </div>
                    {selectedRunFitOverlay ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={sendSelectedRunFitLineBackward}>Send Back</Button>
                        <Button variant="outline" className="rounded-xl" onClick={bringSelectedRunFitLineForward}>Bring Front</Button>
                      </div>
                    ) : null}
                  </>
                ) : null}
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
                onClick={() => setRunFitRouteOverlays((prev: any[]) => prev.slice(0, -1))}
                disabled={!runFitRouteOverlays.length}
              >
                Undo Line
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setRunFitFieldTags((prev: any[]) => prev.slice(0, -1))}
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
  );
}
