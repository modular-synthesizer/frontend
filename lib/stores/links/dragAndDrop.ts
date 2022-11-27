import { findDir } from "@vue/compiler-core";
import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import Link from "~~/lib/wrappers/Link";
import Port from "~~/lib/wrappers/Port";
import Synthesizer from "~~/lib/wrappers/Synthesizer";
import { useAuthentication } from "../authentication";
import { useContextMenu } from "../mods/context";
import { useSynthesizerDetails } from "../synthesizers/details";
import { useLinksList } from "./linksList";

export const useLinkDrag = defineStore('linkDrag', {
  state: () => ({
    startPort: null as Port,
    dragCoordinates: {x: 0, y: 0},
    magnet: null as Port,
  }),
  actions: {
    startLinkFrom(port: Port) {
      useContextMenu().hide();
      this.startPort = port;
    },
    cancelLink() {
      this.startPort = null;
    },
    moveLink(x: number, y: number) {
      this.dragCoordinates.x = x;
      this.dragCoordinates.y = y;
    },
    endLinkTo(port: Port) {
      if (this.startPort === null) return;
      if (this.startPort.id === port.id) this.cancelLink();
      
      const found: boolean = useLinksList().links.find(link => {
        return (
          (link.from.id == this.startPort.id && link.to.id == port.id) ||
          (link.from.id == port.id && link.to.id == this.startPort.id)
        );
      }) !== undefined;

      if (found) return;

      const auth_token: string = useAuthentication().session.token;
      const synthesizer: Synthesizer = useSynthesizerDetails().synthesizer;
      const payload = {
        auth_token,
        from: port.isInput() ? this.startPort.id : port.id,
        to: port.isInput() ? port.id : this.startPort.id,
        synthesizer_id: synthesizer.id,
        color: 'red'
      }
      api.post("/links", payload)
        .then(response => {
          useLinksList().addLink(response);
        });

      this.startPort = null;
    },
    magnetize(port: Port) {
      if (!this.startPort || this.startPort.id === port.id) return;
      this.magnet = port;
    },
    unmagnetize() {
      this.magnet = null;
    }
  }
})