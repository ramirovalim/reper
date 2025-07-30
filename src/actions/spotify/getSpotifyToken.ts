"use server";

import { auth } from "@/auth";
import { AccessToken } from "@spotify/web-api-ts-sdk";

export async function getSpotifyToken(): Promise<AccessToken> {
  const session = await auth();
  if (!session || !session.user.access_token || !session.user.refresh_token) {
    throw new Error("getSpotifyToken: User not authenticated");
  }

  if (!session.user.access_token || !session.user.refresh_token) {
    throw new Error("getSpotifyToken: Missing access or refresh token");
  }

  const token = {
    access_token: session.user.access_token,
    token_type: "Bearer",
    expires_in: Number(session.expires),
    refresh_token: session.user.refresh_token,
  };

  return token;
}
