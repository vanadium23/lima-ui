/// <reference types="astro/client" />
export interface ImportMetaEnv {
  readonly COLOR_THEME: "default" | "dark";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
