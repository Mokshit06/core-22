import { getCsrfToken, signIn } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useConnect, useSignMessage } from 'wagmi';
// import Layout from '../components/layout';

export function Siwe() {
  const { connectAsync, connectors } = useConnect();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    try {
      const res = await connectAsync({ connector: connectors[0] });
      const callbackUrl = '/protected';
      const message = new SiweMessage({
        domain: window.location.host,
        address: res.account,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: res.chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <button
      onClick={e => {
        e.preventDefault();
        handleLogin();
      }}
    >
      Sign-In with Ethereum
    </button>
  );
}
