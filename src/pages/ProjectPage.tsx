import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { PROFILE, PROJECTS } from '@/data/portfolio';
import { ProjectArt } from '@/components/ProjectArt';
import { Gallery } from '@/components/Gallery';
import { StatusChip, ProjectLinks } from '@/sections/Projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useReveal } from '@/hooks/useReveal';
import { homeMeta, projectMeta } from '@/seo/meta';
import NotFound from './NotFound';

export default function ProjectPage() {
  const { slug } = useParams();
  const all = PROJECTS;
  const index = all.findIndex(p => p.slug === slug);
  const project = all[index];
  useDocumentMeta(useMemo(() => (project ? projectMeta(project) : homeMeta()), [project]));
  useReveal([slug]);

  if (!project) return <NotFound />;

  const next = all[(index + 1) % all.length];
  const facts = [
    ['Role', project.role],
    ['Engine', project.engine],
    ['Period', project.period],
    ...(project.team ? [['Team', project.team]] : []),
    ...(project.org ? [['Studio / Org', project.org]] : []),
  ];

  return (
    <article className="px-4 pb-16 pt-28 md:px-6">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="font-tech text-base font-semibold text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-white">{PROFILE.name}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/#projects" className="hover:text-white">Projects</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-toon-orange">{project.title}</li>
          </ol>
        </nav>

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <StatusChip project={project} />
            {project.categories.map(c => <span key={c} className="chip">{c}</span>)}
          </div>
          <h1 className="toon-heading mt-4 text-4xl leading-tight md:text-6xl">{project.title}</h1>
          <p className="mt-2 font-script text-2xl font-bold text-toon-orange md:text-3xl">{project.kind}</p>
        </header>

        <div className="toon-card mt-8 aspect-video overflow-hidden p-0">
          <ProjectArt project={project} eager />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="reveal">
            <h2 className="toon-heading text-2xl">Overview</h2>
            <div className="mt-4 space-y-4 font-tech text-lg leading-relaxed text-slate-300">
              {project.overview.map(p => <p key={p}>{p}</p>)}
            </div>

            <h2 className="toon-heading mt-10 text-2xl">What I did</h2>
            <ul className="mt-4 space-y-3">
              {project.highlights.map(h => (
                <li key={h} className="flex gap-3 font-tech text-lg leading-relaxed text-slate-300">
                  <Check size={20} className="mt-1 shrink-0 text-toon-orange" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="reveal space-y-6" style={{ transitionDelay: '100ms' }}>
            <div className="toon-card toon-screws p-6 pt-10">
              <dl className="space-y-4">
                {facts.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-display text-xs uppercase text-slate-500">{k}</dt>
                    <dd className="font-tech text-lg font-bold text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tech">
                {project.tags.map(t => <li key={t} className="tag">#{t}</li>)}
              </ul>
            </div>
            {project.links.length > 0 ? (
              <div className="flex flex-wrap gap-3"><ProjectLinks project={project} /></div>
            ) : project.clientWork ? (
              <p className="rounded-2xl border-2 border-dashed border-toon-line p-4 font-tech text-base text-slate-400">
                Client project: builds and source aren&rsquo;t public. Happy to walk through the work on a call.
              </p>
            ) : null}
          </aside>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <section className="reveal mt-14" aria-labelledby="gallery-heading">
            <h2 id="gallery-heading" className="toon-heading text-2xl">Screenshots</h2>
            <div className="mt-6">
              <Gallery shots={project.gallery} title={project.title} />
            </div>
          </section>
        )}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-toon-line pt-8">
          <Link to="/#projects" className="btn-toon btn-ghost">
            <ArrowLeft size={16} aria-hidden="true" /> All projects
          </Link>
          {next && next.slug !== project.slug && (
            <Link to={`/project/${next.slug}`} className="btn-toon btn-blue">
              Next: {next.title} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
