# Human editor review — SCSF website

**Purpose:** Find out whether board members can safely handle routine updates in
Sanity without a developer or a long README walkthrough. This is the acceptance
test for the editor experience, not a general design review.

## Before the session

- Use a staging Sanity dataset and a Vercel preview deployment connected to
  that same dataset. Confirm the Studio dataset before making any changes.
  The current local `localhost:3000` configuration points at `production`;
  use it for read-only review only.
- Confirm every tester can sign in and has the role needed to edit and publish.
- Have at least two board members who are not maintaining the code test
  independently. Diane may participate, but should not be the sole tester or
  the person responsible for the launch decision.
- Give each tester this checklist without coaching them through the menu. Ask
  them to think aloud. Record the first place they hesitate, what they expected
  to find, and whether they finish without help.
- Use only clearly named `QA TEST ONLY` content. Do not delete real pages,
  events, announcements, or test records.

## Tasks to try

For each task, mark **Pass**, **Pass with help**, or **Fail**. Save a screenshot
of the finished state and note the time and any wrong turns.

| # | Task for the editor | Pass criteria |
|---|---|---|
| 1 | From the public Membership page, open its editor using the `/studio` shortcut. Find where the membership wording is edited. | Correct Membership document opens; editor can identify which fields change the page. |
| 2 | Change one sentence in the staging copy, publish it, and confirm it appears on the preview site. | Publish is easy to find; editor sees a success state; preview updates within about a minute. |
| 3 | Make a second change and undo it back to the published version. | Publish becomes disabled when there is no content difference. Record whether the title or draft status is confusing. |
| 4 | Add a `QA TEST ONLY` announcement with a short title and date, then edit and delete it. | Editor can find Announcements, understands the required fields, sees the item on preview, and can delete only the test item. |
| 5 | Add a future `QA TEST ONLY` event, change its date, publish, then remove it. | Editor can find Events, understands the date fields, and confirms the event appears/disappears from preview as expected. |
| 6 | Create a custom `QA TEST ONLY` page with a heading, a paragraph, and a PDF or embed. Duplicate it, change the copy's slug, then delete both test pages. | Page creation, edit, duplicate, and deletion are available from the page workflow; new URL works; no unrelated page is touched. |
| 7 | Add and then remove a `QA TEST ONLY` Tests Passed record. | Editor finds **Tests Passed → All test records**, understands the passed month/year field, and sees the record update on preview. |
| 8 | Find Board Members and explain what to do if the list is empty. | Tester finds **People → Board members** and understands this is its own collection, not Site Settings. |
| 9 | Find the navigation menu and explain how to add a link to a custom page. | Tester finds **Website settings → Navigation menu** and can describe the link steps without guesswork. |

## Score and triage

Record every task in a short session log:

| Tester | Task | Result | Time | Where they hesitated / what they expected | Screenshot or issue link |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

Treat a task as a launch blocker if the tester cannot finish it without help,
publishes to the wrong place, cannot tell whether a change is live, or risks
changing/deleting the wrong item. Fix blockers first; then repeat the failed
task with a different tester.

A reasonable first launch gate is:

- Both testers complete all critical tasks (1–7 and 9) without coaching.
- Create, edit, publish, duplicate, and delete are verified on staging records,
  including the draft-only and published-document states.
- Undoing back to the published value disables Publish in the browser.
- The public preview reflects published edits, while drafts remain private.
- No critical or high-severity issues remain, and a named person owns each
  remaining follow-up.
- The board confirms current page content, membership season details, events,
  board-member records, PDFs, and links.

## Read-only smoke check — 2026-10-31

The local app was connected to the production Sanity dataset, so only public
pages and Studio navigation were inspected; no Sanity records were changed.

- `/`, `/about`, `/membership`, `/events`, `/announcements`, `/tests-passed`,
  `/resources`, and `/faqs` rendered with a page heading.
- `/events/studio` redirected to the Events page editor.
- Events opened with an `Untitled` document heading even though the **Page
  heading** field contains “Events.” The Published status is disabled and the
  Draft status is available. This is confusing on first open; investigate why
  the document header does not reflect its title and establish/verify a
  published baseline in staging before editor review.
- Studio showed the simplified Pages and Tests Passed menus, the spreadsheet
  upload pane, and native Delete/Duplicate actions on a custom page.
- **Membership** still displays 2025–26 dates in October 2026. The board needs
  to confirm the current season dates and wording before launch.
- **Events** displayed “No upcoming events scheduled” during the check. The
  board should confirm whether that is accurate or means current event data is
  missing.
- **People → Board members** displayed “No documents of this type.” The board
  must supply/confirm the current list if those names should appear publicly.
- The About document currently has a draft without a published version. Its
  Publish action is a first publish, so the no-op/undo case still needs a
  separate browser test against a document with an established published base.

## What still needs to be prepared

1. Confirm or create a non-production Sanity dataset and connect a Vercel
   preview deployment to it. Do not run write-flow reviews against the current
   production-connected local app.
2. Run `bun run seed:site-pages` to review missing fixed-page baselines. Apply
   only after confirming the target dataset and intended effect.
3. Schedule the two-editor session, capture screenshots, fix blockers, and
   repeat the failed tasks. Then make a dated go/no-go decision for January.
