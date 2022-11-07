import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { useAuthentication } from "../authentication";

export const useGenerators = defineStore('generators', {
  state: () => ({
    generators: [] as string[]
  }),
  actions: {
    fetchGenerators() {
      const auth = useAuthentication();
      return api.get("/generators", {auth_token: auth.session.token})
        .then(response => this.generators = response);
    }
  }
})