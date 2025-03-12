import {defineConfig} from "astro/config";
import node from "@astrojs/node";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  devToolbar: {
    enabled: false
  },
  vite: {
    // To fix the Vite loading issue as recommended in https://github.com/vitejs/vite/discussions/13910#discussioncomment-8377145.
    base: "/",
    build: {
      // To fix the SVG after build Vite issue as described in https://github.com/withastro/astro/issues/10296#issuecomment-1976825322.
      assetsInlineLimit: 0,
    },
    optimizeDeps: {
      // To resolve incorrectly working caching on the first run: https://stackoverflow.com/a/76379587/2008562.
      force: true
    },
    define: {
      "import.meta.env.PUBLIC_API_URL": JSON.stringify(process.env.PUBLIC_API_URL || "http://localhost:3000")
    },
  },
});
