import { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Gamepad2, BriefcaseBusiness, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { PROFILE } from '@/data/portfolio';

// EmailJS credentials (see SETUP_EMAILJS.md). The public key is meant to be public.
const EMAILJS = {
  publicKey: '-zQomnyoRArbe3Noz',
  serviceId: 'service_svwmt24',
  templateId: 'template_dds6lcb',
};

const socialStyle: Record<string, { icon: typeof Github; className: string }> = {
  GitHub: { icon: Github, className: 'bg-[#1f2937] border-black text-white' },
  LinkedIn: { icon: Linkedin, className: 'bg-[#0a66c2] border-[#073f78] text-white' },
  'itch.io': { icon: Gamepad2, className: 'bg-[#fa5c5c] border-[#b83b3b] text-white' },
  Fiverr: { icon: BriefcaseBusiness, className: 'bg-[#1dbf73] border-[#13854f] text-white' },
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          to_email: PROFILE.email,
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          reply_to: form.email,
        },
        { publicKey: EMAILJS.publicKey },
      );
      setState('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Email sending failed:', err);
      setState('error');
    }
  };

  const field =
    'w-full border-0 border-b-2 border-toon-card/60 bg-transparent px-1 py-1 font-hand text-xl text-toon-card placeholder:text-toon-card/40 focus:border-toon-card focus:outline-none';

  return (
    <section id="contact" aria-labelledby="contact-heading" className="px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <h2 id="contact-heading" className="toon-heading text-4xl md:text-6xl">Get in touch</h2>
          <span className="rounded-full border-2 border-toon-orange/40 px-4 py-1 font-tech text-lg font-bold uppercase tracking-[0.2em] text-toon-orange">
            Contact me
          </span>
        </div>

        <div className="mt-14 grid items-start gap-14 lg:grid-cols-2">
          <div className="reveal space-y-5">
            <div className="rounded-2xl border-l-[6px] border-toon-blue bg-[#22314d] p-6">
              <p className="font-tech text-xl font-bold text-toon-blue">Hey you!</p>
              <p className="mt-2 font-tech text-lg leading-relaxed text-slate-200">
                I&rsquo;m open to studio roles, freelance Roblox VFX/UI work, or jumping into a collab.
                If you&rsquo;ve got a game that needs systems, effects or interfaces, just reach out.
              </p>
            </div>

            <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-4 rounded-2xl border-[3px] border-toon-line bg-toon-card p-4 transition-colors hover:border-toon-blue">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-toon-orange">
                <Mail size={20} className="text-white" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-xs uppercase text-slate-400">Email me at</span>
                <span className="block break-all font-mono text-base text-white">{PROFILE.email}</span>
              </span>
            </a>

            <a href={PROFILE.phoneHref} className="flex items-center gap-4 rounded-2xl border-[3px] border-toon-line bg-toon-card p-4 transition-colors hover:border-toon-blue">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-toon-orange">
                <Phone size={20} className="text-white" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-xs uppercase text-slate-400">Call me at</span>
                <span className="block font-mono text-base text-white">{PROFILE.phone}</span>
              </span>
            </a>

            <ul className="grid grid-cols-2 gap-4">
              {PROFILE.socials.map(s => {
                const { icon: Icon, className } = socialStyle[s.label] ?? socialStyle.GitHub;
                return (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer me" className={`btn-toon w-full border-2 ${className} shadow-pop`} style={{ borderBottomWidth: 5 }}>
                      <Icon size={18} aria-hidden="true" /> {s.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sticky-note form */}
          <div className="reveal relative mx-auto w-full max-w-lg" style={{ transitionDelay: '120ms' }}>
            <div className="relative rotate-[1.5deg] bg-toon-yellow px-7 pb-20 pt-12 shadow-[10px_10px_0_rgba(0,0,0,0.45)]">
              <span aria-hidden="true" className="absolute -top-4 left-1/2 h-9 w-32 -translate-x-1/2 -rotate-2 bg-white/50 backdrop-blur-sm" />

              {state === 'sent' ? (
                <div className="py-16 text-center" role="status">
                  <p className="font-hand text-4xl text-toon-card">Message sent!</p>
                  <p className="mt-2 font-hand text-xl text-toon-card/70">Thanks for reaching out. I&rsquo;ll get back to you soon.</p>
                  <button type="button" onClick={() => setState('idle')} className="mt-6 font-hand text-xl text-toon-card underline">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-6">
                  <label className="flex items-end gap-3">
                    <span className="shrink-0 font-hand text-2xl text-toon-card">NAME -</span>
                    <input
                      className={field}
                      name="name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </label>
                  <label className="flex items-end gap-3">
                    <span className="shrink-0 font-hand text-2xl text-toon-card">EMAIL -</span>
                    <input
                      className={field}
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Message</span>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full resize-none border-0 bg-transparent px-1 font-hand text-xl leading-8 text-toon-card placeholder:text-toon-card/40 focus:outline-none"
                      style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(15,23,42,0.18) 31px, rgba(15,23,42,0.18) 32px)' }}
                    />
                  </label>
                  {state === 'error' && (
                    <p role="alert" className="font-hand text-xl text-red-700">
                      Couldn&rsquo;t send that. Try again, or email me directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={state === 'sending'}
                    className="btn-toon btn-orange absolute -bottom-5 right-4 -rotate-3 border-2 border-black text-base shadow-pop disabled:opacity-70"
                    style={{ borderBottomWidth: 5 }}
                  >
                    {state === 'sending' ? 'Sending...' : 'Send it'} <Send size={16} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
