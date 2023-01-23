import IModule from "../interfaces/IModule";
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
    return new Mod({...details, nodes: audioNodes})
  }
}

const factory = new ModulesFactory();

export default factory;