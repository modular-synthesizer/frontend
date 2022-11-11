import { defineStore } from "pinia";
import IModule from "~~/lib/interfaces/IModule";
import { RACK_HEIGHT, SLOT_SIZE, TOPBAR_HEIGHT } from "~~/lib/utils/constants";
import { useSynthesizerDetails } from "../synthesizers/details";
import { getRack, getSlot, relativePosition } from "./utils/coordinates";
import { clamp } from "lodash"
import { remove } from "@vue/shared";

export const useModDrag = defineStore("modDrag", {
  state: () => ({
    mod: null as IModule,
    coords: {x: 0, y: 0},
    startSlot: 0,
    startRack: 0,
  }),
  actions: {
    startModDrag(mod: IModule, $event: MouseEvent) {
      this.mod = mod;
      this.startSlot = mod.slot;
      this.startRack = mod.rack;
    },
    moveModDrag(x: number, y: number) {
      if (this.mod === null) return;

      const synth = useSynthesizerDetails().synthesizer;
      const slot = getSlot(this.mod, x, y);
      const rack = getRack(x, y);

      synth.remove(this.mod);
      if (synth.hasRoom(rack, slot, this.mod)) {
        synth.place(rack, slot, this.mod);
      }
    },
    endModDrag() {
      this.mod = null;
    }
  }
})