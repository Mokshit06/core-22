import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import type { AppProps } from 'next/app';
import { useState } from 'react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
    cssVarPrefix: 'tony',
  } as ThemeConfig,
});

function MyApp({ Component, pageProps }: AppProps<{ dehydratedState: any }>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;
