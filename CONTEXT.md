# Formation Recognition App Context

Start every new AI/code session with: **Read `CONTEXT.md` before starting.**

This file is the handoff map for the Formation Recognition app. Keep it concise and update it after meaningful feature/rule changes.

## App Summary

Formation Recognition is a Next.js football coaching/training app for high school players. It teaches offensive formation recognition, defensive alignment, film read keys, pass concepts, and blitz chalkboard rules.

The app uses React/Next.js with Supabase auth, storage, and database persistence. Users can create accounts, log in/out, track scores, track total time on app, and view leaderboards. Admin users get extra editing/upload tools.

Main sections:
- `Offense`
- `Defense`
- `Leaderboard`
- `Account`
- Admin-only tools inside specific modes

Main modes:
- `Formation Trainer`: study/quiz offensive formations and personnel.
- `Alignment Mode`: study/quiz defensive alignments vs formations in `4-3` and `4-4`.
- `Film Mode`: uploaded read-key clips. Study mode shows full clips; quiz mode shows trimmed clips and asks run/pass/scheme/direction/details.
- `Pass Concept Mode`: visually teaches route concepts and quizzes route assignments or concept names.
- `Blitz Mode`: chalkboard mode for premade blitz pathways and coverage responsibilities.
- `Run Fit Mode`: currently being reworked around manual drawing tools and premade fit pathways.

## File Map

- `app/page.tsx`: Top-level app shell for section/mode switching, account/admin gates, shared scoring, and wiring extracted boards together.
- `app/login/page.tsx`: Login page.
- `app/signup/page.tsx`: Signup page.
- `components/alignment/AlignmentBoard.tsx`: Alignment Mode UI for study/quiz defensive landmarks and defender placement.
- `components/blitz/BlitzBoard.tsx`: Blitz Mode UI for board selection, admin tools, saved boards, and pathway controls.
- `components/film/FilmPlayer.tsx`: Film Mode UI for study/quiz clips, metadata editing/upload tools, and filtered clip work.
- `components/formation/FormationBoard.tsx`: Formation Trainer UI for study/quiz/offensive formation recognition and editing.
- `components/passConcept/PassConceptBoard.tsx`: Pass Concept Mode UI for study/quiz route boards and concept answers.
- `components/runFit/RunFitBoard.tsx`: Run Fit Mode UI for manual drawing tools, premade fit pathways, and admin fit-board controls.
- `components/ui/*`: Shared UI primitives like `Button`, `Card`, `Input`, `Select`.
- `lib/alignment/alignmentLogic.ts`: Defensive landmark generation, `4-3`/`4-4` alignment rules, and alignment validation helpers.
- `lib/blitz/blitzLogic.ts`: Blitz call families, auto-checks, coverage assignments, DL slants, and pathway calculations.
- `lib/blitz/blitzRenderer.ts`: Blitz board rendering helpers for field, players, labels, and drawn pathways.
- `lib/film/filmLogic.ts`: Film clip metadata types, bucket/scheme helpers, quiz scoring helpers, and clip organization logic.
- `lib/formation/formationLogic.ts`: Formation rules, personnel groupings, alignment buckets, bunch/stack/empty logic, and layout generation.
- `lib/passConcept/passConceptLogic.ts`: Route definitions, concept data, route drawing helpers, and pass-concept quiz logic.
- `lib/runFit/runFitLogic.ts`: Run Fit drawing/pathway types, premade pathway helpers, and manual board utility logic.
- `lib/supabase/client.ts`: Browser Supabase client.
- `lib/supabase/server.ts`: Server Supabase client helper for auth-aware server routes/pages.
- `lib/utils.ts`: Shared utility helpers such as class name merging.
- `supabase/*`: SQL/schema-related project files if present.
- `README.md`: General project notes.
- `ROADMAP.md`: Future roadmap notes. This may be untracked locally; do not assume it is committed.

## Admins

Admin tools should be visible only to approved admin accounts unless specifically opened up.

Known admin emails include:
- `nmendonca@pleasantonusd.net`
- `mendoncanick@gmail.com`

## Core Football Rules

### Formation Rules

- Formations are rule-built, not freehand random dots.
- Offensive skill players should snap to clear buckets: attached, wing, slot, normal split, tight split, bunch, stack.
- No player circles should overlap.
- There must be 11 players: 5 OL, 1 QB, 5 skill players.
- LOS count should be legal for the formation.
- X is usually on the ball unless a formation-specific exception exists.
- Off-ball receivers should be visibly off the ball.
- TE/wing players are either tight to the EMOLOS or flexed into the slot.
- Empty formations generally keep the original formation structure and move the RB into the slot opposite the called/pass-strength side unless a formation-specific exception exists.

### Bunch Rules

- Bunch has special coding.
- In Foothill default bunch, the point man is usually `Y`.
- Bunch point man is on the ball.
- Inside and outside bunch players are off the ball.
- Bunch players should be attached/tight with no overlap.
- Bunch defensive landmarks are special:
  - Keep normal surface landmarks up to the bunch.
  - H can be treated like a normal wing for landmarks.
  - Add a `9T` landmark outside the Y/point man.
  - Do not add LB-level apex landmarks between tightly bunched players.

### Alignment Mode Rules

- Supports `4-3` and `4-4`.
- Uses landmarks such as `6T`, `7T`, `70T`, `Apex`, `Hash`, `MOF`, `Edge`.
- Apex is used only when there is considerable space between eligibles.
- Do not apex tight TE/wing surfaces or bunch spacing.
- Closed formations have special rules and should not always follow normal 3x1 spacing.
- For 3x1 with a detached #3, Mike can apex between #3 and tackle.
- For 3x1 with TE/wing, Mike rules have been adjusted multiple times; verify current intended rule before changing.
- In `4-3`, safety rules generally follow pass strength:
  - FS goes to pass strength.
  - BS goes away from pass strength.
  - If #2 is a true slot/hash-or-wider, safety can align inside/apex depending on rule.
  - If #2 is a TE/wing or not a true slot, safety uses outside shade rules.

### Blitz Mode Rules

- Blitz Mode supports `4-4` and `4-3`.
- Ball spot options: `MOF` and `Hash`.
- Hash boards should use field/boundary logic where appropriate.
- On hash, defensive alignment should shift with the offensive center/origin.
- Main call families:
  - Newton / Panthers / Carolina
  - Fields / Bears / Chicago
  - Brees / Saints / NOLA
  - Bradshaw / Steelers / Pitt
  - Carr / Raiders / Oakland
  - Allen / Bills / Buffalo
  - Brady / Patriots / Boston
  - Fitz / Bucs / Tampa Bay
- Call types:
  - Last Name = 4-man pressure with DE drop.
  - Team Name = 5-man pressure, no DE drop.
  - Location Name = 6-man pressure.
- DL slants should pop in green.
- Blitz/pressure paths are red.
- Underneath coverage paths are yellow.
- Third-level/deep coverage paths are purple.
- Pathways should start on the circumference of the player circle, not inside it.
- If a pathway is applied to a player who already has one, replace the old pathway.

### Current Blitz Special Rules

- Newton auto-checks to Fields behavior only when the #3 is detached in a 3x1 surface.
- FS `MOF` pathway should point toward the bottom of the board every time.
- Hash boundary `C/F` should landmark horizontally near the numbers at the discussed vertical depth.
- Cover 2 flat landmarks are wider than Cover 3 `C/F` landmarks and should stay distinct.
- Brady and Fitz:
  - Brady is boundary B-gap pressure.
  - Fitz/Bucs/Tampa Bay mirrors Brady as field B-gap pressure.
  - Blitz-side DE uses a COP rush instead of slanting.
- Bradshaw:
  - BS blitzes.
  - SDE drops.
  - Mike and Will bump one zone responsibility toward the blitz side.
  - Mike has weak hook.
  - Will has C/F.
- Carr:
  - In `4-3`, CB blitz is allowed. BS replaces the blitzing corner’s deep third; FS stays MOF; other zones stay normal.
  - In `4-4`, Carr auto-changes to `Carr Bounce`.
- Carr Bounce (`4-4`):
  - Weak-side Cover 2 rotation.
  - FS takes boundary deep half where CB blitzed from.
  - FC takes field deep half.
  - Nickel takes field flat.
  - Mike plays Tampa pole.
  - Will plays weak hook.
  - BS plays weak flat.
  - DE still drops into strong hook.
- Allen:
  - The ILB aligned to the `3T` side is the `C-Read` blitzer.
  - C-Read pathway should go directly at the center.
  - Nose stunts into the near-side B gap.
  - Non-dropping DE uses a COP rush.
- NOLA:
  - Will blitzes the boundary edge.
  - Mike fits weak A gap across formations.
- Oakland:
  - Uses Carr coverage rules.
  - Will inserts into weak A gap.
- Buffalo:
  - Uses Allen C-Read/Nose movement.
  - Both ILBs blitz their own A gaps.
- Run Fit Mode is currently a manual/admin build space:
  - Premade run-fit pathway controls sit directly under the board.
  - Saved custom pathway stamping has been removed from the UI.
  - Manual drawing tools are the preferred way to create exact fit boards.

## Film Mode Rules

- Film clips are uploaded to Supabase storage and metadata is stored in Supabase.
- Study mode uses the full uploaded clip.
- Quiz mode uses the same clip plus quiz start/end trim times.
- Quiz mode hides the preview until the rep starts.
- After answering in quiz mode, user can review the full clip manually with teaching panel.
- Pass clips only require pass-related answers.
- Pass bucket includes normal, screen, and play action.
- Run bucket includes gap, zone, and man.
- Zone includes normal, split, and jet sweep.
- Gap has puller/detail options such as Power, Dart (Tackle Power), G Lead, Trap, Center Pull, Pin N Pull, GT, GY/GH, CG/CT, Buck Sweep.
- Film clips can be tagged by formation family and team, but not every clip must have these tags.
- Team Key and Formation Key are separate film submodes that filter clips by tagged team/formation family.

## Pass Concept Rules

- Pass Concept Mode has study and quiz versions.
- Concepts are drawn from offensive perspective.
- 2x2 study labels should use `X` and `Z` side naming, e.g. `X Malone / Z Matt`.
- Quiz can ask users to build routes from a concept name or name the concept from routes.
- In build-concept quiz, user chooses route for each active eligible; selected routes preview on the field.
- In name-concept quiz, user may need separate frontside/backside concept answers for 2x2 boards.
- Route drawings are based on the user’s PowerPoint references and should preserve route shape/depth closely.

## Scoring / Leaderboard Rules

- Scores persist to Supabase.
- Time on app should be total lifetime time, not just current browser session.
- Users should not earn points more than once on the same rep/formation/clip after checking answers.
- Revealing answers before checking should block points.
- Leaderboards should exclude admin accounts from public top rankings but still track admin stats internally.
- Leaderboards are grouped by offense/defense modes.
- If user is outside top 10, show their current rank below the top 10.

## Recent Changes Log

- Moved Run Fit premade pathway controls directly under the board and removed saved custom pathway UI.
- Updated Run Fit manual drawing tools and moved line/tag editing into a horizontal toolbar near the board.
- Updated Newton auto-check so only a detached #3 triggers Fields behavior.
- Added Brady/Fitz B-gap pressure rules with COP rush behavior for the blitz-side DE.
- Added/updated Allen, NOLA, Oakland, and Buffalo blitz family rules.
- Added distinct Cover 2 flat landmarks separate from Cover 3 `C/F` landmarks.

## Prompting Guidance For Future AI Sessions

Use small, exact prompts. Include mode, front, formation, ball spot, and call.

Good examples:
- “In Blitz Mode, `4-4`, Carr vs Quad on Hash, change BS from weak flat to weak hook.”
- “In Alignment Mode, `4-3`, B Trey, change FS landmark only when #3 is detached.”
- “In Film Mode quiz, hide any metadata that reveals run/pass before user answers.”

After edits, always run:

```bash
npx tsc --noEmit
```

Avoid broad rewrites unless necessary. The app currently has a lot of feature logic in `app/page.tsx`, so targeted patches are safer.
