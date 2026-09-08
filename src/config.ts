// src/config.ts — Runtime configuration sourced exclusively from environment variables.
// Vite only exposes VITE_-prefixed variables to the browser bundle.
// This module throws immediately on startup if any required variable is absent,
// so the app fails fast rather than silently misbehaving.

const REQUIRED_VARS = [
  'VITE_OIDC_ISSUER',
  'VITE_OIDC_CLIENT_ID',
  'VITE_OIDC_REDIRECT_URI',
  'VITE_API_BASE_URL',
] as const;

for (const key of REQUIRED_VARS) {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  oidc: {
    issuer: import.meta.env.VITE_OIDC_ISSUER as string,
    clientId: import.meta.env.VITE_OIDC_CLIENT_ID as string,
    redirectUri: import.meta.env.VITE_OIDC_REDIRECT_URI as string,
  },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
} as const;
