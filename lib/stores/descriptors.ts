import { defineStore } from "pinia";
import { api } from "../api/Api";
import IParameter from "../interfaces/IParameter";

export const useDescriptors = defineStore('descriptors', {
  state: () => ({
    parameters: [] as IParameter[],
  }),
  actions: {
    fetchDescriptors() {
      const token: string = useAuthentication().session.token;
      api.get("/parameters", {auth_token: token})
        .then(parameters => {
          this.parameters = parameters.parameters;
        });
    }
  }
})