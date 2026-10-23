// Build-time SEO: injects meta tags and JSON-LD into index.html, then writes a static HTML
// page per project plus robots.txt, sitemap.xml, llms.txt, llms-full.txt, site.webmanifest
// and a 404.html SPA fallback into the output directory. scripts/prerender.mjs then fills
// each page's <div id="root"> with the server-rendered app.
import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { SITE, PROFILE, PROJECTS } from '../src/data/portfolio';
import {
  homeMeta, projectMeta, renderHead, renderLlmsTxt, renderLlmsFullTxt, absUrl, projectPath,
} from '../src/seo/meta';

const HEAD_RE = /<!-- seo:head -->[\s\S]*?<!-- \/seo:head -->/;

const head = (html: string) => `<!-- seo:head -->\n    ${html}\n    <!-- /seo:head -->`;

export function seoPlugin(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'portfolio-seo',

    configResolved(c) {
      config = c;
    },

    transformIndexHtml(html) {
      return html.replace(HEAD_RE, head(renderHead(homeMeta())));
    },

    closeBundle() {
      // Skip the SSR bundle pass (vite build --ssr), which has no index.html.
      if (config.command !== 'build' || config.build.ssr) return;
      const out = path.resolve(config.root, config.build.outDir);
      const indexHtml = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
      const write = (rel: string, content: string) => {
        const file = path.join(out, rel);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, content);
      };

      // One static page per project so each has its own title/description/OG/JSON-LD
      // and works as a direct link on GitHub Pages.
      for (const p of PROJECTS) {
        const html = indexHtml.replace(HEAD_RE, head(renderHead(projectMeta(p))));
        write(path.join(projectPath(p.slug), 'index.html'), html);
      }

      // GitHub Pages serves 404.html for unknown paths; the SPA router shows its own not-found view.
      write('404.html', indexHtml.replace(
        /<meta name="robots" content="[^"]*" \/>/,
        '<meta name="robots" content="noindex" />',
      ));

      const today = new Date().toISOString().slice(0, 10);
      const urls = ['', ...PROJECTS.map(p => projectPath(p.slug))];
      write('sitemap.xml', [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        ...urls.map(u => {
          const p = PROJECTS.find(x => projectPath(x.slug) === u);
          const imgs = u === ''
            ? [PROFILE.photo]
            : [...new Set([p?.image, ...(p?.gallery ?? []).map(g => g.src)].filter(Boolean) as string[])];
          return [
            '  <url>',
            `    <loc>${absUrl(u)}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <changefreq>${u === '' ? 'weekly' : 'monthly'}</changefreq>`,
            `    <priority>${u === '' ? '1.0' : '0.8'}</priority>`,
            ...imgs.map(i => `    <image:image><image:loc>${absUrl(i)}</image:loc></image:image>`),
            '  </url>',
          ].filter(Boolean).join('\n');
        }),
        '</urlset>',
        '',
      ].join('\n'));

      const aiBots = [
        'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
        'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended',
        'Bingbot', 'CCBot', 'cohere-ai', 'meta-externalagent', 'DuckAssistBot',
      ];
      write('robots.txt', [
        `# ${absUrl()}`,
        '# Search engines and AI assistants are welcome.',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        ...aiBots.flatMap(b => [`User-agent: ${b}`, 'Allow: /', '']),
        `Sitemap: ${absUrl('sitemap.xml')}`,
        `# LLM profile: ${absUrl('llms.txt')}`,
        '',
      ].join('\n'));

      write('llms.txt', renderLlmsTxt());
      write('llms-full.txt', renderLlmsFullTxt());

      write('site.webmanifest', JSON.stringify({
        name: `${PROFILE.name} | ${PROFILE.handle}`,
        short_name: PROFILE.handle,
        description: PROFILE.summary,
        start_url: SITE.base,
        scope: SITE.base,
        display: 'standalone',
        background_color: SITE.themeColor,
        theme_color: SITE.themeColor,
        icons: [
          { src: `${SITE.base}icon-192.png`, sizes: '192x192', type: 'image/png' },
          { src: `${SITE.base}icon-512.png`, sizes: '512x512', type: 'image/png' },
          { src: `${SITE.base}favicon.svg`, sizes: 'any', type: 'image/svg+xml' },
        ],
      }, null, 2));
    },
  };
}
