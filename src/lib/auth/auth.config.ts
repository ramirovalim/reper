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
    // Restrict access to certain users
    async signIn({ user }) {
      if (user?.email !== 'ramirotuk@gmail.com') return false;
      return true;
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
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.sessionToken = token.accessToken as string;
      session.user.id = token.id as string;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
