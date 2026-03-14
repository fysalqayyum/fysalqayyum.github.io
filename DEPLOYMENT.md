# Deployment Guide

## GitHub Pages Setup

1. Create repo named `fysalqayyum.github.io`
2. Push all files to `main` branch
3. Go to repo Settings > Pages > Source: Deploy from branch `main`, root `/`
4. Under Custom domain: enter `faisalqayyum.com` > Save
5. Check "Enforce HTTPS" (after DNS propagates ~10 min)

## Dynadot DNS Configuration

Log into Dynadot > Manage Domains > faisalqayyum.com > DNS Settings:

| Type  | Host | Value                    | TTL   |
|-------|------|--------------------------|-------|
| A     | @    | 185.199.108.153          | 3600  |
| A     | @    | 185.199.109.153          | 3600  |
| A     | @    | 185.199.110.153          | 3600  |
| A     | @    | 185.199.111.153          | 3600  |
| CNAME | www  | fysalqayyum.github.io.   | 3600  |

DNS propagation: 10-60 minutes. HTTPS certificate: issued automatically by GitHub.

## Quick Deploy Commands

```bash
git init
git add .
git commit -m "Initial site deployment"
git branch -M main
git remote add origin https://github.com/fysalqayyum/fysalqayyum.github.io.git
git push -u origin main
```

## Adding New Blog Posts

See instructions in `/blog/posts/post-template.html`
