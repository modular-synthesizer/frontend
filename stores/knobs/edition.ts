import { defineStore } from "pinia";

export const useKnobEdition = defineStore('knobEdition', {
  state: () => ({
    overlay: false
  }),
  actions: {
    toggleOverlay() {
      this.overlay = !this.overlay
    }
  }
});