import { map, uniqBy } from "lodash";
import { defineStore } from "pinia";
import Link from "~~/lib/wrappers/Link";
import Mod from "~~/lib/wrappers/Mod";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

export const useModuleMenu = defineStore('moduleMenu', {
  state: () => ({
    mod: null as unknown as Mod
  }),
  getters: {
    synth(): Synthesizer {
      return useSynthesizerDetails().synthesizer as Synthesizer;
    },
    username(): string {
      return useAuthentication().storedSession.username;
    }
  },
  actions: {
    show(mod: Mod, $event: MouseEvent) {
      if (this.synth.isReadonly(this.username)) return;
      useContextMenus().display("modules", $event);
      this.mod = mod;
    },
    disconnectLinks() {
      if (this.mod === null) return;
      
      const allLinks: Link[] = map(this.mod.ports, "links").flat() as Link[];
      const uniqLinks: Link[] = uniqBy(allLinks, 'id');
      uniqLinks.forEach((link: Link) => useLinksList().remove(link.id));
      useContextMenus().hide();
    },
    deleteModule() {
      this.disconnectLinks();
      useModulesList().remove(this.mod.id);
      useContextMenus().hide();
    }
  }
})