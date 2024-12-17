import { pick } from "lodash";
import type IModule from "../interfaces/modules/IModule";
import type ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import type { Parameter } from '~/types/modules/Parameter';
import { Repository } from "./utils/Repository";

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export class ModulesRepository extends Repository<IModule> {
  public async createInSynthesizer(payload: CreationPayload): Promise<IModule> {
    return await api_post(`${this.BASE_URI}/modules`, payload);
  }

  public override async list(synthesizer: ISynthesizer): Promise<IModule[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }

  public override async update(payload: IModule): Promise<IModule> {
    return await api_put(this.uri(payload.id), pick(payload, 'slot', 'rack'));
  }

  public async updateParameter(parameter: Parameter): Promise<Parameter> {
    await api_put(this.uri(parameter.mod.id), { parameters: [pick(parameter, 'id', 'value')] });
    return parameter;
  }
}