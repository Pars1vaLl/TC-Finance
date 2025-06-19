/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_GOOGLE_SHEETS_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 