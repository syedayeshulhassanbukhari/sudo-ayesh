import { PROFILE } from '@/data/portfolio';

export default function Footer() {
  return (
    <footer className="hx-wrap hx-foot">© {new Date().getFullYear()} {PROFILE.name}</footer>
  );
}
