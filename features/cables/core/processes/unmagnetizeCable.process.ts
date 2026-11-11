import type { CableDrag } from "../data/CableDrag.type";
import type { DragFacts } from "../data/Facts.type";
import type { Port } from "../data/Port.type";

export type UnmagnetizeCableFct = (drag: CableDrag, port: Port) => DragFacts

export const unmagnetizeCable: UnmagnetizeCableFct = (drag, port) => {
  if (drag.step === "magnetized" && drag.target.id === port.id) return {
    drag: { step: "started", origin: drag.origin },
    effects: [ { type: "cables.audio.disconnect", connection: drag.connection } ]
  }
  return { drag, effects: [] }
}