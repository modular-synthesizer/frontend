import type { Coordinates } from "~/types/utils/Coordinates";
import type { Control } from '~/types/blueprints/Control';

const selected: Ref<Control|undefined> = ref();

const origin: Ref<Coordinates> = ref({ x: 0, y: 0 })

function selectControl(control: Control, $event: MouseEvent) {
  selected.value = control;
  origin.value.x = ($event.clientX / 1.5 - 50) - +(control.payload.x ?? 0);
  origin.value.y = (($event.clientY - 48) / 1.5 - 50) - +(control.payload.y ?? 0);
}

export function useControlSelection() {
  return { selectControl };
}