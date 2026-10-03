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
    (f"{SITE}/services/", git_date("services/index.html"), "monthly", "0.9"),
    (f"{SITE}/about/", git_date("about/index.html"), "monthly", "0.8"),
    (f"{SITE}/services/phd-research-rescue.html",
     git_date("services/phd-research-rescue.html"), "monthly", "0.9"),
    (f"{SITE}/services/academic-career-germany.html",
     git_date("services/academic-career-germany.html"), "monthly", "0.9"),
    (f"{SITE}/services/academic-jobs-saudi-arabia-gulf.html",
     git_date("services/academic-jobs-saudi-arabia-gulf.html"), "monthly", "0.9"),
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
    (f"{SITE}/privacy.html", git_date("privacy.html"), "yearly", "0.2"),
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
    <title>Faisal Qayyum Research Consulting — Blog</title>
    <link>{SITE}/blog/</link>
    <atom:link href="{SITE}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical guides for researchers: finishing a PhD, getting papers published, academic careers in Germany and the Gulf, and crystal plasticity and materials simulation.</description>
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
llms = f"""# Faisal Qayyum Research Consulting

> Research consulting by Dr.-Ing. Faisal Qayyum, a materials scientist and mechanical engineer (Dr.-Ing. magna cum laude, TU Bergakademie Freiberg, Germany; nine years at Freiberg; Assistant Professor at the University of Tabuk, Saudi Arabia, since February 2026). Helps researchers who are stuck with a PhD, a paper, a supervisor conflict or a career move to Germany or the Gulf, and consults on crystal plasticity and materials simulation for labs and industry. Google Scholar: 1,371 citations, h-index 23 (September 2026). 150+ manuscripts reviewed; editorial board, Discover Materials (Springer Nature). Works remotely in English, German and Urdu. Services, not outcomes: no guaranteed admissions, acceptances or jobs; no ghostwriting; career coaching is not recruitment.

Site: {SITE}/
How to start: describe your situation at {SITE}/#contact or book a free 15-minute call: https://cal.eu/fysalqayyum/15min
About: {SITE}/about/
All services: {SITE}/services/

## Finish & Publish
- PhD & research rescue (stalled PhD, supervisor conflict, authorship dispute, rejected paper): {SITE}/services/phd-research-rescue.html
- Scientific writing coaching and reviewer responses: {SITE}/services/scientific-writing-coaching.html
- PhD & research mentoring: {SITE}/services/phd-research-mentoring.html
- Grant proposal consulting: {SITE}/services/grant-proposal-consulting.html

## Careers & Mobility
- PhD, postdoc and research careers in Germany (coaching): {SITE}/services/academic-career-germany.html
- Academic jobs in Saudi Arabia and the Gulf (coaching): {SITE}/services/academic-jobs-saudi-arabia-gulf.html

## Simulation & Materials
- Crystal plasticity simulation (DAMASK): {SITE}/services/crystal-plasticity-simulation-consulting.html
- Metal forming FEM (ABAQUS): {SITE}/services/metal-forming-fem-consulting.html
- Phase field simulation: {SITE}/services/phase-field-simulation-consulting.html
- EBSD and microstructure analysis: {SITE}/services/ebsd-analysis-consulting.html
- Materials failure analysis: {SITE}/services/materials-failure-analysis.html
- Mechanical test data analysis: {SITE}/services/mechanical-test-data-analysis.html
- Process-structure-property analysis: {SITE}/services/process-structure-property-analysis.html
- Multiscale modeling strategy: {SITE}/services/multiscale-modeling-strategy.html

## Training
- Custom courses and workshops for research groups: {SITE}/services/custom-digital-courses-workshops.html

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
