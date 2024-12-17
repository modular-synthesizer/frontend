import IModule from "../interfaces/modules/IModule";
import Mod from "../wrappers/Mod";
import InnerNodesFactory from "./InnerNodes"
import InnerLinksFactory from "./InnerLinks"
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import Synthesizer from "../wrappers/Synthesizer";
import { IGenerator } from "../interfaces/IGenerator";
import IPlacableModule from "../interfaces/modules/IPlacableModule";
import type { Channel } from "~/types/modules/Channel";
import type { InnerLink } from "~/types/tools/InnerLink";

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
      const nodes: Record<string, AudioNode> = await InnerNodesFactory.create(details.nodes, generators);
      const links: Array<InnerLink> = InnerLinksFactory.link(nodes, details.links);
      channels.push({ index: i, used: false, nodes, links });
    }
    return new Mod({...details, channels})
  }
}

const factory = new ModulesFactory();

export default factory;