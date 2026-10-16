# Orbital Glass

**Cloudflare-native edge control room.** React 19 + TypeScript + Vite, with a Cloudflare Worker API and GitHub Actions CI/CD.

Orbital Glass is an interactive **demonstration workspace**, not a production monitoring platform. Only the Cloudflare Worker health check is actual live infrastructure data. Fleet status, telemetry, workflows and charts are visibly labeled sample data.

## Features

- Responsive dark orbital-themed UI with five working views: **Overview, Node Explorer, Pipelines, Analytics, Settings**.
- **Real edge connection check** using `GET /api/health` served by the same Cloudflare Worker as the UI.
- Search and filter nodes, add demo nodes, pause/resume them, inspect load and latency, reset all nodes.
- Run three simulated pipelines and see their completion status.
- View deterministic sample analytics and export JSON snapshots.
- Nodes persist locally in browser `localStorage`; no database or login needed.
- No runtime Tailwind CDN, importmap, external image service, or client-side API key.
- Automated Node 22 install, TypeScript checks, frontend build and Worker deployment through GitHub Actions.

## Architecture

```text
GitHub master
  └── GitHub Actions
      ├── npm ci → npx tsc --noEmit → npm run build
      └── wrangler-action deploy
          └── Cloudflare Worker (workers.dev)
              ├── React SPA static assets (dist/)
              └── GET /api/health
```

No R2, D1, paid domain, paid database, third-party SaaS or Gemini subscription is required.

## Run locally

Node.js 22 or later recommended.

```bash
npm ci
npm run dev
```

Open **http://localhost:3000** for frontend development. The `/api/health` check will show **unreachable** under Vite alone because no Worker is running. All demo functionality still works.

For the complete app with its real Worker endpoint:

```bash
npm ci
npx tsc --noEmit
npm run build
npx wrangler@4 dev
```

Wrangler serves the built frontend and `/api/health` together. You can test the endpoint at `http://localhost:8787/api/health`.

## Automatic deployment (free tier)

1. Create or use a **Cloudflare Free** account and activate a free `workers.dev` subdomain.
2. Create an API token scoped to the account with **Workers Scripts: Edit** permissions and copy your Cloudflare account ID.
3. Add these **Actions repository secrets** in GitHub at **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Push or merge a commit to `master`, or select **Actions → Verify and deploy to Cloudflare → Run workflow**. Pull requests only verify the build.
5. The Cloudflare deployment step prints the resulting URL, typically `https://orbital-glass.<your-subdomain>.workers.dev`.

Alternatively, from your local machine run `npx wrangler@4 login`, `npm run build`, and `npx wrangler@4 deploy`.

The workflow intentionally fails with a clear credentials error if the secrets are missing, rather than falsely reporting that a deployment occurred. It does not require a payment method or a custom domain for its documented architecture. Standard Cloudflare Workers Free limits apply. Static asset requests are free; the health endpoint counts toward free Worker requests. Automatic checks run once per minute while the app is open and can be disabled under Settings.

## Real versus simulated

| Feature | Source |
| --- | --- |
| Page delivery | Cloudflare static assets once deployed |
| Edge health | Actual Worker `/api/health` response |
| Connection latency | Measured browser round-trip time |
| Fleet status / node latency / load | Local demo fixtures |
| Pipeline runs | Simulated in the browser |
| Trend charts | Deterministic sample data |
| Node edits and workspace state | Browser localStorage |

This project deliberately avoids presenting sample data as production uptime or security posture. Real operational monitoring requires secure authenticated integrations that are out of scope for the free, zero-credentials demo.

## Security and maintenance

- Cloudflare credentials must remain **GitHub Actions secrets**, never hard-coded in the frontend.
- The Worker health endpoint returns minimal public metadata and sends `Cache-Control: no-store`.
- No mandatory paid APIs or external frontend assets.
- `wrangler.jsonc` specifies Workers static assets and first-party API routing.
- Any changes to `master` are automatically tested and then deployed when Cloudflare secrets are configured.
