// Minimal zero-dependency static file server for Railway (and any host).
// Serves the "Zero to Launched" site over HTTP on the port Railway provides.
const http = require("http");
const fs = require("fs");
const path = require("path");

// Serve from ./zero-to-launched when deploying from the repo root, or from
// the current directory if the host's root is already set to that folder.
const candidates = [path.join(__dirname, "zero-to-launched"), __dirname];
const ROOT =
  candidates.find((d) => fs.existsSync(path.join(d, "index.html"))) || __dirname;

const PORT = process.env.PORT || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

// Resolve a request path to a file inside ROOT, blocking directory traversal.
function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const resolved = path.normalize(path.join(ROOT, clean));
  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) return null;
  return resolved;
}

function handleRequest(req, res) {
  const requested = req.url === "/" ? "/index.html" : req.url;
  let filePath = resolvePath(requested);

  if (!filePath) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Bad request");
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, "index.html");

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // Serve the site's own 404 page when present.
        fs.readFile(path.join(ROOT, "404.html"), (e404, notFound) => {
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(e404 ? "404 — Not found" : notFound);
        });
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": TYPES[ext] || "application/octet-stream",
        "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600, immutable",
      });
      res.end(data);
    });
  });
}

function createServer() {
  return http.createServer(handleRequest);
}

// Start listening only when run directly (`node server.js`), not when required.
if (require.main === module) {
  createServer().listen(PORT, "0.0.0.0", () => {
    console.log(`Zero to Launched: serving "${ROOT}" on port ${PORT}`);
  });
}

module.exports = { createServer, handleRequest, ROOT };
