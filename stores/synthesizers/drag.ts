import { defineStore } from "pinia";
import ICoordinates from '~~/lib/interfaces/ICoordinates'
import { api } from "~~/lib/api/Api";
import { useSynthesizerDetails } from "./details";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

export const useSynthesizerDrag = defineStore('synthesizerDrag', {
  state: () => ({
    dragging: false,
    // The current coordinates where the cursor is moved on the screen.
    coords: { x: 0, y: 0 } as ICoordinates
  }),
  getters: {
    synth(): Synthesizer {
      return useSynthesizerDetails().synthesizer as Synthesizer;
    }
  },
  actions: {
    dragstart(x: number, y: number) {
      useContextMenus().hide()
      this.dragging = true;
      this.coords.x = x;
      this.coords.y = y;
    },
    dragmove(x: number, y: number) {
      if (!this.dragging) return;

      this.synth.x += x - this.coords.x;
      this.synth.y += y - this.coords.y;
      this.coords.x = x;
      this.coords.y = y;
    },
    dragend() {
      if (!this.dragging) return;
      api.auth_put(`/synthesizers/${this.synth.id}`, this.synth.coordinates);
      this.dragging = false;
    },
    reset() {
      useContexts().hide();
      this.dragging = true;
      this.synth.x = 0;
      this.synth.y = 0;
      this.dragend();
    }
  }
})