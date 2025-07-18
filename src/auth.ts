import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';
import SpotifyProvider from 'next-auth/providers/spotify';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  debug: true,
  providers: [
    SpotifyProvider({
      authorization: {
        url: 'https://accounts.spotify.com/authorize',
        params: {
          scope:
            'user-read-email playlist-read-private playlist-modify-private playlist-modify-public',
        },
      },
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
});
