import {} from '@tanstack/react-query';
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
  Button,
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
import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { Seating } from '../components/seating';
import Layout from '../components/layout';

export default function Home() {
  return (
    <Layout>
      <Flex w="100%" py="2vh" flexDir="column" alignItems="center" px="2vw">
        <Box maxW="1200px" w="100%">
          <Box
            as="img"
            src="/flight.jpg"
            w="100%"
            h="45vh"
            borderRadius="lg"
            objectFit="cover"
            objectPosition="center"
            filter="brightness(0.6)"
            mb="5"
          />
          <Box w="100%">
            <Box
              gap={4}
              placeItems="flex-end stretch"
              w="100%"
              rounded="lg"
              shadow="lg"
              alignItems="center"
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
                    // defaultValue={router.query.text || ''}
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
                    name="email"
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
                    h={12}
                    name="email"
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
                <NumberInput>
                  <NumberInputField
                    h={12}
                    name="email"
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
                  name="email"
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
              >
                Search
              </Button>
            </Box>
          </Box>
        </Box>
      </Flex>
    </Layout>
  );
}
