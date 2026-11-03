import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';

// Muted looping preview inside a viewport tile. It plays only while on screen (carousel
// clones included), so off-screen videos neither download nor decode.
export function VideoTile({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={asset(src)}
      poster={poster ? asset(poster) : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  );
}
