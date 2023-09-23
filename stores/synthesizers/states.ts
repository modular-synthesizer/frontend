import { defineStore } from "pinia";

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
  DISPLAYING_CONTEXT = 'DISPLAYING_CONTEXT'
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
[SynthState.DISPLAYING_CONTEXT]: true
}

/**
 * This store holds the logic for the states a synthesizer can be in, and what state can be safely
 * transitioned to another. It furthermore says which state is "blocking" (a blocking state is a state
 * from which no new state can be set before it unblocks).
 */
export const useStates = defineStore("states", {
  state(): Payload {
    return {
      current: SynthState.NONE,
      next: SynthState.NONE,
      blocked: false,
    }
  },
  actions: {
    setState(state: SynthState): void {
      this.next = state;
      if (!this.blocked) this.processNext();
    },
    unblock(): void {
      useModHover().update();
      this.processNext();
      this.blocked = false;
    },
    is(state: SynthState): Boolean {
      return this.current === state;
    },
    isNot(state: SynthState): Boolean {
      return !this.is(state);
    },
    among(...states: SynthState[]): Boolean {
      return states.indexOf(this.current) >= 0;
    },
    notAmong(...states: SynthState[]) {
      return !this.among(...states);
    },
    processNext(): void {
      this.current = this.next;
      this.next = SynthState.NONE;
      if (isBlocking[this.current]) this.blocked = true;
    },
  },
});