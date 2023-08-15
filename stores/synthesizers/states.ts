import { defineStore } from "pinia";

export enum SynthState {
  // The user is currently creating a link
  CREATING_LINK = 'CREATING_LINK',
  // The user is currently dragging a node
  DRAGGING_MODULE = 'DRAGGING_MODULE',
  // The user is currently editing a parameter
  EDITING_PARAMETER = 'EDITING_PARAMETER',
  // When creating a link, a user is magnetizing it to the end port
  MAGNETIZING = 'MAGNETIZING',
  // The synthesizer actually does nothing
  NONE = 'NONE',
  // The user is currently hovering an already created link
  HOVERING_LINK = 'HOVERING_LINK',
  // The user is currently hovering a module
  HOVERING_MODULE = 'HOVERING_MODULE',
  // The user is currently moving the whole synthesizer
  PANNING = 'PANNING',
  // The user is zooming in or out on the synthesizer
  ZOOMING = 'ZOOMING',
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
  [SynthState.CREATING_LINK]: true,
  [SynthState.DRAGGING_MODULE]: true,
  [SynthState.EDITING_PARAMETER]: true,
  [SynthState.MAGNETIZING]: false,
  [SynthState.NONE]: false,
  [SynthState.HOVERING_LINK]: false,
  [SynthState.HOVERING_MODULE]: false,
  [SynthState.PANNING]: true,
  [SynthState.ZOOMING]: true
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
      if (this.next !== SynthState.NONE) this.processNext();
      this.blocked = false;
    },
    is(state: SynthState): Boolean {
      return this.current === state;
    },
    isNot(state: SynthState): Boolean {
      return !this.is(state);
    },
    among(...states: SynthState[]): Boolean {
      return states.indexOf(this.current) > 0;
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