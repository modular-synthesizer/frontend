import { defineStore } from "pinia";

export const useAudioContext = defineStore('audioContext', {
  state: () => ({
    context: null as AudioContext,
  }),
  actions: {
    async initContext() {
      this.context = await new AudioContext();
    }
  }
})