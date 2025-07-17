import NextAuth, { type User } from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import SpotifyProvider from 'next-auth/providers/spotify';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    SpotifyProvider({
      authorization:
        'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,playlist-modify-private,playlist-modify-public',
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
});
