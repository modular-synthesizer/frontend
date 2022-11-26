import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IModule from "~~/lib/interfaces/IModule";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import Mod from "~~/lib/wrappers/Mod";
import { useAuthentication } from "../authentication";

export const useModulesList = defineStore("modulesList", {
  state: () => ({
    mods: [] as Mod[],
  }),
  actions: {
    async fetchModules(synthesizer: Synthesizer) {
      this.mods = [];
      const payload = {
        auth_token: useAuthentication().session.token,
        synthesizer_id: synthesizer.id
      }
      const modules = await api.get("/modules", payload)
      modules.forEach((imod: IModule) => {
        const instance: Mod = new Mod(imod)
        this.mods.push(instance);
        synthesizer.place(imod.rack, imod.slot, instance);
      });
    }
  }
})