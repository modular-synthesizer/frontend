import type IModule from "../interfaces/modules/IModule";
import Synthesizer from "../wrappers/Synthesizer";
import type { Generator } from "../../types/Generator";
import { createModule } from "~/utils/factories/modules";
import type { PlacedModule } from "~/types/modules/AudioModule";

export class ModulesFactory {
  public empty(): PlacedModule {
    return {
      id: "",
      rack: 0,
      slot: 0,
      slots: 0,
      type: "",
      ports: [],
      parameters: {},
      controls: [],
      channels: []
    }
  }
  public async build(details: IModule, synthesizer: Synthesizer, generators: Generator[]) {
    return createModule(details, generators, synthesizer);
  }
}

const factory = new ModulesFactory();

export default factory;