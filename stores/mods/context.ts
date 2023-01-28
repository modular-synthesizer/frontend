import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";

export const useModuleMenu = defineStore('moduleMenu', {
  state: () => ({
    mod: null as unknown as Mod
  }),
  actions: {
    show(mod: Mod, $event: MouseEvent) {
      useContextMenus().display("modules", $event);
      this.mod = mod;
    },
    disconnectLinks() {
      if (this.mod === null) return;

      for (let link of this.mod.links) {
        useLinksList().delete(link.id as string);
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