import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Built pages arrive pre-rendered (scripts/prerender.mjs); the dev server and 404.html don't.
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
