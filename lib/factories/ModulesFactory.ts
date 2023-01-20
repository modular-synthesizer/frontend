import IModule from "../interfaces/IModule";

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
}

const factory = new ModulesFactory();

export default factory;