import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ISynthesizer from "~~/lib/interfaces/ISynthesizer";
import { managers } from "~~/lib/managers";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

export const useSynthesizerDetails = defineStore('synthesizerDetail', {
  state: () =>({
    synthesizer: new Synthesizer(createEmptySynthesizer()),
  }),
  actions: {
    async fetch(id: string): Promise<void> {
      const results: ISynthesizer = await api.auth_get(`/synthesizers/${id}`);
      managers.keyboard.setSynthesizer(results);
      managers.midi.setSynthesizer(results);
      this.synthesizer = new Synthesizer(results);
    },
    reset() {
      this.synthesizer = new Synthesizer(createEmptySynthesizer())
    }
  }
})