import type { ObjectId } from "../../../shared/data/ObjectId.type";
import type { Cable } from "../data/Cable.type";
import type { CablesFacts } from "../data/Facts.type";
import { touches } from "../shared/connection";
import { unplugEffects } from "../shared/effects";

export type UnplugModuleFct = (cables: readonly Cable[], moduleId: ObjectId) => CablesFacts


export const unplugModule: UnplugModuleFct = (cables, moduleId) => ({
  cables: cables.filter(cable => !touches(cable, moduleId)),
  effects: cables.filter(cable => touches(cable, moduleId)).flatMap(unplugEffects),
})
