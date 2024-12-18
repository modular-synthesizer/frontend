import { pick } from "lodash";
import type ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import type { Parameter } from '~/types/modules/Parameter';
import { Repository } from "./utils/Repository";
import type { PlacedModule } from "~/types/modules/AudioModule";

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export class ModulesRepository extends Repository<PlacedModule> {
  public async createInSynthesizer(payload: CreationPayload): Promise<PlacedModule> {
    return await api_post(`${this.BASE_URI}/modules`, payload);
  }

  public override async list(synthesizer: ISynthesizer): Promise<PlacedModule[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }

  public override async update(payload: PlacedModule): Promise<PlacedModule> {
    return await api_put(this.uri(payload.id), pick(payload, 'slot', 'rack'));
  }

  public async updateParameter(parameter: Parameter): Promise<Parameter> {
    await api_put(this.uri(parameter.mod.id), { parameters: [pick(parameter, 'id', 'value')] });
    return parameter;
  }
}