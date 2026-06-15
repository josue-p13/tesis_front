/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "vanta/dist/vanta.clouds.min" {
  interface VantaEffect {
    destroy: () => void;
  }
  const clouds: (options: any) => VantaEffect;
  export default clouds;
}

declare module "vanta/dist/vanta.globe.min" {
  interface VantaEffect {
    destroy: () => void;
    setOptions: (options: any) => void;
  }
  const globe: (options: any) => VantaEffect;
  export default globe;
}
