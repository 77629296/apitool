import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

import { getServerConfig } from '@/config/server';

const {
  ENABLE_OAUTH_SSO,
  SSO_PROVIDERS,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  NEXTAUTH_SECRET,
} = getServerConfig();

declare module '@auth/core/jwt' {
  // Returned by the `jwt` callback and `auth`, when using JWT sessions
  interface JWT {
    userId?: string;
  }
}

const nextAuth = NextAuth({
  callbacks: {
    // Note: Data processing order of callback: authorize --> jwt --> session
    async jwt({ token, account }) {
      // Auth.js will process the `providerAccountId` automatically
      // ref: https://authjs.dev/reference/core/types#provideraccountid
      if (account) {
        token.userId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      // Pick userid from token
      if (session.user) {
        session.user.id = token.userId ?? session.user.id;
      }
      return session;
    },
  },
  providers: ENABLE_OAUTH_SSO
    ? SSO_PROVIDERS.split(/[,，]/).map((provider) => {
        switch (provider) {
          case 'GitHub': {
            return GitHub({
              clientId: GITHUB_CLIENT_ID,
              clientSecret: GITHUB_CLIENT_SECRET,
            });
          }
          default: {
            throw new Error(`[NextAuth] provider ${provider} is not supported`);
          }
        }
      })
    : [],
  secret: NEXTAUTH_SECRET,
  trustHost: true,
});

export const {
  handlers: { GET, POST },
  auth,
} = nextAuth;
