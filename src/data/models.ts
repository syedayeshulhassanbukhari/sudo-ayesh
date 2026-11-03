// 3D work shown live on the site. The GLBs and manifest are generated from the Blender
// sources by scripts/blender/export_web_models.py (jobs in scripts/blender/jobs.json);
// this file groups them into collections and writes the copy.
import manifest from '../../public/models/manifest.json';

export interface ModelFile { file: string; name: string; tris: number; kb: number; clips: string[] }
const M = manifest as Record<string, ModelFile[]>;

export interface Collection {
  slug: string; // URL: /collection/<slug>
  title: string;
  sub: 'Asset Packs' | 'Weapons' | 'Characters' | 'Props' | 'Environment';
  engine?: 'Roblox' | 'Unity';
  client?: string; // credited client or game
  note: string; // one line for cards
  about: string; // paragraph for the collection page
  cover: string; // file shown on the home card
  best?: boolean; // carousel up front; the rest go to the archive
  models: ModelFile[];
  elev?: number; // camera height for flat/wide kits
}

const pick = (key: string) => {
  if (!M[key]) throw new Error(`models.ts: no "${key}" in manifest`);
  return M[key];
};

export const COLLECTIONS: Collection[] = [
  { slug: 'stud-eggs', title: 'Stud Eggs', sub: 'Asset Packs', engine: 'Roblox', best: true, cover: 'eggs/floating-island.glb', models: pick('eggs'),
    note: '60 themed pet eggs across six tiers, from Critters to Epic.',
    about: 'Sixty hatchable eggs for a Roblox pet simulator, in six themed tiers: Critters, Snacks, Toys, Wild, Myth and Epic. Each egg is its own sculpted shell with a hand-painted 1K texture, kept between 3k and 9k triangles so a full shop of them runs on mobile.' },
  { slug: 'axe-pack', title: 'Axe Pack', sub: 'Weapons', best: true, cover: 'axes/duskwarden.glb', models: pick('axes'),
    note: 'Eighteen named fantasy axes, each with its own silhouette.',
    about: 'Eighteen stylised fantasy axes, from the Stormwing Labrys to the Crimson Eclipse. Every axe was designed around a theme (frost, venom, sand, thunder) with a distinct head shape, and built game-ready at 2.5k to 6k triangles.' },
  { slug: 'treadmills', title: 'Treadmill Pack', sub: 'Asset Packs', engine: 'Roblox', best: true, cover: 'treadmills/dragon-run.glb', models: pick('treadmills'),
    note: 'Ten themed Roblox treadmills, from starter to Void Eclipse.',
    about: 'Ten progression treadmills for a Roblox training game, each tier more extravagant than the last: Starter Runner, Candy Rush, Arcade Cabinet, Glacier Peak, Lava Forge, Royal Throne, Dragon Run, Galaxy Portal, Solar Crown and Void Eclipse.' },
  { slug: 'dino-empire-creatures', title: 'Dino Empire Creatures', sub: 'Characters', engine: 'Roblox', client: 'Dino Empire', best: true, cover: 'dinos/trex.glb', models: pick('dinos'),
    note: 'Fifteen low-poly dinosaurs and Ice Age beasts, rigged for Roblox.',
    about: 'The creature roster for Dino Empire, a Roblox dinosaur simulator (client work): T-Rex, Triceratops, Spinosaurus, Mammoth and eleven more, each with colour, normal and roughness maps and an R15-friendly rig.' },
  { slug: 'client-creatures', title: 'Fantasy Creatures', sub: 'Characters', engine: 'Roblox', client: 'Fiverr client', best: true, cover: 'creatures/winged-lion.glb', models: pick('creatures'),
    note: 'Winged lion, crystal lizard and turtle, rigged and animated.',
    about: 'Three fantasy creatures built for a Fiverr client: a winged lion, a crystal-armoured lizard and a giant turtle. Full PBR texture sets, rigged for Roblox, with flight, attack and roar animations (see Animation).' },
  { slug: 'megastore-kit', title: 'MegaStore Kit', sub: 'Asset Packs', engine: 'Roblox', best: true, cover: 'megastore/delivery-truck.glb', models: pick('megastore'),
    note: 'Store, fuel station and vehicles for a Roblox tycoon.',
    about: 'A 23-piece game kit for a Roblox store tycoon: delivery truck, getaway van, fuel canopy and pumps, merchant, carts, signage and a leaderboard, all sharing one texture palette.' },
  { slug: 'festival-kit', title: 'Festival Kit', sub: 'Environment', engine: 'Roblox', client: 'Dainty Gulli Danda', best: true, cover: 'dainty-festival/yagura.glb', models: pick('dainty-festival'), elev: 0.4,
    note: 'Japanese summer-festival arena: stalls, lanterns, shrine and bridge.',
    about: 'A Japanese matsuri arena for Dainty Gulli Danda: a yagura tower, taiko stage, food stalls, chochin lantern lines, a vermilion bridge and machiya houses, 26 modular pieces.' },
  { slug: 'dino-empire-world', title: 'Dino Empire World', sub: 'Environment', engine: 'Roblox', client: 'Dino Empire', cover: 'dino-env/waterfall.glb', models: pick('dino-env'), elev: 0.4,
    note: 'Cliffs, waterfall, trees, mining rocks and zone signs.',
    about: 'The environment kit for Dino Empire: cliff walls and pillars, a waterfall, mining and quarry rocks, three tree types, bushes and signage.' },
  { slug: 'dino-empire-props', title: 'Dino Empire Props', sub: 'Props', engine: 'Roblox', client: 'Dino Empire', cover: 'dino-props/incubator-advanced.glb', models: pick('dino-props'),
    note: 'Eggs, incubators, shop stalls and resources.',
    about: 'Gameplay props for Dino Empire: three incubator tiers, collectible eggs, shop stalls, a pickaxe and resource drops.' },
  { slug: 'street-kit', title: 'Street Kit', sub: 'Environment', engine: 'Roblox', client: 'Dainty Gulli Danda', cover: 'dainty-street/truck-art.glb', models: pick('dainty-street'), elev: 0.4,
    note: 'South Asian street arena: truck art, chingchi, dhaba, haveli.',
    about: 'A South Asian street arena for Dainty Gulli Danda: a painted truck, chingchi rickshaw, dhaba, haveli, Delhi gate, kites and animals.' },
  { slug: 'backyard-kit', title: 'Backyard Kit', sub: 'Environment', engine: 'Roblox', client: 'Dainty Gulli Danda', cover: 'dainty-backyard/treehouse-oak.glb', models: pick('dainty-backyard'), elev: 0.4,
    note: 'Suburban backyard arena: houses, treehouse, pool and fences.',
    about: 'A suburban backyard arena for Dainty Gulli Danda: three house styles, an oak treehouse, pool, patio, fences and lawn props, 30 pieces.' },
  { slug: 'gulli-danda-skins', title: 'Gulli Danda Skins', sub: 'Props', engine: 'Roblox', client: 'Dainty Gulli Danda', cover: 'dainty-skins/danda-golden.glb', models: pick('dainty-skins'),
    note: 'Cosmetic gulli and danda skins: bamboo, crystal, golden, champion.',
    about: 'The cosmetic shop items for Dainty Gulli Danda: matching gulli and danda skins in Classic, Bamboo, Cricket, Crystal, Golden, Painted and Champion finishes.' },
  { slug: 'sci-fi-crate', title: 'Sci-Fi Crate', sub: 'Props', engine: 'Unity', cover: 'scifi/sci-fi-crate.glb', models: pick('scifi'),
    note: 'Hard-surface crate with a baked PBR set for Unity.',
    about: 'A hard-surface sci-fi crate with a baked PBR texture set (albedo, normal, metallic-smoothness, AO and emission) for Unity.' },
];

export const collectionBySlug = (slug: string) => COLLECTIONS.find(c => c.slug === slug);

// Animation reel: each file plays its clips in a loop. `clips` limits which ones (by name).
export const ANIMATIONS: { file: string; name: string; note: string; clips?: string[] }[] = [
  { file: 'animation/winged-lion-flight.glb', name: 'Winged Lion Flight', note: 'Take-off, wing beats and a gliding loop.' },
  { file: 'animation/crystal-lizard-attack.glb', name: 'Crystal Lizard Attack', note: 'A lunge and tail sweep with weight on every step.' },
  { file: 'animation/crystal-surge.glb', name: 'Crystal Surge', note: 'The lizard charges up and bursts crystal spikes.' },
  { file: 'animation/turtle-roar.glb', name: 'Turtle Roar', note: 'Head rears back, shell shakes, full roar.' },
  { file: 'animation/r6-shoto-combo.glb', name: 'R6 Shoto Combo', note: 'A fighting-game combo on a custom R6 IK rig, ending in a fireball.', clips: ['ShotoCombo'] },
];

export const MODEL_TOTAL = COLLECTIONS.reduce((n, c) => n + c.models.length, 0);
