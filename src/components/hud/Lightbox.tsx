import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';

// Full-size image or video viewer for cards with a `.hx-play[data-full]` button. Delegated on the document,
// so carousel clones open it too. Closes on the button, Escape, or a click on the backdrop.
export function Lightbox() {
  const dlg = useRef<HTMLDialogElement>(null);
  const [shot, setShot] = useState<{ src: string; name: string } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const b = (e.target as Element).closest?.<HTMLElement>('.hx-play[data-full]');
      if (!b || e.defaultPrevented) return;
      setShot({ src: b.dataset.full!, name: b.dataset.name ?? '' });
      dlg.current?.showModal();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <dialog
      ref={dlg}
      className="hx-vbox"
      aria-label={shot?.name ?? 'Full size view'}
      onClick={e => { if (e.target === dlg.current) dlg.current.close(); }}
      onClose={() => setShot(null)}
    >
      <div className="hx-vbox-bar">
        <span>{shot?.name}</span>
        <button className="hx-vbox-x" type="button" onClick={() => dlg.current?.close()}>Close ✕</button>
      </div>
      {shot && (shot.src.endsWith('.mp4')
        ? <video src={asset(shot.src)} controls autoPlay playsInline loop />
        : <img src={asset(shot.src)} alt={shot.name} />)}
    </dialog>
  );
}
