import { Link } from 'react-router';
import { Gamepad2, Mail, FileText } from 'lucide-react';
import { PROFILE } from '@/data/portfolio';
import { asset } from '@/lib/asset';

export default function Hero() {
  const [firstName, ...rest] = PROFILE.name.split(' ');

  return (
    <section id="hero" aria-label="Introduction" className="relative flex min-h-screen items-center overflow-hidden px-4 py-24 md:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Trading-card portrait with a fanned stack behind it */}
        <div className="reveal relative mx-auto w-full max-w-[420px]">
          <div aria-hidden="true" className="absolute inset-0 translate-x-10 translate-y-4 rotate-[10deg] rounded-[2rem] border-4 border-black/50 bg-indigo-800" />
          <div aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-2 rotate-[5deg] rounded-[2rem] border-4 border-black/50 bg-[#1e1b4b]" />
          <div className="relative -rotate-2 rounded-[2rem] border-4 border-toon-blue bg-toon-card p-5 shadow-pop-lg transition-transform duration-300 hover:rotate-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-[#1e3a8a] bg-toon-blue">
              <img
                src={asset(PROFILE.photo)}
                alt={`${PROFILE.name}, game developer`}
                fetchPriority="high"
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-toon-card/60 via-transparent to-transparent" />
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <span className="font-display text-2xl text-white [text-shadow:3px_3px_0_rgba(0,0,0,0.6)]">
                {PROFILE.handle.toUpperCase()}
              </span>
              <span className="text-right font-mono text-[11px] font-bold uppercase leading-snug tracking-widest text-toon-orange">
                Game Developer<br />&amp; VFX / UI Artist
              </span>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="reveal" style={{ transitionDelay: '120ms' }}>
          <div className="flex items-center gap-5">
            <img
              src={asset(PROFILE.avatar)}
              alt={`Pixel-art avatar of ${PROFILE.firstName}`}
              className="h-20 w-20 shrink-0 rounded-2xl border-4 border-toon-blue object-cover shadow-pop md:h-24 md:w-24"
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <p className="font-script text-3xl text-toon-orange md:text-4xl">Hi, this is</p>
              <h1 className="toon-heading text-4xl leading-none sm:text-5xl md:text-6xl">
                {firstName}
                <span className="mt-1 block text-2xl text-blue-200 sm:text-3xl md:text-4xl">{rest.join(' ')}</span>
              </h1>
            </div>
          </div>

          <p className="mt-8 font-script text-2xl font-bold text-toon-orange md:text-3xl">{PROFILE.tagline}</p>

          <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-slate-300 md:text-lg">
            {PROFILE.intro.map(p => <p key={p}>{p}</p>)}
          </div>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/#projects" className="btn-toon btn-blue">
              <Gamepad2 size={18} aria-hidden="true" /> View Projects
            </Link>
            <Link to="/#contact" className="btn-toon btn-ghost">
              <Mail size={18} aria-hidden="true" /> Contact Me
            </Link>
            <a href={asset(PROFILE.resume)} target="_blank" rel="noopener" className="btn-toon btn-orange">
              <FileText size={18} aria-hidden="true" /> Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
