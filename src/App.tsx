import { Routes, Route, useLocation } from 'react-router';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollManager from './components/ScrollManager';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import ProjectPage from './pages/ProjectPage';
import NotFound from './pages/NotFound';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Everything inside the router. main.tsx wraps it in a BrowserRouter, and
// src/entry-server.tsx in a StaticRouter to pre-render each page at build time.
export default function App() {
  const { pathname } = useLocation();
  useSmoothScroll();

  return (
    <>
      <ScrollManager />
      <ScrollProgress />
      <div className="relative min-h-screen overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-toon-yellow focus:px-4 focus:py-2 focus:font-display focus:text-toon-card"
        >
          Skip to content
        </a>
        <Navigation />
        {/* Keyed by route so each page plays the enter animation */}
        <main id="main" key={pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
