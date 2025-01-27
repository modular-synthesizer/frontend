import type { AudioModule, ModulePayload, Parameters } from "~/types/modules/AudioModule";
import type { Channel } from "~/types/modules/Channel";
import type { InnerLink } from "~/types/tools/InnerLink";
import InnerNodesFactory from '~~/lib/factories/InnerNodes';
import InnerLinksFactory from '~~/lib/factories/InnerLinks';
import type { Generator } from '~~/types/Generator';
import { initParameters } from "../functions/parameters";
import type { ToolPort } from "~/types/tools/Port";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";
import type { Tool } from "~/types/tools/Tool";
import type { Port } from "~/types/modules/Port";
import type { Parameter } from "~/types/modules/Parameter";
import type { ToolParameter } from "~/types/tools/Parameter";
import { RACK_HEIGHT, SLOT_SIZE } from "~/lib/utils/constants";
import type { Control, ModControl } from "~/types/tools/Control";

export async function createModule(details: ModulePayload, generators: Array<Generator>, synthesizer: Synthesizer): Promise<AudioModule> {
  const module: AudioModule = {
    id: details.id,
    type: details.type,
    slots: details.slots,
    slot: details.slot,
    rack: details.rack,
    controls: [],
    parameters: {},
    ports: [],
    channels: await createChannels(details, generators, synthesizer.voices),
    category: details.category,
    x: details.slot * SLOT_SIZE,
    y: details.rack * RACK_HEIGHT,
    width: details.slots * SLOT_SIZE,
    height: RACK_HEIGHT,
  }
  module.parameters = initParameters(module, details.parameters);
  module.ports = instanciatePorts(module, details.ports);
  module.controls = details.controls.map((c: Control): ModControl => ({ ...c, module }));

  usePorts().addModulePorts(module);
  return module;
}

function instanciatePorts(module: AudioModule, ports: Array<ToolPort>): Array<Port> {
  return ports.map((tp: ToolPort) => ({ ...tp, link: undefined, mod: module }))
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
export function createChannels(details: ModulePayload, generators: Array<Generator>, voices: number): Promise<Array<Channel>> {
  const arr: Array<number> = new Array(voices).fill(null).map((_, i) => i);
  return Promise.all(arr.map(async (_, index: number) => {
    const nodes: Record<string, AudioNode> = await InnerNodesFactory.create(details.nodes, generators);
    const links: Array<InnerLink> = InnerLinksFactory.link(nodes, details.links);
    return { index, used: false, nodes, links}
  }));
}

function instanciateParameters(module: AudioModule, parameters: Array<ToolParameter>): Parameters {
  return initParameters(module, parameters.map((tp: ToolParameter): Parameter => ({ ...tp, mod: module, value: tp.default })));
}

export function createEmptyModule(tool: Tool): AudioModule {
  const module: AudioModule = {
    id: '', type: '', category: '', slot: 0, rack: 0, slots: 2, channels: [], ports: [], parameters: {}, controls: [], height: RACK_HEIGHT, width: 2 * SLOT_SIZE, x: 0, y: 0
  }
  module.ports = instanciatePorts(module, tool.ports);
  module.parameters = instanciateParameters(module, tool.parameters);
  return module;
}