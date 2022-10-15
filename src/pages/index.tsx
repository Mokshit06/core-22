import { useQuery } from '@tanstack/react-query';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Text,
  Button,
  Divider,
} from '@chakra-ui/react';
import {
  CesiumComponentRef,
  Viewer,
  CloudCollection,
  Fog,
  Entity,
} from 'resium';
import * as Cesium from 'cesium';
import { ClockRange, JulianDate, PolylineGlowMaterialProperty } from 'cesium';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { Seating } from '../components/seating';
import Layout from '../components/layout';
import { Siwe } from '../components/siwe';
import { useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { useRouter } from 'next/router';

const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const fRoutes = (dep: string, arr: string) =>
  `https://airlabs.co/api/v9/routes?api_key=6d660a02-43ea-46fe-b79d-26ba567dc8fd&dep_iata=${encodeURIComponent(
    dep
  )}&arr_iata=${encodeURIComponent(arr)}`;
const fAirlines = (iata: string) =>
  `https://airlabs.co/api/v9/airlines?iata_code=${encodeURIComponent(
    iata
  )}&api_key=6d660a02-43ea-46fe-b79d-26ba567dc8fd`;

function getUniqueRoutes(routes: any[]) {
  const usedIata: string[] = [];

  return routes
    .filter(f => {
      if (usedIata.includes(f.airline_iata)) return false;

      usedIata.push(f.airline_iata);

      return true;
    })
    .slice(0, 6);
  // .map(async route => {
  //   const info = await fetch(fAirlines(route.airline_iata)).then(r =>
  //     r.json()
  //   );

  //   route.name = info.response[0].name;

  //   return route;
  // });
}

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const session = useSession();
  const [flightData, setFlightData] = useState<any>();
  const [status, setStatus] = useState<'idle' | 'loading' | 'fetched'>('idle');
  const [page, setPage] = useState<'search' | 'booking'>('search');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus('loading');

    const formData = new FormData(formRef.current!);
    const departureRoutes = await fetch(
      fRoutes(
        formData.get('departure') as string,
        formData.get('arrival') as string
      )
    ).then(r => r.json());
    const arrivalRoutes = await fetch(
      fRoutes(
        formData.get('arrival') as string,
        formData.get('departure') as string
      )
    ).then(r => r.json());

    const departureDay =
      days[new Date(formData.get('departing') as any).getDay()];
    const arrivalDay =
      days[new Date(formData.get('returning') as any).getDay()];

    const outbound = getUniqueRoutes(
      departureRoutes.response.filter((r: any) => r.days.includes(departureDay))
    );
    const inbound = getUniqueRoutes(
      arrivalRoutes.response.filter((r: any) => r.days.includes(arrivalDay))
    );

    setStatus('fetched');
    setPage('booking');
    setFlightData({
      outbound,
      inbound,
      departing: formData.get('departing'),
      returning: formData.get('returning'),
      passengers: formData.get('passengers'),
    });
  };

  return (
    <Layout>
      <Head>
        <link
          href="https://db.onlinewebfonts.com/c/d2ea9647b9b2c568d950a5e7849f6dee?family=BattleslabW00-Black"
          rel="stylesheet"
          type="text/css"
        />
      </Head>
      {/* <Siwe />
      <pre>{JSON.stringify(sess, null, 2)}</pre> */}
      <Flex w="100%" py="2vh" flexDir="column" alignItems="center" px="2vw">
        <Box maxW="1200px" w="100%">
          {page === 'search' ? (
            <SearchFlight
              isLoading={status === 'loading'}
              formRef={formRef}
              onSubmit={handleSubmit}
            />
          ) : (
            <MakeBooking {...flightData} />
          )}
        </Box>
      </Flex>
    </Layout>
  );
}

function MakeBooking({ outbound, inbound }: any) {
  const router = useRouter();

  return (
    <>
      <Box
        bgImage="url(/bg.jpg)"
        w="100%"
        h="50vh"
        overflow="hidden"
        borderRadius="lg"
        backgroundSize="cover"
        bgPosition="center"
        mb="5"
      >
        <Heading
          w="100%"
          borderRadius="lg"
          px="8"
          py="6"
          backdropFilter="brightness(0.5)"
          h="100%"
          fontSize="5xl"
          mb={7}
          fontFamily="BattleslabW00-Black"
        >
          Make booking
        </Heading>
      </Box>
      <Flex w="100%" gap="4">
        <Flex
          flex={1}
          gap={4}
          w="100%"
          rounded="lg"
          shadow="lg"
          // alignItems="center"
          minH="4vh"
          backdropFilter="blur(8px) brightness(0.8) "
          px={7}
          flexDir="column"
          py={5}
          border="1px solid rgb(30 41 59/1)"
        >
          <Heading as="h3" fontFamily="BattleslabW00-Black" fontSize="3xl">
            Outbound
          </Heading>
          <Flex flexDir="column">
            {outbound.map(route => (
              <>
                <Flex
                  cursor="pointer"
                  transition="background 200ms ease-in-out"
                  rounded="lg"
                  onClick={() => router.push('/booking')}
                  _hover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  px="4"
                  py="3"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex fontSize="lg" gap={2} alignItems="center">
                    {/* {JSON.stringify(route, null, 2)} */}
                    <Box>
                      <Text fontSize="sm">{route.dep_iata}</Text>
                      <Text fontSize="md" fontWeight="bold">
                        {route.dep_time}
                      </Text>
                    </Box>
                    <ArrowSVG />
                    <Box>
                      <Text fontSize="sm">{route.arr_iata}</Text>
                      <Text fontSize="md" fontWeight="bold">
                        {route.arr_time}
                      </Text>
                    </Box>
                  </Flex>
                  <Box textAlign="center">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="whiteAlpha.600"
                    >
                      Business class
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      ${randPrice()}
                    </Text>
                  </Box>
                  <Box p="1">
                    <Box
                      as="img"
                      height="40px"
                      rounded="lg"
                      // src={`https://daisycon.io/images/airline/?height=150&iata=${out.airline_iata}`}
                      src="/Frame 1.png"
                      // src={`https://content.airhex.com/content/logos/airlines_${route.airline_iata}_350_100_r.png`}
                      // src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${out.airline_iata}.svg`}
                    />
                  </Box>
                </Flex>
                <Divider />
              </>
            ))}
          </Flex>
        </Flex>
        <Flex
          flex={1}
          gap={4}
          w="100%"
          rounded="lg"
          shadow="lg"
          // alignItems="center"
          minH="4vh"
          backdropFilter="blur(8px) brightness(0.8) "
          px={7}
          flexDir="column"
          py={5}
          border="1px solid rgb(30 41 59/1)"
        >
          <Heading as="h3" fontFamily="BattleslabW00-Black" fontSize="3xl">
            Inbound
          </Heading>
          <Flex flexDir="column">
            {inbound.map(route => (
              <>
                <Flex
                  px="4"
                  py="3"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Flex fontSize="lg" gap={2} alignItems="center">
                    {/* {JSON.stringify(route, null, 2)} */}
                    <Box>
                      <Text fontSize="sm">{route.dep_iata}</Text>
                      <Text fontSize="md" fontWeight="bold">
                        {route.dep_time}
                      </Text>
                    </Box>
                    <ArrowSVG />
                    <Box>
                      <Text fontSize="sm">{route.arr_iata}</Text>
                      <Text fontSize="md" fontWeight="bold">
                        {route.arr_time}
                      </Text>
                    </Box>
                  </Flex>
                  <Box textAlign="center">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="whiteAlpha.600"
                    >
                      Business class
                    </Text>
                    <Text fontSize="md" fontWeight="semibold">
                      ${randPrice()}
                    </Text>
                  </Box>
                  <Box p="1">
                    <Box
                      as="img"
                      height="40px"
                      rounded="lg"
                      // src={`https://daisycon.io/images/airline/?height=150&iata=${out.airline_iata}`}
                      src="/Frame 1.png"
                      // src={`https://content.airhex.com/content/logos/airlines_${route.airline_iata}_350_100_r.png`}
                      // src={`https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/${out.airline_iata}.svg`}
                    />
                  </Box>
                </Flex>
                <Divider />
              </>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

function ArrowSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="feather feather-arrow-right"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

function SearchFlight({ isLoading, onSubmit, formRef }: any) {
  return (
    <>
      <Box
        bgImage="url(/bg.jpg)"
        w="100%"
        h="50vh"
        overflow="hidden"
        borderRadius="lg"
        backgroundSize="cover"
        bgPosition="center"
        mb="5"
      >
        <Heading
          w="100%"
          borderRadius="lg"
          px="8"
          py="6"
          backdropFilter="brightness(0.5)"
          h="100%"
          fontSize="5xl"
          mb={7}
          fontFamily="BattleslabW00-Black"
        >
          Search flights
        </Heading>
      </Box>
      <Box w="100%">
        <Box
          as="form"
          ref={formRef as any}
          onSubmit={onSubmit as any}
          gap={4}
          // placeItems="flex-end stretch"
          alignItems="flex-end"
          w="100%"
          rounded="lg"
          shadow="lg"
          // alignItems="center"
          minH="4vh"
          backdropFilter="blur(8px) brightness(0.8) "
          px={7}
          py={5}
          border="1px solid rgb(30 41 59/1)"
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
        >
          <Flex gridColumnStart={1} gridColumnEnd={3}>
            <FormControl>
              <FormLabel>Departure Airport</FormLabel>
              <Input
                h={12}
                border="none"
                borderRight="1px solid rgba(229, 231, 235, 0.2)"
                name="departure"
                bg="rgb(30 41 59/1)"
                shadow="md"
                type="text"
                required
                borderRadius="0.5rem 0 0 0.5rem"
                fontSize="md"
                defaultValue="DEL"
                px={6}
                _focus={{ border: 'none' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Arrival Airport</FormLabel>
              <Input
                h={12}
                name="arrival"
                bg="rgb(30 41 59/1)"
                shadow="md"
                border="none"
                defaultValue="BLR"
                type="text"
                required
                borderRadius="0 0.5rem 0.5rem 0"
                fontSize="md"
                // defaultValue={router.query.email || ''}
                px={6}
                _focus={{ border: 'none' }}
              />
            </FormControl>
          </Flex>
          <Flex>
            <FormControl>
              <FormLabel>Departing</FormLabel>
              <Input
                // bg="rgb(30 41 59/1)"
                h={12}
                name="departing"
                defaultValue="2022-10-16"
                borderRight="1px solid rgba(229, 231, 235, 0.2)"
                bg="rgb(30 41 59/1)"
                shadow="md"
                border="none"
                type="date"
                required
                borderRadius="0.5rem 0 0 0.5rem"
                // defaultValue={router.query.email || ''}
                px={6}
                _focus={{ border: 'none' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Returning</FormLabel>
              <Input
                // bg="rgb(30 41 59/1)"
                defaultValue="2022-10-20"
                h={12}
                name="returning"
                bg="rgb(30 41 59/1)"
                borderRadius="0 0.5rem 0.5rem 0"
                shadow="md"
                border="none"
                type="date"
                required
                // defaultValue={router.query.email || ''}
                px={6}
                _focus={{ border: 'none' }}
              />
            </FormControl>
          </Flex>

          <FormControl>
            <FormLabel>No. of passengers</FormLabel>
            <NumberInput defaultValue={2}>
              <NumberInputField
                h={12}
                name="passengers"
                bg="rgb(30 41 59/1)"
                shadow="md"
                border="none"
                required
                borderRadius="0.5rem"
                // defaultValue={router.query.email || ''}
                px={6}
                _focus={{ border: 'none' }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {/* <Input
                /> */}
          </FormControl>
          <FormControl>
            <FormLabel>Class</FormLabel>
            <Select
              h={12}
              name="class"
              bg="rgb(30 41 59/1)"
              shadow="md"
              border="none"
              required
              borderRadius="0.5rem"
              // defaultValue={router.query.email || ''}
              // _focus={{ border: 'none' }}
              // placeholder="Select Class"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </Select>
          </FormControl>
          <Button
            bg="rgb(14 165 233/1)"
            fontSize="md"
            _active={{
              bg: 'rgb(56 189 248/1)',
            }}
            _hover={{
              bg: 'rgb(56 189 248/1)',
            }}
            h={12}
            type="submit"
            rounded="lg"
            isLoading={isLoading}
          >
            Search
          </Button>
        </Box>
      </Box>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async ctx => {
//   const session = await unstable_getServerSession(ctx.req, ctx.res);

//   return {
//     props: {
//       session,
//     },
//   };
// };

function randPrice() {
  return Math.round(Math.random() * 200 + 200);
}
