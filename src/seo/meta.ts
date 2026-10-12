// Page metadata + structured data, shared by the app (client-side navigation)
// and seo/plugin.ts (static HTML generated at build time).
import {
  SITE, PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, CORE_SKILLS, SECONDARY_SKILLS,
  MILESTONES, KEYWORDS, PROJECTS, type Project,
} from '../data/portfolio';

export interface PageMeta {
  path: string; // relative to the site root, '' for home, e.g. 'project/locked-in-fear/'
  title: string;
  description: string;
  image: string; // absolute URL
  imageAlt: string;
  type: 'website' | 'article';
  keywords: string[];
  jsonLd: object[];
}

export const absUrl = (path = '') => `${SITE.url}/${path}`;
export const projectPath = (slug: string) => `project/${slug}/`;

const person = () => ({
  '@type': 'Person',
  '@id': `${absUrl()}#person`,
  name: PROFILE.name,
  alternateName: PROFILE.handle,
  url: absUrl(),
  image: absUrl(PROFILE.photo),
  email: `mailto:${PROFILE.email}`,
  jobTitle: PROFILE.role,
  description: PROFILE.summary,
  address: { '@type': 'PostalAddress', addressLocality: 'Peshawar', addressCountry: 'PK' },
  knowsAbout: [...CORE_SKILLS, ...SECONDARY_SKILLS].map(s => s.name)
    .concat(['Gameplay Programming', 'NPC AI', 'Stealth Mechanics', 'VFX', 'UI/UX', 'Level Design']),
  sameAs: PROFILE.socials.map(s => s.url),
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'City University of Science and Information Technology, Peshawar' },
    { '@type': 'EducationalOrganization', name: 'Peshawar Model Degree College' },
  ],
  worksFor: { '@type': 'Organization', name: 'Zehn Studio 26' },
  hasOccupation: EXPERIENCE.map(e => ({
    '@type': 'Occupation',
    name: e.title,
    description: `${e.org} (${e.date})`,
  })),
  hasCredential: CERTIFICATIONS.map(c => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.title,
    recognizedBy: { '@type': 'Organization', name: c.org },
    dateCreated: c.date,
  })),
});

const projectSchema = (p: Project) => {
  const isGame = p.categories.includes('Games') || p.categories.includes('Roblox');
  const live = p.links.find(l => l.kind === 'site' || l.kind === 'play' || l.kind === 'store');
  return {
    '@type': isGame ? 'VideoGame' : 'SoftwareApplication',
    name: p.title,
    description: p.summary,
    url: absUrl(projectPath(p.slug)),
    ...(p.image || p.gallery?.length
      ? { image: [...new Set([p.image, ...(p.gallery ?? []).map(g => g.src)].filter(Boolean) as string[])].map(i => absUrl(i)) }
      : {}),
    ...(isGame
      ? { genre: p.kind, gamePlatform: p.engine === 'Roblox Studio' ? 'Roblox' : 'PC' }
      : { applicationCategory: p.engine === 'Web' ? 'WebApplication' : 'MobileApplication' }),
    operatingSystem: p.engine === 'Roblox Studio' ? 'Roblox' : undefined,
    keywords: p.tags.join(', '),
    creator: { '@id': `${absUrl()}#person` },
    ...(live ? { sameAs: live.url } : {}),
  };
};

export function homeMeta(): PageMeta {
  const projects = PROJECTS;
  return {
    path: '',
    title: `${PROFILE.name} (${PROFILE.handle}) | Game Developer: Unreal Engine 5, Roblox & Unity`,
    description:
      `Portfolio of ${PROFILE.name}, a game developer from Peshawar working in Unreal Engine 5, Roblox and Unity: gameplay systems, NPC AI, stealth mechanics, VFX and UI/UX. Shipped Locked In Fear (500+ wishlists).`,
    image: absUrl(SITE.ogImage),
    imageAlt: `${PROFILE.name}, Game Developer`,
    type: 'website',
    keywords: KEYWORDS,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        url: absUrl(),
        name: `${PROFILE.name} Portfolio`,
        mainEntity: person(),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: `${PROFILE.handle} | ${PROFILE.name}`,
        url: absUrl(),
        inLanguage: 'en',
        author: { '@id': `${absUrl()}#person` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `Projects by ${PROFILE.name}`,
        numberOfItems: projects.length,
        itemListElement: projects.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: absUrl(projectPath(p.slug)),
          name: p.title,
        })),
      },
    ],
  };
}

export function projectMeta(p: Project): PageMeta {
  return {
    path: projectPath(p.slug),
    title: `${p.title}: ${p.kind} | ${PROFILE.name}`,
    description: p.summary,
    image: absUrl(p.image ?? SITE.ogImage),
    imageAlt: p.image ? `${p.title} screenshot` : `${PROFILE.name}, Game Developer`,
    type: 'article',
    keywords: [p.title, ...p.tags, PROFILE.name, PROFILE.handle, p.kind],
    jsonLd: [
      { '@context': 'https://schema.org', ...projectSchema(p) },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: PROFILE.name, item: absUrl() },
          { '@type': 'ListItem', position: 2, name: 'Projects', item: `${absUrl()}#projects` },
          { '@type': 'ListItem', position: 3, name: p.title, item: absUrl(projectPath(p.slug)) },
        ],
      },
    ],
  };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Everything that goes between the seo markers in <head>.
export function renderHead(m: PageMeta): string {
  const url = absUrl(m.path);
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="author" content="${esc(PROFILE.name)}" />`,
    `<meta name="keywords" content="${esc(m.keywords.join(', '))}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta name="theme-color" content="${SITE.themeColor}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<link rel="icon" type="image/svg+xml" href="${SITE.base}favicon.svg" />`,
    `<link rel="icon" type="image/png" sizes="192x192" href="${SITE.base}icon-192.png" />`,
    `<link rel="apple-touch-icon" href="${SITE.base}apple-touch-icon.png" />`,
    `<link rel="manifest" href="${SITE.base}site.webmanifest" />`,
    `<link rel="alternate" type="text/plain" title="LLM-friendly profile" href="${absUrl('llms.txt')}" />`,
    `<meta property="og:type" content="${m.type === 'website' ? 'profile' : 'article'}" />`,
    `<meta property="og:site_name" content="${esc(`${PROFILE.handle} | ${PROFILE.name}`)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    ...(m.type === 'website'
      ? [
          `<meta property="profile:first_name" content="${esc(PROFILE.firstName)}" />`,
          `<meta property="profile:username" content="${esc(PROFILE.handle)}" />`,
        ]
      : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    ...(SITE.googleSiteVerification
      ? [`<meta name="google-site-verification" content="${esc(SITE.googleSiteVerification)}" />`]
      : []),
    ...m.jsonLd.map(
      j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`,
    ),
  ];
  return tags.join('\n    ');
}

// Plain-HTML copy of the page for crawlers that don't run JavaScript.
export function renderNoscript(page: { project?: Project }): string {
  const link = (href: string, text: string) => `<a href="${href}">${esc(text)}</a>`;
  const list = (items: string[]) => `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  const p = page.project;
  const body: string[] = [];

  if (p) {
    body.push(
      `<p>${link(absUrl(), `← ${PROFILE.name}`)}</p>`,
      `<h1>${esc(p.title)}</h1>`,
      `<p><strong>${esc(p.kind)}</strong> · ${esc(p.period)}${p.status ? ` · ${esc(p.status)}` : ''}</p>`,
      `<p>Role: ${esc(p.role)}${p.team ? ` · Team: ${esc(p.team)}` : ''}${p.org ? ` · ${esc(p.org)}` : ''}</p>`,
      ...p.overview.map(t => `<p>${esc(t)}</p>`),
      `<h2>Highlights</h2>`,
      list(p.highlights.map(esc)),
      `<p>Tech: ${esc(p.tags.join(', '))}</p>`,
      p.links.length ? list(p.links.map(l => link(l.url, l.label))) : '',
    );
  } else {
    body.push(
      `<h1>${esc(PROFILE.name)} (${esc(PROFILE.handle)})</h1>`,
      `<p><strong>${esc(PROFILE.tagline)}</strong></p>`,
      ...PROFILE.intro.map(t => `<p>${esc(t)}</p>`),
      `<h2>Experience</h2>`,
      list(EXPERIENCE.map(e => `<strong>${esc(e.title)}</strong>, ${esc(e.org)} (${esc(e.date)})`)),
      `<h2>Projects</h2>`,
      list(PROJECTS.map(x => `${link(absUrl(projectPath(x.slug)), x.title)}: ${esc(x.summary)}`)),
      `<h2>Skills</h2>`,
      `<p>${esc([...CORE_SKILLS, ...SECONDARY_SKILLS].map(s => s.name).join(', '))}</p>`,
      `<h2>Education</h2>`,
      list(EDUCATION.map(e => `${esc(e.title)}, ${esc(e.org)} (${esc(e.date)})`)),
      `<h2>Certifications</h2>`,
      list(CERTIFICATIONS.map(c => `${esc(c.title)}, ${esc(c.org)} (${esc(c.date)})`)),
      `<h2>Milestones</h2>`,
      list(MILESTONES.map(m => `${esc(m.title)}, ${esc(m.org)} (${esc(m.date)})`)),
    );
  }

  body.push(
    `<h2>Contact</h2>`,
    list([
      link(`mailto:${PROFILE.email}`, PROFILE.email),
      ...PROFILE.socials.map(s => link(s.url, s.label)),
      link(absUrl(PROFILE.resume), 'Resume (PDF)'),
    ]),
  );

  return `<noscript><div style="max-width:860px;margin:0 auto;padding:2rem;font-family:system-ui,sans-serif;color:#f8fafc;background:#1e293b;line-height:1.6">${body.join('')}</div></noscript>`;
}

// https://llmstxt.org
export function renderLlmsTxt(): string {
  const lines = [
    `# ${PROFILE.name} (${PROFILE.handle})`,
    '',
    `> ${PROFILE.summary}`,
    '',
    `Based in ${PROFILE.location}. Contact: ${PROFILE.email}`,
    '',
    '## Experience',
    ...EXPERIENCE.map(e => `- ${e.title}, ${e.org} (${e.date})`),
    '',
    '## Projects',
    ...PROJECTS.map(
      p => `- [${p.title}](${absUrl(projectPath(p.slug))}): ${p.kind}. ${p.summary} Tech: ${p.tags.join(', ')}.`,
    ),
    '',
    '## Skills',
    `- Core: ${CORE_SKILLS.map(s => s.name).join(', ')}`,
    `- Tools: ${SECONDARY_SKILLS.map(s => s.name).join(', ')}`,
    '- Focus: Gameplay programming, NPC AI & stealth systems, VFX, UI/UX, performance profiling, level design',
    '',
    '## Education',
    ...EDUCATION.map(e => `- ${e.title}, ${e.org} (${e.date})`),
    ...CERTIFICATIONS.map(c => `- ${c.title}, ${c.org} (${c.date})`),
    '',
    '## Milestones',
    ...MILESTONES.map(m => `- ${m.title}, ${m.org} (${m.date})`),
    '',
    '## Links',
    `- [Portfolio](${absUrl()})`,
    `- [Resume (PDF)](${absUrl(PROFILE.resume)})`,
    ...PROFILE.socials.map(s => `- [${s.label}](${s.url})`),
    '',
  ];
  return lines.join('\n');
}
