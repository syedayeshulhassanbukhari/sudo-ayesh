import { useEffect, useRef, type ElementType } from 'react';
import { onBootLeft } from './boot';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01ΛΣΞ';

// Text stays readable at rest (and in the pre-rendered HTML); it scrambles and resolves
// once it comes into view. `replayOnBoot` decodes again when the boot screen lifts (hero name).
export function scramble(el: HTMLElement, final: string) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || el.dataset.busy) return;
  el.dataset.busy = '1';
  let f = 0;
  const t = setInterval(() => {
    el.textContent = [...final].map((ch, i) => (ch === ' ' ? ' ' : i < f / 3 ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (++f > final.length * 3 + 6) { clearInterval(t); el.textContent = final; delete el.dataset.busy; }
  }, 35);
}

export function Scramble({ text, as: Tag = 'span', className, replayOnBoot = false }: {
  text: string;
  as?: ElementType;
  className?: string;
  replayOnBoot?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { scramble(el, text); io.unobserve(el); }
    }), { threshold: 0.6 });
    io.observe(el);
    const off = replayOnBoot ? onBootLeft(() => scramble(el, text)) : undefined;
    return () => { io.disconnect(); off?.(); };
  }, [text, replayOnBoot]);
  return <Tag ref={ref} className={className}>{text}</Tag>;
}
