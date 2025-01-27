import type { Port } from "~/types/Index"
import type { ModControl } from "~/types/tools/Control";
import type { Coordinates } from "~/types/utils/Coordinates";
import { add } from "~/utils/functions/geometry";

type State = {
  ports: { origin?: Port, destination?: Port},
  controls: { origin?: ModControl, destination?: ModControl},
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
  unmagnetize();
  state.value.ports.origin = undefined;
  state.value.controls.origin = undefined;
}

function magnetize(port: Port, control: ModControl) {
  if (port.kind === state.value.ports.origin?.kind) return;
  state.value.ports.destination = port;
  state.value.controls.destination = control;
}

function unmagnetize() {
  state.value.ports.destination = undefined;
  state.value.controls.destination = undefined;
}

function getCoordinates(control: ModControl|undefined) {
  if (control === undefined) return { x: 0, y: 0 };
  return add(control.payload as Coordinates, control.module);
}

export function useLinkCreation() {
  return {
    end, magnetize, start, unmagnetize,
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
    }
  };
}