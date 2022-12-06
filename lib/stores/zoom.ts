import { defineStore } from "pinia";
import { api } from "../api/Api";
import { ZOOM_RATIO, MAX_ZOOM_OUT, MAX_ZOOM_IN } from "../utils/constants";

export const useZoomStore = defineStore('zoom', {
  actions: {
    setScale(delta: number) {
      const synthesizer = useSynthesizerDetails().synthesizer;
      if (synthesizer === null) return;

      const auth = useAuthentication();

      let scale: number = synthesizer.scale + delta * -ZOOM_RATIO;
      scale = Math.min(Math.max(MAX_ZOOM_OUT, Math.abs(scale)), MAX_ZOOM_IN);

      const payload = {
        scale: scale,
        auth_token: auth.session.token
      };
      return api.put(`/synthesizers/${synthesizer.id}`, payload).then(() => {
        synthesizer.scale = scale;
      })
    }
  }
})