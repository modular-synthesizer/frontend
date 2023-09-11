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
    },
    add(generator: IGenerator) {
      this.generators.push(generator);
    }
  }
})