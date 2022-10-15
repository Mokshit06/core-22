import { EthWallet } from '@prisma/client';
import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & EthWallet;
  }
}
