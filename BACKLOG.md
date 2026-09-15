# Backlog

Running list of requested changes, in priority order. Update this file (don't
just talk about changes in chat) so it stays the source of truth across
sessions. Move items to **Done** with the date/commit when shipped; add new
asks to **Open** as they come in, roughly ordered by priority.

Priority is judged by: data integrity issues first, then foundational
schema/model changes (everything else depends on these), then UX/discoverability,
then net-new features.

## Open

_(none right now — see Done below for the latest batch)_

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
     imports and individual records are easy to find, edit, or delete.
  6. Added a Type tab row to `/tests-passed` (alongside the existing Year
     tabs) so visitors can filter to one discipline.
  7. Confirmed delete/edit already work for `testPassed` and `page` documents
     via Sanity Studio's default document actions — no schema restriction was
     blocking it. See "Where things live in Studio" below.

## Where things live in Studio

- **Delete or edit a single document** (any type, including Tests Passed and
  Pages): open the document, then use the "⋯" menu at the top of the editor
  pane (next to Publish) → Delete. This is Sanity Studio's built-in action,
  not something custom-built for this project — it works the same for every
  document type unless a schema explicitly restricts it (only `navigation`
  and `siteSettings` restrict actions, since those are singletons).
- **Past Tests Passed imports**: Studio sidebar → Content → Tests Passed →
  "All (recently uploaded first)" — sorted by `uploadedAt` descending.
