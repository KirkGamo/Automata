/// <reference types="vite/client" />

// Allow reading VITE_API_BASE from import.meta.env without using `any`.
interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
