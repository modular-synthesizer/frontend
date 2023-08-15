import { Store, defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";
import { SynthState, useStates } from "../synthesizers/states";

interface Payload {
  hovered: Mod | null;
}

const { NONE, HOVERING_MODULE } = SynthState;

export const useModHover = defineStore("moduleHover", {
  state(): Payload {
    return { hovered: null };
  },
  actions: {
    mouseenter(mod: Mod) {
      if (useStates().isNot(NONE)) return;
      useStates().setState(HOVERING_MODULE);
      this.hovered = mod;
    },
    mouseleave() {
      if (useStates().notAmong(NONE, HOVERING_MODULE)) return;
      useStates().setState(NONE);
      this.hovered = null;
    },
  }
});