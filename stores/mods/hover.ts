import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";
import { SynthState as S, useStates } from "../synthesizers/states";

interface Payload {
  current: Mod | null;
  next: Mod | null;
  blocked: boolean;
}

export const useModHover = defineStore("moduleHover", {
  state(): Payload {
    return { current: null, next: null, blocked: false };
  },
  actions: {
    mouseenter(mod: Mod) {
      useStates().setState(S.HOVERING_MODULE);
      this.next = mod;
      this.update();
    },
    mouseleave() {
      this.update();
    },
    update() {
      if(this.blocked) return;
      if (useStates().among(S.HOVERING_MODULE, S.NONE)) {
        this.current = this.next;
        this.next = null;
      }
    },
    block() {
      this.blocked = true;
    },
    unblock() {
      this.blocked = false;
    }
  }
});