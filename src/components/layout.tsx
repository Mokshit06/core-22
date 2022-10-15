import {
  Flex,
  Heading,
  HStack,
  Spacer,
  Button,
  Image,
  Box,
  Text,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';
import Link from './link';
import { Logo } from './logo';
import { useDisconnect } from 'wagmi';
import { Siwe } from './siwe';
// import { UserRole } from '@prisma/client';

export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession();
  const disconnect = useDisconnect();

  return (
    <Flex
      minH="100vh"
      bgImage="url(/hero.jpg)"
      bgPosition="bottom"
      bgSize="150rem"
      // bgColor="gray.900"
      backdropFilter="blur(10px)"
      bgRepeat="no-repeat"
      fontFamily="Inter var,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji"
      flexDirection="column"
    >
      <Flex
        as="nav"
        align="center"
        wrap="wrap"
        padding="1rem 2rem"
        zIndex={1000}
        // boxShadow="md"
      >
        <Flex
          align="center"
          css={{ '> svg': { height: '3.2rem', width: 'max-content' } }}
          mr={5}
          gap={5}
        >
          <Box as="img" src="/logo-coloured.png" height="3rem" />
          {/* <Box as={Logo} /> */}
          <Text fontSize="2xl" fontWeight="bold">
            Tony Airlines
          </Text>
        </Flex>

        <Spacer />

        <HStack
          spacing={5}
          mr={5}
          width={{ md: 'auto', base: 'full' }}
          alignItems="center"
        >
          <Link href="/">Home</Link>
          {session.status === 'authenticated' ? (
            <>
              <Button
                onClick={async () => {
                  await disconnect.disconnectAsync();
                  signOut();
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Siwe />
            </>
          )}
        </HStack>
      </Flex>
      {children}
    </Flex>
  );
}
