const state: Ref<{ display: boolean }> = ref({ display: false });

export function useParamDialog() {
  return {
    state,
    toggle() {
      state.value.display = !state.value.display
    }
  }
}