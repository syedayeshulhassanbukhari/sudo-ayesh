// Live 3D viewer for model cards. One shared WebGL renderer draws every visible model
// canvas in turn and copies the frame into it, so a 60-card collection page still costs a
// single GL context. Models load only when their card is within about a screen of view,
// spin slowly (faster on hover), and play their animation clips one after another.
// Canvases with `drag` let the visitor turn the model (in carousels the rail owns dragging).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { asset } from '@/lib/asset';

export interface ViewOpts {
  file: string; // path inside public/models, e.g. "eggs/chick.glb"
  drag?: boolean;
  spin?: number; // starting yaw
  elev?: number; // camera height factor (bigger = more top-down)
  zoom?: number; // < 1 moves the camera in
  clips?: string[]; // only play clips whose names end with one of these
  onState?: (s: 'loading' | 'ready' | 'failed') => void;
}

interface Model { pivot: THREE.Group; r: number; mixer?: THREE.AnimationMixer }
interface Entry extends ViewOpts { c: HTMLCanvasElement; ctx?: CanvasRenderingContext2D | null; yaw: number; hold: number }

let R: THREE.WebGLRenderer | null = null;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(30, 1, 0.01, 1000);
const models = new Map<string, Model | 'loading' | 'failed'>();
const waiting = new Map<string, Set<Entry>>();
const entries = new Set<Entry>();
let loader: GLTFLoader;
let raf = 0, last = 0;
// a 60-model page would otherwise fetch and decode everything in one burst
const MAX_LOADS = 4;
let inFlight = 0;
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function init() {
  if (R) return true;
  try { R = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); }
  catch { return false; }
  R.outputColorSpace = THREE.SRGBColorSpace;
  R.toneMapping = THREE.ACESFilmicToneMapping;
  R.toneMappingExposure = 1.05;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5a6478, 1.4), new THREE.AmbientLight(0xffffff, 0.35));
  const sun = new THREE.DirectionalLight(0xfff4e6, 2.2); sun.position.set(-3, 5, 4);
  const rim = new THREE.DirectionalLight(0xdfe9ff, 1.3); rim.position.set(3, 2, -4);
  scene.add(sun, rim);
  const draco = new DRACOLoader(); draco.setDecoderPath(asset('draco/'));
  loader = new GLTFLoader(); loader.setDRACOLoader(draco);
  return true;
}

// skinned meshes move away from their bind-pose bounds, so frame poses sampled across every clip
function posedBox(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
  const box = new THREE.Box3(), v = new THREE.Vector3(), mx = new THREE.AnimationMixer(root);
  const sk: THREE.SkinnedMesh[] = [];
  root.traverse(o => { if ((o as THREE.SkinnedMesh).isSkinnedMesh) sk.push(o as THREE.SkinnedMesh); });
  if (!sk.length) return box.setFromObject(root);
  clips.forEach(c => {
    const a = mx.clipAction(c).play();
    for (let k = 0; k < 5; k++) {
      mx.setTime((c.duration * k) / 5); root.updateMatrixWorld(true);
      sk.forEach(m => {
        const p = m.geometry.attributes.position;
        for (let i = 0; i < p.count; i += 4) { v.fromBufferAttribute(p, i); m.applyBoneTransform(i, v); box.expandByPoint(v.applyMatrix4(m.matrixWorld)); }
      });
    }
    a.stop();
  });
  mx.uncacheRoot(root);
  return box;
}

function playChain(root: THREE.Object3D, clips: THREE.AnimationClip[]) {
  const mx = new THREE.AnimationMixer(root);
  let i = 0;
  const play = () => { const a = mx.clipAction(clips[i]); a.reset(); a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; a.play(); };
  mx.addEventListener('finished', e => {
    const prev = e.action; i = (i + 1) % clips.length; play();
    if (prev !== mx.clipAction(clips[i])) prev.stop();
  });
  play();
  return mx;
}

function load(file: string, only?: string[]) {
  models.set(file, 'loading');
  inFlight++;
  loader.load(asset(`models/${file}`), g => {
    inFlight--;
    const root = g.scene;
    const clips = only ? g.animations.filter(a => only.some(n => a.name.endsWith(n))) : g.animations;
    const box = clips.length ? posedBox(root, clips) : new THREE.Box3().setFromObject(root);
    const sph = box.getBoundingSphere(new THREE.Sphere());
    root.position.sub(sph.center);
    root.traverse(o => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        (m as THREE.SkinnedMesh).frustumCulled = false; // skinned bounds are bind-pose
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && 'metalness' in mat) mat.metalness = Math.min(mat.metalness, 0.3);
      }
    });
    const pivot = new THREE.Group(); pivot.add(root);
    models.set(file, { pivot, r: sph.radius || 1, mixer: clips.length ? playChain(root, clips) : undefined });
    waiting.get(file)?.forEach(e => e.onState?.('ready'));
  }, undefined, () => {
    inFlight--;
    models.set(file, 'failed');
    waiting.get(file)?.forEach(e => e.onState?.('failed'));
  });
}

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const vh = innerHeight, vw = innerWidth;
  if (!reduce) models.forEach(m => { if (typeof m === 'object') m.mixer?.update(dt); });
  entries.forEach(e => {
    const b = e.c.getBoundingClientRect();
    const m = models.get(e.file);
    if (!m) {
      if (inFlight < MAX_LOADS && b.width && b.bottom > -vh && b.top < vh * 2 && b.right > -vw && b.left < vw * 2) load(e.file, e.clips);
      return;
    }
    if (typeof m !== 'object') return;
    if (b.bottom < 0 || b.top > vh || b.right < 0 || b.left > vw || !b.width) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    // layout size, so a tilted tile doesn't resize the canvas every frame
    const w = Math.round(e.c.clientWidth * dpr), h = Math.round(e.c.clientHeight * dpr);
    if (!w || !h) return;
    if (e.c.width !== w || e.c.height !== h) { e.c.width = w; e.c.height = h; }
    R!.setSize(w, h, false);
    const hover = e.c.closest('.hx-card, .hx-model')?.matches(':hover');
    if (!reduce && now - e.hold > 1500) e.yaw += dt * (hover ? 1.6 : 0.55);
    m.pivot.rotation.set(0, e.yaw, 0);
    scene.add(m.pivot);
    cam.aspect = w / h;
    const fit = Math.max(1, 1 / cam.aspect); // tall canvases need more distance to keep the sides in frame
    const d = (m.r / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2))) * 1.02 * fit * (e.zoom ?? 1);
    const el = e.elev ?? 0.26;
    cam.position.set(0, d * el, d).multiplyScalar(Math.hypot(1, 0.26) / Math.hypot(1, el));
    cam.lookAt(0, 0, 0); cam.near = d / 50; cam.far = d * 4; cam.updateProjectionMatrix();
    R!.render(scene, cam);
    scene.remove(m.pivot);
    const ctx = e.ctx ?? (e.ctx = e.c.getContext('2d'));
    ctx?.clearRect(0, 0, w, h); ctx?.drawImage(R!.domElement, 0, 0);
  });
  raf = entries.size ? requestAnimationFrame(frame) : 0;
}

// Registers a canvas; returns an unregister function. Returns null when WebGL is unavailable.
export function attach(c: HTMLCanvasElement, opts: ViewOpts): (() => void) | null {
  if (!init()) { opts.onState?.('failed'); return null; }
  const e: Entry = { ...opts, c, yaw: opts.spin ?? 0.6, hold: 0 };
  entries.add(e);
  if (!waiting.has(e.file)) waiting.set(e.file, new Set());
  waiting.get(e.file)!.add(e);
  const m = models.get(e.file);
  opts.onState?.(typeof m === 'object' ? 'ready' : m === 'failed' ? 'failed' : 'loading');

  let down: { x: number } | null = null;
  const pd = (ev: PointerEvent) => { if (!e.drag) return; down = { x: ev.clientX }; c.setPointerCapture(ev.pointerId); };
  const pm = (ev: PointerEvent) => { if (!down) return; e.yaw += (ev.clientX - down.x) * 0.012; down.x = ev.clientX; e.hold = performance.now(); };
  const pu = () => { down = null; };
  c.addEventListener('pointerdown', pd); c.addEventListener('pointermove', pm);
  c.addEventListener('pointerup', pu); c.addEventListener('pointercancel', pu);

  if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  return () => {
    entries.delete(e); waiting.get(e.file)?.delete(e);
    c.removeEventListener('pointerdown', pd); c.removeEventListener('pointermove', pm);
    c.removeEventListener('pointerup', pu); c.removeEventListener('pointercancel', pu);
  };
}
