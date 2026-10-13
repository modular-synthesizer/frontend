import type { InSynthesizer, PolyphonyVoice, Synthesizer } from "../../data/Synthesizer.type"
import { connectNodes, type ConnectNodesFct } from "../inner_links/connectNodes.process";
import { createNode } from "../inner_nodes/create.process";

export type CreateVoiceFct = (s: Synthesizer) => Promise<InSynthesizer<PolyphonyVoice>>;

export function createVoiceTemplate(connectNodes: ConnectNodesFct): CreateVoiceFct {
  return async synthesizer => {
    const voice: PolyphonyVoice = { nodes: {} }
    for(let audioModule of synthesizer.audioModules) {
      for(let template of audioModule.nodeTemplates) {
        voice.nodes[template.name] = await createNode(template)
      }
      for(let template of audioModule.linkTemplates) {
        connectNodes(voice.nodes[template.from.name], voice.nodes[template.to.name])
      }
    }
    return { synthesizer, ...voice }
  }
}

/**
 * Creates a new voice by iterating on every inner node template of every module in the synthesizer,
 * and creating a node from it in the newly created polyphony voice.
 * 
 * @param synthesizer the whole synthesizer to "clone and represent" its node templates as nodes, and
 *   its links templates as connections between nodes, in the result layer.
 * 
 * @returns A created polyphony layer with the whole structure reproduced and connected.
 */
export const createVoice: CreateVoiceFct = createVoiceTemplate(connectNodes)