# ADXFLIX

TMDB movie discover app — static front-end with a serverless API proxy
that keeps the TMDB bearer token out of the repo.

## How the token stays secure

The front-end never touches the TMDB API directly. Instead it calls
`/api/tmdb`, a [Vercel serverless function](api/tmdb.js) that adds the
`Authorization: Bearer` header server-side using an environment variable.

```
Browser  →  /api/tmdb?path=/discover/movie&...  →  Vercel function  →  api.themoviedb.org
                         (no token in browser)        (token from env var)
```

This means:
- The token is **never** in the repo or visible to users.
- The token is **never** shipped to the browser.

## Setup

### 1. Get your TMDB token
1. Go to <https://www.themoviedb.org/settings/api>
2. Copy the **API Read Access Token** (the long JWT-style string).

### 2. Add the token to Vercel
- In the Vercel dashboard → your project → **Settings → Environment Variables**
- Key: `TMDB_BEARER`
- Value: *paste your read access token*
- Apply to: Production, Preview, and Development

### 3. Deploy
```bash
vercel --prod
```
Or just push to GitHub — Vercel auto-deploys from the connected repo.

### Local development
```bash
npm i -g vercel     # if not already installed
vercel dev           # serves adxflix.html + the /api proxy locally
```

## Project structure

```
.
├── adxflix.html       # front-end (calls /api/tmdb, not TMDB directly)
├── layout.css         # styles
├── api/
│   └── tmdb.js         # serverless proxy — reads TMDB_BEARER from env
├── vercel.json         # route "/" → adxflix.html
├── package.json
├── .gitignore          # ignores .env, node_modules, .vercel
├── .env.example        # documents the env var (not committed with a real value)
└── README.md
```
