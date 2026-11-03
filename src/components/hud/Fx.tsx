import { useEffect } from 'react';

// Site-wide interaction layer: scroll progress bar, scroll reveal, and on mouse/trackpad a
// custom pointer, a glow that trails it, tilt on tiles and magnetic buttons. Reduced motion
// keeps the cursor and glow but drops reveal, tilt and magnet. Styles are in styles/hud.css.
const REVEAL = '.hx-sec-head,.hx-skill,.hx-price,.hx-card,.hx-contact';
const TILT = '.hx-vp,.hx-skill,.hx-price';

export default function Fx() {
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const html = document.documentElement;
    const made: HTMLElement[] = [];
    const add = (cls: string) => { const e = document.createElement('div'); e.className = cls; e.setAttribute('aria-hidden', 'true'); document.body.appendChild(e); made.push(e); return e; };
    const off: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, target: Window | Document = window) => {
      target.addEventListener(t, fn as EventListener, { passive: true });
      off.push(() => target.removeEventListener(t, fn as EventListener));
    };

    // scroll progress
    const bar = add('fx-bar');
    const prog = () => { const h = html.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
    on('scroll', prog); on('resize', prog); prog();

    // scroll reveal, including cards rendered later (archive grid, filters)
    if (!still) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); }
      }), { rootMargin: '0px 0px -8% 0px' });
      const scan = (root: ParentNode) => root.querySelectorAll<HTMLElement>(REVEAL).forEach(el => {
        // carousel cards scroll sideways into view; sliding them up looks like the row jumping
        if (el.classList.contains('fx-in') || el.closest('.hx-hero,.hx-rail')) return;
        // already tagged by an earlier (remounted) pass: just watch it again
        if (el.classList.contains('fx-r')) { io.observe(el); return; }
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) return; // already on screen: no flash
        el.classList.add('fx-r'); io.observe(el);
      });
      scan(document);
      const mo = new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => n.nodeType === 1 && scan((n.parentNode ?? n) as ParentNode))));
      mo.observe(document.body, { childList: true, subtree: true });
      off.push(() => { io.disconnect(); mo.disconnect(); });
    }

    if (fine) {
      const glow = add('fx-glow'), ring = add('fx-ring'), dot = add('fx-dot');
      html.classList.add('fx-cursor');
      let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, gx = x, gy = y, raf = 0;
      const loop = () => {
        rx += (x - rx) * 0.2; ry += (y - ry) * 0.2; gx += (x - gx) * 0.08; gy += (y - gy) * 0.08;
        dot.style.transform = `translate(${x}px,${y}px)`; ring.style.transform = `translate(${rx}px,${ry}px)`; glow.style.transform = `translate(${gx}px,${gy}px)`;
        raf = Math.abs(x - rx) + Math.abs(y - ry) + Math.abs(x - gx) + Math.abs(y - gy) > 0.3 ? requestAnimationFrame(loop) : 0;
      };
      on('pointermove', e => {
        x = e.clientX; y = e.clientY; html.classList.add('fx-on');
        if (!raf) raf = requestAnimationFrame(loop);
        const t = e.target as Element | null;
        const drag = !!t?.closest?.('.hx-rail.loop');
        ring.classList.toggle('drag', drag && !t?.closest?.('a,button'));
        ring.classList.toggle('link', !ring.classList.contains('drag') && !!t?.closest?.('a,button,[role=button],label,summary'));
      });
      on('pointerleave', () => html.classList.remove('fx-on'), document);
      on('blur', () => html.classList.remove('fx-on'));
      on('pointerdown', () => ring.classList.add('down'));
      on('pointerup', () => ring.classList.remove('down'));
      off.push(() => { cancelAnimationFrame(raf); html.classList.remove('fx-cursor', 'fx-on'); });

      if (!still) {
        // tilt: tiles, skill and price cards lean toward the pointer, with a soft sheen.
        // Cards carry a full-size link over the tile, so listen on the card and tilt its tile.
        on('pointerover', e => {
          const host = (e.target as Element).closest?.<HTMLElement>(`.hx-card,${TILT}`);
          const el = host && (host.matches(TILT) ? host : host.querySelector<HTMLElement>('.hx-vp'));
          if (!host || !el || host.dataset.fx) return;
          host.dataset.fx = '1'; el.classList.add('fx-tilt');
          if (!el.querySelector(':scope>.fx-sheen')) { const s = document.createElement('span'); s.className = 'fx-sheen'; el.appendChild(s); }
          if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
          const max = el.matches('.hx-vp') ? 7 : 4;
          const move = (ev: PointerEvent) => {
            const r = el.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
            el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
            el.style.setProperty('--sx', px * 100 + '%'); el.style.setProperty('--sy', py * 100 + '%'); el.classList.add('fx-hot');
          };
          const leave = () => { el.style.transform = ''; el.classList.remove('fx-hot'); host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); delete host.dataset.fx; };
          host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
        }, document);

        // magnetic buttons: drift toward the pointer (uses `translate`, so :active's transform still works)
        on('pointerover', e => {
          const b = (e.target as Element).closest?.<HTMLElement>('.hx-btn,.hx-arrow');
          if (!b || b.dataset.mag) return;
          b.dataset.mag = '1'; b.classList.add('fx-mag');
          const move = (ev: PointerEvent) => { const r = b.getBoundingClientRect(); b.style.translate = `${(ev.clientX - r.left - r.width / 2) * 0.22}px ${(ev.clientY - r.top - r.height / 2) * 0.3}px`; };
          const leave = () => { b.style.translate = ''; b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave); delete b.dataset.mag; };
          b.addEventListener('pointermove', move); b.addEventListener('pointerleave', leave);
        }, document);
      }
    }

    return () => { off.forEach(f => f()); made.forEach(e => e.remove()); };
  }, []);
  return null;
}
