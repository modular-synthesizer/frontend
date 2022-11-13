import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import Port from "~~/lib/wrappers/Port";
import { useAuthentication } from "../authentication";
import { useSynthesizerDetails } from "../synthesizers/details";

export const useLinkDrag = defineStore('linkDrag', {
  state: () => ({
    startPort: null as Port,
  }),
  actions: {
    startLinkFrom(port: Port) {
      this.startPort = port;
    },
    cancelLink() {
      this.startPort = null;
    },
    endLinkTo(port: Port) {
      if (this.startPort === null) return;

      const auth_token: string = useAuthentication().session.token;
      const synthesizer: Synthesizer = useSynthesizerDetails().synthesizer;
      const payload = {
        auth_token,
        from: this.startPort.id,
        to: port.id,
        synthesizer_id: synthesizer.id,
        color: 'red'
      }
      api.post("/links", payload)
        .then(response => console.log(response));

      this.startPort = null;
    }
  }
})