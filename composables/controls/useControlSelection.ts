import { IControl } from "~~/lib/interfaces/IControl";

const selected: Ref<IControl|undefined> = ref();

function selectControl(control: IControl) {
  selected.value = control;
}

function reset() {
  console.log("resetting");
  selected.value = undefined;
}

export function useControlSelection() {
  return { reset, selected, selectControl };
}