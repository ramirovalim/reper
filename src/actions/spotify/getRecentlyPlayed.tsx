"use server";

import { auth } from "@/auth";

export default async function getRecentlyPlayed() {
    const session = await auth();

    if (!session || !session.access_token) {
        console.log('Deu ruim: ', session);
    }

    try {
    const url = "https://api.spotify.com/v1/me/player/recently-played?limit=5";

    const payload = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session?.access_token}`,
        'Content-Type': 'application/json'
      },
      
    }

    const body = await fetch(url, payload);

    const response = await body.json();
    return response.items;
  } catch (error) {
    console.log(error);
    return error;
  }
}