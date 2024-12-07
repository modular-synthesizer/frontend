import IModule from "../interfaces/modules/IModule";
import Channel from "../wrappers/Channel";
import Mod from "../wrappers/Mod";
import InnerNodesFactory from "./InnerNodes"
import InnerLinksFactory from "./InnerLinks"
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import Synthesizer from "../wrappers/Synthesizer";
import { IGenerator } from "../interfaces/IGenerator";
import IPlacableModule from "../interfaces/modules/IPlacableModule";

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
      controls: [],
      intersects(_module: IPlacableModule) {
        return false;
      }
    }
  }
  public async build(details: IModule, synthesizer: ISynthesizer|Synthesizer, generators: IGenerator[]) {
    const channels: Channel[] = [];
    for (let i = 0 ; i < synthesizer.voices ; ++i) {
      const channel = new Channel(i);
      channel.nodes = await InnerNodesFactory.create(details.nodes, generators);
      channel.links = InnerLinksFactory.link(channel.nodes, details.links);
      channels.push(channel);
    }
    return new Mod({...details, channels})
  }
}

const factory = new ModulesFactory();

export default factory;