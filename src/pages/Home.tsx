import { useEffect, useMemo, useRef, useState } from 'react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { homeMeta } from '@/seo/meta';
import { PROFILE } from '@/data/portfolio';
import { asset } from '@/lib/asset';
import { Link } from 'react-router';
import { PRICES, RELEASES, SECTIONS, SKILL_CARDS, TICKER } from '@/data/home';
import { VideoTile } from '@/components/hud/VideoTile';
import { BootScreen } from '@/components/hud/BootScreen';
import { Scramble } from '@/components/hud/Scramble';
import { WorkSection } from '@/components/hud/WorkSection';
import { Wire } from '@/components/hud/Card';
import { initials } from '@/components/hud/Header';
import { bootDone } from '@/components/hud/boot';
import { Lightbox } from '@/components/hud/Lightbox';

function SecHead({ idx, title, blurb, id }: { idx: string; title: string; blurb: string; id: string }) {
  return (
    <div className="hx-sec-head">
      <div>
        <div className="hx-idx">{idx}</div>
        <h2 id={id} aria-label={title}><Scramble text={title} /></h2>
        <p>{blurb}</p>
      </div>
    </div>
  );
}

function Hero() {
  const [first, ...rest] = PROFILE.name.split(' ');
  const hero = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stop: (() => void) | undefined, dead = false;
    import('@/components/hud/heroScene')
      .then(m => { if (!dead) stop = m.startHeroScene(hero.current!, cv.current!, slot.current!); })
      .catch(() => { hero.current?.classList.add('no3d'); bootDone(); });
    return () => { dead = true; stop?.(); };
  }, []);

  return (
    <section ref={hero} className="hx-hero" id="top">
      <div className="hx-wrap">
        <div className="hx-hero-copy">
          <div className="hx-eyebrow">Founder · <a className="hx-red-ink" href={PROFILE.studio.url} target="_blank" rel="noopener">Odd Studios</a> · Game developer</div>
          <h1 aria-label={PROFILE.name}>
            <Scramble text={first} replayOnBoot />
            <Scramble text={rest.join(' ')} className="outline" replayOnBoot />
          </h1>
          <div className="hx-tagline">UE5 · Roblox · Godot · Blender</div>
          <p>I build games and game-ready assets in Unreal Engine 5, Roblox and Blender: NPC AI, 3D models, animation, UI and VFX.</p>
          <div className="hx-ctas">
            <a className="hx-btn solid go" href="#modeling">View work</a>
            <a className="hx-btn red" href={PROFILE.studio.url} target="_blank" rel="noopener">Odd Studios ↗</a>
            <a className="hx-btn" href="#contact">Contact</a>
          </div>
        </div>
        <div ref={slot} className="hx-scene-slot" aria-hidden="true">
          <span className="hx-hud">SCENE_01 · LIVE · HOVER / CLICK</span>
          <span className="hx-corner tl" /><span className="hx-corner tr" /><span className="hx-corner bl" /><span className="hx-corner br" />
          <Wire />
        </div>
      </div>
      <canvas ref={cv} className="hx-hero-3d" aria-hidden="true" />
    </section>
  );
}

// Released games: a looping preview, the trailer in the lightbox, and a button per store.
// A store without a url (Google Play for now) shows as "Coming soon".
function MyGames() {
  return (
    <section className="hx-sec" id="my-games" aria-labelledby="my-games-h">
      <SecHead idx="Released" id="my-games-h" title="My Games" blurb="Games I designed, built and released myself. Free to play." />
      <div className="hx-releases">
        {RELEASES.map(g => (
          <article key={g.slug} className="hx-release">
            <div className="hx-release-media">
              <VideoTile src={g.video} poster={g.poster} />
              <button className="hx-play hx-release-play" type="button" data-full={g.trailer} data-name={`${g.title} trailer`}>
                <span aria-hidden="true">▶</span> Watch trailer
              </button>
            </div>
            <div className="hx-release-body">
              <span className="hx-release-status">{g.status}</span>
              <h3>{g.title}</h3>
              <p>{g.blurb}</p>
              <div className="hx-tags">{g.facts.map(f => <span key={f}>{f}</span>)}</div>
              <div className="hx-release-stores">
                {g.stores.map(s => s.url
                  ? <a key={s.label} className={`hx-btn sm go${s.primary ? ' loot' : ''}`} href={s.url} target="_blank" rel="noopener">{s.label}</a>
                  : <span key={s.label} className="hx-btn sm hx-soon" aria-disabled="true">{s.label}<small>Coming soon</small></span>)}
                <Link className="hx-btn sm" to={`/project/${g.slug}`}>Details</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [label, setLabel] = useState('Copy email');
  const email = useRef<HTMLSpanElement>(null);
  const copy = async () => {
    try { await navigator.clipboard.writeText(PROFILE.email); setLabel('Copied'); }
    catch {
      const r = document.createRange(); r.selectNodeContents(email.current!);
      const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
      setLabel('Press Ctrl+C');
    }
    setTimeout(() => setLabel('Copy email'), 2000);
  };
  return (
    <section className="hx-sec" id="contact" style={{ borderBottom: 0 }} aria-labelledby="contact-h">
      <SecHead idx="Contact" id="contact-h" title="Join the party" blurb="Tell me about your game. Studio roles, freelance work and collabs are all welcome." />
      <div className="hx-contact">
        <span ref={email} className="hx-email">{PROFILE.email}</span>
        <button className="hx-btn solid" type="button" onClick={copy} aria-live="polite">{label}</button>
      </div>
      <div className="hx-contact" aria-label="Profiles">
        {PROFILE.socials.map(s => (
          <a key={s.label} className="hx-btn sm" href={s.url} target="_blank" rel="noopener noreferrer me">{s.label} ↗</a>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  useDocumentMeta(useMemo(() => homeMeta(), []));
  const ticker = [...TICKER, ...TICKER, ...TICKER, ...TICKER];

  return (
    <>
      <BootScreen initials={initials} />
      <Hero />

      <div className="hx-ticker" aria-label={`Skills: ${TICKER.join(', ')}`}>
        <div className="hx-ticker-track" aria-hidden="true">
          {ticker.map((t, i) => <span key={i}>{t}</span>)}
        </div>
      </div>

      <div className="hx-wrap">
        <MyGames />
        {SECTIONS.map(s => <WorkSection key={s.id} s={s} />)}

        <section className="hx-sec" id="skills" aria-labelledby="skills-h">
          <SecHead idx="Skills" id="skills-h" title="Skills & Services" blurb="What I build for your game, in Unreal Engine 5, Roblox Studio and Unity." />
          <div className="hx-skills">
            {SKILL_CARDS.map(k => (
              <article key={k.name} className="hx-skill">
                <div className="hx-skill-pic" aria-hidden="true">
                  {k.image
                    ? <img src={asset(k.image)} alt="" loading="lazy" />
                    : <pre dangerouslySetInnerHTML={{ __html: k.code!.replace(/<k>(.*?)<\/k>/g, '<b>$1</b>') }} />}
                  <span className="hx-glyph">{k.glyph}</span>
                </div>
                <h3>{k.name}</h3>
                <p>{k.note}</p>
                <div className="hx-tags">{k.tags.map(t => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="hx-sec" id="prices" aria-labelledby="prices-h">
          <SecHead idx="Prices" id="prices-h" title="Services & Prices" blurb="Starting prices. The final quote depends on the job." />
          <div className="hx-prices">
            {PRICES.map(p => (
              <article key={p.name} className={`hx-price${p.feat ? ' feat' : ''}${p.wide ? ' wide' : ''}`}>
                <h3>{p.name}</h3>
                <div className={`hx-amt${p.quote ? ' q' : ''}`}>{p.amt}{p.unit && <small>{p.unit}</small>}</div>
                {p.extra && <div className="hx-extra">{p.extra}</div>}
                <p>{p.note}</p>
                <ul className="hx-checks">{p.list.map(l => <li key={l}>{l}</li>)}</ul>
                <div className="act">
                  {p.url && <a className="hx-btn sm go" href={p.url} target="_blank" rel="noopener noreferrer">Order on Fiverr</a>}
                  <a className={`hx-btn sm${p.url ? '' : ' go'}`} href="#contact">Ask me</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Contact />
      </div>
      <Lightbox />
    </>
  );
}
