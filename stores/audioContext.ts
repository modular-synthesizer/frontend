import { defineStore } from "pinia";

export const useAudioContext = defineStore('audioContext', {
  state: () => ({
    context: null as AudioContext | null,
  }),
  actions: {
    async initContext() {
      this.context = await new AudioContext();
      await this.context.resume();
    }
  }
})