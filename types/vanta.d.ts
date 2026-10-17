// Vanta ships UMD bundles without type definitions. This covers the one
// effect we use and only the options we pass.
declare module "vanta/dist/vanta.net.min" {
  export interface VantaEffect {
    destroy(): void;
    resize(): void;
    setOptions(options: Record<string, unknown>): void;
  }

  export interface VantaNetOptions {
    el: HTMLElement;
    THREE: unknown;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    points?: number;
    maxDistance?: number;
    spacing?: number;
    showDots?: boolean;
  }

  const NET: (options: VantaNetOptions) => VantaEffect;
  export default NET;
}

// three.js is only handed to Vanta, never used directly, so it is typed as an
// opaque module instead of pulling in @types/three for r134.
declare module "three";
