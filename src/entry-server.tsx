// Server entry used only at build time: `vite build --ssr src/entry-server.tsx`, then
// scripts/prerender.mjs calls render() for every route and writes the HTML into dist/.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { PROJECTS } from './data/portfolio';
import { projectPath } from './seo/meta';

const base = import.meta.env.BASE_URL;

// `file` is the page inside dist/ that seo/plugin.ts already wrote for this route.
export const routes = [
  { url: base, file: 'index.html' },
  ...PROJECTS.map(p => ({ url: `${base}${projectPath(p.slug)}`, file: `${projectPath(p.slug)}index.html` })),
];

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter basename={base} location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
