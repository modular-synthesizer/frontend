import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";

export const useSynthesizerDetails = defineStore('synthesizerDetail', {
  state: () =>({
    synthesizer: createEmptySynthesizer()
  }),
  actions: {
    async fetch(id: string): Promise<void> {
      this.synthesizer = await api.auth_get(`/synthesizers/${id}`)
    }
  }
})