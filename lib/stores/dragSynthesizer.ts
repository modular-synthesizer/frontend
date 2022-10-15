import { defineStore } from "pinia";
import Synthesizer from "../wrappers/Synthesizer";
import { useLoginStore } from "./login";
import { api } from '~~/lib/api/Api'

/**
 * This store is dedicated to node dragging and dropping, saving the currently moved
 * node, modifying its coordinates when moving, and correctly ending the drag.
 */
export const useSynthesizerDrag = defineStore("dragSynthesizer", {
  state: () => ({
    synthesizer: null as Synthesizer,
    coords: {
      x: 0,
      y: 0
    }
  }),
  actions: {
    start(synthesizer: Synthesizer, x: number, y: number) {
      this.synthesizer = synthesizer;
      this.coords.x = x;
      this.coords.y = y;
    },
    move(x: number, y: number) {
      if (this.synthesizer === null) return;

      this.synthesizer.x += x - this.coords.x;
      this.synthesizer.y += y - this.coords.y;
      this.coords.x = x;
      this.coords.y = y;
    },
    end() {
      if (this.synthesizer === null) return;

      const loginStore = useLoginStore();
      const payload: any = {
        x: this.synthesizer.x,
        y: this.synthesizer.y,
        auth_token: loginStore.token
      };
      api.put(`/synthesizers/${this.synthesizer.id}`, payload)
        .then(() => this.synthesizer = null as Synthesizer);
    }
  }
})