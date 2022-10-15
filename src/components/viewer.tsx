import {} from '@tanstack/react-query';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box } from '@chakra-ui/react';
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

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyNDBiYTUyNC1kZjI5LTRiNDQtYTZmZi0xZGM1OTE3Y2ZiYTQiLCJpZCI6MTA5ODE5LCJpYXQiOjE2NjQ1OTQ4Njd9.6EaeFnjcD1xLCaqi8MdlinlBrGzZLu2Wfl4LJvgnZtg';

// function createModel(position, viewer: Cesium.Viewer, url: string, height: number) {
//   viewer.entities.removeAll();

//   const heading = Cesium.Math.toRadians(135);
//   const pitch = 0;
//   const roll = 0;
//   const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
//   const orientation = Cesium.Transforms.headingPitchRollQuaternion(
//     position,
//     hpr
//   );

//   const entity = viewer.entities.add({
//     name: url,
//     position: position,
//     orientation: orientation as any,
//     model: {
//       uri: url,
//       minimumPixelSize: 128,
//       maximumScale: 20000,
//     },
//   });
//   viewer.trackedEntity = entity;
// }

const p = (t: number) =>
  Cesium.Cartesian3.fromDegrees(
    -123.0744619 + t * 0.0025,
    44.0503706 + t * 0.005,
    1000
  );

type FlightViewerProps = {
  arrivalCoords: [lat: number, long: number];
  departureCoords: [lat: number, long: number];
  duration: number;
};

export function FlightViewer(props: FlightViewerProps) {
  const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
  const [position, setPosition] = useState<Cesium.SampledPositionProperty>();
  const flightRef = useRef<CesiumComponentRef<Cesium.Entity>>(null);

  const heading = useMemo(() => Cesium.Math.toRadians(90), []);
  const pitch = 0;
  const roll = 0;
  const hpr = useMemo(
    () => new Cesium.HeadingPitchRoll(heading, pitch, roll),
    [heading]
  );
  const orientation = useMemo(
    () =>
      Cesium.Transforms.headingPitchRollQuaternion(
        Cesium.Cartesian3.fromDegrees(
          props.departureCoords[1],
          props.departureCoords[0],
          1000
        ),
        hpr
      ),
    []
  );

  useEffect(() => {
    const totalSeconds = props.duration * 60;

    const start = JulianDate.fromDate(new Date());
    const stop = JulianDate.addSeconds(start, totalSeconds, new JulianDate());

    const position = new Cesium.SampledPositionProperty();

    position.addSample(
      JulianDate.addSeconds(start, 0, new JulianDate()),
      Cesium.Cartesian3.fromDegrees(
        props.departureCoords[1],
        props.departureCoords[0],
        1000
      )
    );
    position.addSample(
      JulianDate.addSeconds(start, props.duration, new JulianDate()),
      Cesium.Cartesian3.fromDegrees(
        props.arrivalCoords[1],
        props.arrivalCoords[0],
        1000
      )
    );

    setPosition(position);

    if (viewerRef.current?.cesiumElement) {
      viewerRef.current.cesiumElement.scene.skyAtmosphere =
        new Cesium.SkyAtmosphere();
      viewerRef.current.cesiumElement.scene.globe.enableLighting = true;
      viewerRef.current.cesiumElement.clock.startTime = start.clone();
      viewerRef.current.cesiumElement.clock.stopTime = stop.clone();
      viewerRef.current.cesiumElement.clock.currentTime = start.clone();
      viewerRef.current.cesiumElement.timeline.zoomTo(start, stop);
      viewerRef.current.cesiumElement.clock.multiplier = 0.23;
      // viewerRef.current.cesiumElement.clock.clockRange = ClockRange.LOOP_STOP;
      viewerRef.current.cesiumElement.clock.tick();

      if (flightRef.current?.cesiumElement) {
        console.log('tracking');
        viewerRef.current.cesiumElement.trackedEntity =
          flightRef.current.cesiumElement;
      }
    }
  }, []);

  return (
    <Viewer
      infoBox={false}
      shadows
      full
      shouldAnimate
      ref={viewerRef}
      style={{
        position: 'relative',
        height: '100vh',
      }}
    >
      <CloudCollection show />
      <Entity
        name="flight"
        position={position}
        orientation={orientation as any}
        model={{
          uri: '/scene.gltf',
          minimumPixelSize: 128,
          maximumScale: 20000,
        }}
        ref={flightRef}
        path={{
          leadTime: new Cesium.ConstantProperty(36000),
          trailTime: new Cesium.ConstantProperty(3600),
          width: 6,
          resolution: 100,
          material: new PolylineGlowMaterialProperty({
            glowPower: 0.1,
            color: Cesium.Color.DARKGRAY,
            taperPower: 1,
          }),
        }}
      />
      <Fog enabled minimumBrightness={0.4} />
    </Viewer>
  );
}
