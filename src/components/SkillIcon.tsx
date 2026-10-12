import {
  siUnrealengine, siCplusplus, siBlueprint, siRobloxstudio, siRoblox, siLua, siUnity, siBlender,
  siGit, siGithub, siFigma, siNotion, siFlutter, siDart, siFirebase, siSupabase, siMysql, siNextdotjs,
  type SimpleIcon,
} from 'simple-icons';
import { cn } from '@/lib/utils';

// Only the icons referenced in src/data/portfolio.ts are imported, so the bundle stays small.
// Add new ones here when you add a skill with a new `icon` name.
const ICONS: Record<string, SimpleIcon> = {
  siUnrealengine, siCplusplus, siBlueprint, siRobloxstudio, siRoblox, siLua, siUnity, siBlender,
  siGit, siGithub, siFigma, siNotion, siFlutter, siDart, siFirebase, siSupabase, siMysql, siNextdotjs,
};

const luminance = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Brand colour by default; swapped for a readable one when it would vanish on the tile.
function readableColor(hex: string, surface: 'light' | 'dark') {
  const l = luminance(hex);
  if (surface === 'dark' && l < 0.22) return '#e2e8f0';
  if (surface === 'light' && l > 0.85) return '#0f172a';
  return `#${hex}`;
}

export function SkillIcon({ icon, badge, className, color, style, surface = 'light' }: {
  icon?: string;
  badge?: string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
  surface?: 'light' | 'dark';
}) {
  const si = icon ? ICONS[icon] : undefined;
  if (!si) {
    return (
      <span
        className={cn('font-display leading-none', surface === 'light' ? 'text-[#68217a]' : 'text-violet-300', className)}
        aria-hidden="true"
      >
        {badge}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill={color ?? readableColor(si.hex, surface)} aria-hidden="true">
      <path d={si.path} />
    </svg>
  );
}
