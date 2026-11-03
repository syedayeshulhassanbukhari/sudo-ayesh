import { Routes, Route, useLocation } from 'react-router';
import Header from './components/hud/Header';
import Fx from './components/hud/Fx';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import CollectionPage from './pages/CollectionPage';
import NotFound from './pages/NotFound';
import './styles/hud.css';

// Everything inside the router. main.tsx wraps it in a BrowserRouter, and
// src/entry-server.tsx in a StaticRouter to pre-render each page at build time.
export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <ScrollManager />
      <Fx />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-toon-orange focus:px-4 focus:py-2 focus:font-display focus:text-toon-bg"
      >
        Skip to content
      </a>
      <Header />
      {/* Keyed by route so each page plays the enter animation */}
      <main id="main" key={pathname} className={pathname === '/' ? undefined : 'page-enter'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:slug" element={<ProjectPage />} />
          <Route path="/collection/:slug" element={<CollectionPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
