import { defineStore } from "pinia";

export const useKeyboard = defineStore('keyboard', {
  state: () => ({
    shift: false,
  }),
  actions: {
    shiftOn() {
      if (this.shift) return;
      this.shift = true;
    },
    shiftOff() {
      this.shift = false;
    }
  }
});