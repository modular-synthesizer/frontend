import { IControl } from "~~/lib/interfaces/IControl";

export type ControlEditionState = {
  control?: IControl,
  displayed: boolean,
  get creating(): boolean,
}

const state: Ref<ControlEditionState> = ref({
  displayed: false,
  get creating(): boolean {
    return state.value.control?.id === '';
  }
});

function startEdit(control: IControl) {
  state.value.control = control;
  state.value.displayed = true;
}

function reset() {
  state.value.control = undefined;
  state.value.displayed = false;
}

export function useControlEdition() {
  return { reset, startEdit, state };
}