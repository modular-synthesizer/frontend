import type { Identified } from "./utils/Identified";

/**
 * A generator encapsulates a function used to instanciate audio nodes
 */
export type Generator = Identified & {
  // The name of the generator, used to display it in the interface.
  name: string;
  // The code of the generator, evaluated at runtime when creating it.
  code: string;
}