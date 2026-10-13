import type { InnerNode, InnerNodeTemplate } from "../../data/InnerNode.type";
import type { InVoice, PolyphonyVoice } from "../../data/Synthesizer.type";

export type CreateNodeFct = (t: InnerNodeTemplate) => Promise<InnerNode>;

/**
 * Instanciates an audio node inside a polyphony layer from an inner node template providing the
 * literal code used to create it.
 * 
 * @param template the template that will provide the generator to create the audio node inside.
 * 
 * @return A promise to create the inner node. For some nodes (eg. microphone entries)
 */
export const createNode: CreateNodeFct = async (template) => {
  const innerNode = {
    id: template.id,
    name: template.name,
    audioNode: await template.generator()
  }

  return innerNode
}

export type CreateInVoiceFct = (t: InnerNodeTemplate, v: PolyphonyVoice) => Promise<InVoice<InnerNode>>;

/**
 * Makes the backlink in the template to acess the voice directly.
 * 
 * @param template the template to link to the voice.
 * @param voice  the voice to link to the template.
 * 
 * @returns the node linked to the voice so that the voice can be accessed back.
 */
export const createInVoice: CreateInVoiceFct = async (template, voice) => {
  return { voice, ...(await createNode(template)) }
}