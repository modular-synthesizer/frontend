import type { PlacedModule } from "~/types/modules/AudioModule";
import Port from "~~/lib/wrappers/Port";

type State = { ports: Port[] }

const state: Ref<State> = ref({ ports: [] })

export function usePorts() {
  return {
    state,
    addPorts(ports: Port[]) {
      ports.forEach(port => state.value.ports.push(port));
    },
    addModulePorts(module: PlacedModule) {
      this.addPorts(module.ports);
    },
    reset() {
      state.value.ports = [];
    },
    get ports(): Port[] {
      return state.value.ports;
    }
  }
}