# Backlog

Running list of requested changes, in priority order. Update this file so it
stays the source of truth across sessions. Move items to **Done** with the
date/commit when shipped; add new asks to **Open** as they come in, roughly
ordered by priority.

Priority: data integrity first, then foundational schema/model changes, then
editor workflow/discoverability, then net-new features.

## Open

- **P0 — Prepare a safe staging environment.** Confirm or create a non-
  production Sanity dataset and connect a Vercel preview deployment to it.
  The current local app points at `production`; do not run write-flow reviews
  against it. Confirm the deployment branch and preview credentials.
- **P0 — Initialize built-in page baselines in staging.** Review
  `bun run seed:site-pages` against the staging dataset, then apply only after
  confirming the missing-page list. The browser currently shows Events as
  `Untitled` with Publish disabled because its fixed-route document has no
  published baseline.
- **P0 — Review current public content.** Membership still displays the
  2025–26 season in October 2026; Events showed no upcoming schedule; Board
  Members has no records. Ask the board to confirm dates, events, and the
  approved board list before launch.
- **P1 — Run human editor acceptance testing.** Have at least two nontechnical
  board members complete the tasks in
  [docs/HUMAN_REVIEW_CHECKLIST.md](docs/HUMAN_REVIEW_CHECKLIST.md) independently.
  Log hesitation, help needed, completion time, and screenshots; fix blockers
  and retest with someone else. Diane must not be the only tester or sign-off.
- **P1 — Verify publish and delete behavior end to end.** On staging, test
  first publish, edit/undo against a published document, custom page duplicate
  and delete, and a page that has a draft or release version. Use only `QA TEST
  ONLY` records and remove those records at the end.
- **P1 — Preview/apply the built-in page baseline seed.** Run
  `bun run seed:site-pages` against the intended dataset and review the list.
  Use `--apply` only after confirming it creates the expected published
  baselines and preserves existing drafts.
- **P2 — Make remaining page sections editable.** After editor testing, define
  the reusable content sections needed for Membership, Events, Announcements,
  and the PDF/calendar page. Avoid building a broad page builder until the
  tested workflows show it is necessary. See
  [the editor problem log](docs/EDITOR_PROBLEMS_README.md#problem-3--editing-is-harder-than-wordpress-and-content-lives-in-surprising-places).
- **P2 — Assign ongoing ownership and the go/no-go date.** Name an editor lead,
  code maintainer, and backup; agree how code/content changes are reviewed,
  published, rolled back, and supported if Forest is unavailable.

## Done

- **2026-10-31 — Studio controls visibility and editor navigation.** Removed
  public site chrome from Studio, flattened the built-in Pages list, grouped
  People and Website settings, moved spreadsheet import into Tests Passed,
  and removed developer/redundant top-level tabs. Publish now disables when
  draft content matches published content. Added unit tests and browser-checked
  the new Pages and Tests Passed navigation locally. Detailed findings are in
  [docs/EDITOR_PROBLEMS_README.md](docs/EDITOR_PROBLEMS_README.md).
- **2026-10-23 — Disposable-dataset workflow validation.** Browser-tested
  Pages and Tests Passed create, edit, publish, and delete flows against a
  disposable Sanity dataset, including a record with an unpublished draft.
  Tested spreadsheet parsing, row exclusion, distinctions, date selection,
  import, and repeat-import deduplication. Removed synthetic documents.
- **2026-10-23 — Manage Pages and Manage Tests Passed tools.** Added page and
  test-record create/edit/delete workflows, with search and full-editor links.
- **2026-10-23 — README audit and content settings.** Exposed existing Zeffy
  URLs in Site Settings, corrected setup/content/import guidance, and documented
  refresh timing.
- **2026-09-14 — Tests Passed cleanup.** Removed duplicate 2026-06-30 records;
  consolidated test categories and month/year passed dates; added upload
  timestamps, type filters, and a Studio view sorted by recent import.
