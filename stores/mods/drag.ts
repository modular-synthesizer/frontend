import { defineStore } from "pinia";
import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { getRack, getSlot } from "~~/lib/utils/coordinates";
import { clamp } from 'lodash'
import { api } from "~~/lib/api/Api";
import Mod from "~~/lib/wrappers/Mod";
import sendModuleEvent from "~~/lib/commands/events/sendModuleEvent";

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
  // TRUE if someone else is currently moving a mod, FALSE otherwise
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
    synth() {
      return useSynthesizerDetails().synthesizer
    }
  },
  actions: {
    dragstart(mod: Mod, $event: MouseEvent) {
      useContextMenus().hide();
      if (this.blocked) return;
      this.mod = mod;
      this.slots.click = getSlot($event.clientX, $event.clientY);
      this.slots.mod = this.mod.slot;
      this.rack = mod.rack;
      sendModuleEvent('startDrag', mod);
    },
    dragmove(x: number, y: number) {
      if (this.mod === null) return;

      const rack = getRack(x, y);
      const slot = clamp(getSlot(x, y), 0, this.synth.maxSlot);

      const delta = slot - this.slots.click;

      const newPlace = clamp(this.slots.mod + delta, 0, this.synth.maxSlot - this.mod.slots);

      if (newPlace === this.mod.slot && rack === this.mod.rack) return;

      this.synth.remove(this.mod as Mod);

      if (this.synth.hasRoom(rack, newPlace, this.mod.slots)) {
        this.synth.place(rack, newPlace, this.mod as Mod);
      }
      else {
        this.synth.place(this.mod.rack, this.mod.slot, this.mod as Mod);
      }
    },
    dragend() {
      if (this.mod === null) return;

      const payload = {
        slot: this.mod.slot,
        rack: this.mod.rack,
      }
      api.auth_put(`/modules/${this.mod.id}`, payload);
      this.mod = null;
    },
    blockDrag() {
      this.blocked = true;
    }
  }
});