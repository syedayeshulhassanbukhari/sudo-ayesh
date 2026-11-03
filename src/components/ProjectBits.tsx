import { ExternalLink } from 'lucide-react';
import type { Project, ProjectLink } from '@/data/portfolio';

// Status chip and outbound links, shared by the project page.
const statusStyle: Record<string, string> = {
  Wishlist: 'border-sky-400/60 bg-sky-400/10 text-sky-200',
  'In Development': 'border-amber-400/60 bg-amber-400/10 text-amber-200',
  Live: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
  Shipped: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
  Completed: 'border-slate-400/60 bg-slate-400/10 text-slate-200',
};

const linkStyle: Record<ProjectLink['kind'], string> = {
  play: 'btn-orange',
  site: 'btn-blue',
  store: 'btn-blue',
  devlog: 'btn-blue',
  video: 'btn-ghost',
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
