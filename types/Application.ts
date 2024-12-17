import type { Identified } from "./utils/Identified";

export type Application = Identified & {
  name: string;
}