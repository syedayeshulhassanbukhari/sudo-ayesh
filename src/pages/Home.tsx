import { useMemo } from 'react';
import Hero from '@/sections/Hero';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Logbook from '@/sections/Logbook';
import Contact from '@/sections/Contact';
import { useReveal } from '@/hooks/useReveal';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { homeMeta } from '@/seo/meta';

export default function Home() {
  useDocumentMeta(useMemo(() => homeMeta(), []));
  useReveal();

  return (
    <>
      <Hero />
      <Experience />
      <Projects />
      <Logbook />
      <Contact />
    </>
  );
}
