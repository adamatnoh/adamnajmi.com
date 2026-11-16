import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://adamnajmi.com",
  output: "static",
  adapter: vercel(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    // Pre-bundle deps that are only reached through lazy imports, so the dev
    // server doesn't re-optimise (and invalidate open tabs) on first use.
    optimizeDeps: {
      include: ["pdfjs-dist", "@vercel/analytics"],
    },
  },
});
