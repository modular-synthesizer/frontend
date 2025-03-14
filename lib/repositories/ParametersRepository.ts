import type { Parameter } from "~/types/modules/Parameter";
import { Repository } from "./utils/Repository";

export class ParametersRepository extends Repository<Parameter> {

  public constructor() {
    super('parameters');
  }

  public override update(parameter: Parameter): Promise<Parameter> {
    return api_put(this.uri(parameter.id), { value: parameter.value })
  }
}