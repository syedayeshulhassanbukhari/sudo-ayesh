import { Sparkle } from 'lucide-react';
import {
  EXPERIENCE, EDUCATION, CERTIFICATIONS, FOCUS_AREAS, CORE_SKILLS, SECONDARY_SKILLS,
  type TimelineItem,
} from '@/data/portfolio';
import { SkillIcon } from '@/components/SkillIcon';

function Timeline({ heading, items }: { heading: string; items: TimelineItem[] }) {
  return (
    <div>
      <h3 className="toon-heading flex items-center gap-3 text-2xl md:text-[1.7rem]">
        {heading} <span aria-hidden="true" className="h-1 w-8 rounded bg-white" />
      </h3>
      <ol className="mt-6 space-y-6 border-l-2 border-dashed border-toon-line pl-7">
        {items.map(item => (
          <li key={item.title + item.date} className="relative">
            <span aria-hidden="true" className="absolute -left-[41px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-toon-line bg-toon-card">
              <Sparkle size={12} className="text-toon-orange" fill="currentColor" />
            </span>
            <p className="font-tech text-sm font-bold uppercase tracking-wide text-toon-blue">{item.date}</p>
            <p className="mt-0.5 font-tech text-lg font-bold leading-snug text-white">{item.title}</p>
            <p className="font-tech text-[15px] leading-snug text-toon-muted">{item.org}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

const ticketTone = { blue: 'ticket-blue', white: 'ticket-white', orange: 'ticket-orange' } as const;
const ticketTilt = ['rotate-[1deg]', '-rotate-[1.5deg]', 'rotate-[2deg]', '-rotate-[1deg]', 'rotate-[1.5deg]'];

export default function Experience() {
  return (
    <section id="about" aria-labelledby="about-heading" className="px-4 py-16 md:px-6 md:py-24">
      <h2 id="about-heading" className="sr-only">About, experience and skills</h2>
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-3 lg:gap-8">
        {/* Experience / education / certification */}
        <div className="toon-card toon-screws reveal -rotate-[0.6deg] space-y-10 px-7 pb-10 pt-12">
          <Timeline heading="Experience" items={EXPERIENCE} />
          <Timeline heading="Education" items={EDUCATION} />
          <Timeline heading="Certification" items={CERTIFICATIONS} />
        </div>

        {/* Focus areas as a chain of tickets */}
        <div className="toon-card toon-screws reveal rotate-[0.6deg] px-7 pb-10 pt-12" style={{ transitionDelay: '100ms' }}>
          <h3 className="toon-heading text-center text-3xl leading-tight">Technical<br />Skills</h3>
          <div className="mt-8 flex flex-col items-center">
            <span aria-hidden="true" className="h-4 w-4 rounded-full border-[3px] border-toon-blue" />
            <ul className="w-full">
              {FOCUS_AREAS.map((f, i) => (
                <li key={f.name} className="flex flex-col items-center">
                  <span aria-hidden="true" className="h-7 border-l-2 border-dashed border-toon-line" />
                  <div className={`ticket ${ticketTone[f.tone]} ${ticketTilt[i % ticketTilt.length]} w-[92%]`}>
                    {f.name}
                  </div>
                </li>
              ))}
            </ul>
            <span aria-hidden="true" className="h-7 border-l-2 border-dashed border-toon-line" />
            <span aria-hidden="true" className="h-4 w-4 rounded-full border-[3px] border-toon-blue" />
          </div>
        </div>

        {/* Tool belt */}
        <div className="reveal flex flex-col justify-center gap-14 py-4 lg:self-center" style={{ transitionDelay: '200ms' }}>
          <div>
            <h3 className="toon-heading text-center text-3xl">Core Arsenal</h3>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-5">
              {CORE_SKILLS.map(s => (
                <li key={s.name} className="flex w-[76px] flex-col items-center gap-2">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-b-[5px] border-amber-200/70 bg-[#fef9e7] shadow-pop transition-transform hover:-translate-y-1">
                    <SkillIcon icon={s.icon} badge={s.badge} className="h-8 w-8 text-2xl" />
                  </span>
                  <span className="text-center font-tech text-sm font-bold leading-tight text-white">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="toon-heading text-center text-2xl md:text-3xl">Secondary Tools</h3>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-3 gap-y-4">
              {SECONDARY_SKILLS.map(s => (
                <li key={s.name} className="flex w-[60px] flex-col items-center gap-1.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-toon-line bg-toon-card shadow-pop transition-transform hover:-translate-y-1">
                    <SkillIcon icon={s.icon} badge={s.badge} surface="dark" className="h-6 w-6" />
                  </span>
                  <span className="text-center font-tech text-xs font-semibold text-slate-400">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
