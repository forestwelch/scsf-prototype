# SCSF Website

The Skating Club of San Francisco's website. Built with Next.js and Sanity CMS,
replacing the old scsf.org WordPress site. Deployed on Vercel.

This README is written for two audiences: developers setting up the project,
and non-technical editors (board members, coaches) who just need to update
content. If you only need to update content, skip to
**["What lives in Sanity vs. what lives in code"](#what-lives-in-sanity-vs-what-lives-in-code)**
and the **[FAQ](#faq)** below — you don't need to touch the code at all.

---

## What lives in Sanity vs. what lives in code

This is the single most important thing to understand about this project.
The goal is: **anything a non-technical editor needs to change lives in
Sanity Studio, not in code.** If you find yourself needing a developer to
change text, a link, an image, or the menu — that's a bug, tell us and we'll
move it into Sanity.

### Lives in Sanity (edit at `/studio`, no code, no deploy needed)

| What | Where in Studio |
|---|---|
| Site-wide settings: address, phone, social links, **Zeffy donation/newsletter embed URLs**, EntryEeze/EMS links | **Site Settings** (pinned at top) |
| The navigation menu — order, labels, links, dropdowns, the Donate button | **Navigation** (pinned at top) |
| All page content — About, Membership, Ice Theatre, policies, etc., including images | **Pages** |
| News posts | **Announcements** |
| Events (gala, competitions, test sessions) | **Events** |
| Tests passed records, incl. Honors/Distinction | **Tests Passed** |
| Coaches directory | **Coaches** |
| Board members | **Board Members** |
| FAQs | **FAQs** |
| Homepage hero slides | **Hero Slides** |
| Membership category pricing/details | **Membership Categories** |

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
Studio → **Navigation** (pinned at the top of the sidebar, above the divider).
It's one document with a list of menu items. Drag the handle on the left of
each item to reorder. Click into an item to edit its label or link, or to
add/remove dropdown sub-items. Changes go live as soon as you publish — no
code, no deploy.

**Q: I created a new page. Why isn't it in the menu?**
Creating a page (Studio → Pages → "+") makes it live at `yoursite.com/its-slug`
automatically, but it does **not** automatically add itself to the nav menu.
That's a deliberate two-step: not every page needs to be in the main menu
(e.g. a page only linked from another page). To add it to the menu, go to
Studio → **Navigation** → add a new item → set its link type to "Sanity Page"
→ pick your page from the list.

**Q: How do I delete a page?**
Studio → Pages → open the page → the "..." menu → Delete (or unpublish, if
you want to keep a draft). This removes the live route immediately. If that
page was linked in the Navigation menu, you'll want to also remove that link
in Studio → Navigation, or visitors will click through to a 404.

**Q: Where's the Zeffy donation/newsletter embed link?**
Studio → **Site Settings** → "Zeffy Donate Form Embed URL" (used on `/donate`)
and "Zeffy Newsletter Signup Embed URL." Paste the `src` URL from Zeffy's
embed code (not the full `<iframe>` HTML, just the URL). No code change
needed — the donate/newsletter pages read this value automatically.

**Q: How do I add or edit images on a page?**
Open the page in Studio → click into the Content field → click the "+" button
below any paragraph → choose "Image" → drag a file in or click to upload.
Add alt text (for accessibility/SEO) and an optional caption. Drag the image
block up or down in the content list to move it. This works on Pages,
Announcements, and Events.

**Q: How does "With Honors" / "With Distinction" work on Tests Passed?**
Each test record in Studio → Tests Passed has a "Distinction" field: None,
With Honors (`*`), or With Distinction (`**`). Set it per record. The
`/tests-passed` page automatically shows the marker next to the test name and
a legend key, but only for years/records that actually have one set — no
legend clutter on records with nothing to flag.

**Q: How do bulk imports of tests passed work?**
See `scripts/migrate-tests-passed.mjs` — pulls the official tests-passed pages
directly from scsf.org's WordPress API and imports them as Sanity records,
safe to re-run (it updates existing records rather than duplicating them). A
spreadsheet-upload flow for one-off batches (e.g. from the club secretary) is
planned but not yet built — see open items below.

**Q: What if a page is missing images that the old WordPress site had?**
Run `scripts/backfill-page-images.mjs <page-slug>` — it pulls every image off
the *live* WordPress page at that same slug, uploads them to Sanity, and adds
them to the bottom of that page's content (it won't touch or reorder existing
text). Then go into Studio and drag the new images into position. Safe to
re-run; it won't create duplicates.

**Q: Something changed in code — how do I see it live?**
Any code change needs to be committed, pushed, and deployed via Vercel (see
Deployment below). Sanity content changes are live immediately on publish —
no deploy needed.

---

## Getting started (developers)

### Prerequisites

- [Bun](https://bun.sh) (this project uses `bun`, not npm/yarn — there's a
  `bun.lock` file, not a `package-lock.json`)
- A Sanity account with access to this project (ask an existing collaborator
  to invite you at [sanity.io/manage](https://sanity.io/manage))

### Setup

```bash
git clone <this-repo-url>
cd scsf-prototype
bun install
```

Copy `.env.local.example` if one exists, or create `.env.local` with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xi18pbe1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_TOKEN=<your Sanity API token, Editor role>

# Only needed for one-off scripts in scripts/, not for running the site itself
SANITY_TOKEN=<same token as above>
WP_USERNAME=<only if you need to pull unpublished/archived WP content>
WP_APP_PASSWORD=<same>
BLOB_STORE_ID=<Vercel Blob store id, only needed for asset migration scripts>
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
Studio (content editing) running locally against the same live dataset —
edits there affect the real production content, same as the hosted studio.

### Other commands

```bash
bun run build   # production build — catches type errors, run before pushing
bun run lint    # eslint
bun run start   # serve the production build locally
```

---

## Working with this codebase using Claude / Cowork

This project is set up to be worked on with an AI coding assistant (Claude
Code or Cowork) rather than requiring you to write code by hand.

1. **Get the code onto your machine.** Either clone the repo yourself
   (`git clone <repo-url>`), or open the project folder if it's already been
   shared with you (e.g. via Cowork's folder selection).
2. **Open Claude in this folder.**
   - In **Claude Code** (terminal): `cd` into the project folder and run
     `claude`.
   - In **Cowork**: select this folder as your working folder when starting a
     session.
3. **Describe what you want in plain English.** You don't need to know how
   to code. Examples that work well:
   - *"Add a field to the coach schema for their PSA certification level."*
   - *"The membership page is missing a photo, can you pull one over from the
     old wordpress site?"*
   - *"Why does the donate page look broken?"*
4. **Review what changes.** Claude will explain what it changed and why
   before/after making edits. If it's proposing a code change, it's a good
   idea to run `bun run build` (or ask Claude to) to confirm nothing broke
   before pushing.
5. **Commit and push** — either ask Claude to do it, or do it yourself:
   ```bash
   git add -A
   git commit -m "describe the change"
   git push
   ```
   Pushing to the main branch triggers a Vercel deploy automatically (see
   below).

If a request is really a Sanity content change (see the table above), Claude
will usually just tell you where to go in Studio instead of touching code —
that's expected, not a limitation.

---

## Deployment

This project auto-deploys to [Vercel](https://vercel.com) on every push to
the main branch. No manual deploy step needed. Check the Vercel dashboard for
build status/logs if a deploy fails — most failures are TypeScript errors,
which `bun run build` will also catch locally before you push.

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

## Open items (as of this writing)

- **Bulk spreadsheet upload for Tests Passed** — so a spreadsheet (e.g. from
  Diane) can be uploaded and imported without a developer running a script.
  Stretch goal: read directly from a shared Google Doc/Sheet on a manual
  trigger.
- **Site-wide old-vs-new content audit** — systematically compare every page
  against the old scsf.org to catch anything else missing beyond images
  (Ice Theatre was the first one found and fixed).
