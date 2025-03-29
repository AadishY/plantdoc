
/// <reference types="vite/client" />

interface ImportMetaEnv {
  // No API keys here anymore as we're using Supabase for secret management
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
