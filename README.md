# Dr.-Ing. Faisal Qayyum — Personal Website

Professional digital profile at [faisalqayyum.com](https://www.faisalqayyum.com), hosted on GitHub Pages.

Pure HTML5 / CSS3 / Vanilla JS — no build tools, no npm, no frameworks.

## Setup Checklist — Complete After Deployment

- [ ] Add your photos: rename `iP2-2.jpg` to `fq-hero.jpg`, `iP1.jpg` to `fq-about.jpg`, `iP3-3.jpg` to `fq-vlog.jpg`, place all in `/assets/img/`
- [ ] Create `og-image.jpg` (1200x630px) for social sharing — add to `/assets/img/`
- [ ] Update YouTube links in `#media` section with actual playlist URLs
- [ ] Update Podcast link in `#contact` section
- [ ] Replace 3 placeholder blog post thumbnails with real video thumbnails (use: `https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg`)
- [ ] Collect real testimonials from Muhammad Umar, Teqwa Khalifa, Shao-Shen Tseng, and Fariha Mukhtar to replace placeholders
- [ ] Submit `sitemap.xml` to Google Search Console (https://search.google.com/search-console)
- [ ] Verify site in Google Search Console and request indexing
- [ ] Install GitHub Pages in repo Settings > Pages (if not auto-deployed)
- [ ] Configure Dynadot DNS as per `DEPLOYMENT.md`

## File Structure

```
fysalqayyum.github.io/
├── index.html              <- Main single-page site
├── CNAME                   <- Contains: faisalqayyum.com
├── robots.txt
├── sitemap.xml
├── 404.html
├── README.md
├── DEPLOYMENT.md
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── img/
│       ├── fq-hero.jpg     <- PLACEHOLDER: user will add iP2-2.jpg renamed
│       ├── fq-about.jpg    <- PLACEHOLDER: user will add iP1.jpg renamed
│       ├── fq-vlog.jpg     <- PLACEHOLDER: user will add iP3-3.jpg renamed
│       └── og-image.jpg    <- PLACEHOLDER: 1200x630 social share image
└── blog/
    ├── index.html          <- Blog listing page
    └── posts/
        ├── post-template.html        <- Copy this to create new posts
        └── 2026-03-welcome.html      <- First SEO post
```

## Adding New Blog Posts

See instructions in `/blog/posts/post-template.html`.

## Tech Stack

- HTML5 semantic markup
- CSS3 custom properties, Grid, Flexbox
- Vanilla JavaScript (IntersectionObserver, smooth scroll, accordion)
- Google Fonts (Inter)
- JSON-LD structured data (Person, FAQPage, BlogPosting)
- Open Graph + Twitter Card meta tags
