import { describe, expect, it, vi } from "vitest";
import { populateLayer } from "../populateLayer.process";
import type { InnerNodeTemplate } from "~/features/core/data/InnerNode.type";
import type { Uuid } from "~/features/core/data/Uuid.type";
import { connectLayer } from "../connectLayer.process";

const nodes = {
  first: { connect: vi.fn(), disconnect: vi.fn() },
  second: { connect: vi.fn(), disconnect: vi.fn() }
}

const generators = {
  first: vi.fn().mockReturnValue(nodes.first),
  second: vi.fn().mockReturnValue(nodes.second)
}

const templates: InnerNodeTemplate<string>[] = [
  { id: "first" as Uuid, name: "template name", generator: generators.first },
  { id: "first" as Uuid, name: "template name", generator: generators.second }
]

const spies = [ vi.spyOn(nodes.first, "connect"), vi.spyOn(nodes.second, "connect") ]

const layer = await populateLayer<string>(templates)

describe("connectLayer", () => {
  it("Does nothing ig there are no link in the list", async () => {
    await connectLayer<string>(layer, [])
    expect(spies[0]).not.toHaveBeenCalled()
    expect(spies[1]).not.toHaveBeenCalled()
  })
  it("Connects both nodes if a link exists between them", () => {

  })
  it("Ignores a link if the origin is not found", () => {

  })
  it("Ignores a link if the destination is not found", () => {

  })
})