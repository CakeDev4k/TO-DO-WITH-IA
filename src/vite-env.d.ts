/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}