import { useEffect } from 'react';
import type { PageMeta } from '@/seo/meta';
import { absUrl } from '@/seo/meta';

// Keeps <title>, description, canonical and OG tags in sync during client-side navigation.
// The static HTML for each route already has these baked in at build time (seo/plugin.ts).
export function useDocumentMeta(meta: PageMeta) {
  useEffect(() => {
    document.title = meta.title;
    const set = (selector: string, attr: string, value: string) => {
      document.head.querySelector(selector)?.setAttribute(attr, value);
    };
    const url = absUrl(meta.path);
    set('meta[name="description"]', 'content', meta.description);
    set('link[rel="canonical"]', 'href', url);
    set('meta[property="og:url"]', 'content', url);
    set('meta[property="og:title"]', 'content', meta.title);
    set('meta[property="og:description"]', 'content', meta.description);
    set('meta[property="og:image"]', 'content', meta.image);
    set('meta[name="twitter:title"]', 'content', meta.title);
    set('meta[name="twitter:description"]', 'content', meta.description);
    set('meta[name="twitter:image"]', 'content', meta.image);
  }, [meta]);
}
