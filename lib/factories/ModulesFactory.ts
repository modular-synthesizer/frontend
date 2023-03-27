import IModule from "../interfaces/IModule";
import { POLYPHONY_CHANNELS } from "../utils/constants";
import Channel from "../wrappers/Channel";
import InnerAudioNode from "../wrappers/InnerAudioNode";
import Mod from "../wrappers/Mod";
import InnerNodesFactory from "./InnerNodes"

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
    const audioNodes: InnerAudioNode[] = await InnerNodesFactory.create(details.nodes);

    const channels: Channel[] = [];
    for (let i = 0 ; i < POLYPHONY_CHANNELS ; ++i) {
      const channel = new Channel(i);
      channel.nodes = await InnerNodesFactory.create(details.nodes);
      channels.push(channel);
    }
    return new Mod({...details, nodes: audioNodes, channels})
  }
}

const factory = new ModulesFactory();

export default factory;