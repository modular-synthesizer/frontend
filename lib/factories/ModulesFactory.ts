import IModule from "../interfaces/IModule";
import Channel from "../wrappers/Channel";
import Mod from "../wrappers/Mod";
import InnerNodesFactory from "./InnerNodes"
import InnerLinksFactory from "./InnerLinks"
import ISynthesizer from "../interfaces/ISynthesizer";
import Synthesizer from "../wrappers/Synthesizer";

export class ModulesFactory {
  public empty(): IModule {
    return {
      id: "",
      nodes: [],
      links: [],
      rack: 0,
      slot: 0,
      slots: 0,
      type: "",
      ports: [],
      parameters: [],
      category: "",
      controls: []
    }
  }
  public async build(details: IModule, synthesizer: ISynthesizer|Synthesizer) {
    const channels: Channel[] = [];
    for (let i = 0 ; i < synthesizer.voices ; ++i) {
      const channel = new Channel(i);
      channel.nodes = await InnerNodesFactory.create(details.nodes);
      channel.links = InnerLinksFactory.link(channel.nodes, details.links);
      channels.push(channel);
    }
    return new Mod({...details, channels})
  }
}

const factory = new ModulesFactory();

export default factory;