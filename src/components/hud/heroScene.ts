// Hero 3D: real low-poly game assets (treadmill, pet eggs, axes), floating in the bracketed
// frame on the blue slab. Pointer moves the camera a little, hovering an item spins it up,
// clicking flips it. Loaded with a dynamic import so three.js never delays first paint.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { asset } from '@/lib/asset';
import { bootDone, bootReal, onBootLeft } from './boot';

interface Item {
  o: THREE.Group;
  d: [number, number]; // fraction of the scene slot from its centre (±.5 = brackets)
  phoneOff?: boolean; // hidden on phones, where the slot is too small for everything
  z: number;
  face: number;
  delay: number;
  sway?: number;
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
  gl.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  cam.position.set(0, 0, 14);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a97ad, 1.6), new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(3, 5, 9);
  const fill = new THREE.DirectionalLight(0xe8f0ff, 0.9); fill.position.set(-7, 1, 6);
  const rim = new THREE.DirectionalLight(0xffffff, 1); rim.position.set(0, 4, -8);
  scene.add(key, fill, rim);


  // real shipped meshes from public/models: a treadmill centrepiece, pet eggs and axes around it.
  // Each item starts as an empty group and gets its model once the GLB arrives, fitted to `size`.
  const slot3d = () => new THREE.Group();
  const raw: (Omit<Item, 'ph' | 'h' | 'kick' | 'extra' | 't0' | 'base'> & { file: string; size: number })[] = [
    { file: 'treadmills/dragon-run.glb', size: 3.6, o: slot3d(), d: [0, 0.02], z: 1, face: -0.5, delay: 0.1 },
    { file: 'eggs/chick.glb', size: 1.5, o: slot3d(), d: [-0.36, -0.28], z: -1, face: 0.3, delay: 0.3 },
    { file: 'eggs/rocket.glb', size: 1.5, o: slot3d(), d: [0.36, -0.3], z: -1, face: -0.3, delay: 0.45 },
    { file: 'axes/ember-crescent.glb', size: 2.5, o: slot3d(), d: [-0.4, 0.2], z: 0.3, face: 0.3, delay: 0.6 },
    { file: 'axes/rimefang.glb', size: 2.5, o: slot3d(), d: [0.4, 0.22], z: 0.3, face: 0, delay: 0.75 },
    { file: 'eggs/star-whale.glb', size: 1.1, o: slot3d(), d: [0.18, -0.42], phoneOff: true, z: 0.6, face: 0.5, delay: 0.85 },
  ];
  let T = reduce ? 99 : 0;
  const items: Item[] = raw.map((it, i) => ({ ...it, ph: i * 1.7, h: 0, kick: 0, extra: 0, t0: 0, base: new THREE.Vector3() }));
  items.forEach(it => { it.o.userData.it = it; scene.add(it.o); });
  // the boot screen waits for the meshes; a failed file just leaves its slot empty
  let loaded = 0;
  const draco = new DRACOLoader(); draco.setDecoderPath(asset('draco/'));
  const loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  const settle = () => { loaded++; bootReal(loaded / raw.length); if (loaded === raw.length) bootDone(); };
  raw.forEach(r => loader.load(asset('models/' + r.file), g => {
    const m = g.scene, box = new THREE.Box3().setFromObject(m), sz = box.getSize(new THREE.Vector3());
    m.position.sub(box.getCenter(new THREE.Vector3()));
    const pivot = new THREE.Group(); pivot.add(m); pivot.scale.setScalar(r.size / Math.max(sz.x, sz.y, sz.z));
    r.o.add(pivot); settle();
  }, undefined, settle));
  const offBoot = onBootLeft(() => { if (!reduce) items.forEach(it => { it.t0 = T + 0.25; }); });

  let phone = false, fit = 1;
  const resize = () => {
    const w = hero.clientWidth, h = hero.clientHeight; if (!w || !h) return;
    gl.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    const H = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)), W = H * cam.aspect;
    phone = w < 900;
    // desktop positions hang off the scene slot, measured in world units at z = 0
    const hr = hero.getBoundingClientRect(), sr = slot.getBoundingClientRect();
    const sx = ((sr.left + sr.width / 2 - hr.left) / w - 0.5) * W, sy = (0.5 - (sr.top + sr.height / 2 - hr.top) / h) * H;
    const sw = (sr.width / w) * W, sh = (sr.height / h) * H;
    fit = Math.min(1, sw / 7.5) * (w < 900 ? 1.15 : 1); // 7.5 world units is about the desktop slot width
    items.forEach(it => {
      // phones use the same bracketed slot, scaled down to its width
      it.off = phone && !!it.phoneOff; if (it.off) return;
      const p = it.d, k = phone ? 0.72 : 1; // phones pull the ring in so nothing drops under the ticker
      it.base.set(Math.min(W / 2 - 0.7 * fit, Math.max(-W / 2 + 0.7 * fit, sx + p[0] * sw * k)), sy + p[1] * sh * k, it.z);
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
        it.o.scale.setScalar(fit * Math.max(0.001, back(e)) * (1 + it.h * 0.15));
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

  return () => {
    cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); draco.dispose(); offBoot();
    removeEventListener('resize', resize);
    hero.removeEventListener('pointermove', onMove); hero.removeEventListener('pointerleave', onLeave); hero.removeEventListener('click', onClick);
    gl.dispose();
  };
}
