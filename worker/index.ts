interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'content-type': 'application/json; charset=utf-8', allow: 'GET, HEAD', 'cache-control': 'no-store' }
        });
      }
      return new Response(request.method === 'HEAD' ? null : JSON.stringify({
        status: 'ok',
        service: 'orbital-glass',
        runtime: 'cloudflare-workers',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
      });
    }
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }
      });
    }
    return env.ASSETS.fetch(request);
  }
};
