// Boot progress shared between the boot screen and the hero 3D scene.
// The scene reports real progress (`bootReal`) and completion (`bootDone`); the boot screen
// creeps on its own meanwhile so it never looks stuck, and fires `boot:done` when it leaves.
type Listener = () => void;

export const boot = {
  real: 0.08,
  finished: false,
  left: false,
  listeners: new Set<Listener>(),
};

export function bootReal(f: number) { boot.real = Math.max(boot.real, 0.08 + f * 0.87); }
export function bootDone() { boot.finished = true; }

// Runs `fn` once the boot screen has gone (immediately if it already has).
export function onBootLeft(fn: Listener) {
  if (boot.left) { fn(); return () => {}; }
  boot.listeners.add(fn);
  return () => { boot.listeners.delete(fn); };
}

export function markBootLeft() {
  boot.left = true;
  boot.listeners.forEach(fn => fn());
  boot.listeners.clear();
}
