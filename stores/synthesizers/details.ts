import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ISynthesizer from "~~/lib/interfaces/ISynthesizer";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

export const useSynthesizerDetails = defineStore('synthesizerDetail', {
  state: () =>({
    synthesizer: new Synthesizer(createEmptySynthesizer()),
  }),
  actions: {
    async fetch(id: string): Promise<void> {
      const results: ISynthesizer = await api.auth_get(`/synthesizers/${id}`);
      this.synthesizer = new Synthesizer(results);
    }
  }
})