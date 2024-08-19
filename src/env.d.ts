import "../.astro/types.d.ts"; //GERMAN че за фигня?
export interface ImportMetaEnv {
  PUBLIC_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
