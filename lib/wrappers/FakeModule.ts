import Mod from "./Mod";
import Parameter from "./Parameter";
import ParametersFactory from "~~/lib/factories/ParametersFactory"

export class FakeModule extends Mod {
  public param(_name: string): Parameter {
    return new Parameter(ParametersFactory.empty(), this)
  }
}