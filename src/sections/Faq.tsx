import { Plus } from 'lucide-react';
import { FAQS } from '@/data/portfolio';
import { SplitHeading } from '@/components/SplitHeading';

// Native <details> so every answer is in the HTML (crawlers and AI assistants read it all),
// and it works without JavaScript. The same Q&A is emitted as FAQPage JSON-LD (seo/meta.ts).
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-4xl">
        <SplitHeading id="faq-heading" text="Quick answers" className="toon-heading text-center text-4xl md:text-6xl" />
        <p className="reveal mt-2 text-center font-tech text-lg font-bold uppercase tracking-[0.2em] text-toon-blue">FAQ</p>

        <div className="mt-12 space-y-4">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="faq reveal group rounded-2xl border-[3px] border-toon-line bg-toon-card shadow-pop transition-colors open:border-toon-blue"
              style={{ transitionDelay: `${i * 60}ms` }}
              open={i === 0}
            >
              <summary className="flex list-none items-center justify-between gap-4 p-5 font-tech text-xl font-bold text-white [&::-webkit-details-marker]:hidden">
                <h3>{f.q}</h3>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-toon-blue text-toon-blue transition-transform duration-300 group-open:rotate-45 group-open:bg-toon-blue group-open:text-white">
                  <Plus size={18} aria-hidden="true" />
                </span>
              </summary>
              <p className="faq-answer px-5 pb-5 font-tech text-lg leading-relaxed text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
