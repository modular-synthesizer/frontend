import { defineStore } from "pinia";
import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { useSynthesizerDetails } from "../synthesizers/details";
import { getRack, getSlot } from "./utils/coordinates";
import { clamp } from 'lodash'
import { api } from "~~/lib/api/Api";
import { useAuthentication } from "../authentication";
import Mod from "~~/lib/wrappers/Mod";

interface Payload {
  mod: Mod;
  coords: ICoordinates;
  slots: {
    // The slot where the click has been started
    click: number;
    // The slot where the moved components is currently placed
    mod: number;
  };
  rack: number;
}

export const useModDrag = defineStore("modDrag", {
  state: (): Payload => ({
    mod: null,
    coords: {x: 0, y: 0},
    slots: {click: 0, mod: 0},
    startRack: 0,
  }),
  actions: {
    startModDrag(mod: Mod, $event: MouseEvent) {
      this.mod = mod;
      this.slots.click = getSlot($event.clientX, $event.clientY);
      this.slots.mod = this.mod.slot;
      this.startRack = mod.rack;
    },
    moveModDrag(x: number, y: number) {
      if (this.mod === null) return;

      const synth = useSynthesizerDetails().synthesizer;
      const rack = getRack(x, y);
      const slot = clamp(getSlot(x, y), 0, synth.maxSlot);

      const delta = slot - this.slots.click;
      const newPlace = clamp(this.slots.mod + delta, 0, synth.maxSlot - this.mod.slots);

      if (newPlace === this.mod.slot && rack === this.mod.rack) return;

      synth.remove(this.mod);
      if (synth.hasRoom(rack, newPlace, this.mod)) {
        synth.place(rack, newPlace, this.mod);
      }
      else {
        synth.place(this.mod.rack, this.mod.slot, this.mod);
      }
    },
    endModDrag() {
      if (this.mod === null) return;

      const payload = {
        slot: this.mod.slot,
        rack: this.mod.rack,
        auth_token: useAuthentication().session.token
      }
      api.put(`/modules/${this.mod.id}`, payload);
      this.mod = null;
    }
  }
});