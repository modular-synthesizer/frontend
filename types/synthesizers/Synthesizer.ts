import type { Identified } from "../utils/Identified";
import type { AudioModule } from "../modules/AudioModule";
import type { Membership } from "./Membership";

export type Synthesizer = Identified & {
  members: Array<Membership>,
  name: string;
  x: number;
  y: number;
  scale: number;
  voices: number;
  modules: Array<AudioModule>;
}