// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {

  interface Session {
    accessToken?: string;
    refreshToken?: string;
    user: {
      address?: string;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken: string;
    refreshToken: string;
  }

  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}
