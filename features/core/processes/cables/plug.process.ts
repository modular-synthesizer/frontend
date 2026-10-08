import type { Port } from "../../data/Control.type";
import type { SynthesizerMap } from "../../shared/SynthesizerMap.type";

/**
 * Creates the cable and plugs both origin and destination nodes to allow the signal to be
 * forwarded from a module to another. It immediatly plugs both audio nodes so if the origin
 * module emits a signal, and the destination module outputs it, it's instantly updated.
 * 
 * @param origin The origin port from which the signal will be emitted.
 * @param destination The destination port where the signal will go.
 * 
 * @return a function that can transform a synthesizer into another synthesizer with one more cable.
 */
export const plug = (origin: Port, destination: Port): SynthesizerMap => {
  return synthesizer => synthesizer
}    