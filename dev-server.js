/**
 * Local dev server — builds adxflix.html (injects token from .env.local)
 * and serves it on http://localhost:3000.
 *
 * Run:   node dev-server.js
 * Open:  http://localhost:3000
 *
 * Zero dependencies — only uses Node.js built-ins.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const PORT = 3000;

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
    console.error("\n  !  TMDB_BEARER not found in env or .env.local");
    console.error("     Create .env.local with:  TMDB_BEARER=your_token_here\n");
    process.exit(1);
}

/* ---- cache the HTML with token injected ---- */
let html = fs.readFileSync(path.join(root, "adxflix.html"), "utf8");
html = html.replace("__TMDB_BEARER__", token);

const css = fs.existsSync(path.join(root, "layout.css"))
    ? fs.readFileSync(path.join(root, "layout.css"))
    : "";

const MIME = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8"
};

http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    if (url.pathname === "/" || url.pathname === "/adxflix.html") {
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(html);
    } else if (url.pathname === "/layout.css") {
        res.writeHead(200, { "Content-Type": MIME[".css"] });
        res.end(css);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 — " + url.pathname);
    }
}).listen(PORT, () => {
    console.log("\n  ADXFLIX running at  http://localhost:" + PORT + "\n");
    console.log("  Press Ctrl+C to stop.\n");
});
