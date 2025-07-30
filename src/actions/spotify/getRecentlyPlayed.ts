"use server";

import { auth } from "@/auth";
import { getSpotifyToken } from "./getSpotifyToken";
import { getRecentlyPlayedEndpoint } from "@/lib/spotify/endpoints";

export async function getRecentlyPlayed() {
  const session = await auth();
  if (!session || !session.user.access_token || !session.user.refresh_token) {
    console.log("Session:", session);
    console.error("getRecentlyPlayed: User not authenticated");
    throw new Error("getRecentlyPlayed: User not authenticated");
  }

  const token = await getSpotifyToken();
  if (!token || !token.access_token) {
    throw new Error("Failed to retrieve Spotify token");
  }

  const endpoint = getRecentlyPlayedEndpoint();

  try {
    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Error fetching recently played: ${res.statusText}`);
    }
    return res.json();
  } catch (e) {
    throw new Error("Failed to fetch");
  }
}
