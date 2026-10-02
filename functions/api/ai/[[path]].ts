import { handleAiProxy, type ProxyEnv } from '../../../server/aiProxy';

interface PagesContext {
  request: Request;
  env: ProxyEnv;
}

/**
 * Cloudflare Pages Function: /api/ai/*
 * Keys live in the Pages project environment (GEMINI_API_KEY, GROQ_API_KEY,
 * OPENROUTER_API_KEY) and are never shipped to the browser bundle.
 */
export const onRequest = async (context: PagesContext): Promise<Response> => {
  const response = await handleAiProxy(context.request, context.env);
  return response ?? new Response('Not found', { status: 404 });
};
