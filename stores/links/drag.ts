import { defineStore } from "pinia";
import { api } from "~~/lib/api/Api";
import Link from "~~/lib/wrappers/Link";
import Port from "~~/lib/wrappers/Port";

export const useLinkDrag = defineStore('linkDrag', {
  state: () => ({
    start: null as Port|null,
    coords: {x: 0, y: 0},
    magnet: null as Port|null,
  }),
  getters: {
    synth() {
      return useSynthesizerDetails().synthesizer
    }
  },
  actions: {
    dragstart(port: Port, $event: MouseEvent) {
      this.start = port;
      this.dragmove($event.clientX, $event.clientY);
    },
    dragcancel() {
      this.start = null;
    },
    dragmove(x: number, y: number) {
      if (this.start === null) return;
      this.coords.x = x;
      this.coords.y = y;
    },
    dragend(): void {
      console.info("dragend")
      if (this.start === null || this.magnet === null) return this.dragcancel();
      
      console.info("both ports are connectable");
      const found: boolean = useLinksList().links.find(link => {
        return (
          (link.from.id == this.start?.id && link.to.id == this.magnet?.id) ||
          (link.from.id == this.magnet?.id && link.to.id == this.start?.id)
        );
      }) !== undefined;

      if (found) return;

      const payload = {
        from: this.magnet.isInput() ? this.start.id : this.magnet.id,
        to: this.magnet.isInput() ? this.magnet.id : this.start.id,
        synthesizer_id: this.synth.id,
        color: 'red'
      }
      api.auth_post("/links", payload)
        .then(response => {
          useLinksList().add(new Link(response));
        });

      this.start = null;
    },
    magnetize(port: Port) {
      if (
        this.start === null ||
        this.start.id === port.id ||
        this.start.isInput === port.isInput) return;
      this.magnet = port;
    },
    unmagnetize() {
      this.magnet = null;
    }
  }
})