import { defineStore } from "pinia";
import ICoordinates from "~~/lib/interfaces/ICoordinates";
import IModule from "~~/lib/interfaces/IModule";
import { useSynthesizerDetails } from "../synthesizers/details";
import { getRack, getSlot } from "./utils/coordinates";
import { clamp } from 'lodash'

interface Payload {
  mod: IModule;
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
    rack: 0,
  }),
  actions: {
    startModDrag(mod: IModule, $event: MouseEvent) {
      this.mod = mod;
      this.slots.click = getSlot($event.clientX, $event.clientY);
      this.slots.mod = this.mod.slot;
      this.startRack = mod.rack;
    },
    moveModDrag(x: number, y: number) {
      if (this.mod === null) return;

      const synth = useSynthesizerDetails().synthesizer;
      const rack = getRack(x, y);
      const maxSlot = synth.racks[0].slots.length
      const slot = clamp(getSlot(x, y), 0, maxSlot);

      const delta = slot - this.slots.click;
      const newPlace = clamp(this.slots.mod + delta, 0, maxSlot - this.mod.slots);

      synth.remove(this.mod);
      if (synth.hasRoom(rack, newPlace, this.mod)) {
        synth.place(rack, newPlace, this.mod);
      }
    },
    endModDrag() {
      this.mod = null;
    }
  }
});