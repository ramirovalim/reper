import type { NextAuthConfig } from 'next-auth';

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
    async redirect({ url, baseUrl }) {
      // Use ngrok URL in development
      if (process.env.NODE_ENV === 'development') {
        const ngrokUrl = process.env.NEXTAUTH_URL!;
        if (url.startsWith('/')) return `${ngrokUrl}${url}`;
        if (url.startsWith(ngrokUrl)) return url;
      }
      return baseUrl;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
