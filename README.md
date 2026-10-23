# sudo-ayesh: Ayesh Ul Hassan's portfolio

Game developer portfolio (Unreal Engine 5 · Roblox · Unity), built with React 19, Vite, TypeScript and Tailwind.

**Live:** https://syedayeshulhassanbukhari.github.io/sudo-ayesh/

## Editing content

Everything on the site comes from **`src/data/portfolio.ts`**: profile, experience, education, skills,
projects, services (Fiverr gigs), FAQ, milestones and SEO keywords. Edit that file and rebuild; the page *and* all SEO output update together.
When a Fiverr price changes, update `SERVICES` too: the FAQ answers and structured data read their prices from it.

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
| JSON-LD: `ProfilePage`/`Person` (with `makesOffer` services), `FAQPage`, `WebSite`, `ItemList`, `VideoGame`, `BreadcrumbList` | Google rich results and AI answer engines |
| `project/<slug>/index.html` | A real, indexable page per project with its own meta tags |
| `sitemap.xml`, `robots.txt` (AI crawlers allowed), `llms.txt`, `llms-full.txt`, `site.webmanifest`, `404.html` | Discovery, AI assistants, PWA, SPA fallback |

Then `scripts/prerender.mjs` renders the app on the server (`src/entry-server.tsx`) and writes the full HTML
of the home page and every project page into `dist/`, so crawlers that don't run JavaScript see the real content.
The browser then hydrates that HTML (`src/main.tsx`).

Shared logic lives in `src/seo/meta.ts` (also used by the app to update tags during client-side navigation).

## Motion

Smooth scrolling (Lenis), scroll reveals (`.reveal` + `data-reveal="pop|left|right"`, driven by `useReveal`),
letter-pop headings (`SplitHeading`), pointer tilt/parallax (`usePointerTilt`), count-up stats, the skills
marquee and the hero entrance all live in `src/index.css`, `src/hooks/` and `src/components/`.
Everything switches off for visitors with *reduce motion* enabled in their OS.

**After deploying:** add the site to [Google Search Console](https://search.google.com/search-console),
paste the verification code into `SITE.googleSiteVerification`, then submit `sitemap.xml`.

## Develop & deploy

```bash
npm install
npm run dev       # http://localhost:3000/sudo-ayesh/
npm run build     # type-check, build, then pre-render every page into dist/
npm run preview   # serve dist/ locally
npm run deploy    # build and publish dist/ to the gh-pages branch
```

Moving to a custom domain or a root `<user>.github.io` repo: change `SITE.url` and `SITE.base` in `src/data/portfolio.ts`.

## Contact form

Uses EmailJS. Credentials are at the top of `src/sections/Contact.tsx`; see `SETUP_EMAILJS.md`.
