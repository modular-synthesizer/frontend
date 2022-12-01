import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { useAuthentication } from "../authentication";

export const useGenerators = defineStore('generators', {
  state: () => ({
    generators: [] as string[],
    scripts: {} as {[key: string]: any}
  }),
  actions: {
    async fetchGenerators() {
      const auth = useAuthentication();
      const generators = await api.get('/generators', {auth_token: auth.session.token});
      this.generators = generators;
    },
    async fetchScripts() {
      const auth = useAuthentication();
      await this.fetchGenerators();
      const results = await Promise.all(
        this.generators.map(generator => {
          return new Promise(async (resolve, _reject) => {
            const res = await api.get(`/generators/${generator}`, {auth_token: auth.session.token})
            resolve([generator, Function('name', 'context', res)])
          })
        })
      )
      this.scripts = Object.fromEntries(results);
    },
    createGenerator(name: string, code: string) {
      const payload = { name, code, auth_token: useAuthentication().session.token }
      api.post('/generators', payload).then(() => this.addGenerator(name));
    },
    addGenerator(name: string) {
      this.generators.push(name);
      api.get(`/generators/${name}`, {auth_token: useAuthentication().session.token})
        .then(results => this.scripts[name] = Function('name', 'context', results.code));
    },
  }
})