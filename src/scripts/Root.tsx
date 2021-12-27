import React from 'react';
import { ARCanvas, ARMarker } from '@artcom/react-three-arjs';
import Fiber from '@react-three/fiber';

import CameraParameter from '../parameters/camera.dat';
import HiroPattern from '../patterns/hiro.patt';

const Root = () => {
  return (
    <>
      <div className="text-green-800 font-bold text-3xl">
        こんにちは！
      </div>

      <ARCanvas
        camera={{ position: [0, 0, 0] }}
        cameraParametersUrl={CameraParameter}
        dpr={window.devicePixelRatio}
        onCreated={({ gl }) => {
          gl.setSize(window.innerWidth, window.innerHeight)
        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 0]} />
        <ARMarker
          type={"pattern"}
          patternUrl={HiroPattern}
        >
          <mesh>
            <boxBufferGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={"green"} />
          </mesh>
        </ARMarker>
      </ARCanvas>
    </>
  );
};

export default Root;
