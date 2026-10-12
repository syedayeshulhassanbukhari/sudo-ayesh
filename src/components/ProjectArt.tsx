import type { Project } from '@/data/portfolio';
import { asset } from '@/lib/asset';
import { cn } from '@/lib/utils';
import { SkillIcon } from './SkillIcon';

// Project screenshot, or generated cover art for projects without one.
export function ProjectArt({ project, className, eager = false }: {
  project: Project;
  className?: string;
  eager?: boolean;
}) {
  if (project.image && project.imageFit === 'contain') {
    return (
      <div className={cn('relative h-full w-full overflow-hidden bg-black', className)}>
        <img src={asset(project.image)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
        <img
          src={asset(project.image)}
          alt={`${project.title}: ${project.kind}`}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="relative h-full w-full object-contain"
        />
      </div>
    );
  }

  if (project.image) {
    return (
      <img
        src={asset(project.image)}
        alt={`${project.title}: ${project.kind} screenshot`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('h-full w-full object-cover', className)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${project.title} cover art`}
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
      style={{
        background: `radial-gradient(circle at 30% 20%, ${project.accent}cc, transparent 60%),
          radial-gradient(circle at 80% 90%, ${project.accent}88, transparent 55%), #0b1220`,
      }}
    >
      <div className="dot-grid absolute inset-0 opacity-60" />
      <SkillIcon
        icon={project.engineIcon}
        color="rgba(255,255,255,0.12)"
        className="absolute -right-6 -bottom-6 h-44 w-44 rotate-[-12deg]"
      />
      <div className="relative px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">{project.kind}</p>
        <p className="mt-2 font-display text-2xl leading-tight text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.5)] md:text-3xl">
          {project.title}
        </p>
        {project.clientWork && (
          <p className="mt-3 inline-block rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/80">
            Client work · visuals on request
          </p>
        )}
      </div>
    </div>
  );
}
