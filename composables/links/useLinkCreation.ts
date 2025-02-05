import type { Cable, Port } from "~/types/Index"
import type { ModControl } from "~/types/tools/Control";
import type { Coordinates } from "~/types/utils/Coordinates";
import { connectCable, disconnectCable } from "~/utils/factories/cables";
import { add } from "~/utils/functions/geometry";

type State = {
  ports: { origin?: Port, destination?: Port},
  controls: { origin?: ModControl, destination?: ModControl},
  cable?: Cable | undefined,
};

const state: Ref<State> = ref({
  ports: {}, controls: {},
});

function start(port: Port, control: ModControl) {
  state.value.ports.origin = port;
  state.value.controls.origin = control;
  console.log("Début de la création");
}

function end() {
  console.log("ending");
  resetDestination();
  state.value.ports.origin = undefined;
  state.value.controls.origin = undefined;
}

function magnetize(port: Port, control: ModControl) {
  if (port.kind === state.value.ports.origin?.kind) return;
  state.value.ports.destination = port;
  state.value.controls.destination = control;
  const { origin: from, destination: to } = state.value.ports;
  if (from === undefined || to === undefined) return;
  state.value.cable = { from, to, color: 'red', id: '' };
  connectCable(state.value.cable);
}

function resetDestination() {
  state.value.ports.destination = undefined;
  state.value.controls.destination = undefined;
}

function unmagnetize(trace: string = "unknown") {
  console.log("in unmagnetize : " + trace)
  resetDestination()
  if (state.value.cable === undefined) return;
  console.log("Disconnecting the cable now")
  disconnectCable(state.value.cable, "unmagnetize");
  resetCable()
}

function resetCable() {
  state.value.cable = undefined;
}

function getCoordinates(control: ModControl|undefined) {
  if (control === undefined) return { x: 0, y: 0 };
  return add(control.payload as Coordinates, control.module);
}

export function useLinkCreation() {
  return {
    end, magnetize, start, unmagnetize, resetCable,
    get origin(): Coordinates {
      return getCoordinates(state.value.controls.origin);
    },
    get destination(): Coordinates {
      if (state.value.ports.destination === undefined) return useCoordinates().absolute();
      return getCoordinates(state.value.controls.destination);
    },
    get magnetized(): boolean {
      return !!state.value.controls.destination
    },
    get displayed(): boolean {
      return !!state.value.ports.origin;
    },
    get startPort(): Port {
      return state.value.ports.origin as Port;
    },
    get endPort(): Port {
      return state.value.ports.destination as Port;
    },
    get cable(): Cable {
      return state.value.cable as Cable;
    }
  };
}