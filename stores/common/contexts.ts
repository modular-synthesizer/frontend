import { defineStore } from "pinia";

export const useContexts = defineStore('contexts', {
  state:  () => ({
    x: 0, y: 0, visible: false, items: [] as any[]
  }),
  actions: {
    display($event: MouseEvent, items: any[]) {
      this.x = $event.clientX;
      this.y = $event.clientY;
      this.visible = true;
      this.items = items;
    },
    hide() {
      this.visible = false;
    }
  }
})