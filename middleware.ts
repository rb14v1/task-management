import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// Standard Harbour SSO wiring stub.
// Reads OIDC issuer, client ID, and client secret from env (never hardcoded).
// For any non-public path that lacks a session cookie, redirects the user
// to the identity provider for authentication.

const PUBLIC_PATHS = ["/healthz", "/_next", "/favicon.ico"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths are always allowed through.
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // If a session cookie is present, let the request through.
  // In a real implementation this would validate the session token
  // against the OIDC provider or a session store.
  const sessionCookie = request.cookies.get("session");
  if (sessionCookie) {
    return NextResponse.next();
  }

  // No session — redirect to the IdP.
  const oidcIssuer = process.env.OIDC_ISSUER;
  if (!oidcIssuer) {
    return new NextResponse("OIDC_ISSUER is not configured", { status: 500 });
  }

  const redirectUri = process.env.OIDC_REDIRECT_URI ?? "http://localhost:3000/auth/callback";
  const clientId = process.env.OIDC_CLIENT_ID;

  const authUrl = new URL("/authorize", oidcIssuer);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId ?? "");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "openid profile email");
  authUrl.searchParams.set("state", crypto.randomUUID());

  return NextResponse.redirect(authUrl);
}
