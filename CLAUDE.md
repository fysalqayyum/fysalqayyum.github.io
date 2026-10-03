# CLAUDE.md — faisalqayyum.com

Public consulting portfolio of Dr.-Ing. Faisal Qayyum (materials science professor).
Static HTML/CSS/vanilla JS, no build step, hosted on GitHub Pages with the custom
apex domain `faisalqayyum.com`. **This repo is public** — treat every commit accordingly.

**Read `PROJECT_MEMORY.md` first** (project root, git-ignored, local only). It holds
current state, settled decisions, and next steps. This file holds the conventions.
Do not duplicate content between the two, and never commit PROJECT_MEMORY.md — it
contains traffic figures and positioning notes that must not be public.

## Non-negotiable conventions

- **Canonical domain is the apex with HTTPS: `https://faisalqayyum.com`** (no `www`).
  Never introduce `www.faisalqayyum.com` in canonicals, OG tags, JSON-LD, sitemap,
  or robots.txt. `www` and plain HTTP both 301-redirect to the apex (decided 2026-07-02).
- **Commit messages**: `Update site - <date>` style via `push-to-live.command`.
  **Never add "Co-Authored-By: Claude"** or any AI attribution — the owner does not
  want it in the public history.
- **Before any push — hard gate**: run
  `python3 ~/.claude/lib/leak_scan/leak_scan.py --range origin/main..HEAD` and fix
  every finding. Commit identities in this repo use
  `fysalqayyum@users.noreply.github.com`; never commit a private address. An email
  is a leak both in a commit identity and inside a tracked file, and the gate
  catches both. Eyeball `git status` too.
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
3. The homepage `#thoughts` grid is a **curated "Start here" set of 3 cards**, career-first
   (since the 2026-10 redesign), not the newest posts. Only swap a card in when a new post
   is a better first read for the career or research audience.
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

- **Positioning (redesign 2026-10):** the site is "Faisal Qayyum Research Consulting".
  Light theme, petrol `--primary #0B4F6C` + burnt orange `--cta #C2410C` (buttons only),
  Source Serif 4 (headings) + Source Sans 3 (body). Old token names (`--accent-1`,
  `--bg-card`, ...) are aliases kept so inline post styles still resolve. The redesign
  layer and the shared service-page template CSS live at the **end** of `style.css`.
- **Pages:** homepage = consultancy landing, career-first (hero, career moves: Germany/Gulf,
  research help tiles, how it works, why-me + 3 testimonials, 3 curated posts, FAQ ×6, contact).
  Case stories live on `/about/#stories`. Academic profile, publications, awards,
  media and collaborations live on `/about/`. Services hub `/services/` groups all 15
  service pages into Finish & Publish, Careers & Mobility, Simulation & Materials,
  Training. No prices on the site.
- **One primary action:** any element with `data-help="<area>"` opens the contact picker on
  the homepage, or a pre-filled help email elsewhere (main.js section 9a; prompts =
  situation, deadline, what was tried). Every post ends in one `.help-box` matched to its
  area and has a `.post-byline` linking to `/about/` and the matching service page.
  main.js adds the mobile sticky help bar on posts and service pages only (not the
  homepage).
- **Shared chrome:** nav, mobile menu and footer markup are identical on every sub-page;
  copy them from any service page when creating a page.
- Homepage is one long page with section anchors; blog posts are standalone files
  under `blog/posts/`. The homepage `#thoughts` grid and `blog/index.html` are
  **two separate grids with no shared data source** — posts must be added to both.
- Blog post navs intentionally hardcode `class="nav scrolled"` and have **no
  `id="nav"`**. Leave as is.
- Contact = the Formspree help form on the homepage (`#helpForm`, main.js 9a/9c). `data-help`
  triggers preselect the topic and scroll to it; on other pages they go to
  `/?area=<key>#contact`. Do not go back to bare mailto links: that caused ~10% dead-click
  sessions in Clarity. Email (`buildMailto`) stays only as a fallback.
- Social image for every page: `assets/img/og-card-2026.jpg` (topic pages may use their own).
- "Write for Us" is deliberately not linked from the footer (positioning); the page stays live.
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
