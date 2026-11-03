import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { PROFILE } from '@/data/portfolio';
import { NAV } from '@/data/home';
import { scrollToId } from '@/lib/motion';

export const initials = PROFILE.name.split(' ').map(w => w[0]).slice(0, 2).join('');

// Sticky header: border once scrolled, phone menu, and the section in view underlined.
export default function Header() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const pinned = useRef<string | null>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let rq = 0;
    // Underline the section whose top has passed a line a third of the way down. A clicked
    // item stays pinned until the visitor scrolls themselves, since the smooth scroll passes others.
    const spy = () => {
      rq = 0;
      setScrolled(scrollY > 8);
      if (!onHome || pinned.current) return;
      const secs = NAV.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
      const line = innerHeight / 3;
      let cur: string | null = null;
      for (const s of secs) if (s.getBoundingClientRect().top <= line) cur = s.id;
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2 && secs.length) cur = secs[secs.length - 1].id;
      setCurrent(cur);
    };
    const onScroll = () => { if (!rq) rq = requestAnimationFrame(spy); };
    const unpin = () => { if (pinned.current) { pinned.current = null; spy(); } };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); menuBtn.current?.focus(); } };
    addEventListener('scroll', onScroll, { passive: true });
    ['wheel', 'pointerdown'].forEach(t => addEventListener(t, unpin, { passive: true }));
    addEventListener('keydown', onKey);
    spy();
    return () => {
      removeEventListener('scroll', onScroll);
      ['wheel', 'pointerdown'].forEach(t => removeEventListener(t, unpin));
      removeEventListener('keydown', onKey);
      cancelAnimationFrame(rq);
    };
  }, [onHome]);

  const go = (id: string) => {
    setOpen(false);
    if (!onHome) return; // Link navigates to "/#id"; ScrollManager scrolls there
    pinned.current = id;
    setCurrent(id);
    scrollToId(id);
  };

  return (
    <header className={`hx-top${scrolled ? ' scrolled' : ''}`}>
      <div className="hx-wrap">
        <Link className="hx-mark" to="/#top" onClick={() => go('top')} aria-label={`${PROFILE.name}, back to top`}>
          <span className="hx-logo" aria-hidden="true">{initials}</span>
          <span className="hx-nm">{PROFILE.name}<small>Game dev · UE5 · Roblox</small></span>
        </Link>
        <nav className={`hx-nav${open ? ' open' : ''}`} id="hx-nav" aria-label="Sections">
          {NAV.map(n => (
            <Link key={n.id} to={`/#${n.id}`} onClick={() => go(n.id)} aria-current={current === n.id ? 'true' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link className="hx-btn sm loot go hx-hire" to="/#contact" onClick={() => go('contact')}>Hire me</Link>
        <button ref={menuBtn} className="hx-menu-btn" type="button" aria-expanded={open} aria-controls="hx-nav" onClick={() => setOpen(o => !o)}>
          <span className="hx-bars" aria-hidden="true" /><span>{open ? 'Close' : 'Menu'}</span>
        </button>
      </div>
    </header>
  );
}
