import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import IModule from "~~/lib/interfaces/IModule";
import Mod from "~~/lib/wrappers/Mod";
import { find, remove } from 'lodash'
import Link from "~~/lib/wrappers/Link";

export const useModulesList = defineStore('modulesList', {
  state: () => ({
    modules: [] as Mod[],
  }),
  actions: {
    /**
     * Fetches the modules of a synthesizer and puts them in an accessible list.
     * @param synthesizer_id the unique UUID of the synthesizer to fetch the modules from.
     */
    async fetch(synthesizer_id: string) {
      this.modules = [];
      const response: IModule[] = await api.auth_get('/modules', { synthesizer_id });
      this.modules = response.map((imod: IModule) => new Mod(imod));
    },
    async remove(id: string) {
      await api.auth_delete(`/modules/${id}`);
      this.disconnect(find(this.modules, { id }));
      remove(this.modules, { id });
    },
    disconnect(mod: Mod) {
      mod.links.forEach((link: Link) => {
        useLinksList().remove(link.id);
      })
    }
  },
})