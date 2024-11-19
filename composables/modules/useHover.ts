import Mod from "~~/lib/wrappers/Mod";

interface Payload {
  current: Mod | null;
  next: Mod | null;
  blocked: boolean;
}

const state: Ref<Payload> = ref({ current: null, next: null, blocked: false });

export function useHover() {
  return {
    state,
    mouseenter(mod: Mod) {
      useStates().setState(SynthState.HOVERING_MODULE);
      useModuleDrag().entersOtherModule()
      state.value.next = mod;
      this.update();
    },
    mouseleave() {
      useModuleDrag().outsOtherModule()
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