import { getRack, getSlot } from "~~/lib/utils/coordinates";
import sendModuleEvent from "~~/lib/commands/events/sendModuleEvent";
import { repositories } from "~~/lib/repositories";
import type { AudioModule } from "~/types/modules/AudioModule";
import { hasRoom } from "~/utils/functions/synthesizers";
import { place } from "~/utils/functions/modules";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

/**
 * This composable holds the logic for the drag and drop of a module in the racks and slots.
 */
export const useModuleDrag = () => {

  let mod!: AudioModule;
  let synth!: Synthesizer;
  // The slot of the first position of the clicked module (its origin).
  let movedSlot: number = 0;
  // The slot the user has clicked in to move the module (not mandatory to be the origin).
  let clickedSlot: number = 0;

  let blocked: boolean = false;

  let onOtherModule: boolean = false;

  function move(x: number, y: number) {

    if (onOtherModule) return;

    const rack = getRack(x, y);
    const slot = getSlot(x, y);

    const delta = slot - clickedSlot;

    // The new place the module SHOULD go if it's free.
    const newPlace = movedSlot + delta;


    if (newPlace === mod.slot && rack === mod.rack) return;

    if (hasRoom(synth, { rack, slot: newPlace, slots: mod.slots, id: mod.id })) {
      place(mod, rack, newPlace);
    }
    else {
      place(mod, mod.rack || 0, mod.slot || 0);
    }
  }
  
  function end() {
    repositories.modules.update(mod)
    useHover().unblock();
    useStates().unblock()
    sendModuleEvent('endDrag', mod);
  }

  return {
    /**
     * Declares the necessary callbacks to the utility functions starting a new drag n drop event.
     * @param $event the mouse event emitted when the user starts clicking to move a module.
     * @param draggedMod the module currently moved.
     * @param draggedInSynth the synthesizer in which the drag n drop event is occurring.
     */
    start($event: MouseEvent, draggedMod: AudioModule, draggedInSynth: Synthesizer) {
      if (blocked) return;
      mod = draggedMod;
      synth = draggedInSynth;
      movedSlot = mod.slot;
      clickedSlot = getSlot($event.clientX, $event.clientY);
      startDragEvent($event, { move, end })
    },
    block() {
      blocked = true;
    },
    unblock() {
      blocked = false;
    },
    entersOtherModule() {
      onOtherModule = true
    },
    outsOtherModule() {
      onOtherModule = false
    }
  }
}