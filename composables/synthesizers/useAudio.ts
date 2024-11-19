type Payload = { context: AudioContext | null };

const state: Ref<Payload> = ref({ context: null });

export function useAudio() {
  return {
    state,
    get context(): AudioContext {
      if (!state.value.context) state.value.context = new AudioContext();
      return state.value.context as AudioContext;
    },
    async initContext() {
      if (!state.value.context) return;
      await state.value.context.resume();
    }
  }
}