import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { useAuthentication } from "../authentication";

export const useGenerators = defineStore('generators', {
  state: () => ({
    generators: [] as string[],
    scripts: {}
  }),
  actions: {
    async fetchGenerators() {
      const auth = useAuthentication();
      const generators = await api.get('/generators', {auth_token: auth.session.token});
      this.generators = generators;
    },
    async fetchScripts() {
      await this.fetchGenerators();
      const results = await Promise.all(
        this.generators.map(generator => {
          return new Promise(async (resolve, _reject) => {
            const res = await api.get(`/generators/${generator}`)
            resolve([generator, Function('name', 'context', res)])
          })
        })
      )
      this.scripts = Object.fromEntries(results);
    }
  }
})