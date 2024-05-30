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
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      const data = {
        token: account.id_token,
        email: profile.email,
        name: profile.name,
      };
      const response = await axios.post(`${process.env.BACKEND_URL}/api/auth/google/login/`, data);
      const { access_token, refresh_token } = response.data;
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      return true;
    },
  },
});
