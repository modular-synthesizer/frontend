import { defineStore } from "pinia";
import Mod from "~~/lib/wrappers/Mod";

export const useContextMenu = defineStore('contxtMenu', {
  state: () => ({
    x: 0,
    y: 0,
    display: false,
    mod: null as unknown as Mod
  }),
  actions: {
    show($event: MouseEvent, mod: Mod) {
      this.x = $event.clientX;
      this.y = $event.clientY;
      this.display = true;
      this.mod = mod;
    },
    hide() {
      this.display = false;
    },
    disconnectLinks() {
      if (this.mod === null) return;

      for (let link of this.mod.links) {
        useLinksList().remove(link.id);
      }

      this.hide();
    },
    deleteModule() {
      this.disconnectLinks();
      useModulesList().remove(this.mod.id);
    }
  }
})