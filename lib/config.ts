// Configuration loader — satisfies arch.config_externalised.
// All configuration is read from process.env at startup.
// No config values are hardcoded here.

// ── Required vars (throw if missing) ────────────────────────────────
const required = [
  "NODE_ENV",
  "PORT",
  "OIDC_ISSUER",
  "OIDC_CLIENT_ID",
  "OIDC_CLIENT_SECRET",
  "OIDC_REDIRECT_URI",
  "SESSION_SECRET",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// ── Typed config object ─────────────────────────────────────────────

export const config = {
  nodeEnv: process.env.NODE_ENV as string,
  port: parseInt(process.env.PORT, 10),
  oidc: {
    issuer: process.env.OIDC_ISSUER,
    clientId: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    redirectUri: process.env.OIDC_REDIRECT_URI,
  },
  sessionSecret: process.env.SESSION_SECRET,
} as const;
