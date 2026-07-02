#!/usr/bin/env python3
"""Generate sitemap.xml, feed.xml (RSS 2.0), and llms.txt from blog post metadata.

Run from the repo root (push-to-live.command does this automatically):
    python3 tools/build-artifacts.py

Source of truth is each post's BlogPosting JSON-LD block (headline,
datePublished, dateModified, description, url). If a post is missing that
block, the build fails loudly rather than publishing an incomplete sitemap.
"""

import glob
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

SITE = "https://faisalqayyum.com"

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))


def git_date(path, fallback=None):
    try:
        out = subprocess.run(
            ["git", "log", "-1", "--format=%as", "--", path],
            capture_output=True, text=True, check=True,
        ).stdout.strip()
        if out:
            return out
    except Exception:
        pass
    return fallback or datetime.now().strftime("%Y-%m-%d")


def post_meta(path):
    html = open(path).read()
    for block in re.findall(
        r'<script type="application/ld\+json">(.*?)</script>', html, re.S
    ):
        data = json.loads(block)
        if data.get("@type") == "BlogPosting":
            return {
                "title": data["headline"],
                "published": data["datePublished"],
                "modified": data.get("dateModified", data["datePublished"]),
                "description": data["description"],
                "url": data["url"],
            }
    sys.exit(f"ERROR: no BlogPosting JSON-LD in {path} — fix the post before publishing.")


posts = sorted(
    (post_meta(f) for f in glob.glob("blog/posts/2026-*.html")),
    key=lambda p: p["published"],
    reverse=True,
)

# ── sitemap.xml ──────────────────────────────────────
static = [
    (f"{SITE}/", git_date("index.html"), "weekly", "1.0"),
    (f"{SITE}/blog/", git_date("blog/index.html"), "weekly", "0.8"),
    (f"{SITE}/services/crystal-plasticity-simulation-consulting.html",
     git_date("services/crystal-plasticity-simulation-consulting.html"), "monthly", "0.9"),
    (f"{SITE}/services/scientific-writing-coaching.html",
     git_date("services/scientific-writing-coaching.html"), "monthly", "0.9"),
    (f"{SITE}/services/phd-research-mentoring.html",
     git_date("services/phd-research-mentoring.html"), "monthly", "0.9"),
    (f"{SITE}/services/grant-proposal-consulting.html",
     git_date("services/grant-proposal-consulting.html"), "monthly", "0.9"),
    (f"{SITE}/services/materials-failure-analysis.html",
     git_date("services/materials-failure-analysis.html"), "monthly", "0.9"),
    (f"{SITE}/services/ebsd-analysis-consulting.html",
     git_date("services/ebsd-analysis-consulting.html"), "monthly", "0.9"),
    (f"{SITE}/services/metal-forming-fem-consulting.html",
     git_date("services/metal-forming-fem-consulting.html"), "monthly", "0.9"),
    (f"{SITE}/services/phase-field-simulation-consulting.html",
     git_date("services/phase-field-simulation-consulting.html"), "monthly", "0.9"),
    (f"{SITE}/services/mechanical-test-data-analysis.html",
     git_date("services/mechanical-test-data-analysis.html"), "monthly", "0.9"),
    (f"{SITE}/services/process-structure-property-analysis.html",
     git_date("services/process-structure-property-analysis.html"), "monthly", "0.9"),
    (f"{SITE}/services/multiscale-modeling-strategy.html",
     git_date("services/multiscale-modeling-strategy.html"), "monthly", "0.9"),
    (f"{SITE}/services/custom-digital-courses-workshops.html",
     git_date("services/custom-digital-courses-workshops.html"), "monthly", "0.9"),
    (f"{SITE}/write-for-us.html", git_date("write-for-us.html"), "monthly", "0.5"),
]
lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, lastmod, freq, prio in static:
    lines += ["  <url>", f"    <loc>{loc}</loc>", f"    <lastmod>{lastmod}</lastmod>",
              f"    <changefreq>{freq}</changefreq>", f"    <priority>{prio}</priority>", "  </url>"]
for p in posts:
    lines += ["  <url>", f"    <loc>{p['url']}</loc>", f"    <lastmod>{p['modified']}</lastmod>",
              "    <changefreq>monthly</changefreq>", "    <priority>0.7</priority>", "  </url>"]
lines.append("</urlset>")
open("sitemap.xml", "w").write("\n".join(lines) + "\n")

# ── feed.xml (RSS 2.0) ───────────────────────────────
def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def rfc822(d):
    return datetime.strptime(d, "%Y-%m-%d").replace(tzinfo=timezone.utc).strftime(
        "%a, %d %b %Y 00:00:00 +0000"
    )


items = []
for p in posts[:20]:
    items.append(f"""    <item>
      <title>{esc(p['title'])}</title>
      <link>{p['url']}</link>
      <guid isPermaLink="true">{p['url']}</guid>
      <pubDate>{rfc822(p['published'])}</pubDate>
      <description>{esc(p['description'])}</description>
    </item>""")

feed = f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Dr.-Ing. Faisal Qayyum — Blog &amp; Thoughts</title>
    <link>{SITE}/blog/</link>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Research insights, career reflections, and technical notes on crystal plasticity, DAMASK, ABAQUS, and scientific writing.</description>
    <language>en</language>
    <lastBuildDate>{rfc822(posts[0]['published'])}</lastBuildDate>
{chr(10).join(items)}
  </channel>
</rss>
"""
open("feed.xml", "w").write(feed)

# ── llms.txt ─────────────────────────────────────────
post_lines = "\n".join(
    f"- [{p['title']}]({p['url']}) ({p['published']}): {p['description']}" for p in posts
)
llms = f"""# Dr.-Ing. Faisal Qayyum

> Assistant Professor of Mechanical Engineering at the University of Tabuk, Saudi Arabia. PhD (magna cum laude) from TU Bergakademie Freiberg, Germany. Consultant in crystal plasticity simulation (DAMASK), metal forming FEM (ABAQUS), EBSD/microstructure analysis, PhD mentoring, scientific writing coaching, and grant proposal consulting. 39+ peer-reviewed publications, 1,230+ citations, h-index 22.

Site: {SITE}/ — all consulting engagements are scoped individually.
Book a 15-minute discovery call: https://cal.eu/fysalqayyum/15min

## Consulting services
- Crystal plasticity simulation (DAMASK): CPFEM model setup, calibration, interpretation — details: {SITE}/services/crystal-plasticity-simulation-consulting.html
- Metal forming FEM (ABAQUS): forging, rolling, extrusion, sheet forming, thermo-mechanical coupling — details: {SITE}/services/metal-forming-fem-consulting.html
- Phase field simulation: recrystallization, spheroidization, grain growth — details: {SITE}/services/phase-field-simulation-consulting.html
- Mechanical test data analysis: tensile, fatigue, hardness, impact (analytical, no lab work) — details: {SITE}/services/mechanical-test-data-analysis.html
- Microstructure characterization: SEM, EBSD, DIC interpretation; MTEX texture analysis — details: {SITE}/services/ebsd-analysis-consulting.html
- Process-structure-property analysis — details: {SITE}/services/process-structure-property-analysis.html
- Multiscale modeling strategy — details: {SITE}/services/multiscale-modeling-strategy.html
- Materials failure analysis, incl. expert witness contexts — details: {SITE}/services/materials-failure-analysis.html
- PhD & research mentoring — details: {SITE}/services/phd-research-mentoring.html
- Scientific writing coaching — details: {SITE}/services/scientific-writing-coaching.html
- Grant proposal consulting (DFG, AvH, DAAD, EU Horizon) — details: {SITE}/services/grant-proposal-consulting.html
- Custom digital courses and workshops for research teams — details: {SITE}/services/custom-digital-courses-workshops.html

## Blog posts
{post_lines}

## Profiles
- LinkedIn: https://www.linkedin.com/in/fysalqayyum/
- Google Scholar: https://scholar.google.com/citations?user=lXrpH_AAAAAJ
- ResearchGate: https://www.researchgate.net/profile/Faisal-Qayyum-2
- ORCID: https://orcid.org/0000-0001-6393-2858
- YouTube (tutorials, podcasts): https://www.youtube.com/@FaisalQayyum
"""
open("llms.txt", "w").write(llms)

print(f"OK: sitemap.xml ({len(static) + len(posts)} URLs), feed.xml ({len(items)} items), llms.txt ({len(posts)} posts)")
