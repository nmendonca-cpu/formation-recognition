import {
  ALIGNMENT_CALLS,
  PRO_CALLS,
  WING_T_CALLS,
  type Side,
} from "@/lib/formation/formationLogic";

export type FilmViewMode = "study" | "quiz";
export type FilmSubmode = "read_key" | "formation_key" | "team_key";

export type FilmQuizAnswers = {
  runPass: string;
  passType: string;
  direction: string;
  runScheme: string;
  zoneType: string;
  gapPullerCount: string;
  pullerConcept: string;
};

export type FilmSaveStatus = {
  tone: "success" | "error" | "warning";
  message: string;
};

export type FilmAdminPanelMode = "upload" | "edit";

export type FilmSourceType = "Personal" | "Drive" | "Hudl" | "Other";
export type FilmRunScheme = "gap" | "zone" | "man" | "";
export type FilmZoneType = "normal" | "split" | "jet" | "";
export type FilmPassType = "normal" | "screen" | "play_action" | "";
export type FilmGapPullerCount = "1" | "2" | "";
export type FilmGapOnePullerConcept = "Power" | "Dart (Tackle Power)" | "G Lead" | "Trap" | "Center Pull" | "Pin N Pull" | "";
export type FilmGapTwoPullerConcept = "GT" | "GY/GH" | "CG/CT" | "Buck Sweep" | "";
export type FilmManConcept = "Duo" | "Lead" | "";

export type FilmClip = {
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

export type FilmClipDraft = {
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

export type FilmClipEditDraft = Omit<FilmClipDraft, "remoteStudyUrl" | "remoteQuizUrl" | "studyFile" | "quizFile">;

export type FilmClipGroup = {
  runPass: "run" | "pass";
  label: string;
  sections: {
    section: string;
    buckets: {
      bucket: string;
      options: {
        value: string;
        label: string;
      }[];
    }[];
  }[];
};

export const FILM_CLIPS_STORAGE_KEY = "formation-recognition-film-clips";
export const FILM_BUCKET = "film-clips";
export const DEFAULT_FILM_CLIPS: FilmClip[] = [];
export const FILM_RUN_SCHEME_OPTIONS: Exclude<FilmRunScheme, "">[] = ["gap", "zone", "man"];
export const FILM_ZONE_TYPE_OPTIONS: Exclude<FilmZoneType, "">[] = ["normal", "split", "jet"];
export const FILM_PASS_TYPE_OPTIONS: Exclude<FilmPassType, "">[] = ["normal", "screen", "play_action"];
export const FILM_GAP_PULLER_COUNT_OPTIONS: Exclude<FilmGapPullerCount, "">[] = ["1", "2"];
export const FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS: Exclude<FilmGapOnePullerConcept, "">[] = ["Power", "Dart (Tackle Power)", "G Lead", "Trap", "Center Pull", "Pin N Pull"];
export const FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS: Exclude<FilmGapTwoPullerConcept, "">[] = ["GT", "GY/GH", "CG/CT", "Buck Sweep"];
export const FILM_MAN_CONCEPT_OPTIONS: Exclude<FilmManConcept, "">[] = ["Duo", "Lead"];

export const DEFAULT_FILM_QUIZ_ANSWERS: FilmQuizAnswers = {
  runPass: "",
  passType: "",
  direction: "",
  runScheme: "",
  zoneType: "",
  gapPullerCount: "",
  pullerConcept: "",
};

export const DEFAULT_FILM_DRAFT: FilmClipDraft = {
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
};

export const RESET_FILM_DRAFT_AFTER_SAVE: FilmClipDraft = {
  ...DEFAULT_FILM_DRAFT,
  sourceType: "Hudl",
};

export const DEFAULT_FILM_EDIT_DRAFT: FilmClipEditDraft = {
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
};

export function normalizeFilmFormationFamily(value: string) {
  return value
    .replace(/\b(left|right|king|queen)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const FILM_FORMATION_KEY_TAG_GROUPS = [
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

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function normalizeStrength(value: string) {
  const v = normalize(value);
  if (v === "l") return "left";
  if (v === "r") return "right";
  return v;
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function slugifyFilePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "clip";
}

export function formatFilmDirection(direction: Side) {
  return direction === "left" ? "Left" : "Right";
}

export function parseTrimSeconds(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}

export function formatVideoTimestamp(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = Math.floor(safeSeconds % 60);
  const hundredths = Math.floor((safeSeconds - Math.floor(safeSeconds)) * 100);
  return `${minutes}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

export function inferLegacyFilmRunMetadata(
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

export function deriveFilmClipBucket(metadata: {
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

export function loadStoredFilmClips() {
  try {
    const raw = window.localStorage.getItem(FILM_CLIPS_STORAGE_KEY);
    if (!raw) return [];
    const saved = JSON.parse(raw) as FilmClip[];
    if (!Array.isArray(saved)) return [];
    return saved.filter(
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
  } catch {
    return [];
  }
}

export function persistStoredFilmClips(filmClips: FilmClip[]) {
  try {
    const remoteClips = filmClips.filter((clip) => clip.kind === "remote");
    window.localStorage.setItem(FILM_CLIPS_STORAGE_KEY, JSON.stringify(remoteClips));
  } catch {}
}

type FilmClipRow = {
  id: string;
  title?: string | null;
  clip_bucket?: string | null;
  formation_key?: string | null;
  team_tag?: string | null;
  source_type?: FilmSourceType | string | null;
  source_label?: FilmSourceType | string | null;
  run_pass?: "run" | "pass" | string | null;
  direction?: Side | string | null;
  pass_type?: FilmPassType | string | null;
  run_scheme?: FilmRunScheme | string | null;
  zone_type?: FilmZoneType | "split_zone" | string | null;
  gap_puller_count?: number | string | null;
  gap_one_puller_concept?: FilmGapOnePullerConcept | string | null;
  gap_two_puller_concept?: FilmGapTwoPullerConcept | string | null;
  man_concept?: FilmManConcept | string | null;
  study_url?: string | null;
  quiz_url?: string | null;
  quiz_start_seconds?: number | null;
  quiz_end_seconds?: number | null;
  study_storage_path?: string | null;
  quiz_storage_path?: string | null;
  study_file_name?: string | null;
  quiz_file_name?: string | null;
  study_file_size?: number | null;
  quiz_file_size?: number | null;
};

export async function loadFilmClipsFromSupabase(supabase: any) {
  const baseSelect = "id, title, clip_bucket, formation_key, team_tag, source_type, source_label, run_pass, direction, pass_type, run_scheme, gap_puller_count, gap_one_puller_concept, gap_two_puller_concept, man_concept, study_url, quiz_url, quiz_start_seconds, quiz_end_seconds, study_storage_path, quiz_storage_path, study_file_name, quiz_file_name, study_file_size, quiz_file_size";
  const primaryResult = await supabase
    .from("film_clips")
    .select(`${baseSelect}, zone_type`)
    .eq("submode", "read_key")
    .order("created_at", { ascending: false });
  let data = primaryResult.data as FilmClipRow[] | null;
  let error = primaryResult.error;

  if (error?.code === "PGRST204" || error?.message?.includes("zone_type") || error?.message?.includes("formation_key") || error?.message?.includes("team_tag")) {
    const fallbackResult = await supabase
      .from("film_clips")
      .select("id, title, clip_bucket, source_type, source_label, run_pass, direction, pass_type, run_scheme, gap_puller_count, gap_one_puller_concept, gap_two_puller_concept, man_concept, study_url, quiz_url, quiz_start_seconds, quiz_end_seconds, study_storage_path, quiz_storage_path, study_file_name, quiz_file_name")
      .eq("submode", "read_key")
      .order("created_at", { ascending: false });
    data = fallbackResult.data as FilmClipRow[] | null;
    error = fallbackResult.error;
  }

  if (error) {
    throw error;
  }

  return mapFilmClipRows(data ?? []);
}

export function mapFilmClipRows(rows: FilmClipRow[]) {
  return rows.flatMap((row): FilmClip[] => {
    if (!row.study_url || (row.run_pass !== "run" && row.run_pass !== "pass")) return [];
    if (row.direction !== "left" && row.direction !== "right") return [];
    const normalizedPassType: FilmPassType =
      row.run_pass === "pass"
        ? FILM_PASS_TYPE_OPTIONS.includes(row.pass_type as Exclude<FilmPassType, "">) ? row.pass_type as Exclude<FilmPassType, ""> : "normal"
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
    const normalizedRunScheme = FILM_RUN_SCHEME_OPTIONS.includes(row.run_scheme as Exclude<FilmRunScheme, "">) ? row.run_scheme as Exclude<FilmRunScheme, ""> : "";
    const normalizedZoneType =
      row.zone_type === "split_zone"
        ? "split"
        : FILM_ZONE_TYPE_OPTIONS.includes(row.zone_type as Exclude<FilmZoneType, "">)
          ? row.zone_type as Exclude<FilmZoneType, "">
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
        sourceType: (row.source_type || row.source_label || "Other") as FilmSourceType,
        runPass: row.run_pass,
        direction: row.run_pass === "pass" ? "right" : row.direction,
        passType: normalizedPassType,
        runScheme: inferredRunMetadata.runScheme,
        zoneType: inferredRunMetadata.zoneType,
        gapPullerCount: FILM_GAP_PULLER_COUNT_OPTIONS.includes(String(row.gap_puller_count) as Exclude<FilmGapPullerCount, "">)
          ? (String(row.gap_puller_count) as Exclude<FilmGapPullerCount, "">)
          : "",
        gapOnePullerConcept: FILM_GAP_ONE_PULLER_CONCEPT_OPTIONS.includes(row.gap_one_puller_concept as Exclude<FilmGapOnePullerConcept, "">)
          ? row.gap_one_puller_concept as Exclude<FilmGapOnePullerConcept, "">
          : "",
        gapTwoPullerConcept: FILM_GAP_TWO_PULLER_CONCEPT_OPTIONS.includes(row.gap_two_puller_concept as Exclude<FilmGapTwoPullerConcept, "">)
          ? row.gap_two_puller_concept as Exclude<FilmGapTwoPullerConcept, "">
          : "",
        manConcept: FILM_MAN_CONCEPT_OPTIONS.includes(row.man_concept as Exclude<FilmManConcept, "">) ? row.man_concept as Exclude<FilmManConcept, ""> : "",
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
}

export function getActiveFilmClips(
  filmClips: FilmClip[],
  filmSubmode: FilmSubmode,
  filmFormationFilter: string,
  filmTeamFilter: string,
) {
  if (filmSubmode === "formation_key") {
    if (filmFormationFilter === "all") return filmClips;
    return filmClips.filter((clip) => normalizeFilmFormationFamily(clip.formationKey) === filmFormationFilter);
  }
  if (filmSubmode === "team_key") {
    if (filmTeamFilter === "all") return filmClips;
    return filmClips.filter((clip) => clip.teamTag === filmTeamFilter);
  }
  return filmClips;
}

export function getFilmFormationKeyOptions(filmClips: FilmClip[]) {
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
}

export function getFilmTeamTagOptions(filmClips: FilmClip[]) {
  return filmClips
    .map((clip) => clip.teamTag.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .filter((teamTag, index, arr) => arr.indexOf(teamTag) === index);
}

export function getFilmTeamTagSelectOptions(
  currentTeamCode: string | undefined,
  filmDraftTeamTag: string,
  filmEditDraftTeamTag: string,
  filmTeamTagOptions: string[],
) {
  const optionSet = new Set<string>();

  if (currentTeamCode?.trim()) {
    optionSet.add(currentTeamCode.trim());
  }

  filmTeamTagOptions.forEach((teamTag) => optionSet.add(teamTag));

  if (filmDraftTeamTag.trim()) {
    optionSet.add(filmDraftTeamTag.trim());
  }

  if (filmEditDraftTeamTag.trim()) {
    optionSet.add(filmEditDraftTeamTag.trim());
  }

  return Array.from(optionSet).sort((a, b) => a.localeCompare(b));
}

export function getSafeFilmFormationFilter(filmFormationFilter: string, filmFormationKeyOptions: { label: string; options: string[] }[]) {
  return filmFormationFilter === "all" || filmFormationKeyOptions.some((group) => group.options.includes(filmFormationFilter))
    ? filmFormationFilter
    : "all";
}

export function getSafeFilmTeamFilter(filmTeamFilter: string, filmTeamTagOptions: string[]) {
  return filmTeamFilter === "all" || filmTeamTagOptions.includes(filmTeamFilter)
    ? filmTeamFilter
    : "all";
}

export function buildFilmClipGroups(activeFilmClips: FilmClip[]): FilmClipGroup[] {
  type ClipOption = { value: string; label: string };

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
      const sections = Array.from(grouped.get(runPass)?.entries() ?? [])
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
}

export function getSelectedFilmClip(activeFilmClips: FilmClip[], selectedFilmClipId: string) {
  return activeFilmClips.find((clip) => clip.id === selectedFilmClipId) ?? activeFilmClips[0] ?? null;
}

export function getFilmEditDraftFromClip(selectedFilmClip: FilmClip): FilmClipEditDraft {
  return {
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
  };
}

export function getFilmDuplicateCandidate(filmClips: FilmClip[], draft: FilmClipDraft) {
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
}

export function buildFilmClipFromDraft(params: {
  id: string;
  title: string;
  clipBucket: string;
  draft: FilmClipDraft | FilmClipEditDraft;
  studyUrl: string;
  quizUrl: string | null;
  quizStartSeconds: number | null;
  quizEndSeconds: number | null;
  studyStoragePath: string | null;
  quizStoragePath: string | null;
  kind: FilmClip["kind"];
  studyFileName?: string;
  quizFileName?: string;
  studyFileSize?: number | null;
  quizFileSize?: number | null;
  existingClip?: FilmClip;
}): FilmClip {
  const { draft } = params;

  return {
    ...(params.existingClip ?? {}),
    id: params.id,
    title: params.title,
    clipBucket: params.clipBucket,
    formationKey: normalizeFilmFormationFamily(draft.formationKey),
    teamTag: draft.teamTag.trim(),
    sourceType: draft.sourceType,
    runPass: draft.runPass,
    direction: draft.runPass === "pass" ? "right" : draft.direction,
    passType: draft.runPass === "pass" ? draft.passType : "",
    runScheme: draft.runPass === "run" ? draft.runScheme : "",
    zoneType: draft.runPass === "run" && draft.runScheme === "zone" ? draft.zoneType : "",
    gapPullerCount: draft.runPass === "run" && draft.runScheme === "gap" ? draft.gapPullerCount : "",
    gapOnePullerConcept:
      draft.runPass === "run" && draft.runScheme === "gap" && draft.gapPullerCount === "1"
        ? draft.gapOnePullerConcept
        : "",
    gapTwoPullerConcept:
      draft.runPass === "run" && draft.runScheme === "gap" && draft.gapPullerCount === "2"
        ? draft.gapTwoPullerConcept
        : "",
    manConcept: draft.runPass === "run" && draft.runScheme === "man" ? draft.manConcept : "",
    studyUrl: params.studyUrl,
    quizUrl: params.quizUrl,
    quizStartSeconds: params.quizStartSeconds,
    quizEndSeconds: params.quizEndSeconds,
    studyStoragePath: params.studyStoragePath,
    quizStoragePath: params.quizStoragePath,
    kind: params.kind,
    studyFileName: params.studyFileName,
    quizFileName: params.quizFileName,
    studyFileSize: params.studyFileSize,
    quizFileSize: params.quizFileSize,
  };
}

export function buildFilmClipInsertPayload(nextClip: FilmClip, currentUserId: string) {
  return {
    id: nextClip.id,
    title: nextClip.title,
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
    created_by: currentUserId,
  };
}

export function buildFilmClipFallbackInsertPayload(nextClip: FilmClip, currentUserId: string) {
  const {
    formation_key: _formationKey,
    team_tag: _teamTag,
    study_file_size: _studyFileSize,
    quiz_file_size: _quizFileSize,
    ...fallbackPayload
  } = buildFilmClipInsertPayload(nextClip, currentUserId);
  return fallbackPayload;
}

export function buildFilmClipUpdatePayload(nextClip: FilmClip) {
  return {
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
}

export function buildFilmClipFallbackUpdatePayload(nextClip: FilmClip) {
  const {
    zone_type: _zoneType,
    formation_key: _formationKey,
    team_tag: _teamTag,
    ...fallbackPayload
  } = buildFilmClipUpdatePayload(nextClip);
  return fallbackPayload;
}

export function getFilmQuizState(selectedFilmClip: FilmClip | null, filmQuizAnswers: FilmQuizAnswers, filmQuizPlaysUsed: number) {
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

  return {
    filmQuizIsPass,
    filmQuizNeedsPassType,
    selectedFilmGapConcept,
    filmQuizNeedsRunScheme,
    filmQuizNeedsZoneType,
    filmQuizNeedsGapDetails,
    filmQuizResult,
    filmQuizQuestionCount,
    filmQuizScore,
    filmQuizIsPerfect,
    filmQuizAllowedReplays,
    filmQuizTotalPlaysAllowed,
    filmQuizReplaysRemaining,
    filmQuizPlaybackUrl,
    showFilmQuizRunFields,
    showFilmQuizPassFields,
    showFilmQuizZoneFields,
    showFilmQuizGapFields,
  };
}
