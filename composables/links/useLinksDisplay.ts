
const state: Ref<{ flag: boolean }> = ref({ flag: true })

function toggle() {
  state.value.flag = !state.value.flag
}

export const useLinksDisplay = () => {
  return {
    toggle,
    get displayed(): boolean {
      return state.value.flag;
    }
  }
}
