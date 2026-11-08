const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const host = "127.0.0.1";
const basePort = Number(process.env.PORT || 8080);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

const server = http.createServer((request, response) => {
  const pathname = decodeURIComponent((request.url || "/").split("?")[0]);
  const relative = (pathname === "/" ? "prototype/" : pathname).replace(
    /^\/+/,
    ""
  );
  const target = path.resolve(
    root,
    relative.endsWith("/") ? `${relative}index.html` : relative
  );

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Accès refusé");
    return;
  }

  fs.readFile(target, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Fichier introuvable");
      return;
    }

    const type = types[path.extname(target).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
});

function start(port) {
  const onError = (error) => {
    if (error.code === "EADDRINUSE" && port < basePort + 20) {
      start(port + 1);
      return;
    }
    throw error;
  };

  server.once("error", onError);
  server.listen(port, host, () => {
    server.removeListener("error", onError);
    console.log(`Prototype local : http://${host}:${port}/prototype/`);
  });
}

start(basePort);
