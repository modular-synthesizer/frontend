import { beforeEach, describe, expect, it, vi } from "vitest"
import type { AudioModule } from "~/features/core/data/AudioModule.type"
import type { InnerNodeTemplate } from "~/features/core/data/InnerNode.type"
import type { Uuid } from "~/features/core/data/Uuid.type"
import { getLayer } from "../getLayer.process"
import { mockAudioNode } from "../../../../utils/tests/mockAudioNode"
import { initializeModule } from "../initializeModule.process"
import type { InnerLink } from "~/features/core/data/InnerLink.type"

const futureNode = mockAudioNode()

const template: InnerNodeTemplate = {
  id: "templateId" as Uuid,
  name: "template name",
  generator: vi.fn().mockResolvedValue(futureNode)
}

describe("getLayer", () => {

  describe("With only one inner node", () => {

    const audioModule: AudioModule = initializeModule({
      id: "moduleId" as Uuid,
      nodeTemplates: [ template ]
    })

    beforeEach(() => (audioModule.layers = []))

    it("Creates a layer in a module", async () => {
      const layer = await getLayer(audioModule, 0)
      expect(layer.innerNodes.length).toEqual(1)
      expect(audioModule.layers.length).toEqual(1)
    })
    it("Creates another layer if the index is free", async () => {
      await getLayer(audioModule, 0)
      await getLayer(audioModule, 1)
      expect(audioModule.layers.length).toEqual(2)
    })
    it("Does not create a layer if it already exists", async () => {
      await getLayer(audioModule, 0)
      await getLayer(audioModule, 0)
      expect(audioModule.layers.length).toEqual(1)
    })
    it("Does not create all layers between two indexes, only the needed ones", async () => {
      await getLayer(audioModule, 0)
      await getLayer(audioModule, 2)
      expect(audioModule.layers.length).toEqual(3)
      expect(audioModule.layers[1]).toEqual(undefined)
    })
  })

  describe("With two nodes and an inner link", () => {

    const otherfutureNode = mockAudioNode()

    const otherTemplate: InnerNodeTemplate = {
      id: "otherId" as Uuid,
      name: "other name",
      generator: vi.fn().mockResolvedValue(otherfutureNode)
    }

    const link: InnerLink = { from: { name: "template name" }, to: { name: "other name" } }

    const audioModule: AudioModule = initializeModule({
      id: "moduleId" as Uuid,
      nodeTemplates: [ template, otherTemplate ],
      linkTemplates: [ link ]
    })

    const connectSpy = vi.spyOn(futureNode, "connect")

    beforeEach(() => (audioModule.layers = []))

    it("Connects the nodes only once per layer", async () => {
      await getLayer(audioModule, 0)
      await getLayer(audioModule, 0)
      expect(connectSpy).toHaveBeenCalledOnce()
    })
  })
})