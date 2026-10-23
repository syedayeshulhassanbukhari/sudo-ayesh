import { Link } from 'react-router';
import { Gamepad2, FileText, Sparkle, Plus, Star, Zap } from 'lucide-react';
import { PROFILE, STATS } from '@/data/portfolio';
import { asset } from '@/lib/asset';
import { usePointerTilt } from '@/hooks/usePointerTilt';
import { CountUp } from '@/components/CountUp';

// Decorative shapes drifting behind the hero; `depth` is how far each follows the pointer.
const shapes = [
  { Icon: Sparkle, className: 'left-[6%] top-[18%] text-toon-yellow', size: 34, depth: '26px', delay: '0ms' },
  { Icon: Plus, className: 'left-[44%] top-[10%] text-toon-blue', size: 30, depth: '-18px', delay: '900ms' },
  { Icon: Star, className: 'right-[7%] top-[22%] text-toon-orange', size: 28, depth: '22px', delay: '400ms' },
  { Icon: Zap, className: 'bottom-[14%] left-[10%] text-toon-blue', size: 30, depth: '-24px', delay: '1400ms' },
  { Icon: Sparkle, className: 'bottom-[18%] right-[12%] text-white/70', size: 22, depth: '30px', delay: '700ms' },
  { Icon: Plus, className: 'bottom-[8%] left-[48%] text-toon-orange', size: 24, depth: '14px', delay: '1800ms' },
];

export default function Hero() {
  const [firstName, ...rest] = PROFILE.name.split(' ');
  // Pointer position over the whole hero drives both the shape parallax and the card tilt.
  const scene = usePointerTilt<HTMLElement>();
  // Staggered entrance delays for the intro column (see .hero-in in index.css)
  const d = (ms: number) => ({ '--d': `${ms}ms` }) as React.CSSProperties;

  return (
    <section ref={scene} id="hero" aria-label="Introduction" className="relative flex min-h-screen items-center overflow-hidden px-4 py-24 md:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
        {shapes.map(({ Icon, className, size, depth, delay }, i) => (
          <span key={i} className={`parallax absolute ${className}`} style={{ '--depth': depth } as React.CSSProperties}>
            <span className="float block" style={{ '--d': delay } as React.CSSProperties}>
              <Icon size={size} strokeWidth={2.5} fill={Icon === Sparkle || Icon === Star ? 'currentColor' : 'none'} />
            </span>
          </span>
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        {/* Trading-card portrait with a fanned stack behind it */}
        <div className="tilt relative mx-auto w-full max-w-[420px]">
          <div aria-hidden="true" className="hero-fan absolute inset-0 translate-x-10 translate-y-4 rotate-[10deg] rounded-[2rem] border-4 border-black/50 bg-indigo-800" />
          <div aria-hidden="true" className="hero-fan absolute inset-0 translate-x-5 translate-y-2 rotate-[5deg] rounded-[2rem] border-4 border-black/50 bg-[#1e1b4b]" />
          <div className="hero-card relative -rotate-2 rounded-[2rem] border-4 border-toon-blue bg-toon-card p-5 shadow-pop-lg transition-transform duration-300 hover:rotate-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-4 border-[#1e3a8a] bg-toon-blue">
              <img
                src={asset(PROFILE.photo)}
                alt={`${PROFILE.name}, game developer`}
                fetchPriority="high"
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-toon-card/60 via-transparent to-transparent" />
              <span aria-hidden="true" className="tilt-glare" />
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
        <div>
          <div className="hero-in flex items-center gap-5" style={d(150)}>
            <img
              src={asset(PROFILE.avatar)}
              alt={`Pixel-art avatar of ${PROFILE.firstName}`}
              className="wiggle-hover h-20 w-20 shrink-0 rounded-2xl border-4 border-toon-blue object-cover shadow-pop md:h-24 md:w-24"
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

          <p className="hero-in mt-8 font-script text-2xl font-bold text-toon-orange md:text-3xl" style={d(300)}>{PROFILE.tagline}</p>

          <div className="mt-5 max-w-xl space-y-4 text-base leading-relaxed text-slate-300 md:text-lg">
            {PROFILE.intro.map((p, i) => <p key={p} className="hero-in" style={d(420 + i * 110)}>{p}</p>)}
          </div>

          <div className="hero-in mt-9 flex flex-wrap gap-4" style={d(780)}>
            <Link to="/#projects" className="btn-toon btn-blue">
              <Gamepad2 size={18} aria-hidden="true" /> View Projects
            </Link>
            <Link to="/#services" className="btn-toon btn-orange">
              <Zap size={18} aria-hidden="true" /> Hire Me
            </Link>
            <a href={asset(PROFILE.resume)} target="_blank" rel="noopener" className="btn-toon btn-ghost">
              <FileText size={18} aria-hidden="true" /> Resume
            </a>
          </div>

          <dl className="hero-in mt-10 grid max-w-xl grid-cols-3 gap-3" style={d(900)}>
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl border-[3px] border-toon-line bg-toon-card/80 p-3 shadow-pop">
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl text-toon-yellow md:text-3xl">
                  <CountUp value={s.value} suffix={s.suffix} />
                </dd>
                <dd aria-hidden="true" className="mt-1 font-tech text-xs font-semibold leading-tight text-slate-400 md:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
