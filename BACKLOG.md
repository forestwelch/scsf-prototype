# Backlog

Running list of requested changes, in priority order. Update this file (don't
just talk about changes in chat) so it stays the source of truth across
sessions. Move items to **Done** with the date/commit when shipped; add new
asks to **Open** as they come in, roughly ordered by priority.

Priority is judged by: data integrity issues first, then foundational
schema/model changes (everything else depends on these), then UX/discoverability,
then net-new features.

## Open

- **Sanity Studio's native Delete/Duplicate actions don't render for anyone.**
  Confirmed on the account that owns the project (Administrator role) in both
  Chrome and Zen, fullscreen, on both the Drafts and Published perspectives,
  across every document type (Site Settings is *supposed* to lack Delete —
  it's a locked singleton — but Announcements/Pages/Tests Passed should have
  it and don't). Ruled out: schema-level `__experimental_actions` (only
  `navigation`/`siteSettings` restrict anything), project member roles (all 3
  human accounts are Administrators), browser rendering. Root cause still
  unknown — worth a proper look (maybe file a Sanity support ticket, since
  this smells like a Studio bug) but not worth blocking on. Landed the
  "Delete Content" tool below as a working substitute in the meantime.

## Done

- **2026-09-14** — Tests Passed cleanup batch:
  1. Deleted 46 duplicate `2026-06-30` testPassed records (exact dupes of the
     `2026-06-01` batch) + 1 stray unpublished draft, from production.
  2. Consolidated Test Type to 3 categories: `moves` → "Skating Skills",
     `freeskate` → "Singles", `dance` → "Dance" (was mislabeled "Ice Dance" on
     the frontend). Removed the unused "Pairs" option (no data ever used it).
  3. Changed `passedDate` from a full date to month/year only (`YYYY-MM`,
     string field with regex validation). Migrated all 1636 existing records.
     Import tool now uses a native `<input type="month">` picker.
  4. Added `uploadedAt` (readOnly, autofilled datetime) to `testPassed`,
     separate from `passedDate` — tracks when a record was imported, not when
     the test was passed. Backfilled from `_createdAt` on existing records.
  5. Added a Studio structure view (Content → Tests Passed) with an
     "All (recently uploaded first)" list plus per-type sub-lists, so past
     imports and individual records are easy to find/edit.
  6. Added a Type tab row to `/tests-passed` (alongside the existing Year
     tabs) so visitors can filter to one discipline.
  7. Sanity Studio's built-in Delete action turned out to be broken/missing
     for every document type, for reasons we couldn't root-cause (see Open).
     Added a "Delete Content" Studio tool (search + delete for Tests Passed
     and Pages) as a working substitute — see "Where things live" below.

## Where things live in Studio

- **Delete a Tests Passed record or a Page**: top nav → **Delete Content**
  tool (next to Import Tests Passed). Pick the content type, search, hit
  Delete. This exists because Studio's native Delete action isn't rendering
  for anyone on this project — see the Open item above.
- **Edit a single document**: open it from the sidebar and edit fields
  directly — that part works. It's specifically the Delete/Duplicate actions
  (and the whole action footer they'd normally live in) that don't render.
- **Past Tests Passed imports**: Studio sidebar → Content → Tests Passed →
  "All (recently uploaded first)" — sorted by `uploadedAt` descending.
