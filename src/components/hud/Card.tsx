import { Link } from 'react-router';
import type { CardItem } from '@/data/home';
import { asset } from '@/lib/asset';
import { ModelCanvas } from './ModelCanvas';
import { VideoTile } from './VideoTile';

export function Wire() {
  return (
    <svg className="hx-wire" viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 10 L105 34 L105 86 L60 110 L15 86 L15 34 Z M15 34 L60 58 L105 34 M60 58 L60 110" />
    </svg>
  );
}

// "<k>local</k> x" -> keyword spans, everything else plain text
function Code({ src }: { src: string }) {
  const parts = src.split(/(<k>.*?<\/k>)/g);
  return (
    <div className="hx-code">
      {parts.map((p, i) => (p.startsWith('<k>') ? <span key={i} className="k">{p.slice(3, -4)}</span> : p))}
    </div>
  );
}

// Viewport tile + title + meta. A full-size link sits over the card; titles glitch on hover.
export function Card({ it, section, hidden }: { it: CardItem; section: string; hidden?: boolean }) {
  if (it.slot) {
    return (
      <article className="hx-card empty" aria-hidden={hidden || undefined}>
        <div className="hx-vp">
          <span className="hx-hud">{section} | slot</span>
          {it.code ? <Code src={it.code} /> : <div className="hx-slot"><b>+</b>Empty slot</div>}
        </div>
        <div><h3 data-text={it.slot}>{it.slot}</h3><p>Coming soon.</p></div>
      </article>
    );
  }
  return (
    <article className="hx-card" aria-hidden={hidden || undefined}>
      {it.href && (
        <Link className="hx-stretch" to={it.href} aria-label={`Open ${it.name}`} tabIndex={hidden ? -1 : undefined} draggable={false} />
      )}
      {it.full && (
        <button className="hx-stretch hx-play" type="button" data-full={it.full} data-name={it.name} aria-label={`${it.full.endsWith('.mp4') ? 'Play' : 'View'} ${it.name} full size`} tabIndex={hidden ? -1 : undefined} />
      )}
      <div className="hx-vp">
        <span className="hx-corner bl" /><span className="hx-corner br" />
        {it.count && <span className="hx-count">{it.count} models</span>}
        {it.video ? (
          <>
            <VideoTile src={it.video} poster={it.poster} />
            <span className="hx-pend">▶ Play full video</span>
          </>
        ) : it.model ? (
          <ModelCanvas file={it.model} elev={it.elev} clips={it.clips} cta={it.href ? 'Open collection →' : undefined} />
        ) : it.image ? (
          <>
            <img src={asset(it.image)} alt={hidden ? '' : `${it.name} screenshot`} loading="lazy" decoding="async" draggable={false} className={it.contain ? 'contain' : undefined} />
            <span className="hx-pend">{it.full ? '⤢ View full size' : 'Open project →'}</span>
          </>
        ) : (
          <><Wire /><span className="hx-pend">{it.href ? 'Open project →' : 'Render pending'}</span></>
        )}
      </div>
      <div><h3 data-text={it.name}>{it.name}</h3><p>{it.note}</p></div>
      {(it.badge || it.sub) && (
        <div className="hx-meta">
          {it.badge && <span className={`hx-badge ${it.badge === 'Roblox' ? 'loot' : 'acc'}`}>{it.badge}</span>}
          {it.sub && <span>{it.sub}</span>}
        </div>
      )}
    </article>
  );
}
