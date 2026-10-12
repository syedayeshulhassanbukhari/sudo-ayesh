import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ExternalLink, List, GitCommitVertical } from 'lucide-react';
import { PROJECTS, PROJECT_CATEGORIES, projectsSorted, type Project, type ProjectLink } from '@/data/portfolio';
import { ProjectArt } from '@/components/ProjectArt';
import { useReveal } from '@/hooks/useReveal';

type Filter = (typeof PROJECT_CATEGORIES)[number];
type View = 'list' | 'timeline';

const statusStyle: Record<string, string> = {
  Wishlist: 'border-sky-400/60 bg-sky-400/10 text-sky-200',
  'In Development': 'border-amber-400/60 bg-amber-400/10 text-amber-200',
  Live: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
  Shipped: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
  Completed: 'border-slate-400/60 bg-slate-400/10 text-slate-200',
};

const linkStyle: Record<ProjectLink['kind'], string> = {
  play: 'btn-orange',
  site: 'btn-orange',
  store: 'btn-blue',
  devlog: 'btn-blue',
  video: 'bg-red-600 text-white border-red-800',
  code: 'btn-ghost',
};

export function StatusChip({ project }: { project: Project }) {
  if (!project.status) return null;
  return (
    <span className={`chip ${statusStyle[project.status]}`}>
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-current" />
      {project.status}
    </span>
  );
}

export function ProjectLinks({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' }) {
  return (
    <>
      {project.links.map(l => (
        <a
          key={l.url}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-toon ${linkStyle[l.kind]} ${size === 'sm' ? 'px-4 py-2 text-xs' : ''}`}
        >
          {l.label} <ExternalLink size={14} aria-hidden="true" />
        </a>
      ))}
    </>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const href = `/project/${project.slug}`;
  return (
    <article className="toon-card toon-screws reveal group grid gap-6 p-4 pt-9 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:p-6 md:pt-9">
      <Link to={href} className="block aspect-video overflow-hidden rounded-xl border-2 border-[#1e3a8a]" tabIndex={-1} aria-hidden="true">
        <ProjectArt project={project} className="transition-transform duration-500 group-hover:scale-105" />
      </Link>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip project={project} />
          {project.categories.map(c => (
            <span key={c} className="chip">{c}</span>
          ))}
          <span className="rounded-md border border-toon-line px-2.5 py-1 font-mono text-xs text-slate-300">{project.period}</span>
        </div>

        <h3 className="mt-3 font-display text-2xl leading-tight text-white md:text-3xl">
          <Link to={href} className="hover:text-toon-orange focus-visible:text-toon-orange">
            {project.title}
          </Link>
        </h3>
        <p className="mt-1 font-mono text-xs uppercase tracking-widest text-toon-orange">
          {project.kind} · {project.role}
        </p>
        <p className="mt-3 font-tech text-[17px] leading-relaxed text-slate-300">{project.summary}</p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
          <ul className="flex flex-wrap gap-2" aria-label="Tech">
            {project.tags.slice(0, 5).map(t => <li key={t} className="tag">#{t}</li>)}
          </ul>
          <div className="flex flex-wrap gap-3">
            <ProjectLinks project={project} size="sm" />
            <Link to={href} className="btn-toon btn-ghost px-4 py-2 text-xs" aria-label={`Details about ${project.title}`}>
              Details <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function TimelineView({ projects }: { projects: Project[] }) {
  const byYear = useMemo(() => {
    const groups = new Map<string, Project[]>();
    for (const p of projects) {
      const y = p.sortKey.slice(0, 4);
      groups.set(y, [...(groups.get(y) ?? []), p]);
    }
    return [...groups.entries()];
  }, [projects]);

  return (
    <div className="relative mx-auto max-w-4xl">
      <span aria-hidden="true" className="absolute bottom-0 left-4 top-0 border-l-4 border-dashed border-toon-line md:left-1/2 md:-translate-x-1/2" />
      {byYear.map(([year, items]) => (
        <div key={year} className="relative pb-6">
          <div className="relative z-10 mb-8 flex md:justify-center">
            <span className="rounded-xl border-4 border-toon-card bg-toon-orange px-4 py-1 font-display text-xl text-white shadow-pop">{year}</span>
          </div>
          <ol className="space-y-10">
            {items.map((p, i) => (
              <li key={p.slug} className={`reveal relative pl-12 md:w-1/2 md:pl-0 ${i % 2 ? 'md:ml-auto md:pl-10' : 'md:pr-10'}`}>
                <span
                  aria-hidden="true"
                  className={`absolute left-[7px] top-6 h-6 w-6 rounded-full border-4 border-toon-card bg-toon-blue md:left-auto ${i % 2 ? 'md:-left-3' : 'md:-right-3'}`}
                />
                <Link to={`/project/${p.slug}`} className="toon-card group block overflow-hidden p-0 transition-transform hover:-translate-y-1">
                  <div className="aspect-[2/1] overflow-hidden border-b-4 border-toon-blue">
                    <ProjectArt project={p} className="transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusChip project={p} />
                      <span className="font-mono text-xs text-slate-400">{p.period}</span>
                    </div>
                    <h3 className="mt-2 font-display text-xl text-white group-hover:text-toon-orange">{p.title}</h3>
                    <p className="mt-1 font-tech text-[15px] leading-snug text-slate-300">{p.summary}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('All');
  const [view, setView] = useState<View>('list');
  const shown = useMemo(() => {
    const all = view === 'list' ? PROJECTS : projectsSorted();
    return filter === 'All' ? all : all.filter(p => p.categories.includes(filter));
  }, [filter, view]);
  useReveal([filter, view]);

  return (
    <section id="projects" aria-labelledby="projects-heading" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="projects-heading" className="toon-heading text-5xl md:text-7xl">Projects</h2>
            <p className="mt-2 font-tech text-lg font-bold uppercase tracking-[0.2em] text-toon-blue">Games, tools &amp; client work</p>
          </div>
          <div role="group" aria-label="View" className="flex gap-2">
            {([['list', 'List View', List], ['timeline', 'Timeline', GitCommitVertical]] as const).map(([v, label, Icon]) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`flex items-center gap-2 rounded-full border-[3px] px-5 py-2 font-display text-sm uppercase transition-colors ${
                  view === v ? 'border-toon-blue bg-toon-blue text-white' : 'border-toon-line bg-toon-card text-slate-300 hover:border-toon-blue'
                }`}
              >
                <Icon size={16} aria-hidden="true" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div role="group" aria-label="Filter projects" className="mt-8 flex flex-wrap gap-3">
          {PROJECT_CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full border-[3px] px-5 py-2 font-tech text-base font-bold transition-colors ${
                filter === c ? 'border-toon-blue bg-toon-blue text-white' : 'border-toon-line bg-toon-card text-slate-300 hover:border-toon-blue hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {view === 'list' ? (
            <div className="space-y-8">
              {shown.map(p => <ProjectRow key={p.slug} project={p} />)}
            </div>
          ) : (
            <TimelineView projects={shown} />
          )}
        </div>
      </div>
    </section>
  );
}
