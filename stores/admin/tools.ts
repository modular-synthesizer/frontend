import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ITool from "~~/lib/interfaces/ITool";

export const useToolsList = defineStore('toolsList', {
  state: () =>({
    tools: {} as {[key: string]: ITool[]}
  }),
  actions: {
    fetchTools() {
      const auth = useAuthentication();
      return api.get("/tools", {auth_token: auth.session.token})
        .then(response => this.tools = response);
    },
    addTool(key: string, tool: ITool) {
      this.tools[key] = [ ...this.tools[key], tool ]
    }
  }
})