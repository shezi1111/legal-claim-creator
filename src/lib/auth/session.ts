import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "atticus_session";
const SESSION_EXPIRY_HOURS = 24 * 7; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  exp: number;
}

/**
 * Encode a session payload as a base64 JSON token.
 * This is a simple V1 implementation — swap for proper JWTs in production.
 */
function encodeToken(payload: SessionPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json).toString("base64url");
}

/**
 * Decode and validate a session token.
 * Returns null if the token is invalid or expired.
 */
function decodeToken(token: string): SessionPayload | null {
  try {
    const json = Buffer.from(token, "base64url").toString("utf-8");
    const payload = JSON.parse(json) as SessionPayload;

    if (!payload.userId || !payload.email || !payload.exp) {
      return null;
    }

    if (Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Create a session token and set it as an HTTP-only cookie.
 * Call this from Route Handlers after successful authentication.
 */
export async function createSession(user: {
  id: string;
  email: string;
  name: string;
}): Promise<string> {
  const expiresAt = Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    exp: expiresAt,
  };

  const token = encodeToken(payload);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });

  return token;
}

/**
 * Read and validate the session from the request cookie.
 * Works in Route Handlers and Server Components.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return decodeToken(sessionCookie.value);
}

/**
 * Read and validate the session from a NextRequest (for use in proxy/middleware).
 * Does not use the async cookies() API — reads directly from the request.
 */
export function getSessionFromRequest(
  request: NextRequest
): SessionPayload | null {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  return decodeToken(sessionCookie.value);
}

/**
 * Remove the session cookie, effectively logging the user out.
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
