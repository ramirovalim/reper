import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      if (isLoggedIn) {
        Response.redirect(new URL('/', nextUrl));
        return true;
      }
      return false;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
