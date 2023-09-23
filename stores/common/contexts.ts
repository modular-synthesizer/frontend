import { defineStore } from "pinia";

export interface ContextItem {
  label: string;
  action?: (payload: any) => void;
  url?: string;
}

export interface ContextOptions {
  payload?: any;
  items: ContextItem[]
}

export const useContexts = defineStore('contexts', {
  state:  () => ({
    x: 0,
    y: 0,
    visible: false,
    items: [] as any[],
    payload: null as any,
  }),
  actions: {
    display($event: MouseEvent, options: ContextOptions) {
      useStates().setState(SynthState.DISPLAYING_CONTEXT);
      this.x = $event.clientX;
      this.y = $event.clientY;
      this.items = options.items;
      this.payload = options.payload;
      this.visible = true;
    },
    hide(unblock = false) {
      if (unblock) useStates().unblock();
      this.visible = false;
    }
  }
})