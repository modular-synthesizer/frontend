import type { CableDrag } from "../data/CableDrag.type"
import type { DragFacts } from "../data/Facts.type"
import { IDLE_DRAG } from "../shared/Constants"

export type CancelCableFct = (drag: CableDrag) => DragFacts

export const cancelCable: CancelCableFct = drag => ({
  drag: IDLE_DRAG,
  effects: drag.step === "magnetized" ? [ { type: "cables.audio.disconnect", connection: drag.connection } ] : []
})