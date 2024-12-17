import type { Parameter } from "~/types/modules/Parameter";
import Mod from "./Mod";
import ParametersFactory from "~~/lib/factories/ParametersFactory"

export class FakeModule extends Mod {
  public override param(_name: string): Parameter {
    return ParametersFactory.empty(this);
  }
}