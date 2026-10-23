import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { scrollToId, scrollToTop } from '@/lib/motion';

// Scrolls to the #hash target after navigation (e.g. "/#projects" from a project page),
// otherwise back to the top on route change.
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // wait a frame so the target section has rendered
      requestAnimationFrame(() => scrollToId(decodeURIComponent(hash.slice(1))));
      return;
    }
    scrollToTop();
  }, [pathname, hash]);

  return null;
}
