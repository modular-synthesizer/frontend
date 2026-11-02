import type { BlueprintsEffect } from "../../core/data/Effect.type";
import type { Position } from "../../../viewports/core/data/Position.type";
import type { Blueprint } from "~/types/blueprints/Blueprint";
import { moveNode } from "../../core/processes/moveNode.process";
import type { Uuid } from "../../../shared/data/Uuid.type";
import type { RunEffectFct } from "../../../shared/facts";
import type { InnerNode } from "~/types/blueprints/InnerNode";
import { runEffect } from "../effect";

export type MoveNodeAdapter = (blueprint: Blueprint, node: InnerNode, from: Position, to: Position) => Promise<void>

export type MoveNodeAdapterFactory = (run: RunEffectFct<BlueprintsEffect>) => MoveNodeAdapter

export const makeMoveNodeAdapter: MoveNodeAdapterFactory = run =>
  async (blueprint, node, from, to) => {
    const blueprintId = blueprint.id ? blueprint.id as Uuid : null
    const facts = moveNode(blueprintId, node.id as Uuid, from, to)
    node.x = facts.position.x
    node.y = facts.position.y
    await Promise.all(facts.effects.map(run))
  }

export const moveNodeAdapter = makeMoveNodeAdapter(runEffect)