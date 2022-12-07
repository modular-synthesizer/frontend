import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";

export const useLinkMenu = defineStore('moduleMenu', {
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
      useModulesList().disconnect(this.mod as Mod);
      useContextMenus().hide();
    },
    deleteModule() {
      if (this.mod === null) return;
      useModulesList().remove(this.mod.id);
      useContextMenus().hide();
    }
  }
})