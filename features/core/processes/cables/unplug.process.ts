import type { Cable } from "../../data/Cable.type";
import type { SynthesizerMap } from "../../shared/SynthesizerMap.type";

export const unplug = (cable: Cable): SynthesizerMap => {
  return synthesizer => synthesizer
}