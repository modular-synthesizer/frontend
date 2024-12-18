import type { PlacedModule } from "~/types/modules/AudioModule";
import type { Parameter } from "~/types/modules/Parameter";

export class ParametersFactory {
  public empty(mod: PlacedModule): Parameter {
    return {
      id: "",
      name: "",
      minimum: 0,
      maximum: 1,
      step: 1,
      precision: 0,
      value: 0,
      targets: [],
      field: "",
      default: 0,
      mod
    }
  }
}

const factory = new ParametersFactory();

export default factory;