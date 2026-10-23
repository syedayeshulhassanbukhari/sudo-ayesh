import { Fragment, type ElementType } from 'react';
import { cn } from '@/lib/utils';

// Heading whose letters pop in one after another when it scrolls into view (it carries the
// `reveal` class, so useReveal triggers it). Screen readers get the plain text via aria-label;
// the letters stay in the DOM for crawlers.
export function SplitHeading({ text, as: Tag = 'h2', id, className }: {
  text: string;
  as?: ElementType;
  id?: string;
  className?: string;
}) {
  let i = 0;
  const words = text.split(' ');
  return (
    <Tag id={id} aria-label={text} className={cn('reveal split', className)}>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            {/* the space sits between the word boxes; inside an inline-block it would collapse */}
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {[...word].map(ch => (
                <span key={i} className="split-char" style={{ '--i': i++ } as React.CSSProperties}>{ch}</span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
