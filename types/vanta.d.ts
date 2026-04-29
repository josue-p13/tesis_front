/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "vanta/dist/vanta.fog.min" {
  interface VantaEffect {
    destroy: () => void;
  }
  const fog: (options: any) => VantaEffect;
  export default fog;
}
