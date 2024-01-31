import { defineStore } from "pinia";
import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { getRack, getSlot } from "~~/lib/utils/coordinates";
import { clamp } from 'lodash'
import { api } from "~~/lib/api/Api";
import Mod from "~~/lib/wrappers/Mod";
import sendModuleEvent from "~~/lib/commands/events/sendModuleEvent";
import { SynthState, useStates } from "../synthesizers/states";
import Synthesizer from "~~/lib/wrappers/Synthesizer";

interface Payload {
  mod: Mod|null;
  coords: ICoordinates;
  slots: {
    // The slot where the click has been started
    click: number;
    // The slot where the moved components is currently placed
    mod: number;
  };
  rack: number;
  // The drag and drop has been blocked by another user dragging a mod
  blocked: boolean;
}

export const useModDrag = defineStore("moduleDrag", {
  state: (): Payload => ({
    mod: null,
    coords: {x: 0, y: 0},
    slots: {click: 0, mod: 0},
    rack: 0,
    blocked: false,
  }),
  getters: {
    synth(): Synthesizer {
      return useSynthesizerDetails().synthesizer as Synthesizer
    },
    username(): string {
      return useAuthentication().storedSession.username;
    }
  },
  actions: {
    dragstart(mod: Mod, $event: MouseEvent) {
      useContexts().hide(useStates().current === SynthState.DISPLAYING_CONTEXT);
      if (this.blocked) return;
      if (this.synth.isReadonly(this.username)) return;
      this.mod = mod;
      this.slots.click = getSlot($event.clientX, $event.clientY);
      this.slots.mod = this.mod.slot;
      this.rack = mod.rack;
      useModHover().block();
      useStates().setState(SynthState.DRAGGING_MODULE);
      sendModuleEvent('startDrag', mod);
      declareDragMove(this.dragmove);
      declareDragEnd(this.dragend);
    },
    dragmove(x: number, y: number) {
      if (this.blocked) return;
      if (!useStates().is(SynthState.DRAGGING_MODULE) || this.mod === null) return;

      const rack = getRack(x, y);
      const slot = clamp(getSlot(x, y), 0, this.synth.maxSlot);

      const delta = slot - this.slots.click;

      const newPlace = clamp(this.slots.mod + delta, 0, this.synth.maxSlot - this.mod.slots);

      if (newPlace === this.mod?.slot && rack === this.mod?.rack) return;

      this.synth.remove(this.mod as Mod);

      if (this.synth.hasRoom(rack, newPlace, this.mod?.slots || 0)) {
        this.synth.place(rack, newPlace, this.mod as Mod);
      }
      else {
        this.synth.place(this.mod?.rack || 0, this.mod?.slot || 0, this.mod as Mod);
      }
    },
    dragend() {
      if (this.mod === null) return;

      const payload = {
        slot: this.mod.slot,
        rack: this.mod.rack,
      }
      api.auth_put(`/modules/${this.mod.id}`, payload);
      useModHover().unblock();
      useStates().unblock()
      sendModuleEvent('endDrag', this.mod as Mod);
      this.mod = null;
    },
    blockDrag() {
      this.blocked = true;
    },
    unblockDrag() {
      this.blocked = false;
    }
  }
});