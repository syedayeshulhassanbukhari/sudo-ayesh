// Page metadata + structured data, shared by the app (client-side navigation)
// and seo/plugin.ts (static HTML generated at build time).
import {
  SITE, PROFILE, EXPERIENCE, EDUCATION, CERTIFICATIONS, CORE_SKILLS, SECONDARY_SKILLS,
  MILESTONES, KEYWORDS, PROJECTS, SERVICES, FAQS, type Project,
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
    .concat(['Gameplay Programming', 'NPC AI', 'Stealth Mechanics', 'VFX', 'UI/UX', 'Level Design',
      'Roblox Game Development', 'Roblox UI Design', 'Roblox VFX']),
  knowsLanguage: PROFILE.languages.map(l => ({ '@type': 'Language', name: l.name, alternateName: l.code })),
  sameAs: PROFILE.socials.map(s => s.url),
  makesOffer: SERVICES.map(s => ({
    '@type': 'Offer',
    url: s.url,
    priceSpecification: { '@type': 'PriceSpecification', minPrice: s.priceFrom, priceCurrency: 'USD' },
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.summary,
      serviceType: s.title,
      areaServed: 'Worldwide',
      provider: { '@id': `${absUrl()}#person` },
    },
  })),
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
    dateCreated: p.sortKey,
    creator: { '@id': `${absUrl()}#person` },
    ...(live ? { sameAs: live.url } : {}),
  };
};

const buildDate = new Date().toISOString().slice(0, 10);

export function homeMeta(): PageMeta {
  const projects = PROJECTS;
  return {
    path: '',
    title: `${PROFILE.name} (${PROFILE.handle}) | Game Developer: Unreal Engine 5, Roblox & Unity`,
    description:
      'Game developer from Peshawar building in Unreal Engine 5, Roblox and Unity: gameplay systems, NPC AI, VFX and UI. Shipped Locked In Fear (500+ wishlists).',
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
        dateModified: buildDate,
        mainEntity: person(),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQS.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
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

// https://llmstxt.org — a short, link-rich profile for AI assistants.
export function renderLlmsTxt(): string {
  const lines = [
    `# ${PROFILE.name} (${PROFILE.handle})`,
    '',
    `> ${PROFILE.summary}`,
    '',
    `Based in ${PROFILE.location} (${PROFILE.timezone}). Languages: ${PROFILE.languages.map(l => l.name).join(', ')}. Contact: ${PROFILE.email}`,
    '',
    '## Experience',
    ...EXPERIENCE.map(e => `- ${e.title}, ${e.org} (${e.date})`),
    '',
    '## Projects',
    ...PROJECTS.map(
      p => `- [${p.title}](${absUrl(projectPath(p.slug))}): ${p.kind}. ${p.summary} Tech: ${p.tags.join(', ')}.`,
    ),
    '',
    '## Services (freelance, via Fiverr)',
    ...SERVICES.map(s => `- [${s.title}](${s.url}): from $${s.priceFrom}, ${s.deliveryDays}-day delivery. ${s.summary}`),
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
    '## FAQ',
    ...FAQS.flatMap(f => [`### ${f.q}`, f.a, '']),
    '## Links',
    `- [Portfolio](${absUrl()})`,
    `- [Full profile for LLMs](${absUrl('llms-full.txt')})`,
    `- [Resume (PDF)](${absUrl(PROFILE.resume)})`,
    ...PROFILE.socials.map(s => `- [${s.label}](${s.url})`),
    '',
  ];
  return lines.join('\n');
}

// Everything on the site as one Markdown document, so an assistant can answer
// detailed questions without crawling each project page.
export function renderLlmsFullTxt(): string {
  const lines = [
    renderLlmsTxt().trimEnd(),
    '',
    '---',
    '',
    '# Project details',
    '',
    ...PROJECTS.flatMap(p => [
      `## ${p.title}`,
      '',
      `${p.kind} · ${p.period}${p.status ? ` · ${p.status}` : ''} · Role: ${p.role}${p.team ? ` · Team: ${p.team}` : ''}${p.org ? ` · ${p.org}` : ''}`,
      `Page: ${absUrl(projectPath(p.slug))}`,
      '',
      ...p.overview.flatMap(t => [t, '']),
      'What I did:',
      ...p.highlights.map(h => `- ${h}`),
      '',
      `Tech: ${p.tags.join(', ')}`,
      ...p.links.map(l => `- [${l.label}](${l.url})`),
      '',
    ]),
    '# Services in detail',
    '',
    ...SERVICES.flatMap(s => [
      `## ${s.title}`,
      '',
      s.summary,
      '',
      ...s.includes.map(i => `- ${i}`),
      '',
      `From $${s.priceFrom} · ${s.deliveryDays}-day delivery · [Order on Fiverr](${s.url})`,
      '',
    ]),
  ];
  return lines.join('\n');
}
