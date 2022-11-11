import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ITool from "~~/lib/interfaces/ITool";
import { useAuthentication } from '../authentication'

export const useToolsList = defineStore('toolsList', {
  state: () =>({
    tools: {} as {[key: string]: ITool[]}
  }),
  actions: {
    fetchTools() {
      const auth = useAuthentication();
      return api.get("/tools", {auth_token: auth.session.token})
        .then(response => this.tools = response);
    }
  }
})