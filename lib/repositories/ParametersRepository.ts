import { Repository } from "@jsynple/core";
import type { Requestable } from "@jsynple/core/dist/network/Api";
import type { Parameter } from "~/types/modules/Parameter";

export class ParametersRepository extends Repository<Parameter> {

  public constructor(api: Requestable) {
    super('parameters', api);
  }
}