import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { WagmiConfig, createClient } from 'wagmi';
import { getDefaultProvider } from 'ethers';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    cssVarPrefix: 'tony',
  } as ThemeConfig,
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{ dehydratedState: any; session: any }>) {
  const [queryClient] = useState(() => new QueryClient());
  const [wagmiClient] = useState(() =>
    createClient({ autoConnect: true, provider: getDefaultProvider() })
  );

  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <ChakraProvider theme={theme}>
              <Component {...pageProps} />
            </ChakraProvider>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}

export default MyApp;
