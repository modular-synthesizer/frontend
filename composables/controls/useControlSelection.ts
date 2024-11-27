import { IControl } from "~~/lib/interfaces/IControl";

const selected: Ref<IControl> = ref({ id: '', editing: false, payload: {}, component: 'None' });

function selectControl(control: IControl) {
  selected.value = control;
}

export function useControlSelection() {
  return { selected, selectControl };
}