import type { Parameter } from "~/types/modules/Parameter";
import type Mod from "../wrappers/Mod";

export class ParametersFactory {
  public empty(mod: Mod): Parameter {
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