import { pick } from "lodash";
import type ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import type { Parameter } from '~/types/modules/Parameter';
import { Repository } from "./utils/Repository";
import type { AudioModule } from "~/types/modules/AudioModule";
import type { InnerNode } from "~/types/tools/InnerNode";

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export type ModulePayload = AudioModule & { nodes: Array<InnerNode>, parameters: Array<Parameter> };

export class ModulesRepository extends Repository<ModulePayload> {
  public async createInSynthesizer(payload: CreationPayload): Promise<ModulePayload> {
    return await api_post(`${this.BASE_URI}/modules`, payload);
  }

  public override async list(synthesizer: ISynthesizer): Promise<ModulePayload[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }

  public override async update(payload: ModulePayload): Promise<ModulePayload> {
    return await api_put(this.uri(payload.id), pick(payload, 'slot', 'rack'));
  }

  public async updateParameter(parameter: Parameter): Promise<Parameter> {
    await api_put(this.uri(parameter.mod.id), { parameters: [pick(parameter, 'id', 'value')] });
    return parameter;
  }
}