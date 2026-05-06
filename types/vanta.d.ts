/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "vanta/dist/vanta.clouds.min" {
  interface VantaEffect {
    destroy: () => void;
  }
  const clouds: (options: any) => VantaEffect;
  export default clouds;
}
