/// <reference types="astro/client" />
export interface ImportMetaEnv {
  API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
