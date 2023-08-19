import { defineStore } from "pinia";
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

      for(let channel of this.mod.channels) {
        for (let link of channel.links) {
          useLinksList().delete(link.id as string);
        }
      }
      useContextMenus().hide();
    },
    deleteModule() {
      this.disconnectLinks();
      useModulesList().remove(this.mod.id);
      useContextMenus().hide();
    }
  }
})