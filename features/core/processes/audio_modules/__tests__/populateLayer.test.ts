import { describe, expect, it, vi } from "vitest";
import { populateLayer } from "../populateLayer.process";
import type { InnerNodeTemplate } from "~/features/core/data/InnerNode.type";

describe("populateLayer", () => {

  it("Populates an empty layer if the list of templates is empty", async () => {
    expect(await populateLayer([])).toMatchObject({ innerNodes: [] })
  })
  it("Creates a list of nodes corresponding to the list of ", async () => {
    const createdNode = vi.fn()
    const generator = vi.fn().mockReturnValue(createdNode as unknown as AudioNode)
    const template = { id: "templateId", name: "template name", generator } as unknown as InnerNodeTemplate
    expect(await populateLayer([ template ])).toMatchObject({
      innerNodes: [ { id: "templateId", name: "template name", audioNode: createdNode } ]
    })
  })
})