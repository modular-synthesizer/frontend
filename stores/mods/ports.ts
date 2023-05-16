import { defineStore } from "pinia";
import Port from "~~/lib/wrappers/Port";

export const usePorts = defineStore('portsList', {
  state: () =>({
    ports: [] as Port[]
  }),
  actions: {
    addPorts(ports: Port[]) {
      ports.forEach(port => this.ports.push(port));
    },
    reset() {
      this.ports = [];
    }
  }
})