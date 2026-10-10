import { beforeEach, describe, expect, it, vi } from "vitest";
import { populateLayer } from "../populateLayer.process";
import type { InnerNodeTemplate } from "~/features/core/data/InnerNode.type";
import type { Uuid } from "~/features/core/data/Uuid.type";
import { connectLayer } from "../connectLayer.process";
import type { InnerLink } from "~/features/core/data/InnerLink.type";
import { mockAudioNode } from "../../../../utils/tests/mockAudioNode"

const nodes = {
  first: mockAudioNode(),
  second: mockAudioNode()
}

const generators = {
  first: vi.fn().mockReturnValue(nodes.first),
  second: vi.fn().mockReturnValue(nodes.second)
}

const templates: InnerNodeTemplate[] = [
  { id: "first" as Uuid, name: "template name", generator: generators.first },
  { id: "second" as Uuid, name: "other name", generator: generators.second }
]

const spies = [ vi.spyOn(nodes.first, "connect"), vi.spyOn(nodes.second, "connect") ]

const layer = await populateLayer(templates)

describe("connectLayer", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.clearAllMocks()
  })
  
  it("Does nothing ig there are no link in the list", async () => {
    await connectLayer(layer, [])
    expect(spies[0]).not.toHaveBeenCalled()
    expect(spies[1]).not.toHaveBeenCalled()
  })
  it("Connects both nodes if a link exists between them", async () => {
    const links: InnerLink[] = [ { from: { name: "template name" }, to: { name: "other name" } } ]
    await connectLayer(layer, links)
    expect(spies[0]).toHaveBeenCalledOnce()
    expect(spies[1]).not.toHaveBeenCalled()
  })
  it("Ignores a link if the origin is not found", async () => {
    const links: InnerLink[] = [ { from: { name: "fake name" }, to: { name: "other name" } } ]
    await connectLayer(layer, links)
    expect(spies[0]).not.toHaveBeenCalled()
    expect(spies[1]).not.toHaveBeenCalled()
  })
  it("Ignores a link if the destination is not found", async () => {
    const links: InnerLink[] = [ { from: { name: "template name" }, to: { name: "fake name" } } ]
    await connectLayer(layer, links)
    expect(spies[0]).not.toHaveBeenCalled()
    expect(spies[1]).not.toHaveBeenCalled()
  })
})