# ADXFLIX

A movie and TV show discovery app powered by the TMDB API, with embedded streaming via VidSrc and VidBolt.

## Features

- **Movies & TV Shows** — toggle between both from the navbar
- **Discover & Filter** — by streaming provider, genre, region, language, year, rating, votes, runtime, and release period
- **Sort** — popularity, rating, votes, release date, title, revenue (movies)
- **Embedded player** — 3 sources: VidSrc (Player 1), VidSrc TMDB (Player 2), VidBolt (Player 3)
- **TV season/episode picker** — select season and episode directly in the modal
- **Active filter chips** — see and remove applied filters inline
- **Shareable URLs** — filters and page are synced to the URL query string
- **Mobile responsive** — from Nokia 320px to foldable/tablet to 1280px+ desktop

## Project structure

```
.
├── adxflix.html     # single-page app (all HTML, CSS, JS)
├── layout.css       # shared base styles
├── build.js         # injects TMDB_BEARER token at build time → dist/
├── dev-server.js    # local dev server (reads token from .env.local)
├── vercel.json      # build command + output directory for Vercel
├── package.json     # declares "build" script so Vercel picks it up
├── .env.local       # your real token (gitignored, never committed)
├── .env.example     # documents the required env var
└── README.md
```

## How the TMDB token is secured

The token is never stored in the repo. `adxflix.html` contains the placeholder `__TMDB_BEARER__`. At build time `build.js` replaces it with the real value from an environment variable.

```
GitHub repo    →  __TMDB_BEARER__  (safe to commit)
      ↓
Vercel build   →  node build.js    (reads TMDB_BEARER from dashboard)
      ↓
Deployed HTML  →  real token injected, app works
```

## Setup

### 1. Get a TMDB token

Go to [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) and copy the **API Read Access Token** (the long JWT string).

### 2. Add it to Vercel

Vercel dashboard → your project → **Settings → Environment Variables**

| Key | Value | Environments |
|---|---|---|
| `TMDB_BEARER` | your token | Production, Preview, Development |

### 3. Deploy

Push to GitHub — Vercel auto-deploys and runs `node build.js` which injects the token before serving.

### Local development

```bash
# 1. Create .env.local with your token
echo "TMDB_BEARER=your_token_here" > .env.local

# 2. Start the dev server
node dev-server.js

# 3. Open http://localhost:3000
```

The dev server reads from `.env.local` and injects the token at serve time. Opening `adxflix.html` directly in a browser won't work because the placeholder won't be replaced.

## Player sources

### Movies
| Button | Source | URL pattern |
|---|---|---|
| Player 1 | VidSrc (IMDb) | returned by `vidsrc.sh/info/movie/{id}.json` |
| Player 2 | VidSrc (TMDB) | returned by `vidsrc.sh/info/movie/{id}.json` |
| VidBolt | VidBolt | `vidbolt.xyz/movie/{tmdb_id}` |

### TV Shows
| Button | Source | URL pattern |
|---|---|---|
| Player 1 | VidSrc | `vidsrc.sh/embed/tv/{id}/{season}/{episode}` |
| VidBolt | VidBolt | `vidbolt.xyz/tv/{tmdb_id}/{season}/{episode}` |

For TV, selecting a different season or episode in the picker reloads the player automatically. VidSrc also supports `vidsrc.sh/embed/tv/{id}` (no season/episode) which opens its own built-in picker and resumes the last-watched position.

## TMDB API endpoints used

| Endpoint | Purpose |
|---|---|
| `GET /discover/movie` | Movie results with filters |
| `GET /discover/tv` | TV show results with filters |
| `GET /genre/movie/list` | Movie genre list |
| `GET /genre/tv/list` | TV genre list |
| `GET /watch/providers/movie` | Movie streaming providers by region |
| `GET /watch/providers/tv` | TV streaming providers by region |
| `GET /configuration/languages` | Language list for the language filter |
| `GET /configuration/countries` | Country list for the region filter |
| `GET /movie/{id}` | Full movie details + providers + credits |
| `GET /tv/{id}` | Full TV show details + providers + credits |
| `GET /tv/{id}/season/{n}` | Episode count when switching seasons |
