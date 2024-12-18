import type IModule from "~/lib/interfaces/modules/IModule";
import type { AudioModule, PlacedModule } from "~/types/modules/AudioModule";
import type { Channel } from "~/types/modules/Channel";
import type { InnerLink } from "~/types/tools/InnerLink";
import InnerNodesFactory from '~~/lib/factories/InnerNodes';
import InnerLinksFactory from '~~/lib/factories/InnerLinks';
import type { Generator } from '~~/types/Generator';
import type Synthesizer from "~/lib/wrappers/Synthesizer";
import { createParameters } from "../functions/parameters";

export async function createModule(details: IModule, generators: Array<Generator>, synthesizer: Synthesizer): Promise<AudioModule> {
  return {
    id: '',
    type: details.type,
    slots: details.slots,
    controls: details.controls,
    parameters: createParameters(details.parameters),
    ports: details.ports,
    channels: await createChannels(details, generators, synthesizer.voices)
  }
}

export function placeModule(module: AudioModule, slot: number, rack: number): PlacedModule {
  return { ...module, slot, rack };
}

/**
 * Creates all the polyphony channels used in the synthesizer. Every channel holds a full copy of the nodes and links
 * declared in the modules, themselves derived from the template of nodes and links created in the corresponding tool.
 * 
 * @param details The details about the modules. TODO : replace the interface with a type.
 * @param generators The list of generators to get the code to instanciate the inner nodes in each channel.
 * @param voices The number of channels to create, depending on the number of polyphony voices of the synthesizer.
 * 
 * @returns the list of channels created with the given schema of nodes and links.
 */
export function createChannels(details: IModule, generators: Array<Generator>, voices: number): Promise<Array<Channel>> {
  const arr: Array<number> = new Array(voices).fill(null).map((_, i) => i);
  return Promise.all(arr.map(async (_, index: number) => {
    const nodes: Record<string, AudioNode> = await InnerNodesFactory.create(details.nodes, generators);
    const links: Array<InnerLink> = InnerLinksFactory.link(nodes, details.links);
    return { index, used: false, nodes, links}
  }));
}