import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import { defineConfig } from "astro/config";
import process from "process";

// DOC https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: node({
    // The monorepo container (Dockerfile.app) hosts Astro inside the Lima
    // fastify backend: it needs the middleware build. Everything else —
    // `npm run dev`, `npm start`, the standalone Dockerfile — keeps the
    // default standalone mode.
    mode: process.env.ASTRO_ADAPTER_MODE === "middleware" ? "middleware" : "standalone",
  }),
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      // DOC To fix the SVG after build Vite issue as described in https://github.com/withastro/astro/issues/10296#issuecomment-1976825322.
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      include: ["@floating-ui/dom", "solid-floating-ui"],
    },
    define: {
      "import.meta.env.PUBLIC_API_URL": JSON.stringify(process.env.PUBLIC_API_URL || "http://localhost:3000"),
      "import.meta.env.SERVER_API_URL": JSON.stringify(
        process.env.SERVER_API_URL || process.env.PUBLIC_API_URL || "http://localhost:3000",
      ),
    },
  },
});
