import { beforeEach, describe, expect, it, vi } from "vitest"
import type { AudioModule } from "~/features/core/data/AudioModule.type"
import type { InnerNode, InnerNodeTemplate } from "~/features/core/data/InnerNode.type"
import type { Uuid } from "~/features/core/data/Uuid.type"
import { getLayer } from "../getLayer.process"
import { mockAudioNode } from "../../../../utils/tests/mockAudioNode"

describe("getLayer", () => {

  const futureNode = mockAudioNode()

  const innerNode: InnerNode = {
    id: "templateId" as Uuid,
    name: "template name",
    audioNode: futureNode
  }

  const template: InnerNodeTemplate = {
    id: "templateId" as Uuid,
    name: "template name",
    generator: vi.fn().mockReturnValue(innerNode)
  }

  const audioModule: AudioModule = {
    id: "moduleId" as Uuid,
    controls: [],
    layers: [],
    nodeTemplates: [ ]
  }
  
  audioModule.nodeTemplates = [ { ...template, audioModule } ]

  beforeEach(() => {
    audioModule.layers = []
  })

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
})