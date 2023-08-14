import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";

interface Payload {
  hovered: Mod | null;
}

export const useModHover = defineStore("moduleHover", {
  state(): Payload {
    return {
      hovered: null,
    };
  },
  actions: {
    mouseenter(mod: Mod) {
      this.hovered = mod;
    },
    mouseleave() {
      this.hovered = null;
    }
  }
});