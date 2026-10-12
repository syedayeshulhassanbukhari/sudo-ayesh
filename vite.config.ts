import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { SITE } from "./src/data/portfolio"
import { seoPlugin } from "./seo/plugin"

// https://vite.dev/config/
export default defineConfig({
  base: SITE.base,
  plugins: [react(), seoPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
