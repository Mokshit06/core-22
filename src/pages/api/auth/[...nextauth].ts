import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // CredentialsProvider({
    //   authorize(credentials) {
    //     return {};
    //   },
    //   credentials: {
    //     message: {
    //       label: 'Message',
    //       type: 'text',
    //       placeholder: '0x0',
    //     },
    //     signature: {
    //       label: 'Signature',
    //       type: 'text',
    //       placeholder: '0x0',
    //     },
    //   },
    // }),
  ],
};
export default NextAuth(authOptions);
