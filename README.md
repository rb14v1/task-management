# Harbour golden-web starter blueprint

This is the **Harbour golden starter blueprint** — a minimal Next.js 15 + TypeScript
application that satisfies Harbour's baseline blocking requirements out of the box.
The INGEST stage copies this directory to scaffold new IDEA submissions.

## Baseline requirements satisfied

| Requirement ID | Description | How it's satisfied |
|---|---|---|
| `arch.containerised` | Application must be containerised with a Dockerfile using a non-root user | `Dockerfile` — multi-stage build, `USER nextjs` before CMD |
| `arch.healthcheck` | Application must expose a health endpoint | `app/healthz/route.ts` — `GET /healthz` returns `200 { "status": "ok" }` |
| `arch.config_externalised` | No configuration may be hardcoded | `lib/config.ts` — all config from `process.env`, throws on missing vars |
| `sec.no_hardcoded_secrets` | No secrets may be committed to source | `.env.example` — placeholder values only; real values in env |
| `obs.structured_logging` | Application must emit structured JSON logs | `lib/logger.ts` — `console.log(JSON.stringify(...))` to stdout |
| SSO | Application must enforce SSO/OIDC authentication | `middleware.ts` — redirects unauthenticated users to the IdP |

## Env vars

Copy `.env.example` to `.env.local` and fill in the values:

```
NODE_ENV=development
PORT=3000
OIDC_ISSUER=
OIDC_CLIENT_ID=
OIDC_CLIENT_SECRET=
OIDC_REDIRECT_URI=
SESSION_SECRET=
```

## Commands

```bash
pnpm dev       # Start the dev server
pnpm build     # Build for production
pnpm start     # Start the production server
pnpm lint      # Run ESLint
```

## How INGEST uses this blueprint

When a new IDEA submission is received, Harbour's INGEST stage:

1. Copies the contents of `blueprints/golden-web/` into a new project directory.
2. Renames the project (updating `package.json` name if needed).
3. The scaffolded project is then processed through BUILD, TEST, and DEPLOY stages.

No network access is needed during INGEST — everything is a local copy.
