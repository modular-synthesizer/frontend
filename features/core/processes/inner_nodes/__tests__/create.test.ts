import { describe, expect, it, vi } from "vitest"
import { create } from "../create.process"
import type { InnerNode, InnerNodeTemplate, NodeGenerator } from "~/features/core/data/InnerNode.type"
import type { Uuid } from "~/features/core/data/Uuid.type"
import { mockAudioNode } from "../../../../utils/tests/mockAudioNode"

// The future node that will be created by the generator
const futureNode = mockAudioNode()

describe("create", async () => {
  // Mocks a generator function that always returns the same AudioNode-like object
  const generator: NodeGenerator = vi.fn().mockReturnValue(futureNode)
  const template: InnerNodeTemplate = { name: "test template", id: "testId" as Uuid, generator }
  const spy = vi.spyOn(template, "generator")
  const innerNode: InnerNode = await create(template)

  it("Has the same name than the template", () => {
    expect(innerNode.name).toEqual('test template')
  })
  it("Has the same ID than the template", () => {
    expect(innerNode.id).toEqual('testId')
  })
  it('Has correctly called the generating function', () => {
    expect(spy).toHaveBeenCalledOnce()
  })
  it('Has created the node correctly', () => {
    expect(innerNode.audioNode).toEqual(futureNode)
  })
})