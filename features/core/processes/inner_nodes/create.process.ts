import type { InnerNode, InnerNodeTemplate } from "../../data/InnerNode.type";
import type { InLayer, PolyphonyLayer } from "../../data/AudioModule.type";

/**
 * Instanciates an audio node inside a polyphony layer from an inner node template providing the
 * literal code used to create it.
 * 
 * @param template the template that will provide the generator to create the audio node inside.
 * 
 * @return A promise to create the inner node. For some nodes (eg. microphone entries)
 */
export const create = async (template: InnerNodeTemplate): Promise<InnerNode> => {
  const innerNode = {
    id: template.id,
    name: template.name,
    audioNode: await template.generator()
  }

  return innerNode
}

export const createInLayer = async (template: InnerNodeTemplate, layer: PolyphonyLayer): Promise<InLayer<InnerNode>> => {
  return { layer, ...(await create(template)) }
}