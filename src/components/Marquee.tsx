import { Sparkle } from 'lucide-react';

// Tilted ticker strip that scrolls forever. The list is rendered twice so the loop is
// seamless; the copy is hidden from screen readers. Pauses on hover and for reduced motion.
export function Marquee({ items, tone = 'orange', reverse = false }: {
  items: string[];
  tone?: 'orange' | 'blue';
  reverse?: boolean;
}) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map(item => (
        <li key={item} className="flex items-center gap-8 whitespace-nowrap font-display text-xl uppercase text-white md:text-2xl">
          {item}
          <Sparkle size={18} className="text-toon-yellow" fill="currentColor" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`marquee relative -mx-4 overflow-hidden border-y-4 border-black py-3 shadow-pop ${
        tone === 'orange' ? '-rotate-[1.5deg] bg-toon-orange' : 'rotate-[1deg] bg-toon-blue'
      }`}
    >
      <div className={`marquee-track flex w-max ${reverse ? 'marquee-reverse' : ''}`}>
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
