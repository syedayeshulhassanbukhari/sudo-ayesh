import { Link } from 'react-router';

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-8xl text-toon-orange [text-shadow:6px_6px_0_rgba(0,0,0,0.55)]">404</p>
      <h1 className="toon-heading mt-4 text-3xl">You fell out of the map</h1>
      <p className="mt-3 font-tech text-lg text-slate-400">This page doesn&rsquo;t exist, or it got moved.</p>
      <Link to="/" className="btn-toon btn-blue mt-8">Respawn at home</Link>
    </section>
  );
}
