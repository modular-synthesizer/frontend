type Payload = { context: AudioContext | null };

const state: Ref<Payload> = ref({ context: null });

export function useAudio() {
  return {
    state,
    get context(): AudioContext {
      return state.value.context as AudioContext;
    },
    async initContext() {
      if (state.value.context === null) state.value.context = await new AudioContext();
      await state.value.context.resume();
    }
  }
}