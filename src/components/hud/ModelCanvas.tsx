import { useEffect, useRef, useState } from 'react';
import { Wire } from './Card';

// A live, spinning GLB inside a viewport tile. three.js and the viewer load on first use;
// until a model is ready (or if it fails / WebGL is missing) the wireframe placeholder shows.
export function ModelCanvas({ file, drag, spin, elev, zoom, clips, label, cta }: {
  file: string;
  drag?: boolean;
  spin?: number;
  elev?: number;
  zoom?: number;
  clips?: string[];
  label?: string; // shown if the model can't load
  cta?: string; // bottom caption once loaded, e.g. "Open collection →"
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let off: (() => void) | null = null, dead = false;
    import('./liveViewer')
      .then(v => { if (!dead && ref.current) off = v.attach(ref.current, { file, drag, spin, elev, zoom, clips, onState: s => !dead && setState(s) }); })
      .catch(() => setState('failed'));
    return () => { dead = true; off?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- clips is a static list per file
  }, [file, drag, spin, elev, zoom]);

  return (
    <>
      <canvas ref={ref} className={`hx-model-cv${drag ? ' drag' : ''}`} aria-hidden="true" data-state={state} />
      {state !== 'ready' && <Wire />}
      {state === 'loading' && <span className="hx-pend">Loading model…</span>}
      {state === 'failed' && <span className="hx-pend">{label ?? 'Render pending'}</span>}
      {state === 'ready' && cta && <span className="hx-pend">{cta}</span>}
    </>
  );
}
