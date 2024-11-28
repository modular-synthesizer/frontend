import { IControl } from "~~/lib/interfaces/IControl";
import ITool from "~~/lib/interfaces/ITool";
import { repositories } from "~~/lib/repositories";

const selected: Ref<IControl|undefined> = ref();

function selectControl(control: IControl) {
  selected.value = control;
}

function reset(tool: ITool) {
  if (selected.value !== undefined) {
    repositories.tool.controls.update(tool, tool.controls, selected.value);
  }
  selected.value = undefined;
}

export function useControlSelection() {
  return { reset, selected, selectControl };
}