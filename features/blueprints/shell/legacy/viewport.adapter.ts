import type { Blueprint } from "~/types/blueprints/Blueprint";
import { makeApplyFacts, toViewport, type FactsApplier } from "../../../viewports/shell/legacy/viewport.adapter";
import type { BlueprintsEffect } from "../../core/data/Effect.type";
import { runEffect } from "../effect";
import type { Position } from "../../../viewports/core/data/Position.type";
import { pan } from "../../core/processes/pan.process";
import { toEventualObjectId } from "../../../shared/data/ObjectId.type";

export const applyFacts: FactsApplier<BlueprintsEffect> = makeApplyFacts(runEffect)

export type PanBlueprintFct = (blueprint: Blueprint, from: Position, to: Position) => Promise<void>

export type PanBlueprintFactory = (applier: FactsApplier<BlueprintsEffect>) => PanBlueprintFct

export const makePanBlueprint: PanBlueprintFactory = apply =>
  async (blueprint, from, to) => {
    const blueprintId = toEventualObjectId(blueprint.id)
    const facts = pan(blueprintId, { ...toViewport(blueprint), position: from }, to)
    await apply(blueprint, facts)
  }

export const panBlueprint: PanBlueprintFct = makePanBlueprint(applyFacts)