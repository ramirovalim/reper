import NextAuth, { type User } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

export const { handlers, auth, signOut, signIn } = NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.AUTH_SPOTIFY_ID!,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET!,
      authorization: {
        params: {
          scope: process.env.AUTH_SPOTIFY_SCOPES,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Ensure token has required properties
      let access_token = token.access_token;
      let expires_at = token.expires_at;
      let refresh_token = token.refresh_token;

      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        access_token = account.access_token ?? "";
        expires_at = account.expires_at ?? 0;
        refresh_token = account.refresh_token ?? "";
        return {
          ...token,
          access_token,
          expires_at,
          refresh_token,
        };
      } else if (expires_at && Date.now() < expires_at * 1000) {
        // Subsequent logins, but the `access_token` is still valid
        return {
          ...token,
          access_token: access_token ?? "",
          expires_at: expires_at ?? 0,
          refresh_token: refresh_token ?? "",
        };
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!refresh_token) throw new TypeError("Missing refresh_token");

        try {
          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!,
              client_secret: process.env.AUTH_GOOGLE_SECRET!,
              grant_type: "refresh_token",
              refresh_token: refresh_token!,
            }),
          });

          const tokensOrError = await response.json();

          if (!response.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          access_token = newTokens.access_token ?? "";
          expires_at = Math.floor(
            Date.now() / 1000 + (newTokens.expires_in ?? 0)
          );
          refresh_token = newTokens.refresh_token
            ? newTokens.refresh_token
            : refresh_token;

          return {
            ...token,
            access_token,
            expires_at,
            refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access_token", error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          return {
            ...token,
            access_token: access_token ?? "",
            expires_at: expires_at ?? 0,
            refresh_token: refresh_token ?? "",
            error: "RefreshTokenError",
          };
        }
      }
    },
    async session({ session, token }) {
      session.user.error = token.error;
      return session;
    },
  },
});

declare module "next-auth" {
  interface Session {
    user: User & {
      access_token: string;
      expires_at: number;
      refresh_token?: string;
      error?: "RefreshTokenError";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}
