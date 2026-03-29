// Cloudflare Worker — Webhook Proxy
// Keeps your Make.com webhook URL private.
//
// SETUP:
// 1. Go to https://dash.cloudflare.com → Workers & Pages → Create
// 2. Name it "techne-webhook-proxy" → Deploy
// 3. Click "Edit Code" and paste this file's contents
// 4. Go to Settings → Variables → Add:
//      Name: WEBHOOK_URL
//      Value: (your Make.com webhook URL)
//      Check "Encrypt"
// 5. Save and deploy
// 6. Your proxy URL will be: https://techne-webhook-proxy.<your-subdomain>.workers.dev/webhook
//
// Then update compliance.html to use that URL instead of the Make.com URL directly.

const ALLOWED_ORIGINS = [
  'https://khullani.github.io',
  'https://strategy.techne.ai',
  'http://localhost',
  'http://127.0.0.1'
];

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only accept POST to /webhook
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/webhook') {
      return new Response('Not found', { status: 404 });
    }

    // Origin check
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    if (!allowed) {
      return new Response('Forbidden', { status: 403 });
    }

    // Forward to Make.com
    const webhookUrl = env.WEBHOOK_URL;
    if (!webhookUrl) {
      return new Response('Webhook not configured', { status: 500 });
    }

    const body = await request.text();
    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });

    return new Response(resp.body, {
      status: resp.status,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Content-Type': 'application/json'
      }
    });
  }
};

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowed ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
