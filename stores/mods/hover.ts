import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";
import { SynthState, useStates } from "../synthesizers/states";

interface Payload {
  current: Mod | null;
  next: Mod | null;
}

const { NONE, HOVERING_MODULE } = SynthState;

export const useModHover = defineStore("moduleHover", {
  state(): Payload {
    return { current: null, next: null };
  },
  actions: {
    mouseenter(mod: Mod) {
      useStates().setState(HOVERING_MODULE);
      this.next = mod;
      this.update();
    },
    mouseleave() {
      useStates().setState(NONE);
      this.update();
    },
    update() {
      if (useStates().among(HOVERING_MODULE, NONE)) {
        this.current = this.next;
        this.next = null;
      }
    },
  }
});