import type Lenis from '@studio-freight/lenis';

// Shared smooth-scroll instance (created in useSmoothScroll), so in-page links can glide
// with the same easing instead of fighting it with native smooth scrolling.
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenis = l; };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Matches `scroll-padding-top` in index.css, so headings land below the fixed nav.
const NAV_OFFSET = 88;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -NAV_OFFSET });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo({ top: 0 });
}
