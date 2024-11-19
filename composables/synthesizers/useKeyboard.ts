type State = { shift: boolean };
const state: Ref<State> = ref({ shift: false });

export function useKeyboard() {
  return {
    state,
    shiftOn() {
      if (state.value.shift) return;
      state.value.shift = true;
    },
    shiftOff() {
      state.value.shift = false;
    },
    get shift(): boolean {
      return state.value.shift;
    }
  }
};