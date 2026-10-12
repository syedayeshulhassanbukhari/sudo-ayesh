import { useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { asset } from '@/lib/asset';

type Shot = { src: string; caption: string };

// Screenshot grid with a <dialog> lightbox (Esc closes, arrow keys step through).
export function Gallery({ shots, title }: { shots: Shot[]; title: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const current = shots[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = (d: number) => setIndex(i => (i + d + shots.length) % shots.length);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2">
        {shots.map((s, i) => (
          <li key={s.src}>
            <figure className="toon-card group h-full overflow-hidden p-0">
              <button
                type="button"
                onClick={() => open(i)}
                className="block aspect-video w-full overflow-hidden border-b-4 border-toon-blue bg-black"
                aria-label={`Enlarge: ${s.caption}`}
              >
                <img
                  src={asset(s.src)}
                  alt={`${title}: ${s.caption}`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              <figcaption className="p-4 font-tech text-[15px] leading-snug text-slate-300">{s.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClick={e => e.target === dialogRef.current && dialogRef.current?.close()}
        onKeyDown={e => {
          if (e.key === 'ArrowRight') step(1);
          if (e.key === 'ArrowLeft') step(-1);
        }}
        className="m-auto max-h-[94vh] w-[min(1200px,94vw)] rounded-2xl border-4 border-toon-blue bg-toon-card p-0 text-white shadow-pop-lg backdrop:bg-black/85"
      >
        {current && (
          <figure>
            <div className="relative bg-black">
              <img
                src={asset(current.src)}
                alt={`${title}: ${current.caption}`}
                className="mx-auto max-h-[78vh] w-auto object-contain"
              />
              {shots.length > 1 && (
                <>
                  <button type="button" onClick={() => step(-1)} aria-label="Previous screenshot" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 bg-black/60 p-2 hover:bg-toon-blue">
                    <ChevronLeft size={22} />
                  </button>
                  <button type="button" onClick={() => step(1)} aria-label="Next screenshot" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 bg-black/60 p-2 hover:bg-toon-blue">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}
            </div>
            <figcaption className="flex items-start justify-between gap-4 p-4">
              <span className="font-tech text-base text-slate-300">
                <span className="mr-2 font-mono text-xs text-slate-500">{index + 1}/{shots.length}</span>
                {current.caption}
              </span>
              <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close" className="shrink-0 rounded-lg border-2 border-toon-line p-1.5 hover:border-toon-blue">
                <X size={18} />
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
