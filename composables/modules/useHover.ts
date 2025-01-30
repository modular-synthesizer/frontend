import type { AudioModule } from "~/types/modules/AudioModule";

interface Payload {
  current: AudioModule | null;
  next: AudioModule | null;
  blocked: boolean;
}

const state: Ref<Payload> = ref({ current: null, next: null, blocked: false });

export function useHover() {
  return {
    state,
    mouseenter(mod: AudioModule) {
      useStates().setState(SynthState.HOVERING_MODULE);
      state.value.next = mod;
      this.update();
    },
    mouseleave() {
      this.update();
    },
    update() {
      if(state.value.blocked) return;
      if (useStates().among(SynthState.HOVERING_MODULE, SynthState.NONE)) {
        state.value.current = state.value.next;
        state.value.next = null;
      }
    },
    block() {
      state.value.blocked = true;
    },
    unblock() {
      state.value.blocked = false;
    }
  }
};