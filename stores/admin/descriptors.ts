import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IParameter from "~~/lib/interfaces/IParameter";

export const useDescriptors = defineStore('descriptors', {
  state: () => ({
    parameters: [] as IParameter[],
  }),
  actions: {
    fetchDescriptors() {
      const token: string = useAuthentication().session.token;
      return api.get("/parameters", {auth_token: token})
        .then(parameters => {
          this.parameters = parameters.parameters;
        });
    }
  }
})