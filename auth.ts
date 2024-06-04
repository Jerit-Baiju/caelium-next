import axios from 'axios';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, auth } = NextAuth({
  providers: [
    GoogleProvider({
      authorization: { params: { access_type: 'offline', prompt: 'consent', response_type: 'code' } },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any; profile?: any }) {
      const data = {
        token: account.id_token,
        google_access_token: account.access_token,
        google_refresh_token: account.refresh_token,
      };
      const response = await axios.post(`${process.env.BACKEND_URL}/api/auth/google/login/`, data);
      const { access_token, refresh_token } = response.data;
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      return true;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'accessToken',
          JSON.stringify({ access: token.accessToken as string, refresh: token.refreshToken as string }),
        );
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
  },
});
