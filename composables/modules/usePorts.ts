import type { AudioModule } from "~/types/modules/AudioModule";
import type { Port } from '~/types/modules/Port';

type State = { ports: Port[] }

const state: Ref<State> = ref({ ports: [] })

export function usePorts() {
  return {
    state,
    addPorts(ports: Port[]) {
      ports.forEach(port => state.value.ports.push(port));
    },
    addModulePorts(module: AudioModule) {
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