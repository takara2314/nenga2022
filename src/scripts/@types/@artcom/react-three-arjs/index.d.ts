declare module '@artcom/react-three-arjs' {
  interface ARCanvasProps {
    camera?: {
      position: number[]
    },
    cameraParametersUrl?: string,
    dpr?: number,
    onCreated?: (args: { [gl: string]: THREE.WebGLRenderer }) => void
  }
  export const ARCanvas: React.ComponentType<ARCanvasProps>;

  interface ARMarkerProps {
    type?: string,
    patternUrl?: string
  }
  export const ARMarker: React.ComponentType<ARMarkerProps>;
}
