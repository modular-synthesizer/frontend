import type { Cable } from "../data/Cable.type";
import type { CableDrag } from "../data/CableDrag.type";
import type { DragFacts } from "../data/Facts.type";
import type { Port } from "../data/Port.type";
import { accepts, orient } from "../shared/connection";

export type MagnetizeCableFct = (drag: CableDrag, port: Port, cables: readonly Cable[]) => DragFacts

export const magnetizeCable: MagnetizeCableFct = (drag, port, cables) => {
  if (drag.step !== "started") return { drag, effects: [] }
  const oriented = orient(drag.origin, port)
  if (!oriented.ok || !accepts(cables, port) || !accepts(cables, drag.origin)) return { drag, effects: [] }
  const connection = oriented.orNull()
  return {
    drag: { step: "magnetized", origin: drag.origin, target: port, connection },
    effects: [ { type: "cables.audio.connect", connection } ]
  }
}