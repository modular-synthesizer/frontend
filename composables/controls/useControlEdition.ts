import { IControl } from "~~/lib/interfaces/IControl";

type State = {
  control?: IControl,
  displayed: boolean,
  get creating(): boolean,
}

const state: Ref<State> = ref({
  displayed: false,
  get creating(): boolean {
    return state.value.control?.id === '';
  }
});

function startEdit(control: IControl) {
  state.value.control = control;
  state.value.displayed = true;
}

export function useControlEdition() {
  return { startEdit, state };
}