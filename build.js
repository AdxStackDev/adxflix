/**
 * Build script — replaces __TMDB_BEARER__ in adxflix.html with the real
 * token from the TMDB_BEARER environment variable, then copies everything
 * to the dist/ folder for Vercel to serve.
 *
 * Token source (in priority order):
 *   1. process.env.TMDB_BEARER  (Vercel sets this from the dashboard)
 *   2. .env.local               (local development fallback)
 *
 * Run:  node build.js
 */

const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

/* ---- get the token ---- */
let token = process.env.TMDB_BEARER;

if (!token) {
    const envFile = path.join(root, ".env.local");
    if (fs.existsSync(envFile)) {
        const match = fs.readFileSync(envFile, "utf8").match(/TMDB_BEARER\s*=\s*(.+)/);
        if (match) token = match[1].trim();
    }
}

if (!token) {
    console.error("\n  !  TMDB_BEARER not found.");
    console.error("     Set it as a Vercel env var, or put it in .env.local\n");
    process.exit(1);
}

/* ---- create dist/ ---- */
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

/* ---- inject token into HTML ---- */
let html = fs.readFileSync(path.join(root, "adxflix.html"), "utf8");
html = html.replace("__TMDB_BEARER__", token);
fs.writeFileSync(path.join(dist, "adxflix.html"), html);

/* ---- copy static files ---- */
const staticFiles = ["layout.css"];
for (const file of staticFiles) {
    const src = path.join(root, file);
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, file));
}

console.log("  Build complete → dist/");
