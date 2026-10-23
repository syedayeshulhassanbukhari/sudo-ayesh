// Fills each built page's empty <div id="root"> with the server-rendered app, so search
// engines and AI crawlers that don't run JavaScript still get the full page content.
// Runs after `vite build` (client + seo/plugin.ts pages) and `vite build --ssr`.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssrDir = path.resolve('dist-ssr');
const { render, routes } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href);

const EMPTY_ROOT = '<div id="root"></div>';

for (const { url, file } of routes) {
  const target = path.join(dist, file);
  const html = fs.readFileSync(target, 'utf8');
  if (!html.includes(EMPTY_ROOT)) throw new Error(`No empty #root in ${file}`);
  fs.writeFileSync(target, html.replace(EMPTY_ROOT, `<div id="root">${render(url)}</div>`));
  console.log(`prerendered ${url} -> ${file}`);
}

fs.rmSync(ssrDir, { recursive: true, force: true });
