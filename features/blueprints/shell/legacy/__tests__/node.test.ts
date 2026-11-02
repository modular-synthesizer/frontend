import { describe, expect, it } from "vitest"
import type { BlueprintsEffect } from "../../../core/data/Effect.type"
import type { RunEffectFct } from "../../../../shared/facts"
import { makeMoveNodeAdapter } from "../node.adapter"
import type { Blueprint } from "~/types/blueprints/Blueprint"
import type { InnerNode } from "~/types/blueprints/InnerNode"


describe("moveNodeAdapter", () => {
  const createRunner = () => {
    const effects: BlueprintsEffect[] = []
    const run: RunEffectFct<BlueprintsEffect> = async (effect) => { effects.push(effect) }
    return { effects, moveNode: makeMoveNodeAdapter(run) }
  }
  it("saves the node if the node has a blueprint and has moved", async () => {
    const { effects, moveNode } = createRunner()
    const blueprint = { id: "blueprintId" } as Blueprint
    const node = { id: "id", x: 0, y: 0 } as InnerNode

    await moveNode(blueprint, node, { x: 0, y: 0 }, { x: 10, y: 20 })

    expect(effects).toEqual([
      { type: "blueprints.node.save", id: "id", blueprintId: "blueprintId", position: { x: 10, y: 20 } }
    ])
    expect(node).toMatchObject({ x: 10, y: 20 })
  })
  it("does not save the node if it has not moved", async () => {
    const { effects, moveNode } = createRunner()
    const blueprint = { id: "blueprintId" } as Blueprint
    const node = { id: "id", x: 0, y: 0 } as InnerNode

    await moveNode(blueprint, node, { x: 0, y: 0 }, { x: 0, y: 0 })

    expect(effects).toEqual([])
    expect(node).toMatchObject({ x: 0, y: 0 })
  })
  it("does not save the node if the blueprint ID is not given", async () => {
    const { effects, moveNode } = createRunner()
    const blueprint = { id: "" } as Blueprint
    const node = { id: "id", x: 0, y: 0 } as InnerNode

    await moveNode(blueprint, node, { x: 0, y: 0 }, { x: 10, y: 20 })

    expect(effects).toEqual([])
    expect(node).toMatchObject({ x: 10, y: 20 })
  })
  it("propagates the error if there is any", async () => {
    const blueprint = { id: "blueprintId" } as Blueprint
    const node = { id: "id", x: 0, y: 0 } as InnerNode
    const moveNode = makeMoveNodeAdapter(async () => { throw new Error("apply failed") })

    await expect(moveNode(blueprint, node, { x: 0, y: 0 }, { x: 10, y: 10 })).rejects.toThrow("apply failed")
  })
})