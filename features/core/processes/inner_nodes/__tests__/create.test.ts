import { describe, expect, it, vi } from "vitest"
import { create } from "../create.process"
import type { InnerNode, InnerNodeTemplate } from "~/features/core/data/InnerNode.type"
import type { Uuid } from "~/features/core/data/Uuid.type"

describe("create", async () => {
  const returnedNode: AudioNode = vi.fn() as unknown as AudioNode
  const generator = vi.fn().mockReturnValue(returnedNode)
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
    expect(innerNode.audioNode).toEqual(returnedNode)
  })
})