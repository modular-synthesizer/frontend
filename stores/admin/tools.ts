import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ITool from "~~/lib/interfaces/ITool";

export const useToolsList = defineStore('toolsList', {
  state: () =>({
    tools: [] as ITool[],
  }),
  actions: {
    fetchTools() {
      const auth = useAuthentication();
      return api.get("/tools", {auth_token: auth.session.token})
        .then(response => this.tools = response);
    },
    addTool(tool: ITool) {
      this.tools.push(tool)
    }
  }
})