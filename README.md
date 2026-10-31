# SCSF Website

The Skating Club of San Francisco's website. Built with Next.js and Sanity CMS,
replacing the old scsf.org WordPress site. Deployment is managed through Vercel.

This README is written for two audiences: developers setting up the project,
and non-technical editors (board members, coaches) who just need to update
content. If you only need to update content, skip to
**["What lives in Sanity vs. what lives in code"](#what-lives-in-sanity-vs-what-lives-in-code)**
and the **[FAQ](#faq)** below — you don't need to touch the code at all.

---

## What lives in Sanity vs. what lives in code

Open Studio at `/studio`. Editors can also append `/studio` to a page URL (for
example, `/about/studio`) to open Studio for that page's Sanity document when
the route is linked to a document. Studio opens as a full-screen editor without
the public site header/footer covering its controls.
Sanity still requires the editor to sign in and have permission to publish.
Fixed page layouts and interactive features remain implemented in the app.

### Lives in Sanity (edit at `/studio`, no code, no deploy needed)

| What | Where in Studio |
|---|---|
| Site-wide settings: address, phone, website contact email, social links, **Zeffy donation/newsletter embed URLs**, EntryEeze/EMS links | **Website settings** → **Contact, social links & analytics** |
| Google Analytics 4 tracking ID (optional) | **Website settings** → **Contact, social links & analytics** (requires the club's `G-...` measurement ID) |
| The navigation menu — order, labels, links, dropdowns, the Donate button | **Website settings** → **Navigation menu** |
| Custom pages such as Ice Theatre and policy pages, including rich text, images, PDF uploads, and embeds | **Pages** → **Custom pages** |
| News posts | **Announcements** |
| Events (gala, competitions, test sessions) | **Events** |
| Tests passed records, incl. Honors/Distinction | **Tests Passed** → **All test records** |
| Coaches directory | **People** → **Coaches** |
| Board members | **People** → **Board members** |
| FAQs | **FAQs** |
| Homepage hero slides | **Home page slides** |
| Built-in page headings and intros; additional rich text, images, PDFs, and embeds | **Pages** → choose a page |
| Membership renewal wording and related page copy | **Pages** → **Membership**; category names and prices are under **Membership categories & fees** |
| Announcements newsletter/Instagram visibility and page-specific links | **Pages** → **Announcements** |
| Donation form embed URL | **Pages** → **Donate** |
| Tests Passed photos | **Pages** → **Tests Passed** (legacy Site Settings photos are used if this list is empty) |
| Site-wide address, contact information, links, embeds, analytics | **Website settings** → **Contact, social links & analytics** |

Built-in pages are listed directly under **Pages**; custom pages are in that
same list under **Custom pages**. Built-in URLs and layouts are fixed parts of
the site and cannot be deleted as ordinary content. Custom pages can be
created, duplicated, and deleted. Route layouts, interactive features, and
some section copy still require a code change. The generic rich-text area adds
content to a built-in page; it does not replace its events, forms, or other
functional sections.

### Lives in code (requires a developer + deploy)

- Page layout/design — how things are arranged and styled on screen
- The list of *what fields* a content type has (e.g. adding a totally new
  field to "Events" that doesn't exist yet)
- Routing — how URLs map to pages (`app/` folder)
- One-time data migrations/imports from the old WordPress site (`scripts/`)
- Anything not listed in the Sanity table above

If it's not obvious which bucket something falls into, check the FAQ below —
most of the "where do I..." questions from testing this with the board are
already answered there.

---

## FAQ

**Q: Where do I edit the navigation menu (add/remove/reorder items)?**
Studio → **Website settings** → **Navigation menu**.
It's one document with a list of menu items. Drag the handle on the left of
each item to reorder. Click into an item to edit its label or link, or to
add/remove dropdown sub-items. Changes go live as soon as you publish — no
code or deploy. The site may take up to about a minute to refresh published
content.

**Q: I created a new page. Why isn't it in the menu?**
Create a page in Studio → **Pages** → **Custom pages** → **Add**, then publish it.
Once published, it is available at `yoursite.com/its-slug` (the site may take
up to about a minute to refresh). It does **not** automatically add itself to the nav menu.
That's a deliberate two-step: not every page needs to be in the main menu
(e.g. a page only linked from another page). To add it to the menu, go to
Studio → **Website settings** → **Navigation menu** → add a new item → set its link type to "Sanity Page"
→ pick your page from the list.
Choose a slug that does not conflict with an existing fixed route such as
`/about` or `/membership`; those routes are implemented in code.

**Q: How do I delete or duplicate a page?**
Open Studio → **Pages** → **Custom pages**, select the page, then open the
document actions menu (three dots) in the editor. Choose Delete or Duplicate.
Confirm the page name before deleting; remove its Navigation link separately
if it is linked there. Built-in pages such as About and Membership are fixed
website routes, so they are protected from deletion and duplication as ordinary
content pages.

**Q: How do I add or edit a page or a Tests Passed record?**
Use **Pages** for built-in page copy and custom pages. The built-in pages are
listed directly; choose **Custom pages** for WordPress/imported and new pages.
Use **Tests Passed** → **All test records** for individual results, or choose a
discipline. **Upload a spreadsheet** is in the same Tests Passed menu.

**Q: Can I open an editor from the page I'm looking at?**
Yes. While signed in with Sanity access, add `/studio` to the end of the page
URL, such as `/events/studio`. For event or announcement detail pages, the
shortcut opens that record. `/studio` by itself opens the Studio home.

**Q: Where's the Zeffy donation/newsletter embed link?**
The Donate form URL is under Pages → Donate. The Announcements
newsletter signup and Instagram card are under Pages →
Announcements. The newsletter archive signup URL remains under Website settings.
Paste the `src` URL from Zeffy's embed code (not the full `<iframe>` HTML).
For an embed inside another page, add an Embed block to that page's Content
field instead.

**Q: How do I add or edit images on a page?**
Open the page in Studio and use the **Image** action in the Content editor
toolbar. Drag a file in or choose one to upload, then add alt text (for
accessibility/SEO) and an optional caption. Reorder content blocks in the
editor. This works on Pages, Announcements, and Events.

**Q: How do I add or replace a PDF on a page such as CCIA Calendar?**
Open the page in Studio → Pages and edit its Content. Add a **File** block and
upload a PDF, or add an **Embed** block with a public PDF URL. The PDF appears
in an on-page viewer with a link to open it separately. Older WordPress PDF
Embedder shortcodes are also rendered as PDF viewers for compatibility.

**Q: Where do I update Membership or Events wording?**
Open Studio → **Pages** and choose Membership,
Events, or Announcements. Empty optional fields keep the current site wording.
Membership category names, prices, eligibility, and benefits remain separate
records under **Membership categories & fees**.

**Q: How do I add the Tests Passed photos?**
Open Studio → **Pages** → **Tests Passed**.
Add each photo, write its alt text, optionally add a caption, and publish the
page. Existing Site Settings photos continue to display until the new page
record has photos.

**Q: How do I enable Google Analytics?**
Ask the club's Google Analytics administrator for the GA4 Measurement ID
(format `G-XXXXXXXXXX`), then enter it in Studio → **Website settings** →
**Contact, social links & analytics**
and publish. Tracking remains off while that field is blank.

**Q: Where is the website contact email?**
Studio → **Website settings** → **Contact, social links & analytics** → Website Contact Email.
The footer uses `webmaster@scsf.org` unless another address is entered.

**Q: Where is Publish, and when should changes show up?**
In Studio's document editor, look in the pinned action bar at the bottom of the
editor. Publish is enabled only when the draft differs from the published
content; editing and then undoing back to the published content should leave it
disabled. Studio is
full-screen so the public site header and footer do not cover this bar. If
you're editing a release, publish the release from the release controls. A
validation error or insufficient Sanity permissions can also prevent
publishing. Publishing content does not require a code deploy. Pages that use
Sanity content refresh in the background about once a minute. If the published
change is still missing after that, check that the correct document or release
was published, then ask a developer to inspect the deployment/cache.

**Q: How does "With Honors" / "With Distinction" work on Tests Passed?**
Each test record is available from Studio → **Tests Passed** → **All test records**
and has a "Distinction" field: None,
With Honors (`*`), or With Distinction (`**`). Set it per record. The
`/tests-passed` page automatically shows the marker next to the test level and
a legend key, but only for years/records that actually have one set — no
legend clutter on records with nothing to flag.

**Q: How do bulk imports of Tests Passed work?**
Studio → **Import Tests Passed** accepts `.xlsx` and `.xls` spreadsheets with
Skater and Test Name columns. Review the parsed rows, correct test types or
exclude rows as needed, choose the session month/year, then import. Re-importing
the same rows with the same types and session month/year updates those imported
records. The
historical `scripts/migrate-tests-passed.mjs` script imports data from the old
WordPress site; it is not the normal workflow for new batches.

**Q: What if a page is missing images that the old WordPress site had?**
Run `scripts/backfill-page-images.mjs <page-slug>` — it pulls every image off
the *live* WordPress page at that same slug, uploads them to Sanity, and adds
them to the bottom of that page's content (it won't touch or reorder existing
text). Then go into Studio and drag the new images into position. Safe to
re-run; it won't create duplicates.

**Q: Something changed in code — how do I see it live?**
Any code change needs to be committed, pushed, and deployed (see Deployment
below for how to check the Vercel setup). Published Sanity content usually
appears on the site within about a minute — no code deploy is needed.

---

## Getting started (developers)

### Prerequisites

- [Bun](https://bun.sh) and Node.js 20.9 or newer (required by Next.js 16)
- Use Bun for installs and scripts. The repository has both `bun.lock` and
  `package-lock.json`; avoid mixing package managers in one checkout.
- A Sanity account with access to this project (ask an existing collaborator
  to invite you at [sanity.io/manage](https://sanity.io/manage))

### Setup

```bash
git clone <this-repo-url>
cd scsf-prototype
bun install
```

Create `.env.local` in the project root with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xi18pbe1
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=<your Sanity API token, Editor role; used by migration and seed scripts>

# Only needed by selected migration scripts
WP_USERNAME=<only if you need to pull unpublished/archived WP content>
WP_APP_PASSWORD=<same>
BLOB_READ_WRITE_TOKEN=<Vercel Blob token, same>
```

Get a Sanity API token at `sanity.io/manage` → this project → API → Tokens →
Add API token (Editor permissions).

### Run it

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) for the site, and
[http://localhost:3000/studio](http://localhost:3000/studio) for Sanity
Studio. Local Studio uses the configured dataset; the example above points to
`production`, so edits and published changes affect live content. Use a
separate non-production dataset for write testing. Studio sign-in uses your
Sanity account; the API token above is for scripts, not browser sign-in.

### Other commands

```bash
bun run build   # production build — catches type errors, run before pushing
bun run lint    # eslint
bun test        # unit tests for Studio routing and publish change detection
bun run seed:site-pages        # preview which built-in published baselines are missing (SANITY_TOKEN required)
bun run seed:site-pages -- --apply  # create missing baselines only
bun run start   # serve the production build locally
```

For the issue-by-issue history, causes, fixes, and validation notes, see
[docs/EDITOR_PROBLEMS_README.md](docs/EDITOR_PROBLEMS_README.md).
For a safe, task-based board member review with pass criteria, see
[docs/HUMAN_REVIEW_CHECKLIST.md](docs/HUMAN_REVIEW_CHECKLIST.md).

---

## Working with this codebase using an AI coding assistant

You can use an AI coding assistant to make code or content-model changes.

1. **Get the code onto your machine.** Either clone the repo yourself
   (`git clone <repo-url>`), or open the project folder if it's already been
   shared with you (e.g. via Cowork's folder selection).
2. **Open your coding assistant in this folder.** For example, start Claude
   Code from the terminal or open the folder in Codex.
3. **Describe what you want in plain English.** You don't need to know how
   to code. Examples that work well:
   - *"Add a field to the coach schema for their PSA certification level."*
   - *"The membership page is missing a photo, can you pull one over from the
     old wordpress site?"*
   - *"Why does the donate page look broken?"*
4. **Review the proposed changes.** The assistant should explain what it
   changed and why. If it's proposing a code change, it's a good
   idea to run `bun run build` (or ask Claude to) to confirm nothing broke
   before pushing.
5. **Commit and push** — either ask your assistant to do it, or do it yourself:
   ```bash
   git add -A
   git commit -m "describe the change"
   git push
   ```
   Check the Deployment section below to confirm whether the `main` branch is
   connected to automatic deploys.

If a request is really a Sanity content change (see the table above), your
assistant will usually point you to Studio instead of changing code —
that's expected, not a limitation.

---

## Deployment

This repository does not contain a deployment workflow, so deployment behavior
depends on the external Vercel project configuration. Check the Vercel project
to confirm whether pushes to `main` deploy automatically and to view build
status or logs. Run `bun run build` locally before pushing to catch build and
TypeScript errors.

---

## Project structure

```
app/                    Routes (Next.js App Router) — one folder per URL path
  [slug]/               Catch-all route for generic Sanity "page" documents
  studio/                Sanity Studio, mounted at /studio
components/             Shared React components (Header, Footer, PortableText renderer, etc.)
lib/sanity.queries.ts   All GROQ queries + TypeScript types for Sanity data — start here
                        to see what data is available and how it's shaped
sanity/schemaTypes/     Content type definitions — this is what determines what fields
                        show up for editors in Studio
sanity/structure.ts     Controls the Studio sidebar layout/ordering
scripts/                One-off migration/import scripts (WordPress → Sanity, image
                        backfills, etc.) — see inline comments in each for usage
```

---

## Open items (reviewed 2026-10-31)

- **Confirm Vercel deployment settings** — the repository does not define the
  external Vercel project or its production branch settings.
- **Site-wide old-vs-new content audit** — systematically compare every page
  against the old scsf.org to catch anything else missing beyond images
  (Ice Theatre was the first one found and fixed).
- **Editor experience remains partly structured** — built-in page headings, intros, and added
  rich-text content are in Sanity, but some fixed section copy in About,
  Programs, Resources, and other routes remains in code. Converting those
  bespoke sections to editable Sanity fields/blocks is still follow-up work.
  The current system is not a free-form visual website builder; new page
  layouts and functional sections still need code/schema work.
- **Update current season content** — Membership currently falls back to
  2025–26 wording. The board should enter the approved current-season dates and
  renewal text in Pages → Membership.
- **Confirm public-facing data** — Events currently reports no upcoming
  schedule, and the Board Members collection is empty in the selected dataset.
  Confirm whether that is intentional and add approved content where needed.
- **Test editor workflows with nontechnical editors** — use the task-based
  [human review checklist](docs/HUMAN_REVIEW_CHECKLIST.md) in a staging dataset
  before treating the new editor as easier to maintain than WordPress.
- **Optional integrations and content choices** — get the club's GA4
  measurement ID and confirm any privacy/consent requirements before turning
  tracking on; replace the current Instagram hashtag URL with the official
  profile and explicitly enable the Announcements link; confirm whether the
  existing 2026 CCIA PDFs are still current before replacing them.
