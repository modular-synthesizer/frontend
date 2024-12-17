import type { Tool } from '~~/types/tools/Tool';
import { repositories } from "~~/lib/repositories";
import type { Coordinates } from "~/types/utils/Coordinates";
import type { Control } from '~/types/tools/Control';

const selected: Ref<Control|undefined> = ref();

const origin: Ref<Coordinates> = ref({ x: 0, y: 0 })

function selectControl(control: Control, $event: MouseEvent) {
  selected.value = control;
  origin.value.x = ($event.clientX / 1.5 - 50) - +control.payload.x;
  origin.value.y = (($event.clientY - 48) / 1.5 - 50) - +control.payload.y;
}

function reset(tool: Tool) {
  if (selected.value !== undefined) {
    repositories.tool.controls.update(tool, tool.controls, selected.value);
  }
  selected.value = undefined;
}

export function useControlSelection() {
  return { origin, reset, selected, selectControl };
}