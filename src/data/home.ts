// Content for the home page HUD layout. Projects, services and the profile still live in
// portfolio.ts (SEO, project pages and llms.txt read them from there); this file only says
// how the home page groups and labels them.
import { PROJECTS, SERVICES, type Project } from './portfolio';
import { ANIMATIONS, COLLECTIONS, MODEL_TOTAL } from './models';

export const NAV = [
  { label: 'Skills', id: 'skills' },
  { label: 'Modeling', id: 'modeling' },
  { label: 'Animation', id: 'animation' },
  { label: 'Games', id: 'games' },
  { label: 'VFX', id: 'vfx' },
  { label: 'Prices', id: 'prices' },
];

export const TICKER = ['Unreal Engine 5', 'C++', 'Blueprints', 'Roblox Studio', 'Luau', 'Unity', 'C#', 'NPC AI', 'Game UI', 'VFX', 'Blender', 'Godot', 'Rigging', 'Game-ready assets'];

// glyph = short code in the icon tile (no brand logos)
export const SKILL_CARDS = [
  { glyph: 'UE5', name: 'Unreal Engine 5', note: 'Player controllers, stealth and NPC AI in C++ and Blueprints, tuned to hold frame rate on mid-range PCs.', tags: ['C++', 'Blueprints', 'AI Perception'] },
  { glyph: 'RBX', name: 'Roblox Development', note: 'Full Roblox games and systems in Luau: core loops, data saving, shops, game passes and leaderboards.', tags: ['Luau', 'DataStores', 'Remotes'] },
  { glyph: 'C#', name: 'Unity Development', note: 'Gameplay mechanics, physics and tools in C# for PC and mobile.', tags: ['C#', 'Physics', 'Tools'] },
  { glyph: 'GD', name: 'Godot', note: 'Prototypes and tools in Godot 4 with GDScript. In development now.', tags: ['GDScript', 'Godot 4', 'Shaders'] },
  { glyph: '3D', name: '3D Modeling', note: 'Characters, weapons, props and full environment kits in Blender, low-poly and game-ready.', tags: ['Blender', 'Texturing', 'Low-poly'] },
  { glyph: 'ANM', name: 'Rigging & Animation', note: 'Creature and character rigs with attack, flight and combo animations for Roblox and Unity.', tags: ['Rigging', 'IK', 'Keyframe'] },
  { glyph: 'FX', name: 'VFX', note: 'Anime and combat effects: slashes, beams, auras, impacts and full skill sets, light enough for mobile.', tags: ['Particles', 'Beams', 'Trails'] },
  { glyph: 'GUI', name: 'Game UI / UX', note: 'HUDs, menus, shops and inventories, designed mobile-first and animated in engine.', tags: ['Figma', 'HUD', 'Menus'] },
  { glyph: 'LVL', name: 'Level Design', note: 'Arenas and levels built around player flow, from blockout to dressed kit.', tags: ['Blockout', 'GDD', 'Flow'] },
];

export interface CardItem {
  key: string;
  name: string;
  note: string;
  sub?: string; // shown in the meta row, also the archive filter
  badge?: string;
  href?: string; // internal project page
  image?: string;
  contain?: boolean;
  best?: boolean; // shown in the carousel; the rest go to the archive
  slot?: string; // empty slot title
  code?: string; // optional code shown inside an empty slot; <k>..</k> marks keywords
  model?: string; // live GLB inside public/models
  elev?: number;
  clips?: string[];
  count?: number; // "N models" tag on collection cards
  full?: string; // opens this image or video (.mp4) full-size in the lightbox
  video?: string; // muted looping preview in the tile
  poster?: string;
}

const fromProject = (p: Project, best = true): CardItem => ({
  key: p.slug,
  name: p.title,
  note: p.summary.split(/(?<=\.)\s/)[0],
  sub: p.kind,
  badge: p.engine.split(/[ ,/]/)[0] === 'Unreal' ? 'UE5' : p.engine.split(/[ ,/]/)[0],
  href: `/project/${p.slug}`,
  image: p.image,
  contain: p.imageFit === 'contain',
  best,
});

const bySlug = (slug: string) => {
  const p = PROJECTS.find(x => x.slug === slug);
  if (!p) throw new Error(`home.ts: unknown project ${slug}`);
  return p;
};

// Clips recorded from the MMA showcase (scripts/record_studio.ps1). Only original effects:
// the specials built on third-party library effects (Thunder God Fist, Saiyan Rush,
// Void Breaker...) are left out on purpose. Cards loop the 360p `-sm` cut; click plays 720p.
const VFX_CLIPS = [
  { id: 'crimson-dragon-rush', name: 'Crimson Dragon Rush', note: 'Boxing Critical Art ending in a red brush-stroke finisher.' },
  { id: 'thunder-knee-storm', name: 'Thunder Knee Storm', note: 'Muay Thai combo that ends in a lightning paint burst.' },
  { id: 'jade-tempest', name: 'Jade Tempest', note: 'Karate and judo chain, finished with a jade ink sweep.' },
  { id: 'gravity-sumo-crash', name: 'Gravity Sumo Crash', note: 'Sumo grab and throw into a ground-shaking slam.' },
  { id: 'drive-impact', name: 'Drive Impact', note: 'A fighting-game armoured strike with an impact-frame flash.' },
  { id: 'guard-break', name: 'Guard Break', note: 'Shattering guard with sparks and a stagger.' },
  { id: 'perfect-block', name: 'Perfect Block', note: 'Frame-tight block flash and counter window.' },
  { id: 'flying-knee', name: 'Flying Knee', note: 'Leaping knee with hit-stop and a dust burst.' },
  { id: 'm1-combo', name: 'M1 Combo', note: 'Four-hit basic string with limb trails and hit sparks.' },
  { id: 'roundhouse-kick', name: 'Roundhouse Kick', note: 'Swing trail and a heavy kick impact.' },
  { id: 'skull-splitter', name: 'Skull Splitter', note: 'Overhead elbow with camera shake and a flash.' },
  { id: 'shoulder-throw', name: 'Shoulder Throw', note: 'Judo throw that lands in a crater of floor rocks.' },
];

export interface WorkSection {
  id: string;
  title: string;
  blurb: string;
  items: CardItem[];
  archiveLabel?: string; // "+N {label}" on the archive button
}

export const SECTIONS: WorkSection[] = [
  {
    id: 'modeling',
    title: 'Modeling',
    blurb: `${MODEL_TOTAL} game-ready models across ${COLLECTIONS.length} packs, all live in 3D. Open a pack to turn every model yourself.`,
    archiveLabel: 'packs',
    items: COLLECTIONS.map(c => ({
      key: c.slug, name: c.title, note: c.note, sub: c.sub, badge: c.engine,
      href: `/collection/${c.slug}`, model: c.cover, elev: c.elev, count: c.models.length, best: !!c.best,
    })),
  },
  {
    id: 'animation',
    title: 'Animation',
    blurb: 'Rigged creatures and characters, rendered from Blender. Click a card to watch it in full.',
    // Blender renders of each clip (scripts/blender/render_anim_videos.py); click plays it full size
    items: ANIMATIONS.map(a => {
      const v = `media/anim/${a.file.split('/').pop()!.replace('.glb', '')}`;
      return { key: a.file, name: a.name, note: a.note, sub: 'Blender', video: `${v}.mp4`, poster: `${v}.webp`, full: `${v}.mp4` };
    }),
  },
  {
    id: 'vfx',
    title: 'VFX',
    blurb: 'Combat effects from the MMA Combat VFX pack, recorded live in Roblox Studio. Click a card to watch it in full.',
    items: VFX_CLIPS.map(v => {
      const f = `media/vfx/${v.id}`;
      return { key: v.id, name: v.name, note: v.note, sub: 'MMA Combat VFX', badge: 'Roblox', video: `${f}-sm.mp4`, poster: `${f}.webp`, full: `${f}.mp4` };
    }),
  },
  {
    id: 'games',
    title: 'Games',
    blurb: 'Unreal Engine 5 games, menus and scenes. Click a card for the full breakdown.',
    items: ['locked-in-fear', 'investigation-51', 'ghost-of-yotei-menu', 'sword-in-the-stone'].map(s => fromProject(bySlug(s))),
  },
  {
    id: 'roblox',
    title: 'Roblox',
    blurb: 'Live Roblox work at Zehn Studio 26: VFX, UI/UX and game systems.',
    items: [
      ...['dainty-gulli-danda', 'mma-combat-vfx', 'vermilian-mask', 'roblox-studio-ui-systems'].map(s => fromProject(bySlug(s))),
      { key: 'slot-vfx', slot: 'VFX Reel', name: '', note: '', code: '<k>local</k> fx = Combat.cast("slash")\nfx:Play(hrp.CFrame)\n<k>task</k>.wait(0.2)\nfx:Impact(target)' },
      { key: 'slot-kit', slot: 'Combat Kit', name: '', note: '' },
    ],
  },
  {
    id: 'apps',
    title: 'Apps & Web',
    blurb: 'Sites and apps for clients and side projects, built in Flutter and React.',
    archiveLabel: 'projects',
    items: [
      ...['founders-360', 'flowtiva'].map(s => fromProject(bySlug(s))),
      ...['essence', 'courier-management-system'].map(s => fromProject(bySlug(s), false)),
    ],
  },
  {
    id: 'godot',
    title: 'Godot',
    blurb: 'New work in Godot 4 and GDScript, in development. Slots fill as builds land.',
    items: [
      { key: 'godot-1', slot: 'Prototype 01', name: '', note: '', code: '<k>extends</k> CharacterBody3D\n\n<k>func</k> _physics_process(delta):\n    velocity = input_dir() * SPEED\n    move_and_slide()' },
      { key: 'godot-2', slot: 'Shader Lab', name: '', note: '' },
      { key: 'godot-3', slot: 'Tools & Plugins', name: '', note: '' },
    ],
  },
];

// Prices come from the Fiverr gigs in SERVICES so they never drift apart.
const [fullGame, ui, vfx] = SERVICES;
export interface PriceCard {
  name: string;
  amt: string;
  unit?: string;
  extra?: string;
  note: string;
  list: string[];
  feat?: boolean;
  wide?: boolean;
  quote?: boolean;
  url?: string;
}
export const PRICES: PriceCard[] = [
  { feat: true, wide: true, name: fullGame.title, amt: `$${fullGame.priceFrom}+`, unit: 'Full game', extra: `${fullGame.deliveryDays}-day delivery`, note: fullGame.summary, list: fullGame.includes.slice(0, 3), url: fullGame.url },
  { name: 'Game UI', amt: `$${ui.priceFrom}+`, unit: 'Per screen set', extra: `${ui.deliveryDays}-day delivery`, note: ui.summary, list: ui.includes.slice(0, 3), url: ui.url },
  { name: 'VFX', amt: `$${vfx.priceFrom}+`, unit: 'Per effect', extra: `${vfx.deliveryDays}-day delivery`, note: vfx.summary, list: vfx.includes.slice(0, 3), url: vfx.url },
  { wide: true, quote: true, name: 'Custom Work', amt: 'Get a quote', note: 'Anything else your game needs, with a fixed price and delivery date.', list: ['Unreal Engine 5 systems', 'Unity games and tools', 'NPC AI and gameplay'] },
];
