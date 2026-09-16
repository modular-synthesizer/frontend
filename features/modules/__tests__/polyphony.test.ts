import { describe, expect, it, vi } from "vitest"
import { withWaan, type InnerNode, type NodeGenerator } from "../polyphony"

const runner = vi.fn()
const generator = { name: 'createGain', runner }
const generators: NodeGenerator[] = [ generator ]

describe("withWaan", () => {
  const instanciate = withWaan(generators)
  it("makes the node run correctly", async () => {
    const spy = vi.spyOn(generator, "runner")
    const node: InnerNode = await instanciate({ name: 'gain', generator: 'createGain', running: false })
    expect(node.running).toBe(true)
    expect(spy).toHaveBeenCalledOnce()
  })
})