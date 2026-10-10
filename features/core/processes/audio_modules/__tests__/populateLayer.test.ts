import { describe, expect, it, vi } from "vitest";
import { populateLayer } from "../populateLayer.process";
import type { InnerNodeTemplate } from "~/features/core/data/InnerNode.type";
import type { Uuid } from "~/features/core/data/Uuid.type";
import type { PolyphonyLayer } from "~/features/core/data/AudioModule.type";
import { mockAudioNode } from "../../../../utils/tests/mockAudioNode"

// The future node that will be created by the generator
const futureNode = mockAudioNode()

const uuid = "templateId" as Uuid

describe("populateLayer", () => {
  it("Populates an empty layer if the list of templates is empty", async () => {
    expect(await populateLayer([])).toMatchObject({ innerNodes: [] })
  })
  it("Creates a list of nodes corresponding to the list of ", async () => {
    const generator = vi.fn().mockReturnValue(futureNode)
    const template: InnerNodeTemplate = { id: uuid, name: "template name", generator }
    const layer: PolyphonyLayer = await populateLayer([ template ])

    expect(layer).toMatchObject({
      innerNodes: [ { id: "templateId", name: "template name", audioNode: futureNode } ]
    })
  })
})