import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { asset } from '@/lib/asset';
import { scrollToId } from '@/lib/motion';

const navLinks = [
  { label: 'Home', hash: 'hero' },
  { label: 'About', hash: 'about' },
  { label: 'Projects', hash: 'projects' },
  { label: 'Services', hash: 'services' },
  { label: 'Logbook', hash: 'logbook' },
  { label: 'FAQ', hash: 'faq' },
  { label: 'Contact', hash: 'contact' },
];

export default function Navigation() {
  const { pathname } = useLocation();
  const onHome = pathname === '/';
  const [scrolled, setScrolled] = useState(!onHome);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(!onHome || window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [onHome]);

  // Re-clicking a link whose hash is already in the URL doesn't change location, so scroll manually.
  const jump = (hash: string) => {
    setOpen(false);
    if (onHome) scrollToId(hash);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-2xl border-[3px] border-toon-blue bg-toon-card/95 px-4 py-2 shadow-pop backdrop-blur md:px-5"
        style={{ width: 'calc(100% - 24px)' }}
      >
        <Link to="/#hero" onClick={() => jump('hero')} className="flex items-center gap-2" aria-label={`${PROFILE.name}, home`}>
          <img src={asset(PROFILE.avatar)} alt="" className="h-9 w-9 rounded-lg border-2 border-toon-blue object-cover" />
          <span className="font-display text-base text-white">{PROFILE.handle}</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map(l => (
            <li key={l.hash}>
              <Link
                to={`/#${l.hash}`}
                onClick={() => jump(l.hash)}
                className="rounded-lg px-3 py-2 font-tech text-sm font-bold uppercase tracking-wider text-slate-300 transition-colors hover:bg-toon-blue hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="rounded-lg border-2 border-toon-line p-2 text-white lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <ul
          className="mx-auto mt-2 flex flex-col gap-1 rounded-2xl border-[3px] border-toon-blue bg-toon-card p-3 shadow-pop lg:hidden"
          style={{ width: 'calc(100% - 24px)' }}
        >
          {navLinks.map(l => (
            <li key={l.hash}>
              <Link
                to={`/#${l.hash}`}
                onClick={() => jump(l.hash)}
                className="block rounded-lg px-4 py-3 font-display text-lg uppercase text-slate-200 hover:bg-toon-blue hover:text-white"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
