import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IModule from "~~/lib/interfaces/IModule";
import Mod from "~~/lib/wrappers/Mod";
import { remove } from 'lodash'
import Link from "~~/lib/wrappers/Link";
import ModulesFactory from "~~/lib/factories/ModulesFactory";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import { useModulesLinks } from "./links";
import { IGenerator } from "~~/lib/interfaces/IGenerator";

export const useModulesList = defineStore('modulesList', {
  state: () => ({
    modules: [] as Mod[],
  }),
  getters: {
    synth(): Synthesizer {
      return useSynthesizer().synthesizer.value
    }
  },
  actions: {
    /**
     * Fetches the modules of a synthesizer and puts them in an accessible list.
     * @param synthesizer_id the unique UUID of the synthesizer to fetch the modules from.
     */
    async fetch(synthesizer_id: string) {
      this.modules = [];
      const response: IModule[] = await api.auth_get('/modules', { synthesizer_id });
      const generators: IGenerator[] = await api.auth_get("/generators");
      const mods: Mod[] = await Promise.all(response.map((imod: IModule) => {
        return ModulesFactory.build(imod as unknown as IModule, this.synth, generators);
      }))
      mods.forEach((mod: Mod) => {
        this.synth.place(mod.rack, mod.slot, mod)
        this.modules.push(mod);
      })
    },
    async remove(mod: Mod) {
      await api.auth_delete(`/modules/${mod.id}`);
      useModulesLinks().disconnect(mod);
      this.disconnect(mod);
      remove(this.modules, { id: mod.id });
    },
    disconnect(mod: Mod) {
      mod.connections.forEach((link: Link) => {
        useSynthesizer().removeLink(link.id);
      })
    },
    reset() {
      (this.modules as Mod[]).forEach((m: Mod) => m.stop());
      this.modules = [];
    }
  },
})