import type { AudioModule, PolyphonyLayer } from "../../data/AudioModule.type"
import { populateLayer } from "./populateLayer.process"

/**
 * Gets or creates a polyphony layer in the provided module. A polyphony might be triggered by a MIDI input
 * module, and will propagate to other modules. This will give a simple way to propagate the creation to each
 * and every module, by instanciating them, then finding every cable linked to the module, and propagating
 * the creation of layers to them, etc.
 * 
 * The synthesizer then will be in a state where every module linked to a source will have AT LEAST the
 * same number of polyphony voices than this source. This will allow for convenient partial polyphony and
 * cohabitation between monophonic and polyphonic nodes.
 * 
 * @param audioModule The module in which the layer should be created or obtained.
 * @param index The index of the layer to get, must be equal or superior to zero.
 * 
 * @returns a polyphony layer with all inner nodes created and linked with inner links.
 */
export const getLayer = async (audioModule: AudioModule, index: number): Promise<PolyphonyLayer> => {
  if (!audioModule.layers[index]) {
    const layer = await populateLayer(audioModule.nodeTemplates)
    audioModule.layers[index] = { ...layer, audioModule }
  }
  return audioModule.layers[index]
}