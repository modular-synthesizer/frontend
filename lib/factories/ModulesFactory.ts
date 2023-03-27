import IModule from "../interfaces/IModule";
import { POLYPHONY_CHANNELS } from "../utils/constants";
import Channel from "../wrappers/Channel";
import InnerAudioNode from "../wrappers/InnerAudioNode";
import Mod from "../wrappers/Mod";
import InnerNodesFactory from "./InnerNodes"
import InnerLinksFactory from "./InnerLinks"

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

  public async build(details: IModule) {

    const channels: Channel[] = [];
    for (let i = 0 ; i < POLYPHONY_CHANNELS ; ++i) {
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