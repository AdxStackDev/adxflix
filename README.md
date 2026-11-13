# ADXFLIX

TMDB movie discover app — static front-end with build-time token injection.

## How the token stays secure

`adxflix.html` contains a placeholder `__TMDB_BEARER__` where the real token
would go. During the Vercel build, `build.js` replaces that placeholder with
the real TMDB token from a Vercel environment variable.

```
GitHub repo     →  __TMDB_BEARER__  (placeholder, safe to commit)
       ↓
Vercel build    →  node build.js   (reads TMDB_BEARER from env var)
       ↓
Deployed HTML   →  real token injected, app works as before
```

The token never appears in the repo. The app calls TMDB directly from the
browser, exactly like it did before.

## Setup

### 1. Get your TMDB token
Go to <https://www.themoviedb.org/settings/api> → copy the **API Read Access Token**.

### 2. Add it to Vercel
Vercel dashboard → your project → Settings → Environment Variables:
- Key: `TMDB_BEARER`
- Value: *paste your token*
- Apply to: Production, Preview, Development

### 3. Deploy
Push to GitHub (Vercel auto-deploys) or run `vercel --prod`.

The build runs `node build.js`, which replaces the placeholder and outputs
to `dist/`. Vercel serves that folder.

## Local development

```bash
# Make sure .env.local exists with your token:
#   TMDB_BEARER=your_token_here

node dev-server.js
# → open http://localhost:3000
```

## Project structure

```
.
├── adxflix.html     # front-end (uses __TMDB_BEARER__ placeholder)
├── layout.css       # styles
├── build.js         # replaces placeholder with env var → dist/
├── dev-server.js    # local dev server (serves HTML with token injected)
├── vercel.json       # build command + output directory
├── package.json
├── .gitignore        # ignores .env*, dist/, node_modules/
├── .env.local        # your real token (gitignored, never committed)
├── .env.example      # documents the env var (no real value)
└── README.md
```
