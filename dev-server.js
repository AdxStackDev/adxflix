const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const PORT = 3000;

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".webp": "image/webp"
};

/* ---- read token from .env.local ---- */
let token = process.env.TMDB_BEARER;
if (!token) {
    const envFile = path.join(root, ".env.local");
    if (fs.existsSync(envFile)) {
        const match = fs.readFileSync(envFile, "utf8").match(/TMDB_BEARER\s*=\s*(.+)/);
        if (match) token = match[1].trim();
    }
}
if (!token) {
    console.error("\n  !  TMDB_BEARER not found in env or .env.local\n");
    process.exit(1);
}

http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let filePath = url.pathname === "/" ? "/adxflix.html" : url.pathname;
    const resolved = path.resolve(root, "." + filePath);

    // prevent path traversal
    if (!resolved.startsWith(root)) {
        res.writeHead(403); return res.end("Forbidden");
    }

    if (!fs.existsSync(resolved)) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("404 — " + filePath);
    }

    const ext = path.extname(resolved);
    let content = fs.readFileSync(resolved);

    // inject token into any HTML file that has the placeholder
    if (ext === ".html") {
        content = content.toString().replace(/__TMDB_BEARER__/g, token);
    }

    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(content);

}).listen(PORT, () => {
    console.log("\n  Dev server running at  http://localhost:" + PORT);
    console.log("  Serving all files from: " + root + "\n");
});
