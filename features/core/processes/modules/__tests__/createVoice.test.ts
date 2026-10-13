import { expect, describe, it, vi, beforeEach } from "vitest"
import { createVoiceTemplate } from "../createVoice.process"
import { mockAudioModule } from "../../../../utils/tests/mockAudioModule"
import { mockSynthesizer } from "../../../../utils/tests/mockSynthesizer"
import { mockInnerNode } from "../../../../utils/tests/mockInnerNode"
import type { InnerLink } from "../../../data/InnerLink.type"

const mocks = { connectNodes: vi.fn() }
const spy = vi.spyOn(mocks, "connectNodes")
const createVoice = createVoiceTemplate(mocks.connectNodes)

describe("createVoice", () => {
  describe("With only one node in one module", () => {
    const audioModule = mockAudioModule("id", [ mockInnerNode() ])
    const synthesizer = mockSynthesizer("synth name", [ audioModule ])

    it("creates the node in the polyphony layer", async () => {
      const voice = await createVoice(synthesizer)
      expect(Object.values(voice.nodes).length).toEqual(1)
    })
  })
  describe("With two connected nodes in the same module", () => {
    const nodes = [ mockInnerNode(0), mockInnerNode(1) ]
    const links: InnerLink[] = [ { from: { name: nodes[0].name, index: 0 }, to: { name: nodes[1].name, index: 0 } } ]

    const modules = [ mockAudioModule("id", nodes, links) ]
    const synthesizer = mockSynthesizer("synth name", modules)

    beforeEach(() => {
      vi.resetAllMocks()
      vi.clearAllMocks()
    })

    it("creates both nodes in the polyphony layer", async () => {
      const voice = await createVoice(synthesizer)
      expect(Object.values(voice.nodes).length).toEqual(2)
    })
    it("Connects both nodes", async () => {
      await createVoice(synthesizer)
      expect(spy).toHaveBeenCalledOnce()
    })
  })
  describe("With two nodes in two audio modules, connected with one another", () => {
    it ("creates both nodes in the polyphony layer", () => {

    })
    it("Connects both nodes", () => {

    })
  })
})