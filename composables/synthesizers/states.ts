export enum SynthState {
  // The user is currently dragging a node
  DRAGGING_MODULE = 'DRAGGING_MODULE',
  // The user is currently editing a parameter
  EDITING_PARAMETER = 'EDITING_PARAMETER',
  // The synthesizer actually does nothing
  NONE = 'NONE',
  // The user is currently hovering a module
  HOVERING_MODULE = 'HOVERING_MODULE',
  // The user is zooming in or out on the synthesizer
  ZOOMING = 'ZOOMING',
  // The user is displaying a context menu anywhere (synth or module or parameter)
  DISPLAYING_CONTEXT = 'DISPLAYING_CONTEXT',
  // The user is currently dragging (panning) the whole view
  DRAGGING_VIEW = 'DRAGGING_VIEW',

  DRAGGING = 'DRAGGING',
}

interface Payload {
  current: SynthState;
  next: SynthState;
  blocked: Boolean;
}

type BlockMapping = {
  [key in SynthState]: Boolean;
}

/**
 * This constant indicates which states are blocking. A blocking state forbids the application
 * from being able to pass to another state before the store has been manually unblocked.
 */
export const isBlocking: BlockMapping = {
[SynthState.DRAGGING_MODULE]: true,
[SynthState.NONE]: false,
[SynthState.HOVERING_MODULE]: false,
[SynthState.ZOOMING]: true,
[SynthState.EDITING_PARAMETER]: true,
[SynthState.DISPLAYING_CONTEXT]: true,
[SynthState.DRAGGING_VIEW]: true,
[SynthState.DRAGGING]: true,
}

const state: Ref<Payload> = ref({
  current: SynthState.NONE,
  next: SynthState.NONE,
  blocked: false,
});

/**
 * This store holds the logic for the states a synthesizer can be in, and what state can be safely
 * transitioned to another. It furthermore says which state is "blocking" (a blocking state is a state
 * from which no new state can be set before it unblocks).
 */
export function useStates() {
  return {
    state,
    setState(s: SynthState): void {
      state.value.next = s;
      if (!state.value.blocked) this.processNext();
    },
    unblock(): void {
      useHover().update();
      this.processNext();
      state.value.blocked = false;
    },
    is(s: SynthState): Boolean {
      return state.value.current === s;
    },
    isNot(state: SynthState): Boolean {
      return !this.is(state);
    },
    among(...states: SynthState[]): Boolean {
      return states.indexOf(state.value.current) >= 0;
    },
    notAmong(...states: SynthState[]) {
      return !this.among(...states);
    },
    processNext(): void {
      state.value.current = state.value.next;
      state.value.next = SynthState.NONE;
      if (isBlocking[state.value.current]) state.value.blocked = true;
    }
  };
};