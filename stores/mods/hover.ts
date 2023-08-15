import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";

interface Payload {
  hovered: Mod | null;
  blocked: Boolean;
  shouldBeReleased: Boolean;
}

export const useModHover = defineStore("moduleHover", {
  state(): Payload {
    return {
      hovered: null,
      blocked: false,
      // Indicates that after the drag end, the hover highlight should be removed.
      shouldBeReleased: false,
    };
  },
  actions: {
    mouseenter(mod: Mod) {
      this.shouldBeReleased = mod.id !== useModDrag().mod?.id;
      if (this.blocked) return;
      this.hovered = mod;
    },
    mouseleave() {
      this.shouldBeReleased = this.hovered?.id === useModDrag().mod?.id;
      if (this.blocked) return;
      this.hovered = null;
    },
    blockHover() {
      this.blocked = true;
    },
    unblockHover() {
      this.blocked = false;
    },
    syncFlags() {
      if (this.shouldBeReleased) this.hovered = null;
      this.unblockHover();
    }
  }
});