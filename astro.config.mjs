import { defineConfig } from "astro/config";
import node from "@astrojs/node";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs()],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    // To fix the Vite loading issue as recommended in https://github.com/vitejs/vite/discussions/13910#discussioncomment-8377145.
    base: "./",
    build: {
      // To fix the SVG after build Vite issue as described in https://github.com/withastro/astro/issues/10296#issuecomment-1976825322.
      assetsInlineLimit: 0,
    },
  },
});
