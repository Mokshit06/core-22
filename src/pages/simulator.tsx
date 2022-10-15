import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import { FlightViewer } from '../components/viewer';
import { useEffect, useState } from 'react';

export default function Simulator() {
  const [currentRoute, setCurrentRoute] = useState();
  const [routeCoords, setRouteCoords] = useState();
  const router = useRouter();

  useEffect(() => {
    const info = localStorage.getItem('current-route');
    const route = localStorage.getItem('route-coords');
    if (route == null || info == null) {
      router.push('/');
      return;
    }

    try {
      setCurrentRoute(JSON.parse(info));
      setRouteCoords(JSON.parse(route));
    } catch {
      router.push('/');
    }
  }, [router]);

  if (!routeCoords || !currentRoute) return null;

  return (
    <Box minH="100vh" minW="100vw">
      <FlightViewer
        {...(routeCoords as any)}
        duration={currentRoute.duration}
      />
    </Box>
  );
}
