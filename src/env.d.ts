/// <reference types="astro/client" />
export interface ImportMetaEnv {
  PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
