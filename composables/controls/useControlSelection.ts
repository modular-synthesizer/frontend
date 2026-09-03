import type { Blueprint } from '~~/types/blueprints/Blueprint';
import { repositories } from "~~/lib/repositories";
import type { Coordinates } from "~/types/utils/Coordinates";
import type { Control } from '~/types/blueprints/Control';

const selected: Ref<Control|undefined> = ref();

const origin: Ref<Coordinates> = ref({ x: 0, y: 0 })

function selectControl(control: Control, $event: MouseEvent) {
  selected.value = control;
  origin.value.x = ($event.clientX / 1.5 - 50) - +control.payload.x;
  origin.value.y = (($event.clientY - 48) / 1.5 - 50) - +control.payload.y;
}

function reset(blueprint: Blueprint) {
  if (selected.value !== undefined) {
    repositories.blueprint.controls.update(blueprint, blueprint.controls, selected.value);
  }
  selected.value = undefined;
}

export function useControlSelection() {
  return { origin, reset, selected, selectControl };
}