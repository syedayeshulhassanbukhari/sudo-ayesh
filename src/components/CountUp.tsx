import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

// Counts from 0 to `value` the first time it scrolls into view. The pre-rendered HTML
// (and anyone with reduced motion) gets the final number straight away. The animation
// writes the text directly, so React never re-renders on each frame.
export function CountUp({ value, suffix = '', duration = 1400 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return;
    const show = (n: number) => { el.textContent = `${n}${suffix}`; };
    show(0);
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        show(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      show(value);
    };
  }, [value, suffix, duration]);

  return <span ref={ref} className="tabular-nums">{`${value}${suffix}`}</span>;
}
