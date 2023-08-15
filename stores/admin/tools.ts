import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import ITool from "~~/lib/interfaces/ITool";

export const useToolsList = defineStore('toolsList', {
  state: () =>({
    tools: [] as ITool[],
  }),
  actions: {
    async fetchTools() {
      this.tools = await api.auth_get("/tools")
    },
    addTool(tool: ITool) {
      this.tools.push(tool)
    }
  }
})