import { defineStore } from "pinia";

export const useContextMenus = defineStore('contextMenus', {
  state: () => ({
    displayed: "",
    x: 0,
    y: 0
  }),
  actions: {
    display(type: string, $event: MouseEvent) {
      this.displayed = type;
      this.x = $event.clientX;
      this.y = $event.clientY;
    },
    hide() {
      this.displayed = '';
    }
  }
});