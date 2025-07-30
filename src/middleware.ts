import { auth } from "@/auth";
import { JWT, encode, getToken } from "next-auth/jwt";
import { NextResponse, NextRequest } from "next/server";

export default auth((req) => {
  console.log("<--- HERE --->");
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = nextUrl.pathname.startsWith("/login");

  // Allow access to login page
  if (isOnLoginPage) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  // Protect other pages
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

//cookie name changes depending on context
const sessionCookie = process.env.NEXTAUTH_URL?.startsWith("https://")
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

export async function refreshToken(token: JWT) {
  const basic = Buffer.from(
    `${process.env.AUTH_SPOTIFY_ID}:${process.env.AUTH_SPOTIFY_SECRET}`
  ).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
        client_id: process.env.AUTH_SPOTIFY_ID as string,
      }),
    });

    const newTokens = await response.json();

    if (!response.ok) throw newTokens;

    console.log("Refresh token succufully updated");

    return {
      ...token,
      accessToken: newTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + newTokens.expires_in),
      refreshToken: newTokens.refresh_token,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET as string,
  });

  const response = NextResponse.next();

  //refresh token logic here
  if (
    token &&
    typeof token.expires_at === "number" &&
    Date.now() > token.expires_at * 1000
  ) {
    console.log("token need to be refreshed");

    const newToken = await refreshToken(token);

    const newSessionToken = await encode({
      secret: process.env.AUTH_SECRET as string,
      token: newToken,
      salt: sessionCookie,
    });

    response.cookies.set(sessionCookie, newSessionToken);
  }

  return response;
}
