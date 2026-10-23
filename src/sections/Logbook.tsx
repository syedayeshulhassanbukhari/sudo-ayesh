import { Calendar, Trophy } from 'lucide-react';
import { MILESTONES } from '@/data/portfolio';
import { SplitHeading } from '@/components/SplitHeading';

export default function Logbook() {
  return (
    <section id="logbook" aria-labelledby="logbook-heading" className="relative bg-toon-deep px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <SplitHeading id="logbook-heading" text="Logbook" className="toon-heading text-center text-5xl md:text-7xl" />
        <p className="mt-2 text-center font-tech text-lg font-bold uppercase tracking-[0.2em] text-toon-blue">Events, leadership &amp; milestones</p>

        <div className="reveal relative mt-16 rounded-[2rem] border-4 border-black bg-toon-card px-5 pb-8 pt-14 shadow-pop-lg md:px-8">
          <span className="absolute -top-7 left-6 -rotate-3 rounded-xl border-4 border-white bg-toon-blue px-6 py-2 font-display text-2xl text-white shadow-pop md:left-10">
            Milestones
          </span>
          <div className="flex items-center gap-3 border-b-2 border-dashed border-toon-line pb-5">
            <Trophy className="text-toon-orange" size={30} aria-hidden="true" />
            <p className="font-tech text-lg text-slate-300">Things I&rsquo;ve organised, been selected for, and showed up to.</p>
          </div>

          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MILESTONES.map((m, i) => (
              <li
                key={m.title}
                className="reveal flex flex-col rounded-2xl border-2 border-toon-line bg-[#111a2e] p-5 shadow-pop hover:-translate-y-1"
                data-reveal="pop"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <p className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <Calendar size={13} aria-hidden="true" /> {m.date}
                </p>
                <h3 className="mt-2 font-tech text-xl font-bold leading-snug text-white">{m.title}</h3>
                <p className="font-tech text-[15px] font-semibold text-toon-orange">{m.org}</p>
                <p className="mt-2 font-tech text-[15px] leading-relaxed text-slate-400">{m.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-4">
                  {m.tags.map(t => <li key={t} className="tag text-[11px]">#{t}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
