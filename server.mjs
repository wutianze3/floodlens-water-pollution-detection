import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT || 8080);
const root = process.cwd();
const modelService = process.env.MODEL_SERVICE_URL || 'http://127.0.0.1:8000';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };

createServer(async (req, res) => {
  if (req.url === '/api/health') {
    try {
      const modelResponse = await fetch(`${modelService}/health`, { signal: AbortSignal.timeout(1500) });
      const model = await modelResponse.json();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', model }));
    } catch {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: 'ok', model: { status: 'offline' } }));
    }
  }
  if (req.url === '/api/analyze' && req.method === 'POST') {
    try {
      const chunks = [];
      let total = 0;
      for await (const chunk of req) {
        total += chunk.length;
        if (total > 15 * 1024 * 1024) throw new Error('IMAGE_TOO_LARGE');
        chunks.push(chunk);
      }
      const modelResponse = await fetch(`${modelService}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': req.headers['content-type'] || 'application/octet-stream' },
        body: Buffer.concat(chunks),
        signal: AbortSignal.timeout(30000)
      });
      const body = await modelResponse.text();
      res.writeHead(modelResponse.status, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(body);
    } catch (error) {
      const tooLarge = error.message === 'IMAGE_TOO_LARGE';
      res.writeHead(tooLarge ? 413 : 503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: tooLarge ? error.message : 'MODEL_SERVICE_OFFLINE' }));
    }
  }
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
    const filePath = normalize(join(root, relative));
    if (!filePath.startsWith(normalize(root))) throw new Error('invalid path');
    if (!(await stat(filePath)).isFile()) throw new Error('not a file');
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => console.log(`FloodLens running at http://localhost:${port}`));
