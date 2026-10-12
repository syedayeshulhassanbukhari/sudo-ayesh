// Single source of truth for the portfolio.
// Used by the React app AND by the build-time SEO generator (seo/plugin.ts),
// so keep this file free of browser/Vite-only APIs (no import.meta, no JSX).

export const SITE = {
  // Public URL of the site, no trailing slash. Change this if you move to a custom domain
  // (and update `base` in vite.config.ts to match the path part).
  url: 'https://syedayeshulhassanbukhari.github.io/sudo-ayesh',
  base: '/sudo-ayesh/',
  name: 'sudo-ayesh',
  locale: 'en_US',
  themeColor: '#1e293b',
  ogImage: 'og-image.png',
  // Paste the content value from Google Search Console's "HTML tag" verification here.
  googleSiteVerification: '',
};

export const PROFILE = {
  name: 'Ayesh Ul Hassan',
  firstName: 'Ayesh',
  handle: 'sudo-ayesh',
  role: 'Game Developer',
  tagline: 'Game Developer | Unreal Engine 5 | Roblox',
  location: 'Peshawar, Pakistan',
  email: 'ayeshulhassan@gmail.com',
  phone: '+92-331-9304910',
  phoneHref: 'tel:+923319304910',
  photo: 'Main-Image.jpeg',
  avatar: 'avatar.png',
  resume: 'Ayesh-Ul-Hassan-CV.pdf',
  intro: [
    'Game developer working across Unreal Engine 5, Roblox Studio and Unity, specialising in player controllers, stealth mechanics and NPC AI, plus VFX and UI/UX systems.',
    'Shipped Locked In Fear, a UE5 horror-survival game that pulled in 500+ wishlists before full release.',
    'Software Engineering student at CUSIT, Peshawar, and the sole VFX artist on Vermilian Mask at Zehn Studio 26.',
  ],
  summary:
    'Game developer working across Unreal Engine 5, Roblox Studio and Unity. Builds player controllers, stealth mechanics and NPC AI in UE5, and VFX and UI/UX systems in Roblox. Shipped Locked In Fear, a UE5 horror-survival game with 500+ wishlists before full release.',
  socials: [
    { label: 'GitHub', url: 'https://github.com/syedayeshulhassanbukhari' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/syedaishulhassan' },
    { label: 'itch.io', url: 'https://sudo-ayesh.itch.io/' },
    { label: 'Fiverr', url: 'https://www.fiverr.com/users/syedaish' },
  ],
};

export interface TimelineItem {
  date: string;
  title: string;
  org: string;
}

export const EXPERIENCE: TimelineItem[] = [
  { date: 'MAY 2026 - PRESENT', title: 'Junior Roblox Developer', org: 'Zehn Studio 26 · Vermilian Mask' },
  { date: 'JUN 2026 - JUL 2026', title: 'Unreal Engine Intern', org: 'CUSIT Battle Zone · Investigation 51' },
  { date: '2025 - 2026', title: 'Gameplay Programmer (Final Year Project)', org: 'City University of Science & IT · Locked In Fear' },
  { date: 'JUL 2025 - AUG 2025', title: 'Application Development Intern', org: 'Dev-Spire Solutions' },
];

export const EDUCATION: TimelineItem[] = [
  { date: 'OCT 2022 - PRESENT', title: 'B.CS in Software Engineering', org: 'City University of Science and IT, Peshawar' },
  { date: '2020 - 2022', title: 'F.Sc in Computer Science', org: 'Peshawar Model Degree College' },
];

export const CERTIFICATIONS: TimelineItem[] = [
  { date: '2023', title: 'NAVTTC Graphic Designing Certificate', org: 'Xpert IT Solution' },
  { date: '2022', title: 'Diploma in Information Technology', org: 'Xpert IT Solution' },
];

export const FOCUS_AREAS: { name: string; tone: 'blue' | 'white' | 'orange' }[] = [
  { name: 'Gameplay Programming', tone: 'blue' },
  { name: 'NPC AI & Stealth Systems', tone: 'white' },
  { name: 'VFX & UI/UX', tone: 'orange' },
  { name: 'Performance Profiling', tone: 'white' },
  { name: 'Level Design', tone: 'blue' },
];

// `icon` is a simple-icons export name (see src/components/SkillIcon.tsx); omit it for a text badge.
export interface Skill {
  name: string;
  icon?: string;
  badge?: string;
}

export const CORE_SKILLS: Skill[] = [
  { name: 'Unreal Engine 5', icon: 'siUnrealengine' },
  { name: 'C++', icon: 'siCplusplus' },
  { name: 'Blueprints', icon: 'siBlueprint' },
  { name: 'Roblox Studio', icon: 'siRobloxstudio' },
  { name: 'Luau', icon: 'siLua' },
  { name: 'Unity', icon: 'siUnity' },
  { name: 'C#', badge: 'C#' },
];

export const SECONDARY_SKILLS: Skill[] = [
  { name: 'Blender', icon: 'siBlender' },
  { name: 'Git', icon: 'siGit' },
  { name: 'GitHub', icon: 'siGithub' },
  { name: 'Figma', icon: 'siFigma' },
  { name: 'Notion', icon: 'siNotion' },
  { name: 'Flutter', icon: 'siFlutter' },
  { name: 'Dart', icon: 'siDart' },
  { name: 'Firebase', icon: 'siFirebase' },
  { name: 'Supabase', icon: 'siSupabase' },
  { name: 'SQL', icon: 'siMysql' },
];

export type ProjectCategory = 'Games' | 'Roblox' | '3D Art' | 'Work' | 'Apps & Web';
export type ProjectStatus = 'Wishlist' | 'In Development' | 'Live' | 'Shipped' | 'Completed';

export interface ProjectLink {
  label: string;
  url: string;
  kind: 'play' | 'site' | 'devlog' | 'video' | 'code' | 'store';
}

export interface Project {
  slug: string;
  title: string;
  kind: string; // short genre/type line, e.g. "UE5 Horror Survival"
  summary: string; // one or two sentences for cards + meta descriptions
  overview: string[]; // paragraphs for the project page
  highlights: string[];
  role: string;
  team?: string;
  org?: string;
  engine: string;
  engineIcon?: string; // simple-icons export name, used for placeholder art
  period: string; // human readable
  sortKey: string; // YYYY-MM, used for ordering + the timeline
  status?: ProjectStatus;
  categories: ProjectCategory[];
  tags: string[];
  links: ProjectLink[];
  image?: string; // cover image, path inside /public
  imageFit?: 'cover' | 'contain'; // 'contain' for portrait images so nothing gets cropped
  gallery?: { src: string; caption: string }[]; // extra screenshots shown on the project page
  accent: string; // hex used for placeholder art when there's no image
  clientWork?: boolean;
}

// Order here is the order on the page (List view). The Timeline view sorts by `sortKey`.
export const PROJECTS: Project[] = [
  {
    slug: 'locked-in-fear',
    title: 'Locked In Fear',
    kind: 'UE5 Horror Survival',
    summary:
      'A UE5 horror-survival game shipped as my final year project with a 3-person team: 500+ wishlists before full release, with enemy AI that hears your real microphone.',
    overview: [
      'Locked In Fear is a horror-survival game built end-to-end in Unreal Engine 5 within a 6-month academic deadline, alongside a 3-person team. The public website is live, with promotional gameplay content, and the game attracted 500+ wishlisted users before full release.',
      'I owned the core systems from pre-production through to live deployment: stealth mechanics, collision systems, level design and player controller logic, all guided by a full Game Design Document.',
    ],
    highlights: [
      'Multi-layer enemy AI built on Unreal\'s AI Perception Component: sight detection, hearing detection and live microphone input, so the AI reacts to both player actions and real-world sound.',
      'Converted tightly coupled Blueprint systems to C++ to fix critical frame drops and texture overflow issues, reaching stable frame rates on GTX 1050-class hardware.',
      'Stealth, collision, level design and player controller owned end-to-end.',
      'Full Game Design Document available on request.',
    ],
    role: 'Gameplay Programmer',
    team: '3 people',
    org: 'City University of Science & IT (Final Year Project)',
    engine: 'Unreal Engine 5',
    engineIcon: 'siUnrealengine',
    period: '2025 — 2026',
    sortKey: '2025-09',
    status: 'Wishlist',
    categories: ['Games'],
    tags: ['Unreal Engine 5', 'C++', 'Blueprints', 'AI Perception', 'Stealth', 'Level Design'],
    links: [{ label: 'Website', url: 'https://lockedinfear.me/', kind: 'site' }],
    image: 'projectImages/locked-in-fear.jpg',
    accent: '#16a34a',
  },
  {
    slug: 'vermilian-mask',
    title: 'Vermilian Mask',
    kind: 'Roblox Experience',
    summary:
      'A live Roblox project at Zehn Studio 26. I\'m the sole VFX artist and own its UI/UX, from concept through in-Studio integration.',
    overview: [
      'Vermilian Mask is a live Roblox project at Zehn Studio 26. I own the game\'s entire VFX pipeline and its UI/UX design.',
      'This is client work for the studio, so source and builds aren\'t public.',
    ],
    highlights: [
      'Sole VFX artist: designed and implemented every visual effect in the game, including ability, impact and environmental effects.',
      'Owned the VFX pipeline from concept through in-Studio integration.',
      'Combined VFX and UI/UX ownership within a single production pipeline.',
      'Ramped up on Roblox Studio and Lua-based tooling within the first three months on the team.',
    ],
    role: 'VFX Artist & UI/UX Designer',
    org: 'Zehn Studio 26',
    engine: 'Roblox Studio',
    engineIcon: 'siRobloxstudio',
    period: 'May 2026 — Present',
    sortKey: '2026-05',
    status: 'Live',
    categories: ['Roblox', 'Work'],
    tags: ['Roblox Studio', 'Luau', 'VFX', 'UI/UX'],
    links: [],
    accent: '#dc2626',
    clientWork: true,
  },
  {
    slug: 'founders-360',
    title: 'Founders 360',
    kind: 'Software House Website',
    summary:
      'The website for Founders 360, a Khyber Pakhtunkhwa software house that builds web, mobile, game and AI products and trains developers alongside universities.',
    overview: [
      'Founders 360 is a software house in Khyber Pakhtunkhwa that builds web, mobile, game and AI products for clients, and runs an academy that trains project-ready developers in partnership with universities and IT Board KP.',
      'The site presents the company\'s four service disciplines, six academy training tracks, internship domains, flagship builds and university partnerships, and gives clients a "Start a project" funnel.',
    ],
    highlights: [
      'Service pages for web, mobile, game and AI development.',
      'Academy section covering six training tracks, from Full-Stack Web to Unreal Engine 5 and Deep Learning, each ending in a deployed capstone.',
      'Showcase of 36 track builds, plus internship and partner sections.',
      'Built with Next.js and deployed on Vercel, with light and dark themes.',
    ],
    role: 'Web Developer',
    org: 'Founders 360',
    engine: 'Next.js',
    engineIcon: 'siNextdotjs',
    period: 'Oct 2026',
    sortKey: '2026-10',
    status: 'Live',
    categories: ['Apps & Web'],
    tags: ['Next.js', 'React', 'Vercel', 'Web Design'],
    links: [{ label: 'Visit site', url: 'https://founders-360.vercel.app/', kind: 'site' }],
    image: 'projectImages/founders-360.jpg',
    accent: '#2563eb',
  },
  {
    slug: 'flowtiva',
    title: 'Flowtiva',
    kind: 'AI Agency Website',
    summary:
      'A client website for Flowtiva, a Peshawar AI agency offering calling agents, automation, custom GPTs and AI avatars, with Google and phone-OTP sign-in and consultation booking.',
    overview: [
      'Flowtiva is an AI agency based in Peshawar. I built their marketing site and client portal, which presents five service lines: AI calling agents, automation systems, AI marketing, custom GPT development, and voice and video avatars.',
      'Beyond the landing page, the site has a Supabase-backed sign-in (Google OAuth or phone OTP) leading to a client dashboard, a consultation booking page powered by Calendly, a demos page, a "Suggested Knowledge" articles section, and a community feedback form where visitors can submit testimonials with a rating.',
    ],
    highlights: [
      'Responsive landing page with service cards, a "Why choose us" stats block, knowledge articles and a contact section.',
      'Authentication with Supabase: Google sign-in and phone-number OTP, gating a client dashboard.',
      'Community feedback form that stores testimonials and ratings in Supabase.',
      'Consultation booking flow embedding Calendly scheduling.',
      'Built with React and Tailwind CSS, deployed on Vercel.',
    ],
    role: 'Web Developer',
    org: 'Flowtiva (client)',
    engine: 'React',
    engineIcon: 'siSupabase',
    period: 'Client Project',
    sortKey: '2026-01',
    status: 'Live',
    categories: ['Apps & Web', 'Work'],
    tags: ['React', 'Tailwind CSS', 'Supabase', 'Calendly', 'Vercel'],
    links: [{ label: 'Visit site', url: 'https://flowtivaagents.vercel.app/', kind: 'site' }],
    image: 'projectImages/flowtiva/home.jpg',
    gallery: [
      { src: 'projectImages/flowtiva/home.jpg', caption: 'Landing page hero with consultation and demo calls to action.' },
      { src: 'projectImages/flowtiva/services.jpg', caption: 'Service cards for the five AI offerings.' },
      { src: 'projectImages/flowtiva/login.jpg', caption: 'Sign-in with Google OAuth or phone-number OTP via Supabase.' },
    ],
    accent: '#7c3aed',
    clientWork: true,
  },
  {
    slug: 'investigation-51',
    title: 'Investigation 51',
    kind: 'First-Person Survival Horror',
    summary:
      'My own RE7-inspired first-person survival horror game. I started it in Unreal Engine 5 during my CUSIT Battle Zone internship and am now continuing development in Unity.',
    overview: [
      'Investigation 51 is my own RE7-inspired first-person survival horror game, currently in active development.',
      'It began in Unreal Engine 5 during my internship at CUSIT Battle Zone. There I built the first-person level and core interaction systems (doors, item pickups), and worked on performance and architecture: untangling tightly coupled Blueprint systems and moving the hot paths to C++.',
      'The game is set in a multi-storey mansion, and the floor plan and exterior elevation references below drive the level layout. Development is now moving to Unity, carrying these systems and the level design across.',
      'The full production workspace lives in Notion, tracking assets, Blender work, material references, Sketchfab sources and to-dos.',
    ],
    highlights: [
      'Interactable door actor (BP_Door): a door mesh with a sphere collision trigger, an Interact event that branches on an IsOpen state, and a Timeline curve driving the door\'s yaw rotation for a smooth open/close swing.',
      'Item pickup actor (BP_PickUpItem) for collectibles in the first-person level.',
      'UE5 phase: hit the 60 FPS target on GTX 1080-class hardware by refactoring tightly coupled Blueprint systems into modular Actor Components, fixing bottlenecks and material overflow errors.',
      'UE5 phase: introduced a hybrid Blueprint/C++ architecture that reduced processing overhead and sped up iteration.',
      'Rebuilt the first-person camera: animation timelines and attachment setups for smoother, more responsive movement.',
      'Level design based on a mansion floor plan and exterior elevation.',
      'Decoupled gameplay dependencies so systems are easier to extend and port to Unity.',
      'Production tracked in Notion: assets, Blender work, material references and to-dos.',
    ],
    role: 'Creator & Gameplay Programmer',
    org: 'Started during the CUSIT Battle Zone internship',
    engine: 'Unreal Engine 5 → Unity',
    engineIcon: 'siUnity',
    period: 'Jun 2026 — Present',
    sortKey: '2026-06',
    status: 'In Development',
    categories: ['Games'],
    tags: ['Unity', 'C#', 'Unreal Engine 5', 'C++', 'Blueprints', 'Survival Horror'],
    links: [
      { label: 'Devlog', url: 'https://www.notion.so/Fading-Echoes-341205e08f9a826980f381413e03d828', kind: 'devlog' },
    ],
    image: 'projectImages/investigation-51/bp-door-event-graph.jpg',
    gallery: [
      {
        src: 'projectImages/investigation-51/bp-door-event-graph.jpg',
        caption: 'BP_Door event graph (UE5): Interact → Branch on IsOpen → Open/Close Door, with the "Open Door Flow" Timeline driving Set Relative Rotation.',
      },
      {
        src: 'projectImages/investigation-51/bp-door-viewport.jpg',
        caption: 'BP_Door in the Blueprint viewport: door mesh plus the sphere collision that triggers the interaction.',
      },
      {
        src: 'projectImages/investigation-51/mansion-floor-plan.jpg',
        caption: 'Mansion floor plan used as the level layout reference.',
      },
      {
        src: 'projectImages/investigation-51/mansion-elevation.jpg',
        caption: 'Exterior elevation reference for the mansion.',
      },
    ],
    accent: '#475569',
  },
  {
    slug: 'ghost-of-yotei-menu',
    title: 'Ghost of Yōtei Main Menu',
    kind: 'UE5 Cinematic Main Menu',
    summary:
      'A fan-made, Ghost of Yōtei-inspired main menu in Unreal Engine 5: a katana planted in a windswept grass field, framed with cine cameras and real-time sky, cloud and fog lighting, with a UMG menu on top.',
    overview: [
      'A fan-made main menu inspired by Ghost of Yōtei, built in Unreal Engine 5. The menu sits over a live 3D shot rather than a static image: a katana planted in a field of grass under a bright, cloudy sky.',
      'I set up a dedicated menu level, framed the shot with cine cameras, lit it with UE5\'s real-time sky system, and built the menu itself from reusable UMG widgets.',
      'Fan project, not affiliated with Sucker Punch Productions or Sony Interactive Entertainment.',
    ],
    highlights: [
      'Dedicated L_Menu level with a Menu Camera and a separate Credits Camera (CineCameraActors, 16:9 digital film filmback) to frame each screen.',
      'Real-time lighting: directional light, sky light, sky atmosphere, volumetric clouds and exponential height fog.',
      'Instanced foliage grass field around the katana for a soft, windswept look.',
      'Menu built from reusable UMG widgets (WBP_MenuUI, WBP_Button, WBP_Text, WBP_Credits): Start Game, Settings, Credits and Quit, with a brush-stroke highlight on the selected option.',
      'Iterated on camera position, lens and composition to land the final shot.',
    ],
    role: 'Solo Developer',
    engine: 'Unreal Engine 5',
    engineIcon: 'siUnrealengine',
    period: 'May 2026',
    sortKey: '2026-05',
    status: 'Completed',
    categories: ['Games'],
    tags: ['Unreal Engine 5', 'UMG', 'Cine Camera', 'Lighting', 'Foliage', 'Main Menu'],
    links: [],
    image: 'projectImages/ghost-of-yotei-menu/main-menu.jpg',
    gallery: [
      { src: 'projectImages/ghost-of-yotei-menu/main-menu.jpg', caption: 'The finished main menu: Start Game, Settings, Credits and Quit over the live katana shot.' },
      { src: 'projectImages/ghost-of-yotei-menu/menu-level-setup.jpg', caption: 'L_Menu level: Menu and Credits cine cameras, sky atmosphere, volumetric clouds, height fog and instanced grass.' },
      { src: 'projectImages/ghost-of-yotei-menu/cine-camera-framing.jpg', caption: 'Framing the menu shot through a CineCameraActor.' },
      { src: 'projectImages/ghost-of-yotei-menu/camera-tweaking.jpg', caption: 'Tweaking camera placement and lens for the final composition.' },
    ],
    accent: '#ca8a04',
  },
  {
    slug: 'sword-in-the-stone',
    title: 'Sword in the Stone',
    kind: 'Blender 3D Scene & Render',
    summary:
      'A Blender 4.1 environment piece: a glowing sword set in stone inside a cave, with volumetric light shafts, a Geometry Nodes lightning effect on the blade, and a composited EEVEE render.',
    overview: [
      'A stylised environment render made in Blender 4.1: a sword set in a stone inside a rocky cave, its blade glowing cyan while shafts of warm light cut through the dust.',
      'The scene was built from a modular rock kit, lit with an HDRI and an emissive exterior light shining through a volume, rendered in EEVEE, and finished in the compositor.',
    ],
    highlights: [
      'Cave arch and ground blocked out from a modular rock kit, with the scene organised into Rendering, Sword, Background, Volume and FX collections.',
      'Lighting: HDRI world plus an emissive exterior light plane shining through a volume to create the god rays.',
      'Geometry Nodes lightning effect running along the blade.',
      'EEVEE look-dev with ambient occlusion, bloom and screen-space reflections.',
      'Compositing with Glare and Color Balance (lift/gamma/gain), using the Filmic view transform with a Very High Contrast look.',
    ],
    role: '3D Artist',
    engine: 'Blender',
    engineIcon: 'siBlender',
    period: 'Aug 2024',
    sortKey: '2024-08',
    status: 'Completed',
    categories: ['3D Art'],
    tags: ['Blender', 'EEVEE', 'Geometry Nodes', 'Lighting', 'Compositing'],
    links: [],
    image: 'projectImages/sword-in-the-stone/final-render.jpg',
    imageFit: 'contain',
    gallery: [
      { src: 'projectImages/sword-in-the-stone/final-render.jpg', caption: 'Final render.' },
      { src: 'projectImages/sword-in-the-stone/rock-arch-layout.jpg', caption: 'Blocking out the cave arch and ground from a modular rock kit.' },
      { src: 'projectImages/sword-in-the-stone/lighting-setup.jpg', caption: 'Lighting setup: an emissive exterior light behind the arch drives the light shafts (render preview on the left).' },
      { src: 'projectImages/sword-in-the-stone/world-hdri-eevee.jpg', caption: 'Look-dev: HDRI world lighting and EEVEE settings (AO, bloom, screen-space reflections).' },
      { src: 'projectImages/sword-in-the-stone/lightning-geometry-nodes.jpg', caption: 'Geometry Nodes lightning effect along the blade.' },
      { src: 'projectImages/sword-in-the-stone/compositing.jpg', caption: 'Compositor: Glare and Color Balance nodes, Filmic with Very High Contrast.' },
    ],
    accent: '#0891b2',
  },
  {
    slug: 'roblox-studio-ui-systems',
    title: 'Studio UI/UX Systems',
    kind: 'Roblox UI/UX',
    summary:
      'Menus, HUDs and interaction flows designed across multiple Roblox titles at Zehn Studio 26.',
    overview: [
      'Alongside Vermilian Mask, I design UI/UX systems across multiple Roblox titles in Zehn Studio 26\'s portfolio, built around Roblox Studio\'s UI framework.',
      'This is client work for the studio, so source and builds aren\'t public.',
    ],
    highlights: [
      'Menus, HUDs and interaction flows tailored to Roblox Studio\'s UI framework.',
      'Improved usability and visual consistency across the studio\'s games.',
    ],
    role: 'UI/UX Designer',
    org: 'Zehn Studio 26',
    engine: 'Roblox Studio',
    engineIcon: 'siRoblox',
    period: 'May 2026 — Present',
    sortKey: '2026-05',
    categories: ['Roblox', 'Work'],
    tags: ['Roblox Studio', 'UI/UX', 'HUD', 'Menus'],
    links: [],
    accent: '#0ea5e9',
    clientWork: true,
  },
  {
    slug: 'courier-management-system',
    title: 'Courier Management System',
    kind: 'Flutter App',
    summary:
      'A full UI/UX redesign of a courier management app, shipped as 6 production-ready Flutter screens in 6 weeks.',
    overview: [
      'During my internship at Dev-Spire Solutions I redesigned the full Courier Management System UI/UX in Figma, using a yellow-themed design system, then implemented it in Flutter.',
    ],
    highlights: [
      '6 production-ready screens shipped in 6 weeks: Home, Contact and Admin Panel dashboards with responsive layouts.',
      'Backed by SQL data management with fast retrieval.',
      'Clean Git workflow on GitHub with the senior developer, tracking every sprint milestone.',
    ],
    role: 'Application Development Intern',
    org: 'Dev-Spire Solutions',
    engine: 'Flutter',
    engineIcon: 'siFlutter',
    period: 'Jul 2025 — Aug 2025',
    sortKey: '2025-07',
    status: 'Shipped',
    categories: ['Apps & Web', 'Work'],
    tags: ['Flutter', 'Dart', 'Figma', 'SQL'],
    links: [],
    accent: '#eab308',
  },
  {
    slug: 'essence',
    title: 'Essence',
    kind: 'Perfume Marketplace · Flutter Web',
    summary:
      'A full-stack fragrance marketplace built in Flutter: perfume impression mapping, a community exchange where users list their own bottles and chat with sellers, and an AI perfume assistant.',
    overview: [
      'Essence is a full-stack fragrance community and marketplace, built with Flutter for the web in a bold, neo-brutalist style.',
      'Every perfume page maps how the scent comes across: top, heart and base notes, main accords by percentage, season and occasion rankings, and user reviews. On the Marketplace Exchange, users upload and list their own perfumes and talk to sellers through real-time buyer-seller chat.',
      'An "ESSENCE BOT" perfume assistant answers fragrance-only questions about notes, longevity, layering, storage and recommendations.',
    ],
    highlights: [
      'Impression mapping on every perfume: top/heart/base notes, main accords percentages, season and occasion rankings.',
      'Marketplace Exchange: users upload and list their own perfumes, with real-time buyer-seller chat and a buyer inbox.',
      'Moderated community: verified sellers, user reviews and verified-buyer badges.',
      'AI perfume assistant (ESSENCE BOT) restricted to fragrance topics, with suggested starter questions.',
      'Firebase Authentication (Google and email/password, password reset) with users synced to Firestore; Supabase for marketplace data.',
      'Neo-brutalist UI with light and dark modes, an ingredient glossary and journal sections.',
    ],
    role: 'Full-Stack Developer',
    engine: 'Flutter Web',
    engineIcon: 'siFlutter',
    period: 'Personal Project',
    sortKey: '2025-01',
    status: 'Live',
    categories: ['Apps & Web'],
    tags: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'Supabase'],
    links: [{ label: 'Visit site', url: 'https://scentswapwebsite.vercel.app/', kind: 'site' }],
    image: 'projectImages/essence/sign-in.jpg',
    gallery: [
      { src: 'projectImages/essence/sign-in.jpg', caption: 'Sign-in screen with Google and email/password via Firebase Authentication.' },
      { src: 'projectImages/essence/sign-up.jpg', caption: '"Create Your Vault" registration screen in the neo-brutalist style.' },
      { src: 'projectImages/essence/perfume-assistant.jpg', caption: 'ESSENCE BOT: the fragrance-only AI perfume assistant.' },
    ],
    accent: '#db2777',
  },
];

export const PROJECT_CATEGORIES: ('All' | ProjectCategory)[] = ['All', 'Games', 'Roblox', '3D Art', 'Work', 'Apps & Web'];

export interface Milestone {
  date: string;
  title: string;
  org: string;
  description: string;
  tags: string[];
}

export const MILESTONES: Milestone[] = [
  {
    date: 'Dec 2025 — Present',
    title: 'Advisor to President',
    org: 'YPDC-CUSIT Chapter & Debating Society',
    description:
      'Co-organised 3 major university events (the 150 Years of Quaid-e-Azam Celebration, International Mother\'s Day and Kashmir Day), handling logistics, student coordination, seating and certificates.',
    tags: ['Leadership', 'Events'],
  },
  {
    date: '2026',
    title: 'Black Byt3 Convention',
    org: 'Islamia College, Peshawar',
    description: 'Selected to take part in the Black Byt3 tech convention.',
    tags: ['Tech Event'],
  },
  {
    date: '2026',
    title: 'Azure Web App Deployment Workshop',
    org: 'Microsoft Learn Student Ambassadors',
    description: 'Hands-on workshop on deploying web apps to Microsoft Azure.',
    tags: ['Workshop', 'Cloud'],
  },
  {
    date: '2024 & 2026',
    title: 'Skillathon',
    org: 'City University of Science & IT',
    description: 'Selected for CUSIT\'s Skillathon competition twice.',
    tags: ['Competition'],
  },
  {
    date: '2025',
    title: 'Cyber Fest',
    org: 'University of Peshawar',
    description: 'Selected to take part in Cyber Fest at the University of Peshawar.',
    tags: ['Tech Event'],
  },
];

export const KEYWORDS = [
  'Ayesh Ul Hassan',
  'sudo-ayesh',
  'game developer',
  'gameplay programmer',
  'Unreal Engine 5 developer',
  'UE5 C++',
  'Blueprints',
  'Roblox developer',
  'Roblox VFX artist',
  'Roblox UI/UX',
  'Unity developer',
  'horror game developer',
  'NPC AI',
  'AI Perception',
  'stealth mechanics',
  'Locked In Fear',
  'game developer Pakistan',
  'game developer Peshawar',
  'portfolio',
];

export function projectsSorted(): Project[] {
  return [...PROJECTS].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}
