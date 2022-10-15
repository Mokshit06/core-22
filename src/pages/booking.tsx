import { Box, Button, Flex, FlexProps, Heading, Text } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ArrowSVG } from '../components/arrow-svg';
import {
  MdChair,
  MdOutlineChair,
  MdClose,
  MdOpenInFull,
  MdSell,
  MdOutlineOpenInFull,
  MdPerson,
} from 'react-icons/md';
import Layout from '../components/layout';
import { FlightViewer } from '../components/viewer';

const seats = [
  [
    'na',
    'na',
    'na',
    'ok',
    'ok',
    'ok',
    'ok',
    'ok',
    'ok',
    'na',
    'ok',
    'ok',
    'c',
    'c',
    'na',
    'ok',
    'ok',
    'ok',
    'na',
    'na',
    'ok',
    'na',
    'na',
    'na',
    'c',
    'c',
    'c',
    'c',
    'c',
    'c',
  ],
  [
    'ok',
    'ok',
    'na',
    'ok',
    'ok',
    'ok',
    'ok',
    'ok',
    'ok',
    'c',
    'c',
    'c',
    'c',
    'c',
    'na',
    'ok',
    'ok',
    'ok',
    'na',
    'na',
    'ok',
    'na',
    'ok',
    'na',
    'c',
    'na',
    'c',
    'na',
    'c',
    'c',
  ],
];

export default function Booking() {
  const [currentRouteInfo, setCurrentRouteInfo] = useState();
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState('B2');

  useEffect(() => {
    const route = localStorage.getItem('current-route');
    if (route == null) {
      router.push('/');
      return;
    }

    try {
      setCurrentRouteInfo(JSON.parse(route));
    } catch {
      router.push('/');
    }
  }, [router]);

  if (!currentRouteInfo) return null;

  return (
    <Layout>
      <Head>
        <link
          href="https://db.onlinewebfonts.com/c/d2ea9647b9b2c568d950a5e7849f6dee?family=BattleslabW00-Black"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      <Flex
        flex={1}
        w="100%"
        py="2vh"
        flexDir="column"
        alignItems="center"
        px="2vw"
      >
        <Flex flex={1} gap={6} maxW="1200px" maxH="100%" w="100%">
          <Box
            bgImage="url(/bg.jpg)"
            // h="80vh"
            flex={1}
            overflow="hidden"
            borderRadius="xl"
            backgroundSize="cover"
            bgPosition="right"
            mb="5"
          >
            <Box
              w="100%"
              borderRadius="lg"
              px="8"
              py="6"
              backdropFilter="brightness(0.5)"
              fontFamily="BattleslabW00-Black"
              h="100%"
            >
              <Heading fontSize="5xl" mb={7} fontFamily="BattleslabW00-Black">
                Select Seat
              </Heading>
              <Flex
                gap={4}
                alignItems="center"
                fontSize="2xl"
                color="whiteAlpha.700"
              >
                <Text>{currentRouteInfo.dep_iata}</Text>
                <ArrowSVG />
                <Text>{currentRouteInfo.arr_iata}</Text>
              </Flex>
              <Flex
                gap={4}
                alignItems="center"
                fontSize="2xl"
                color="whiteAlpha.700"
              >
                <Text>{currentRouteInfo.dep_time}</Text>
                <ArrowSVG />
                <Text>{currentRouteInfo.arr_time}</Text>
              </Flex>
              <Text color="whiteAlpha.700" fontSize="2xl">
                Business Class
              </Text>
              <Button
                onClick={() => router.push('/simulator')}
                mt={5}
                size="lg"
                maxW="100%"
                colorScheme="yellow"
              >
                View & experience the journey!
              </Button>
            </Box>
          </Box>
          {/* <FlightViewer /> */}
          <Box w="max-content" rounded="lg" mb="5">
            <Flex p={6} gap={2} bg="gray.50" w="full" h="full" rounded="xl">
              <Box display="grid" gap={3} gridTemplateColumns="repeat(3, 11fr)">
                <RowNo number="A" />
                <RowNo number="B" />
                <RowNo number="C" />
                {seats[0].map((seat, index) => {
                  const alphabet =
                    index % 3 === 0 ? 'A' : index % 3 === 1 ? 'B' : 'C';
                  const s = `${alphabet}${index + 1}`;

                  if (s === selectedSeat) return <SelectedSeat />;

                  if (seat === 'na') return <NotAllowed />;
                  if (seat === 'ok')
                    return <Standard onClick={() => setSelectedSeat(s)} />;
                  if (seat === 'c')
                    return <LegSpace onClick={() => setSelectedSeat(s)} />;
                })}
              </Box>
              <Flex flexDir="column" gap={3}>
                <RowNo />
                {Array.from({ length: 10 }, _ => 0).map((_, i) => (
                  <RowNo key={i} number={1 + i} />
                ))}
              </Flex>
              <Box display="grid" gap={3} gridTemplateColumns="repeat(3, 1fr)">
                <RowNo number="D" />
                <RowNo number="E" />
                <RowNo number="F" />
                {seats[1].map((seat, index) => {
                  const alphabet =
                    index % 3 === 0 ? 'D' : index % 3 === 1 ? 'E' : 'F';
                  const s = `${alphabet}${index + 1}`;

                  if (s === selectedSeat) return <SelectedSeat />;

                  if (seat === 'na') return <NotAllowed />;
                  if (seat === 'ok')
                    return <Standard onClick={() => setSelectedSeat(s)} />;
                  if (seat === 'c')
                    return <LegSpace onClick={() => setSelectedSeat(s)} />;
                })}
              </Box>
            </Flex>
          </Box>
          {/* <Box>{JSON.stringify(currentRouteInfo)}</Box> */}
        </Flex>
      </Flex>
    </Layout>
  );
}

function Seat(props: FlexProps) {
  return (
    <Flex
      as="button"
      align="center"
      justify="center"
      height="70px"
      rounded="lg"
      // transition="background 150ms ease-in-out"
      width="70px"
      {...(props as any)}
    />
  );
}

function RowNo({ number }: any) {
  return (
    <Flex
      height={typeof number === 'number' ? '70px' : '30px'}
      px="2"
      alignItems="center"
      justify="center"
    >
      <Text fontSize="2xl" fontWeight="extrabold" color="gray.500">
        {number}
      </Text>
    </Flex>
  );
}

function Standard(props: FlexProps) {
  return <Seat bg="blue.300" {...(props as any)} />;
}

function LegSpace(props: FlexProps) {
  return (
    <Seat bg="orange.300" {...(props as any)}>
      <Box as={MdSell} color="white" fontSize="5xl" />
    </Seat>
  );
}

function NotAllowed() {
  return (
    <Seat bg="gray.100">
      <Box as={MdClose} fontSize="5xl" color="gray.300" />
    </Seat>
  );
}

function SelectedSeat() {
  return (
    <Seat bg="purple.400">
      <Box as={MdPerson} fontSize="5xl" color="white" />
    </Seat>
  );
}
