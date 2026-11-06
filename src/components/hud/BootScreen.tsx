import { useEffect, useRef, useState } from 'react';
import { boot, markBootLeft } from './boot';
import { ANNOUNCEMENT } from '@/data/home';

const MSGS: [number, string][] = [[0, 'Booting'], [0.2, 'Loading scene'], [0.5, 'Compiling shaders'], [0.75, 'Lighting the level'], [0.95, 'Spawning player']];

// Fills as the hero scene loads, then wipes upward to reveal the page. First visit in a
// session gets a short minimum so the bar reads; return visits and reduced motion skip it.
// The CSS animation `hx-boot-kill` hides it after 15s even if scripts never run.
export function BootScreen({ initials }: { initials: string }) {
  const [gone, setGone] = useState(false);
  const el = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const pct = useRef<HTMLSpanElement>(null);
  const msg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = document.documentElement;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = sessionStorage.getItem('booted') === '1'; } catch { /* storage blocked */ }
    const t0 = performance.now(), MIN = seen || still ? 0 : 1400;
    let shown = 0, last = t0, raf = 0, left = false;
    d.classList.add('booting');
    const hardStop = setTimeout(() => { boot.finished = true; }, 12000);

    const leave = () => {
      if (left) return; left = true;
      try { sessionStorage.setItem('booted', '1'); } catch { /* storage blocked */ }
      d.classList.remove('booting'); d.classList.add('booted');
      el.current?.classList.add('out');
      markBootLeft();
      setTimeout(() => setGone(true), still ? 0 : 800);
    };
    const step = (now: number) => {
      const t = now - t0, creep = Math.min(0.9, t / 9000);
      const target = boot.finished && t >= MIN ? 1 : Math.min(boot.finished ? 0.97 : 0.95, Math.max(boot.real, creep));
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      shown = still ? target : Math.min(target, shown + Math.max((target - shown) * (1 - Math.exp(-dt * 5)), target === 1 ? dt * 1.4 : 0));
      const n = Math.round(shown * 100);
      if (fill.current) fill.current.style.transform = `scaleX(${shown})`;
      if (pct.current) pct.current.textContent = String(n).padStart(2, '0');
      el.current?.setAttribute('aria-valuenow', String(n));
      if (msg.current) msg.current.textContent = shown === 1 ? 'Ready' : MSGS.filter(m => shown >= m[0]).pop()![1];
      if (shown === 1) { setTimeout(leave, still ? 0 : 280); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); clearTimeout(hardStop); d.classList.remove('booting'); };
  }, []);

  if (gone) return null;
  return (
    <div ref={el} className="hx-boot" role="progressbar" aria-label="Loading portfolio" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <div className="hx-boot-box">
        <span className="hx-corner tl" /><span className="hx-corner tr" /><span className="hx-corner bl" /><span className="hx-corner br" />
        <div className="hx-boot-top"><span className="hx-logo" aria-hidden="true">{initials}</span><span>Loading player profile</span></div>
        <div className="hx-boot-pct"><span ref={pct}>00</span><small>% Loaded</small></div>
        <div className="hx-boot-bar"><div ref={fill} className="hx-boot-fill" /></div>
        <div className="hx-boot-ticks" aria-hidden="true"><span>000</span><span>025</span><span>050</span><span>075</span><span>100</span></div>
        <div ref={msg} className="hx-boot-msg">Booting</div>
        <div className="hx-boot-news"><span>{ANNOUNCEMENT.tag}</span>{ANNOUNCEMENT.text}</div>
      </div>
    </div>
  );
}
