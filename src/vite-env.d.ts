/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WIKIMEDIA_USER_AGENT?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_GROQ_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
