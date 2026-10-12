import { PROFILE } from '@/data/portfolio';

export default function Footer() {
  return (
    <footer className="relative z-10 pb-12 pt-8 text-center">
      <p className="inline-block rounded-full bg-black/60 px-6 py-2 font-mono text-xs uppercase tracking-widest text-slate-400">
        © {new Date().getFullYear()} {PROFILE.handle} · {PROFILE.name}
      </p>
    </footer>
  );
}
