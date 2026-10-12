import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Scrolls to the #hash target after navigation (e.g. "/#projects" from a project page),
// otherwise back to the top on route change.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      // wait a frame so the target section has rendered
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
      return;
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}
