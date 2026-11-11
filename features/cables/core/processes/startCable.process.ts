import type { Cable } from "../data/Cable.type"
import type { CableDrag } from "../data/CableDrag.type"
import type { DragFacts } from "../data/Facts.type"
import type { Port } from "../data/Port.type"
import { accepts } from "../shared/connection"
import { cancelCable } from "./cancelCable.process"

export type StartCableFct = (drag: CableDrag, port: Port, cables: readonly Cable[]) => DragFacts

export const startCable: StartCableFct = (drag, port, cables) => {
  const { drag: cancelledDrag, effects } = cancelCable(drag)

  if (accepts(cables, port)) {
    return { drag: { step: "started", origin: port }, effects }
  }
  return { drag: cancelledDrag, effects }
}