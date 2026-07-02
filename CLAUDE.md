# CLAUDE.md — faisalqayyum.com

Public consulting portfolio of Dr.-Ing. Faisal Qayyum (materials science professor).
Static HTML/CSS/vanilla JS, no build step, hosted on GitHub Pages with the custom
apex domain `faisalqayyum.com`. **This repo is public** — treat every commit accordingly.

## Non-negotiable conventions

- **Canonical domain is the apex with HTTPS: `https://faisalqayyum.com`** (no `www`).
  Never introduce `www.faisalqayyum.com` in canonicals, OG tags, JSON-LD, sitemap,
  or robots.txt. `www` and plain HTTP both 301-redirect to the apex (decided 2026-07-02).
- **Commit messages**: `Update site - <date>` style via `push-to-live.command`.
  **Never add "Co-Authored-By: Claude"** or any AI attribution — the owner does not
  want it in the public history.
- **Before any push**: review staged files for secrets/keys/credentials.
  `push-to-live.command` has an automated grep, but eyeball `git status` too.
- **Cache busting**: `style.css` and `main.js` are referenced with `?v=YYYYMMDD`
  on every page. When either file changes, bump the version **on all pages**
  (`grep -rl '?v=' --include='*.html' .` then sed). Stale unversioned JS once kept
  a fixed bug live for weeks.
- **Email address never appears in HTML source.** All mailto links are built in
  `assets/js/main.js` (`buildMailto`). Keep it that way.
- **Images**: max ~1600px wide, WebP preferred, target ≤200 KB. No multi-MB PNGs.

## Publishing a new blog post (four artifacts, one script)

1. Copy the **canonical template post** — the file named in
   `~/.claude/commands/blog-writing.md` under "Reference Standard" (currently
   `blog/posts/2026-06-how-to-build-postdoc-network-germany-phd.html`).
   It carries the full scaffold: canonical/OG/Twitter/article meta, favicon,
   BlogPosting + FAQPage + BreadcrumbList JSON-LD, reading progress bar,
   TOC, post-meta with reading time, component CSS, subscribe box.
   (`post-template.html` was deleted 2026-07-02 — it had drifted; do not recreate it.)
2. Add a `.blog-card` to **`blog/index.html`** (top of grid, newest first).
3. Add a `.blog-card.animate-on-scroll` to **`index.html` `#thoughts`** grid AND
   remove the 7th-newest card — the homepage holds a hard cap of **6 posts**
   (2 rows of 3). The dropped post stays reachable via "Read All Thoughts".
4. `sitemap.xml`, `feed.xml`, and `llms.txt` are **generated — do not hand-edit**.
   `push-to-live.command` runs `python3 tools/build-artifacts.py` automatically;
   it reads each post's BlogPosting JSON-LD (headline/dates/description/url),
   so that block must be complete and valid or the build aborts.

Blog voice, structure, personas, and audit workflow live in
`~/.claude/commands/blog-writing.md` (the `/blog-writing` skill). Use it for any
post writing or post auditing — do not re-derive style rules.

## Publishing a paid guest post (write-for-us)

`write-for-us.html` sells guest post placements. **Any author-bio or in-body link
back to the guest author's site must carry `rel="sponsored"`** (alongside `noopener`
if `target="_blank"`) — this is required by Google's paid-link policy and is the
reason the sales copy on `write-for-us.html` was rewritten 2026-07-03 to drop
"dofollow" language. Do not add a plain dofollow link for a paid placement; it
risks a manual action against the whole domain, not just that page.

## Site architecture notes

- Homepage is one long page with section anchors; blog posts are standalone files
  under `blog/posts/`. The homepage `#thoughts` grid and `blog/index.html` are
  **two separate grids with no shared data source** — posts must be added to both.
- Blog post navs intentionally hardcode `class="nav scrolled"` and have **no
  `id="nav"`** — wiring them to main.js's scroll handler would strip the dark
  bar styling at the top of the page. Leave as is.
- The contact modal (`#contactModalOverlay`) exists only on the homepage.
  Service cards open it with the chosen service appended to the mail subject
  (`pendingService` in main.js). Do not revert service cards to direct mailto —
  that caused ~10% dead-click sessions in Clarity.
- Subscribe boxes on posts/blog index go through `buildMailto` in main.js
  (section 17). Upgrade path: swap to a Formspree/Buttondown form when the
  owner provides an account ID.
- Analytics: Google Analytics `G-FFMZMDW2NV` + Microsoft Clarity `wan2qj09um`
  in the `<head>` of every page. Clarity is the primary UX-evidence source;
  LinkedIn is the dominant traffic referrer (~57% of sessions).

## Workflow expectations from the owner

- **Plan first**: present the approach before writing code; get approval.
- Audits: full read → numbered issue table (Location | Issue | Impact) →
  approval → implement **all** fixes in one pass → push.
- Prefer CSS-only hover interactions over JS.
- Blog content: avoid AI-sounding phrasing (see banned list in the blog skill);
  specific names/numbers/details read human, vague generalisations do not.
