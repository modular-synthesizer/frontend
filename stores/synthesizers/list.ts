import { defineStore } from 'pinia'
import { api } from '~~/lib/api/Api'
import ISynthesizer from '~~/lib/interfaces/ISynthesizer'

export const useSynthesizersList = defineStore('synthesizersList', {
  state: () => ({
    synthesizers: [] as ISynthesizer[],
  }),
  actions: {
    async fetch(): Promise<void> {
      this.synthesizers = await api.auth_get("/synthesizers");
    },
    async create(payload: ISynthesizer) {
      const creation: ISynthesizer = await api.auth_post('/synthesizers', payload);
      this.synthesizers.push(creation);
    }
  },
})