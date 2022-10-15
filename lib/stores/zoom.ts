import axios from "axios";
import { defineStore } from "pinia";
import { api } from "../api/Api";
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "../utils/constants";
import Synthesizer from "../wrappers/Synthesizer";
import { useLoginStore } from "./login";

export const useZoomStore = defineStore('zoom', {
  state() {
    return {
      synthesizer: null as Synthesizer
    }
  },
  actions: {
    setSynthesizer(synthesizer: Synthesizer) {
      this.synthesizer = synthesizer;
    },
    setScale(delta: number) {
      if (this.synthesizer === null) return;

      const loginStore = useLoginStore();

      let scale: number = this.synthesizer.scale + delta * -ZOOM_RATIO;
      scale = Math.min(Math.max(MAX_ZOOM_OUT, Math.abs(scale)), MAX_ZOOM_IN);

      const payload = {
        scale: scale,
        auth_token: loginStore.token
      };
      return api.put(`/synthesizers/${this.synthesizer.id}`, payload).then(() => {
        this.synthesizer.scale = scale;
      })
    }
  }
})