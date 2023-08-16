import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "~~/lib/utils/constants";
import { useSynthesizerDetails } from "./details";

interface Payload {
  timeout: number | null;
  zooming: boolean;
}

export const useZoomStore = defineStore('zoom', {
  state(): Payload {
    return {
      timeout: null,
      zooming: false,
    };
  },
  getters: {
    synth() {
      return useSynthesizerDetails().synthesizer;
    }
  },
  actions: {
    setScale(delta: number) {
      useStates().setState(SynthState.ZOOMING);
      let scale: number = Math.abs(this.synth.scale + delta * -ZOOM_RATIO);
      this.synth.scale = Math.min(Math.max(MAX_ZOOM_OUT, scale), MAX_ZOOM_IN);

      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }
      useStates().unblock();
      this.timeout = setTimeout(() => {
        api.auth_put(`/synthesizers/${this.synth.id}`, { scale });
      }, 500);
    }
  }
})