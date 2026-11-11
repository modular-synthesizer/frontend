import type { CableColor } from "../data/Cable.type"
import type { CableDrag } from "../data/CableDrag.type"

/** The available colors for the cables */
export const CABLE_COLORS: readonly CableColor[] = [ "red", "blue", "green", "yellow" ]
/** The default color of a cable, historically red but might change in the future */
export const DEFAULT_CABLE_COLOR: CableColor = "red"
/** The default state of a cable creation drag, idle meaning "nothing currently happening" */
export const IDLE_DRAG: CableDrag = { step: "idle" }