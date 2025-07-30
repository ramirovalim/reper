import type { NextAuthConfig } from 'next-auth';

const CLIENT_ID = process.env.AUTH_SPOTIFY_ID;
if (!CLIENT_ID) {
  console.error("AUTH_SPOTIFY_ID not found!!!");
}

type refreshSpotifyTokenParams = {
  r_token: string,
}

type refreshSpotifyTokenError =  {
  error: string,
  error_description: string
}

type refreshSpotifyTokenResponse = {
  access_token: string,
  token_type: string,
  expires_in: number,
  refresh_token: string,
  scope: string
};

type refreshedSpotifyToken = refreshSpotifyTokenResponse & refreshSpotifyTokenError;

const refreshSpotifyToken = async (params: refreshSpotifyTokenParams): Promise<refreshedSpotifyToken> => {
  const refreshToken = params.r_token;
  try {
    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID!,
      }),
    }
    const body = await fetch(url, payload);
    const response = await body.json();
    return response;
  } catch (error) {
    console.log(error);
    return error as refreshedSpotifyToken;
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLoginPage = nextUrl.pathname.startsWith('/login');

      // Allow access to login page
      if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL('/', nextUrl));
        }
        return true;
      }

      // For other pages, check if user is logged in
      return isLoggedIn;
    },

    // Restrict access to certain users
    async signIn({ user }) {
      if (user?.email !== 'ramirotuk@gmail.com') return false;
      return true;
    },

    // Redirect after sign in
    async redirect({ url, baseUrl }) {
      // Use ngrok URL in development
      if (process.env.NODE_ENV === 'development') {
        const ngrokUrl = process.env.NEXTAUTH_URL!;
        if (url.startsWith('/')) return `${ngrokUrl}${url}`;
        if (url.startsWith(ngrokUrl)) return url;
      }
      return baseUrl;
    },

    async jwt({ token, account, user }) {
      // Persist the OAuth access_token - first login
      if (account) {
        console.log("ACC: ", account);
        token.id = user.id;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        // se a estratégia de refresh abaixo n funcionar, tentar fazer aqui no primeiro acesso
      }

      // User is logged in
      if (token.expiresAt) {
        const now = Math.floor(Date.now() / 1000);

        if (now < Number(token.expiresAt)) {
          // Não precisa usar o refresh token ainda...
          return token;
        } else {
          if (token.refreshToken) {
            // Tem que atualizar o access token com o refresh token!!!
            const params = {
              r_token: token.refreshToken as string,
            }

            const newToken = await refreshSpotifyToken(params);

            if (!newToken.access_token) {
              console.error('newToken.error: ', newToken.error);
              console.error('description: ', newToken.error_description);
            }

            console.log('newToken: ', newToken);
            return newToken;
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id as string;
      session.access_token = token.accessToken as string;
      session.refresh_token = token.refreshToken as string;
      session.expires_at = token.expiresAt as number;
      

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      teste?: string;
    };
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
  interface Token {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}