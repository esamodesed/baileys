const http = require('http');

function createAPI(options = {}) {
  const port = options.port || 3000;
  const sock = options.sock || null;
  const routes = {};

  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const url = new URL(req.url, `http://${req.headers.host}`);
    const key = `${req.method} ${url.pathname}`;
    if (routes[key]) {
      try {
        const body = await readBody(req);
        const result = await routes[key]({
          query: Object.fromEntries(url.searchParams),
          body, sock
        });
        res.end(JSON.stringify({ ok: true, result }));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ ok: false, error: 'Not found' }));
    }
  });

  function readBody(req) {
    return new Promise(resolve => {
      let chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString() || '{}')); }
        catch { resolve({}); }
      });
    });
  }

  return {
    get(path, handler) { routes[`GET ${path}`] = handler; return this; },
    post(path, handler) { routes[`POST ${path}`] = handler; return this; },
    start() { server.listen(port, () => console.log(`🌐 API running on :${port}`)); },
    stop() { server.close(); }
  };
}

module.exports = { createAPI };
