import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ANNOUNCEMENT } from '@/data/home';

const KEY = 'announce-closed';

// Slim launch bar above the header. It scrolls away with the page; closing it is remembered in this
// browser until ANNOUNCEMENT.id changes.
export function AnnounceBar() {
  // read after mount: the page is prerendered with the bar, so the first render must match it
  const [open, setOpen] = useState(true);
  useEffect(() => {
    try { if (localStorage.getItem(KEY) === ANNOUNCEMENT.id) setOpen(false); } catch { /* storage blocked */ }
  }, []);
  if (!open) return null;
  const close = () => {
    try { localStorage.setItem(KEY, ANNOUNCEMENT.id); } catch { /* storage blocked */ }
    setOpen(false);
  };
  return (
    <aside className="hx-announce" aria-label="Announcement">
      <div className="hx-wrap">
        <span className="hx-announce-tag">{ANNOUNCEMENT.tag}</span>
        <Link className="hx-announce-link" to={ANNOUNCEMENT.href}>
          <span className="hx-announce-text">{ANNOUNCEMENT.text}</span>
          <b>{ANNOUNCEMENT.cta} →</b>
        </Link>
        <button className="hx-announce-x" type="button" onClick={close} aria-label="Close announcement">✕</button>
      </div>
    </aside>
  );
}
