import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { prisma } from '../../../utils/db';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || '{}')
          );

          const nextAuthUrl =
            process.env.NEXTAUTH_URL ||
            (process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}`
              : null);
          if (!nextAuthUrl) {
            return null;
          }

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || '');

          console.log(siwe);
          return {
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === 'GET' && (req.query.nextauth as any).includes('signin');

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    providers,
    session: {
      strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token, user: userF }) {
        let user = await prisma.ethWallet.findUnique({
          where: { address: token.sub! },
        });

        if (!user) {
          user = await prisma.ethWallet.create({
            data: {
              address: token.sub!,
              image: 'https://www.fillmurray.com/128/128',
            },
          });
        }

        session.user = user;

        return session;
      },
    },
  });
}
