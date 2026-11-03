import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { WorkSection as Section } from '@/data/home';
import { Card } from './Card';
import { Scramble } from './Scramble';

const SPEED = 38; // px per second
const GAP = 22; // matches .hx-track gap

// useLayoutEffect warns during the build-time server render; it only matters in the browser
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

// Carousel that drifts on its own once the row is wider than the screen. A second copy of
// the cards (hidden from screen readers) makes the loop seamless. Hover, focus, touch or a
// drag stops it; then arrows, drag or trackpad scroll it.
function useRail(count: number) {
  const rail = useRef<HTMLDivElement>(null);
  const [loop, setLoop] = useState(false);
  const [paused, setPaused] = useState(false);
  const s = useRef({ pos: 0, target: 0, L: 0, hover: false, touch: false, drag: null as null | { x: number; x0: number; cap?: boolean }, visible: true, tt: 0 });

  // decide whether to loop; rebuild only when the width changes (phones resize on scroll)
  useIsoLayoutEffect(() => {
    const r = rail.current!;
    let w = innerWidth, rt = 0;
    const measure = () => {
      const t = r.firstElementChild as HTMLElement;
      const originals = [...t.children].slice(0, count) as HTMLElement[];
      const width = originals.reduce((a, c) => a + c.offsetWidth + GAP, -GAP);
      setLoop(width > r.clientWidth + 4);
    };
    measure();
    const onResize = () => { if (innerWidth === w) return; w = innerWidth; clearTimeout(rt); rt = window.setTimeout(measure, 200); };
    addEventListener('resize', onResize);
    return () => { removeEventListener('resize', onResize); clearTimeout(rt); };
  }, [count]);

  useIsoLayoutEffect(() => {
    const r = rail.current!, st = s.current;
    if (!loop) { st.L = 0; r.scrollLeft = 0; return; }
    const kids = (r.firstElementChild as HTMLElement).children as HTMLCollectionOf<HTMLElement>;
    st.L = kids[count].offsetLeft - kids[0].offsetLeft;
    st.pos = st.target = r.scrollLeft % st.L;
  }, [loop, count]);

  useEffect(() => {
    const r = rail.current!, st = s.current;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isPaused = () => st.hover || st.touch || !!st.drag || reduce;
    const mark = () => setPaused(isPaused());
    const enter = (e: PointerEvent) => { if (e.pointerType === 'mouse') { st.hover = true; mark(); } };
    const leave = (e: PointerEvent) => { if (e.pointerType === 'mouse') { st.hover = false; st.drag = null; r.classList.remove('dragging'); mark(); } };
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') { if (!st.L) return; st.drag = { x: e.clientX, x0: e.clientX }; r.classList.add('dragging'); }
      else { clearTimeout(st.tt); st.touch = true; }
      mark();
    };
    // capture only once it is really a drag, so a plain click still reaches card links
    const move = (e: PointerEvent) => {
      if (!st.drag) return;
      if (!st.drag.cap && Math.abs(e.clientX - st.drag.x0) > 4) { st.drag.cap = true; r.setPointerCapture(e.pointerId); }
      r.scrollLeft -= e.clientX - st.drag.x; st.drag.x = e.clientX;
    };
    const end = (e: PointerEvent) => {
      if (st.drag) { st.drag = null; r.classList.remove('dragging'); }
      if (e.pointerType !== 'mouse') { clearTimeout(st.tt); st.tt = window.setTimeout(() => { st.touch = false; mark(); }, 2500); }
      mark();
    };
    // a drag must not count as a click on a card link
    let downX = 0;
    const capDown = (e: PointerEvent) => { downX = e.clientX; };
    const click = (e: MouseEvent) => { if (Math.abs(e.clientX - downX) > 6) { e.preventDefault(); e.stopPropagation(); } };
    const focusIn = () => { st.hover = true; mark(); };
    const focusOut = () => { st.hover = false; mark(); };
    // while stopped the user drives the scroll; keep it looping and keep our position in sync
    const onScroll = () => {
      if (!st.L || !isPaused() || Math.abs(st.target - st.pos) >= 0.5) return;
      if (r.scrollLeft >= st.L) r.scrollLeft -= st.L; else if (r.scrollLeft <= 0) r.scrollLeft += st.L;
      st.pos = st.target = r.scrollLeft;
    };
    r.addEventListener('pointerenter', enter); r.addEventListener('pointerleave', leave);
    r.addEventListener('pointerdown', down); r.addEventListener('pointermove', move);
    r.addEventListener('pointerup', end); r.addEventListener('pointercancel', end);
    r.addEventListener('pointerdown', capDown, true); r.addEventListener('click', click, true);
    r.addEventListener('focusin', focusIn); r.addEventListener('focusout', focusOut);
    r.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; });
    io.observe(r);

    let last = performance.now(), raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (st.L && st.visible) {
        const idle = Math.abs(st.target - st.pos) < 0.5;
        if (!(isPaused() && idle)) {
          if (!isPaused()) st.target += SPEED * dt;
          st.pos += (st.target - st.pos) * Math.min(1, dt * 10);
          if (st.pos >= st.L) { st.pos -= st.L; st.target -= st.L; } else if (st.pos < 0) { st.pos += st.L; st.target += st.L; }
          r.scrollLeft = st.pos;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); clearTimeout(st.tt);
      r.removeEventListener('pointerenter', enter); r.removeEventListener('pointerleave', leave);
      r.removeEventListener('pointerdown', down); r.removeEventListener('pointermove', move);
      r.removeEventListener('pointerup', end); r.removeEventListener('pointercancel', end);
      r.removeEventListener('pointerdown', capDown, true); r.removeEventListener('click', click, true);
      r.removeEventListener('focusin', focusIn); r.removeEventListener('focusout', focusOut);
      r.removeEventListener('scroll', onScroll);
    };
  }, []);

  const step = (dir: number) => {
    const r = rail.current!, st = s.current;
    if (!st.L) return;
    if (Math.abs(st.target - st.pos) < 0.5) st.pos = st.target = r.scrollLeft;
    st.target += ((r.querySelector('.hx-card') as HTMLElement).offsetWidth + GAP) * dir;
  };

  return { rail, loop, paused, step };
}

export function WorkSection({ s }: { s: Section }) {
  const best = useMemo(() => s.items.filter(it => it.best !== false), [s.items]);
  const rest = useMemo(() => s.items.filter(it => it.best === false), [s.items]);
  const subs = useMemo(() => [...new Set(rest.map(x => x.sub!))], [rest]);
  const { rail, loop, paused, step } = useRail(best.length);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [sub, setSub] = useState('all');
  const moreRef = useRef<HTMLButtonElement>(null);
  const shown = rest.filter(it => sub === 'all' || it.sub === sub);

  return (
    <section className={`hx-sec${paused ? ' paused' : ''}`} id={s.id} aria-labelledby={`${s.id}-h`}>
      <div className="hx-sec-head">
        <div>
          <div className="hx-idx">{s.title}</div>
          <h2 id={`${s.id}-h`} aria-label={s.title}><Scramble text={s.title} /></h2>
          <p>{s.blurb}</p>
        </div>
        <div className="hx-rail-nav" hidden={!loop}>
          <span className="hx-live"><i />Auto</span>
          <button className="hx-arrow" type="button" aria-label="Previous" onClick={() => step(-1)}>←</button>
          <button className="hx-arrow" type="button" aria-label="Next" onClick={() => step(1)}>→</button>
        </div>
      </div>
      <div ref={rail} className={`hx-rail${loop ? ' loop' : ''}`} tabIndex={0} aria-label={`${s.title} carousel, scrollable`}>
        <div className="hx-track">
          {best.map(it => <Card key={it.key} it={it} section={s.title} />)}
          {loop && best.map(it => <Card key={`${it.key}-clone`} it={it} section={s.title} hidden />)}
        </div>
      </div>

      {rest.length > 0 && (
        <>
          <button
            ref={moreRef}
            className="hx-more"
            type="button"
            aria-expanded={archiveOpen}
            aria-controls={`arch-${s.id}`}
            onClick={() => {
              setArchiveOpen(o => !o);
              if (archiveOpen) moreRef.current?.scrollIntoView({ block: 'nearest' });
            }}
          >
            <span>{archiveOpen ? 'Close archive' : 'Open full archive'}</span><b>+{rest.length} {s.archiveLabel ?? 'more'}</b>
          </button>
          <div className="hx-archive" id={`arch-${s.id}`} hidden={!archiveOpen}>
            <div className="hx-archive-head">
              <span className="hx-idx">Archive · {rest.length} more</span>
              <div className="hx-filters" role="group" aria-label={`Filter ${s.title} archive`}>
                {[['all', 'All', rest.length] as const, ...subs.map(x => [x, x, rest.filter(y => y.sub === x).length] as const)].map(([k, v, n]) => (
                  <button key={k} className="hx-chip" type="button" aria-pressed={sub === k} onClick={() => setSub(k)}>
                    {v}<span>{n}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="hx-grid">{shown.map(it => <Card key={it.key} it={it} section={s.title} />)}</div>
          </div>
        </>
      )}
    </section>
  );
}
