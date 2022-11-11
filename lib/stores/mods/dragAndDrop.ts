import { defineStore } from "pinia";
import IModule from "~~/lib/interfaces/IModule";
import { RACK_HEIGHT, SLOT_SIZE, TOPBAR_HEIGHT } from "~~/lib/utils/constants";
import { useSynthesizerDetails } from "../synthesizers/details";
import { getRack, getSlot, relativePosition } from "./utils/coordinates";
import { clamp } from "lodash"

export const useModDrag = defineStore("modDrag", {
  state: () => ({
    mod: null as IModule,
    coords: {x: 0, y: 0},
    startSlot: 0,
    startRack: 0,
  }),
  actions: {
    startModDrag(mod: IModule, $event: MouseEvent) {
      const synth = useSynthesizerDetails().synthesizer;
      this.mod = mod;
      this.startSlot = mod.slot;
      this.startRack = mod.rack;
      this.coords.x = Math.floor($event.clientX / SLOT_SIZE) * SLOT_SIZE;
      this.coords.y = $event.clientY - TOPBAR_HEIGHT;
    },
    moveModDrag(x: number, y: number) {
      if (this.mod === null) return;

      this.mod.slot = getSlot(this.mod, x, y)
      this.mod.rack = getRack(x, y)

    },
    endModDrag() {
      this.mod = null;
    }
  }
})