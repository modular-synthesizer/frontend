import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "~~/lib/utils/constants";
import { useSynthesizerDetails } from "./details";

export const useZoomStore = defineStore('zoom', {
  getters: {
    synth() {
      return useSynthesizerDetails().synthesizer;
    }
  },
  actions: {
    setScale(delta: number) {
      let scale: number = Math.abs(this.synth.scale + delta * -ZOOM_RATIO);
      this.synth.scale = Math.min(Math.max(MAX_ZOOM_OUT, scale), MAX_ZOOM_IN);

      return api.auth_put(`/synthesizers/${this.synth.id}`, { scale });
    }
  }
})