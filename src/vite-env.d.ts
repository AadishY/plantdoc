/// <reference types="vite/client" />

// NOTE: provider API keys are deliberately absent here. They are server-only
// secrets (GEMINI_API_KEY / GROQ_API_KEY / OPENROUTER_API_KEY) consumed by the
// `/api/ai/*` gateway and must never be exposed through `import.meta.env`.
interface ImportMetaEnv {
  readonly VITE_WIKIMEDIA_USER_AGENT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
