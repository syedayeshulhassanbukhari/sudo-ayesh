// Hero 3D: low-poly game items with a Blender-style edge overlay, floating in the bracketed
// frame on the blue slab. Pointer moves the camera a little, hovering an item spins it up,
// clicking flips it. Loaded with a dynamic import so three.js never delays first paint.
import * as THREE from 'three';
import { bootDone, bootReal, onBootLeft } from './boot';

interface Item {
  o: THREE.Group;
  d: [number, number]; // desktop: fraction of the scene slot from its centre (±.5 = brackets)
  m: [number, number] | null; // phone: fraction of the whole canvas, null hides it
  z: number;
  face: number;
  delay: number;
  sway?: number;
  ms?: number; // phone scale
  ph: number; h: number; kick: number; extra: number; t0: number;
  base: THREE.Vector3; off?: boolean;
}

export function startHeroScene(hero: HTMLElement, cv: HTMLCanvasElement, slot: HTMLElement): () => void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gl: THREE.WebGLRenderer;
  try { gl = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); }
  catch { hero.classList.add('no3d'); bootDone(); return () => {}; }
  gl.setPixelRatio(Math.min(2, devicePixelRatio || 1));
  gl.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(0, 0, 14);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a97ad, 1.6), new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 9);
  const fill = new THREE.DirectionalLight(0xe8f0ff, 0.9); fill.position.set(-7, 1, 6);
  const rim = new THREE.DirectionalLight(0xffffff, 1); rim.position.set(0, 4, -8);
  scene.add(key, fill, rim);

  const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || '#0B1220';
  const edgeMat = new THREE.LineBasicMaterial({ color: new THREE.Color(css('--ink')), transparent: true, opacity: 0.6 });
  const mat = (c: number) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.7, metalness: 0.05 });
  const part = (geo: THREE.BufferGeometry, m: THREE.Material, pos?: number[], rot?: number[], scl?: number[]) => {
    const g = new THREE.Group();
    g.add(new THREE.Mesh(geo, m), new THREE.LineSegments(new THREE.EdgesGeometry(geo, 20), edgeMat));
    if (pos) g.position.set(pos[0], pos[1], pos[2]);
    if (rot) g.rotation.set(rot[0], rot[1], rot[2]);
    if (scl) g.scale.set(scl[0], scl[1], scl[2]);
    return g;
  };
  const group = (...ps: THREE.Object3D[]) => { const g = new THREE.Group(); ps.forEach(p => g.add(p)); return g; };

  const YELLOW = 0xFACC15, BLUE = 0x3B82F6, NAVY = 0x0B1220, STEEL = 0xD9DDE2, STONE = 0x8A8F99, GREEN = 0x4F8A3A, WOOD = 0x6B4A2E;
  // centrepiece: a sword planted in a rock (nod to the Sword in the Stone render)
  const swordInStone = group(
    part(new THREE.DodecahedronGeometry(1.1, 0), mat(STONE), [0, -1.1, 0], [0.2, 0.4, 0], [1.3, 0.75, 1]),
    part(new THREE.BoxGeometry(0.22, 2.2, 0.08), mat(STEEL), [0, 0.5, 0]),
    part(new THREE.BoxGeometry(0.9, 0.15, 0.22), mat(NAVY), [0, 1.62, 0]),
    part(new THREE.CylinderGeometry(0.08, 0.08, 0.62, 6), mat(BLUE), [0, 2.0, 0]),
    part(new THREE.OctahedronGeometry(0.15), mat(YELLOW), [0, 2.4, 0]));
  const gem = () => part(new THREE.OctahedronGeometry(0.55), mat(YELLOW), undefined, undefined, [1, 1.35, 1]);
  const tree = () => group(
    part(new THREE.ConeGeometry(0.8, 1.7, 6), mat(GREEN), [0, 0.45, 0]),
    part(new THREE.CylinderGeometry(0.16, 0.2, 0.6, 5), mat(WOOD), [0, -0.65, 0]));
  // horror lantern (Locked In Fear)
  const lantern = group(
    part(new THREE.CylinderGeometry(0.42, 0.5, 0.12, 6), mat(NAVY), [0, -0.55, 0]),
    part(new THREE.CylinderGeometry(0.34, 0.34, 0.9, 6), new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.6, flatShading: true }), [0, 0, 0]),
    part(new THREE.ConeGeometry(0.5, 0.45, 6), mat(NAVY), [0, 0.68, 0]),
    part(new THREE.TorusGeometry(0.16, 0.04, 4, 8), mat(STEEL), [0, 1.0, 0]));
  const bit = (s: number) => { const g = new THREE.Group(); g.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(s, s, s)), edgeMat)); return g; };

  const raw: Omit<Item, 'ph' | 'h' | 'kick' | 'extra' | 't0' | 'base'>[] = [
    { o: swordInStone, d: [0, 0.02], m: [0, -0.3], z: 1, face: -0.35, delay: 0.1 },
    { o: tree(), d: [-0.36, -0.28], m: [-0.34, -0.36], z: -1, face: 0, delay: 0.3 },
    { o: tree(), d: [0.36, -0.3], m: [0.34, -0.38], z: -1, face: 0.4, delay: 0.45 },
    { o: lantern, d: [-0.4, 0.2], m: [-0.34, -0.14], z: 0.3, face: 0.3, delay: 0.6, ms: 0.6 },
    { o: gem(), d: [0.4, 0.22], m: [0.34, -0.14], z: 0.3, face: 0, delay: 0.75, ms: 0.6 },
    { o: bit(0.5), d: [0.18, -0.42], m: null, z: 0.6, face: 0.5, delay: 0.85 },
  ];
  let T = reduce ? 99 : 0;
  const items: Item[] = raw.map((it, i) => ({ ...it, ph: i * 1.7, h: 0, kick: 0, extra: 0, t0: 0, base: new THREE.Vector3() }));
  items.forEach(it => { it.o.userData.it = it; scene.add(it.o); });
  // everything is procedural, so it is "loaded" straight away
  bootReal(1); bootDone();
  const offBoot = onBootLeft(() => { if (!reduce) items.forEach(it => { it.t0 = T + 0.25; }); });

  let phone = false;
  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight; if (!w || !h) return;
    gl.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const H = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), W = H * cam.aspect;
    phone = w < 900;
    // desktop positions hang off the scene slot, measured in world units at z = 0
    const hr = hero.getBoundingClientRect(), sr = slot.getBoundingClientRect();
    const sx = ((sr.left + sr.width / 2 - hr.left) / w - 0.5) * W, sy = (0.5 - (sr.top + sr.height / 2 - hr.top) / h) * H;
    const sw = (sr.width / w) * W, sh = (sr.height / h) * H;
    items.forEach(it => {
      const p = phone ? it.m : it.d; it.off = !p; if (!p) return;
      if (phone) it.base.set(p[0] * W, p[1] * H, it.z);
      else it.base.set(Math.min(W / 2 - 0.7, Math.max(-W / 2 + 0.7, sx + p[0] * sw)), sy + p[1] * sh, it.z);
    });
  };
  resize();
  addEventListener('resize', resize);
  const ro = new ResizeObserver(resize); ro.observe(hero);

  // pointer: camera parallax, hover speeds an item up, click flips it
  const ptr = new THREE.Vector2(0, 0), ray = new THREE.Raycaster();
  let active = false, hov: Item | null = null;
  const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); active = true; };
  const onLeave = () => { active = false; hov = null; ptr.set(0, 0); hero.style.cursor = ''; };
  const onClick = () => { if (hov) hov.kick = 1; };
  hero.addEventListener('pointermove', onMove); hero.addEventListener('pointerleave', onLeave); hero.addEventListener('click', onClick);
  const pick = () => {
    ray.setFromCamera(ptr, cam);
    const hit = ray.intersectObjects(items.map(it => it.o), true).find(x => (x.object as THREE.Mesh).isMesh);
    let o: THREE.Object3D | null = hit ? hit.object : null;
    while (o && !o.userData.it) o = o.parent;
    return o ? (o.userData.it as Item) : null;
  };

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const back = (t: number) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  let last = performance.now(), visible = true, raf = 0;
  const io = new IntersectionObserver(es => { visible = es[0].isIntersecting; }); io.observe(hero);
  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (visible) {
      T += dt;
      if (active) { hov = pick(); hero.style.cursor = hov ? 'pointer' : ''; }
      items.forEach(it => {
        it.o.visible = !it.off;
        if (it.off) return;
        const e = Math.min(1, Math.max(0, (T - it.t0 - it.delay) / 1.1));
        it.h += ((hov === it ? 1 : 0) - it.h) * Math.min(1, dt * 8);
        it.kick *= Math.exp(-dt * 2.2);
        it.o.scale.setScalar((phone ? it.ms ?? 0.62 : 1) * Math.max(0.001, back(e)) * (1 + it.h * 0.15));
        it.o.position.set(it.base.x + Math.sin(T * 0.3 + it.ph) * 0.08, it.base.y + Math.sin(T * 0.9 + it.ph) * 0.14 - (1 - ease(e)) * 5, it.base.z);
        it.extra += (it.h * 3 + it.kick * 14) * dt;
        it.o.rotation.y = it.face + Math.sin(T * 0.45 + it.ph) * (it.sway ?? 0.5) + it.extra;
      });
      cam.position.x += (ptr.x * 0.9 - cam.position.x) * Math.min(1, dt * 3);
      cam.position.y += (ptr.y * 0.6 - cam.position.y) * Math.min(1, dt * 3);
      cam.lookAt(0, 0, 0);
      gl.render(scene, cam);
    }
    if (!reduce) raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  // keep the edge lines matching the theme
  const recolor = () => edgeMat.color.set(css('--ink'));
  const mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', recolor);
  const mo = new MutationObserver(recolor); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect(); offBoot();
    mq.removeEventListener('change', recolor); removeEventListener('resize', resize);
    hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); hero.removeEventListener('click', onClick);
    gl.dispose();
  };
}
