/**
 * TMDB API Proxy — serverless function for Vercel.
 *
 * The TMDB bearer token is read from the environment variable TMDB_BEARER
 * (set in the Vercel dashboard → Settings → Environment Variables).
 * It NEVER appears in the repo or reaches the browser.
 *
 * Usage from the front-end:
 *   GET /api/tmdb?path=/discover/movie&page=1&language=en-US
 *
 * The "path" param is the TMDB endpoint (e.g. /discover/movie).
 * All other query params are forwarded to TMDB as-is.
 */

module.exports = async (req, res) => {
    const { path, ...params } = req.query;

    if (!path) {
        return res.status(400).json({
            status_code: 400,
            status_message: "Missing 'path' query parameter."
        });
    }

    const bearer = process.env.TMDB_BEARER;
    if (!bearer) {
        return res.status(500).json({
            status_code: 500,
            status_message:
                "TMDB_BEARER environment variable is not set. " +
                "Add it in Vercel → Project → Settings → Environment Variables."
        });
    }

    // Build the upstream TMDB URL
    const url = new URL(`https://api.themoviedb.org/3${path}`);
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
            url.searchParams.set(key, String(value));
        }
    }

    try {
        const upstream = await fetch(url, {
            headers: {
                Authorization: `Bearer ${bearer}`,
                accept: "application/json"
            }
        });

        // Pass the raw body and status through unchanged
        res.status(upstream.status);
        res.setHeader("Content-Type", "application/json");
        res.send(await upstream.text());
    } catch (err) {
        res.status(502).json({
            status_code: 502,
            status_message: "Failed to reach TMDB. The service may be down."
        });
    }
};
