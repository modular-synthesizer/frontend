import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IModule from "~~/lib/interfaces/IModule";
import Mod from "~~/lib/wrappers/Mod";
import { find, remove } from 'lodash'
import Link from "~~/lib/wrappers/Link";
import ModulesFactory from "~~/lib/factories/ModulesFactory";

export const useModulesList = defineStore('modulesList', {
  state: () => ({
    modules: [] as Mod[],
  }),
  getters: {
    synth() {
      return useSynthesizerDetails().synthesizer
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
      for (let imod of response) {
        const mod: Mod = await ModulesFactory.build(imod as unknown as IModule);
        this.synth.place(mod.rack, mod.slot, mod)
        this.modules.push(mod);
      }
    },
    async remove(id: string) {
      await api.auth_delete(`/modules/${id}`);
      const mod: Mod = find(this.modules, { id }) as Mod;
      useSynthesizerDetails().synthesizer.remove(mod)
      this.disconnect(mod);
      remove(this.modules, { id });
    },
    disconnect(mod: Mod) {
      mod.connections.forEach((link: Link) => {
        useLinksList().delete(link.id);
      })
    },
    reset() {
      (this.modules as Mod[]).forEach((m: Mod) => m.stop());
      this.modules = [];
    }
  },
})