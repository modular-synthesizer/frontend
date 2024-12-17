import type { Control } from "~/types/tools/Control";

export type ControlEditionState = {
  control?: Control,
  displayed: boolean,
  get creating(): boolean,
}

const state: Ref<ControlEditionState> = ref({
  displayed: false,
  get creating(): boolean {
    return state.value.control?.id === '';
  }
});

function startEdit(control: Control) {
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