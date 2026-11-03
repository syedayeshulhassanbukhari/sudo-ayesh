import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { COLLECTIONS, collectionBySlug } from '@/data/models';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { collectionMeta, homeMeta } from '@/seo/meta';
import { ModelCanvas } from '@/components/hud/ModelCanvas';
import { Scramble } from '@/components/hud/Scramble';
import NotFound from './NotFound';

// Every model in a pack, live: each tile spins on its own and can be dragged to turn.
export default function CollectionPage() {
  const { slug = '' } = useParams();
  const c = collectionBySlug(slug);
  useDocumentMeta(useMemo(() => (c ? collectionMeta(c) : homeMeta()), [c]));
  if (!c) return <NotFound />;

  const i = COLLECTIONS.indexOf(c);
  const next = COLLECTIONS[(i + 1) % COLLECTIONS.length];
  const tris = c.models.reduce((n, m) => n + m.tris, 0);

  return (
    <div className="hx-wrap">
      <section className="hx-sec" aria-labelledby="col-h">
        <div className="hx-sec-head">
          <div>
            <Link to="/#modeling" className="hx-idx" style={{ textDecoration: 'none' }}>← Modeling / {c.sub}</Link>
            <h2 id="col-h" aria-label={c.title}><Scramble text={c.title} /></h2>
            <p>{c.about}</p>
            <div className="hx-meta" style={{ marginTop: 16 }}>
              {c.engine && <span className={`hx-badge ${c.engine === 'Roblox' ? 'loot' : 'acc'}`}>{c.engine}</span>}
              <span>{c.models.length} models</span>
              <span>· {(tris / 1000).toFixed(0)}k tris total</span>
              {c.client && <span>· {c.client}</span>}
            </div>
          </div>
          <span className="hx-live"><i />Live · drag a model to turn it</span>
        </div>

        <div className="hx-grid">
          {c.models.map(m => (
            <article key={m.file} className="hx-card hx-model">
              <div className="hx-vp">
                <span className="hx-hud">{m.tris.toLocaleString()} tris</span>
                <span className="hx-corner bl" /><span className="hx-corner br" />
                <ModelCanvas file={m.file} drag elev={c.elev} />
              </div>
              <div><h3 data-text={m.name}>{m.name}</h3></div>
            </article>
          ))}
        </div>

        <div className="hx-contact" style={{ marginTop: 40 }}>
          <Link className="hx-btn" to="/#modeling">All packs</Link>
          <Link className="hx-btn solid go" to={`/collection/${next.slug}`}>Next: {next.title}</Link>
          <Link className="hx-btn loot go" to="/#contact">Hire me</Link>
        </div>
      </section>
    </div>
  );
}
