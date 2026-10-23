import { useMemo } from 'react';
import Hero from '@/sections/Hero';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Services from '@/sections/Services';
import Logbook from '@/sections/Logbook';
import Faq from '@/sections/Faq';
import Contact from '@/sections/Contact';
import { Marquee } from '@/components/Marquee';
import { useReveal } from '@/hooks/useReveal';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { homeMeta } from '@/seo/meta';
import { CORE_SKILLS, FOCUS_AREAS } from '@/data/portfolio';

const ticker = [...CORE_SKILLS.map(s => s.name), ...FOCUS_AREAS.map(f => f.name)];

export default function Home() {
  useDocumentMeta(useMemo(() => homeMeta(), []));
  useReveal();

  return (
    <>
      <Hero />
      <Marquee items={ticker} />
      <Experience />
      <Projects />
      <Services />
      <Logbook />
      <Faq />
      <Contact />
    </>
  );
}
