import type { Parameter } from '~/types/modules/Parameter';
import { Repository } from "./utils/Repository";
import type { ModuleDescription, ModulePayload } from "~/types/modules/AudioModule";
import type { Synthesizer } from '~/types/synthesizers/Synthesizer';

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export class ModulesRepository extends Repository<ModulePayload> {
  public async createInSynthesizer(payload: CreationPayload): Promise<ModulePayload> {
    return await api_post(`${this.BASE_URI}/modules`, payload);
  }

  public override async list(synthesizer: Synthesizer): Promise<ModulePayload[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }

  public override async update({ rack, slot, id }: ModuleDescription): Promise<ModulePayload> {
    return await api_put(this.uri(id), { slot, rack });
  }
}