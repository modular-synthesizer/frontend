import { vi } from "vitest"
import type { InnerNodeTemplate, NodeGenerator } from "../../core/data/InnerNode.type"
import type { Uuid } from "~/features/core/data/Uuid.type"
import { mockAudioNode } from "./mockAudioNode"

export function mockInnerNode(index: number = 0): InnerNodeTemplate {
    const mockedAudioNode = mockAudioNode()
    const generator: NodeGenerator = vi.fn().mockResolvedValue(mockedAudioNode)
    return{ name: `template.${index}`, id: `id.tpl.${index}` as Uuid, generator }
}