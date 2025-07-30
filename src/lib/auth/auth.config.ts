// // src/auth.ts - Complete auth setup in one file
// import NextAuth from "next-auth";
// import SpotifyProvider from "next-auth/providers/spotify";
// import { spotifyScopes } from "../spotify/scopes";

// const CLIENT_ID = process.env.AUTH_SPOTIFY_ID;
// const CLIENT_SECRET = process.env.AUTH_SPOTIFY_SECRET;

// if (!CLIENT_ID || !CLIENT_SECRET) {
//   throw new Error("Missing Spotify client ID or secret");
// }

// const SPOTIFY_SCOPES = spotifyScopes.join(" ");

// async function refreshAccessToken(token: any) {
//   try {
//     // TypeScript safety check
//     if (!CLIENT_ID || !CLIENT_SECRET) {
//       throw new Error("Missing Spotify client credentials");
//     }

//     // Using body parameters approach (as shown in Spotify docs)
//     const response = await fetch("https://accounts.spotify.com/api/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//         client_id: CLIENT_ID,
//         client_secret: CLIENT_SECRET,
//       }),
//     });

//     const refreshedTokens = await response.json();

//     if (!response.ok) {
//       console.error("Failed to refresh token:", refreshedTokens);
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
//     };
//   } catch (error) {
//     console.error("Error refreshing access token:", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

// export const authConfig = NextAuth({
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     SpotifyProvider({
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       authorization: {
//         params: {
//           scope: SPOTIFY_SCOPES,
//         },
//       },
//     }),
//   ],
//   callbacks: {
//     async redirect({ url, baseUrl }) {
//       // Use ngrok URL in development
//       if (process.env.NODE_ENV === "development" && process.env.NEXTAUTH_URL) {
//         const ngrokUrl = process.env.NEXTAUTH_URL;
//         if (url.startsWith("/")) return `${ngrokUrl}${url}`;
//         if (url.startsWith(ngrokUrl)) return url;
//       }

//       // Allows relative callback URLs
//       if (url.startsWith("/")) return `${baseUrl}${url}`;
//       // Allows callback URLs on the same origin
//       else if (new URL(url).origin === baseUrl) return url;
//       return baseUrl;
//     },

//     async signIn({ user }) {
//       // Restrict access to specific email
//       if (user?.email !== "ramirotuk@gmail.com") {
//         console.log(`Sign in denied for: ${user?.email}`);
//         return false;
//       }
//       return true;
//     },

//     async jwt({ token, account }) {
//       // Initial sign-in
//       if (account) {
//         console.log("Initial sign-in, storing tokens");
//         if (!account.access_token || !account.refresh_token) {
//           console.error("Missing access or refresh token during sign-in");
//           throw new Error("Missing access or refresh token");
//         }

//         const tokenExpiresAt = Math.floor(
//           Date.now() / 1000 + account.expires_at!
//         );
//         token.expiresAt = tokenExpiresAt;
//         token.accessToken = account.access_token;
//         token.refreshToken = account.refresh_token;
//         token.error = undefined; // Clear any previous error
//         console.log("Tokens stored successfully:", {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken,
//           expiresAt: token.expiresAt,
//         });
//         // Return the token with all necessary fields
//         if (token.expiresAt && typeof token.expiresAt === "number") {
//           token.expiresAt = Math.floor(token.expiresAt);
//         } else {
//           console.error("Invalid expiresAt value:", token.expiresAt);
//           throw new Error("Invalid expiresAt value");
//         }
//         // Ensure all fields are present
//         if (!token.accessToken || !token.refreshToken || !token.expiresAt) {
//           console.error("Missing fields in token:", {
//             accessToken: token.accessToken,
//             refreshToken: token.refreshToken,
//             expiresAt: token.expiresAt,
//           });
//           throw new Error("Missing fields in token");
//         }
//         // Return the token with all necessary fields
//         console.log("Returning token with all fields:", {
//           accessToken: token.accessToken,
//           refreshToken: token.refreshToken,
//           expiresAt: token.expiresAt,
//         });

//         // Return the token with all necessary fields
//         return token;
//       }

//       // Return previous token if not expired
//       if (Date.now() < (token.expiresAt as number) * 1000) {
//         return token;
//       }

//       // Access token has expired, refresh it
//       console.log("Token expired, refreshing...");

//       // Access token has expired, refresh it
//       const refreshed = await refreshAccessToken(token);
//       // Always return accessToken, even if refresh failed
//       return {
//         ...refreshed,
//         accessToken: refreshed.accessToken ?? token.accessToken,
//         refreshToken: refreshed.refreshToken ?? token.refreshToken,
//         expiresAt: refreshed.expiresAt ?? token.expiresAt,
//       };
//     },

//     async session({ session, token }) {
//       if (token.error) {
//         console.error("Token error in session:", token.error);
//       }

//       return {
//         ...session,
//         accessToken: token.accessToken,
//         refreshToken: token.refreshToken,
//         error: token.error,
//       };
//     },
//   },
//   debug: process.env.NODE_ENV === "development",
//   secret: process.env.NEXTAUTH_SECRET,
// });

// // Type declarations
// declare module "next-auth" {
//   interface JWT {
//     accessToken?: string;
//     refreshToken?: string;
//     expiresAt?: number;
//     error?: string;
//   }

//   interface Session {
//     accessToken?: string;
//     refreshToken?: string;
//     error?: string;
//   }
// }
