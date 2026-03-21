import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import {
  findUserByEmail,
  createUser,
  type StoredUser,
} from "@/lib/auth/store";
import { createSession } from "@/lib/auth/session";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified: boolean;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${appUrl}/login?error=google_auth_failed`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${appUrl}/login?error=missing_code`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${appUrl}/login?error=oauth_not_configured`
    );
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;

  try {
    // Exchange authorisation code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(
        `${appUrl}/login?error=token_exchange_failed`
      );
    }

    const tokens: GoogleTokenResponse = await tokenRes.json();

    // Get user profile from Google
    const userInfoRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    if (!userInfoRes.ok) {
      return NextResponse.redirect(
        `${appUrl}/login?error=profile_fetch_failed`
      );
    }

    const googleUser: GoogleUserInfo = await userInfoRes.json();

    // Find or create user
    let user = findUserByEmail(googleUser.email);

    if (!user) {
      const newUser: StoredUser = {
        id: uuidv4(),
        name: googleUser.name || googleUser.email,
        email: googleUser.email.toLowerCase(),
        passwordHash: null,
        provider: "google",
        createdAt: new Date().toISOString(),
      };

      user = createUser(newUser);
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(
      `${appUrl}/login?error=unexpected_error`
    );
  }
}
