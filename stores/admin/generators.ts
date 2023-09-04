import axios from "axios";
import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { IGenerator } from "~~/lib/interfaces/IGenerator";

export const useGenerators = defineStore('generators', {
  state: () => ({
    generators: [] as IGenerator[],
  }),
  actions: {
    async fetchGenerators() {
      
      this.generators = await api.auth_get('/generators');
      this.generators.push({
        id: "anyway",
        name: "envelope",
        code: 'return new AudioWorkletNode( useAudioContext().context, "envelope" );'
      })
    },
    add(generator: IGenerator) {
      this.generators.push(generator);
    }
  }
})