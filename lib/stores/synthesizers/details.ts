import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import { useAuthentication } from "../authentication";

export const useSynthesizerDetails = defineStore('synthesizerDetails', {
  state: () => ({
    synthesizer: null as unknown as Synthesizer,
  }),
  actions: {
    fetchSynthesizer(id: string) {
      const token = useAuthentication().session.token;
      api.get(`/synthesizers/${id}`, { auth_token: token })
        .then(response => {
          this.synthesizer = new Synthesizer(response);
        });
    }
  },
});