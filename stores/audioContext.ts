import { defineStore } from "pinia";

export const useAudioContext = defineStore('audioContext', {
  state: () => ({
    context: null as AudioContext | null,
  }),
  actions: {
    async initContext() {
      console.info("passage dans l'initialisation du contexte audio")
      this.context = await new AudioContext();
      console.info(this.context.state);
      await this.context.resume();
    }
  }
})