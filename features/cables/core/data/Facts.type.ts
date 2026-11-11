import type { Facts } from "../../../shared/facts"
import type { CablesEffect } from "./Effect.type"
import type { CableDrag } from "./CableDrag.type"
import type { Cable } from "./Cable.type"

export type DragFacts = Facts<CablesEffect> & { drag: CableDrag }
export type DropFacts = DragFacts & { cables: Cable[], created: Cable | null }
export type CablesFacts = Facts<CablesEffect> & { cables: Cable[] }