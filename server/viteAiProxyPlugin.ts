import type { Plugin } from 'vite';
import { handleAiProxy, type ProxyEnv } from './aiProxy';

/**
 * Dev/preview-server equivalent of the Cloudflare Pages Function at
 * `functions/api/ai/[[path]].ts`, so `npm run dev` behaves exactly like
 * production: the browser only ever talks to same-origin `/api/ai/*`.
 */
export function aiProxyPlugin(env: ProxyEnv): Plugin {
  const middleware = async (req: any, res: any, next: () => void) => {
    const url: string = req.originalUrl || req.url || '';
    if (!url.startsWith('/api/ai')) return next();

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const body = chunks.length ? Buffer.concat(chunks) : undefined;

      const request = new Request(new URL(url, 'http://localhost').toString(), {
        method: req.method,
        headers: { 'Content-Type': 'application/json' },
        body: req.method === 'GET' || req.method === 'HEAD' ? undefined : body,
      });

      const response = await handleAiProxy(request, env);
      if (!response) return next();

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          error: { message: error instanceof Error ? error.message : 'AI gateway failure', code: 502 },
        })
      );
    }
  };

  return {
    name: 'plantdoc-ai-proxy',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
