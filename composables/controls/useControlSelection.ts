import { IControl } from "~~/lib/interfaces/IControl";
import ICoordinates from "~~/lib/interfaces/ICoordinates";
import type { Tool } from '~~/types/tools/Tool';
import { repositories } from "~~/lib/repositories";

const selected: Ref<IControl|undefined> = ref();

const origin: Ref<ICoordinates> = ref({ x: 0, y: 0 })

function selectControl(control: IControl, $event: MouseEvent) {
  selected.value = control;
  origin.value.x = ($event.clientX / 1.5 - 50) - control.payload.x;
  origin.value.y = (($event.clientY - 48) / 1.5 - 50) - control.payload.y;
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