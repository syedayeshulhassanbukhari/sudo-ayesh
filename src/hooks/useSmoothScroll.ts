import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { prefersReducedMotion, setLenis } from '@/lib/motion';

// Inertia-style wheel scrolling (Lenis). Touch keeps native scrolling, and it's off entirely
// for people who ask the OS for reduced motion.
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    setLenis(lenis);

    let frame = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
