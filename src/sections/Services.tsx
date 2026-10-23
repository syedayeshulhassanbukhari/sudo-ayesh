import { Gamepad2, LayoutDashboard, Sparkles, Check, ExternalLink, Clock } from 'lucide-react';
import { SERVICES, type Service } from '@/data/portfolio';
import { SplitHeading } from '@/components/SplitHeading';
import { usePointerTilt } from '@/hooks/usePointerTilt';

const icons: Record<Service['icon'], typeof Gamepad2> = { game: Gamepad2, ui: LayoutDashboard, vfx: Sparkles };
const accents = ['border-toon-blue', 'border-toon-orange', 'border-toon-yellow'];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const tilt = usePointerTilt<HTMLElement>();
  const Icon = icons[service.icon];

  return (
    <div className="reveal flex" data-reveal="pop" style={{ transitionDelay: `${index * 110}ms` }}>
      <article
        ref={tilt}
        className={`tilt toon-card toon-screws flex w-full flex-col p-6 pt-11 ${accents[index % accents.length]}`}
      >
        <span aria-hidden="true" className="tilt-glare" />
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-[3px] border-black bg-toon-yellow text-toon-card shadow-pop">
          <Icon size={28} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-xl leading-tight text-white md:text-2xl">{service.title}</h3>
        <p className="mt-3 font-tech text-[17px] leading-relaxed text-slate-300">{service.summary}</p>

        <ul className="mt-5 space-y-2">
          {service.includes.map(item => (
            <li key={item} className="flex gap-2 font-tech text-[15px] leading-snug text-slate-300">
              <Check size={18} className="mt-0.5 shrink-0 text-toon-orange" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-7">
          <p>
            <span className="block font-mono text-xs uppercase tracking-widest text-slate-400">From</span>
            <span className="font-display text-3xl text-toon-yellow">${service.priceFrom}</span>
            <span className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-slate-400">
              <Clock size={12} aria-hidden="true" /> {service.deliveryDays} days
            </span>
          </p>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-toon border-2 border-[#13854f] bg-[#1dbf73] px-4 py-2 text-xs text-white"
            style={{ borderBottomWidth: 5 }}
          >
            Order on Fiverr <ExternalLink size={14} aria-hidden="true" />
            <span className="sr-only">: {service.title}</span>
          </a>
        </div>
      </article>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SplitHeading id="services-heading" text="Hire me" className="toon-heading text-5xl md:text-7xl" />
        <p className="reveal mt-2 max-w-2xl font-tech text-lg font-bold uppercase tracking-[0.2em] text-toon-blue">
          Freelance Roblox work, fixed prices
        </p>
        <p className="reveal mt-4 max-w-2xl font-tech text-lg leading-relaxed text-slate-300">
          Three things I build for Roblox creators, each a Fiverr gig with fixed packages.
          Need something bigger? Message me for a custom offer with a set price and delivery date.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => <ServiceCard key={s.slug} service={s} index={i} />)}
        </div>
      </div>
    </section>
  );
}
