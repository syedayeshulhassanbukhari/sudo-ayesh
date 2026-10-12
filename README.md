# sudo-ayesh: Ayesh Ul Hassan's portfolio

Game developer portfolio (Unreal Engine 5 · Roblox · Unity), built with React 19, Vite, TypeScript and Tailwind.

**Live:** https://syedayeshulhassanbukhari.github.io/sudo-ayesh/

## Editing content

Everything on the site comes from **`src/data/portfolio.ts`**: profile, experience, education, skills,
projects, milestones and SEO keywords. Edit that file and rebuild; the page *and* all SEO output update together.

- **Add a project:** add an entry to `PROJECTS`. List order is the order on the page; the Timeline view sorts by `sortKey` (`YYYY-MM`).
  Put screenshots in `public/projectImages/` (JPG/WebP, ~1600px wide) and set `image`. Projects without an image get generated cover art.
- **Add a skill icon:** use a [simple-icons](https://simpleicons.org) export name (e.g. `siUnity`) and register it in `src/components/SkillIcon.tsx`.
- **Resume:** replace `public/Ayesh-Ul-Hassan-CV.pdf`.

## SEO / GEO

`seo/plugin.ts` runs at build time and generates:

| Output | What it's for |
|---|---|
| `<title>`, description, keywords, canonical, robots | Search engines |
| Open Graph + Twitter cards (`public/og-image.png`) | Link previews on LinkedIn, Discord, X, WhatsApp |
| JSON-LD: `ProfilePage`/`Person`, `WebSite`, `ItemList`, `VideoGame`, `BreadcrumbList` | Google rich results and AI answer engines |
| `<noscript>` copy of each page's content | Crawlers that don't run JavaScript |
| `project/<slug>/index.html` | A real, indexable page per project with its own meta tags |
| `sitemap.xml`, `robots.txt` (AI crawlers allowed), `llms.txt`, `site.webmanifest`, `404.html` | Discovery, AI assistants, PWA, SPA fallback |

Shared logic lives in `src/seo/meta.ts` (also used by the app to update tags during client-side navigation).

**After deploying:** add the site to [Google Search Console](https://search.google.com/search-console),
paste the verification code into `SITE.googleSiteVerification`, then submit `sitemap.xml`.

## Develop & deploy

```bash
npm install
npm run dev       # http://localhost:3000/sudo-ayesh/
npm run build     # type-check + build to dist/
npm run preview   # serve dist/ locally
npm run deploy    # build and publish dist/ to the gh-pages branch
```

Moving to a custom domain or a root `<user>.github.io` repo: change `SITE.url` and `SITE.base` in `src/data/portfolio.ts`.

## Contact form

Uses EmailJS. Credentials are at the top of `src/sections/Contact.tsx`; see `SETUP_EMAILJS.md`.
