# Website editor problems and responses

This is the running issue log for problems reported by SCSF editors. Each entry
records what the person experienced, what the code was doing, what changed, and
what evidence supports the status. Update this file when a new editing issue is
reported so the board can build on prior diagnosis instead of repeating it.

## Problem 1 — Some custom pages appear impossible to delete

**Reported:** “There is still a lot of bugs with deleting pages. For example,
[this page in Studio](https://scsf-prototype.vercel.app/studio/structure/pages;other-pages;26e797eb-16e1-4570-b703-5e5fb50d48d0) there seems to be no way to delete the page. I need to be able to delete each page.”

**Plain English:** The delete control was hard to find in the regular Sanity
editor, and the convenient Manage Pages tool did not fully remove pages that
were part of a Sanity release. This made deletion look missing or incomplete.

**Code cause:** The delete action existed in Sanity's document overflow, but it
was difficult to discover. A previous custom Manage Pages tool also had a
release-version gap because it initially targeted the published document and
draft only.

**Fix in this iteration:** The duplicate Manage Pages tab was removed. Custom
pages are now found from **Pages → Custom pages**, where editors can open the
document itself and use its native actions. Built-in routes appear beside
custom pages, but are protected because deleting their Sanity copy would not
remove the corresponding route/layout from the site.

**Validation:**

- Local browser check shows the Pages list and Custom pages entry directly in
  Structure. Earlier browser evidence showed the reported custom page and its
  native Delete action; the new structure opens that same document list.
- No production page was deleted. Release-version deletion through the native
  action has not been verified end to end in this iteration.

**Status:** Discoverability improved. Use a disposable page in a non-production
dataset to verify native deletion, including drafts and release versions,
before claiming that the workflow is fully validated.

## Problem 2 — Publish is missing on Announcements

**Reported:** The editor enabled the newsletter signup on Announcements but did
not see a Publish option.

**Plain English:** The editing controls were competing for screen space with
the public website's own header and footer. In a compact viewport, Studio's
bottom action bar was crowded or obscured, so Publish was difficult to locate.

**Code cause:** The root layout rendered the public site Header and Footer
around every route, including embedded Sanity Studio routes.

**Fix in this change:** A route-aware `SiteShell` omits public-site chrome for
`/studio` and page-specific `/.../studio` shortcuts. The Studio surface now
uses the available viewport, including the bottom action bar. A publish action
wrapper also disables Publish when a persisted draft is equivalent to the
published document.

**Validation:**

- Local browser check of Announcements showed the newsletter option checked,
  its URL populated, and an enabled Publish button in the bottom action bar.
- Local screenshots captured during this task showed the Studio editor without
  the site's header/footer and the Publish control visible.
- Unit tests cover changed content, a no-op draft after undo, and a new document
  with no published version. The local Sanity UI remains to be checked with a
  safe disposable document; no live content was changed for this check.
- A page with no pending edits may not show an enabled Publish action. Release
  publishing uses release controls. Validation errors or account permissions
  can also prevent publishing.

**Status:** The reported overlap is fixed locally and visible in browser. The
production Announcements page was inspected read-only and had an enabled Publish
button at the time; this indicates that the user report was not consistently
reproducible on that document. The current code change still fixes the Studio
layout that can hide the action at smaller sizes.

## Problem 3 — Editing is harder than WordPress and content lives in surprising places

**Reported:** Board members need to update content without code, want pages to
be easy to find and pre-populated, and may need to add/reformat content such as
newsletters, PDFs, and embeds. They need a workflow suitable for editors with
little technical experience.

**Plain English:** The current site mixes editable content with page structure
and behavior implemented in code. Sanity provides structured forms, not a
free-form visual builder. An editor can change fields the site already exposes,
but cannot invent a new layout or feature without development work.

**Current architecture:**

- Next.js renders the public website; Sanity Studio is embedded at `/studio`.
- Built-in page documents expose headings, intros, and additional rich content.
  Some fixed page sections, layouts, and interactions remain in code.
- Generic custom pages support rich text, images, files/PDFs, and embeds.
- Events, announcements, membership categories, tests passed, navigation, and
  other collections are separate structured content types and Studio tools.
- The `/.../studio` shortcut opens the corresponding Sanity document when a
  route has a linked document. Not every route is a document-backed page.

**Fix in this change:** Studio no longer shares its viewport with public-site
chrome. Built-in and custom pages now sit in one Pages area; individual custom
pages open in Sanity's document editor. This improves discoverability and
regression checking; it does **not** make all site sections editable yet.

**What would make the experience substantially easier:**

1. **Recommended next step — keep Next.js + Sanity and standardize page
   sections.** Define a small set of reusable sections (heading, text, image,
   cards, button, newsletter signup, PDF/embed, etc.) and expose them as
   reorderable blocks on each page. Add Sanity Presentation/Visual Editing so
   editors can preview and navigate to content in context. Sanity's docs
   describe visual editing and configurable drag-and-drop page building with
   predefined components: [Visual Editing](https://www.sanity.io/docs/visual-editing),
   [Presentation and page building](https://www.sanity.io/docs/user-guides/preview-and-page-building),
   [drag and drop](https://www.sanity.io/docs/visual-editing/enabling-drag-and-drop).
   This is incremental and keeps custom club functionality, but still requires
   developers to build and maintain the approved section library.
2. **Consider Webflow** if visual page composition by editors is the top
   priority and the club can accept rebuilding bespoke features/integrations.
   Webflow's content editor supports editing CMS content and publishing, while
   structural design changes remain constrained by the site's design setup:
   [Webflow content editor](https://help.webflow.com/hc/en-us/articles/33961251014931-Edit-site-content-as-a-content-editor).
3. **Consider Squarespace or Wix Studio** if a hosted all-in-one builder is
   preferred over retaining the custom Next.js application. Their block/CMS
   systems support visual composition, with tradeoffs in custom behavior and
   migration effort: [Squarespace blocks](https://support.squarespace.com/hc/en-us/articles/206543757-Add-content-to-your-site-with-blocks),
   [Wix Studio CMS](https://support.wix.com/en/article/wix-studio-using-the-cms).

A bespoke website builder built from scratch would be a large ongoing product
and maintenance commitment. First prototype the Sanity section library against
the pages board members update most often (Membership, Events, Announcements,
and the PDF/calendar page), then compare that editor experience with a hosted
builder using the same real editing tasks. No platform migration is included
in this code change.

**Status:** Partially addressed. Studio shell and testing are improved; making
every layout and functional feature editable is a separate schema and rendering
project that should be scoped page by page.

## Verification record

Run from the repository root:

```sh
bun test
bun run lint
NEXT_PUBLIC_SANITY_PROJECT_ID=xi18pbe1 NEXT_PUBLIC_SANITY_DATASET=production bun run build
```

Browser checks in this change were against the local app at `localhost:3000`
with a signed-in Sanity session. They covered the Membership Studio route,
Announcements newsletter settings and Publish control, and the revised Pages
and Tests Passed navigation, including the embedded spreadsheet upload pane.
No production content was modified. Screenshots are visual evidence from the
local browser shown in the Codex task conversation, not committed image files.

## Follow-up — Studio navigation and misleading document actions

**Reported:** Website pages were buried under a second menu; Tests Passed
records appeared in three places; Board Members looked empty; custom top tabs
such as Vision and Manage Pages were unclear; and Publish remained enabled
after changing a field and undoing back to the published value.

**Changes in this iteration:**

- Built-in pages are now listed directly under **Pages**. **Custom pages** is
  in the same pane, preserving the different data types and their behavior.
- The **Tests Passed** menu contains all records, discipline-specific lists,
  and **Upload a spreadsheet** together. The standalone Manage Tests Passed
  tab was removed.
- Removed the duplicate standalone Manage Pages tab; custom pages use the
  native searchable Pages document list and open in their document editor.
- Grouped Board Members and Coaches under **People**; renamed settings entries
  to describe their purpose. Board Members are a Sanity collection consumed
  by the About page, not Site Settings.
- Removed Vision from the editor tab bar. It is a developer query tool and is
  not needed for routine editing.
- Wrapped Sanity's built-in Publish action so it remains disabled when draft
  content matches the published content, ignoring revision/timestamp metadata.
- Added a preview-first `scripts/seed-site-pages.ts` command for fixed-route
  published baselines missing from the dataset. With `--apply`, it creates
  missing published baselines and preserves any existing draft. It never
  overwrites an existing published document or creates a baseline when a
  release version exists. The script has not been applied to production.

**Safety boundary:** About, Membership, and the other built-in pages are fixed
website routes. Deleting their Sanity copy would not remove the route/layout;
it could only remove editable CMS fields and lead to confusing fallback
content. They remain protected from deletion/duplication as ordinary pages.
Custom pages can be deleted or duplicated. If the board wants a copy of a
built-in page as a separate URL, that should be an explicit “copy to custom
page” workflow that copies supported content and assigns a new slug.

**Validation:** Unit tests cover the publish action wrapper with a no-op draft
and a real content change. Browser testing confirmed the new Pages list and
the spreadsheet upload pane. I inspected About without editing it: it has a
draft but no published baseline, so its enabled Publish action is a first
publish rather than a no-op. I did not publish or change Sanity content. To
verify the undo case in the UI, first use a disposable document with a
published baseline, make a change, undo it, and confirm Publish disables. Run
the seed command without `--apply` first to review which fixed-route baselines
are absent.

The signed-in browser showed **No documents of this type** under **People →
Board members**, confirming that the collection is currently empty in the
selected dataset; the records do not live in Site Settings.
