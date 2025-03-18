import type { ModulePayload } from "~/types/modules/AudioModule";
import { Repository } from '@jsynple/core';
import type { Requestable } from "@jsynple/core/dist/network/Api";
import type { Synthesizer } from "~/types/Index";

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export class ModulesRepository extends Repository<ModulePayload, CreationPayload> {
  public constructor(api: Requestable) {
    super('modules', api)
  }

  public override async list(token: string, synthesizer: Synthesizer): Promise<ModulePayload[]> {
    return super.list(token, { synthesizer_id: synthesizer.id});
  }
}

// export class ModulesRepository extends Repository<ModulePayload> {
//   public async createInSynthesizer(payload: CreationPayload): Promise<ModulePayload> {
//     return await api_post(`${this.BASE_URI}/modules`, payload);
//   }

//   public override async list(synthesizer: Synthesizer): Promise<ModulePayload[]> {
//     return super.list({ synthesizer_id: synthesizer.id});
//   }

//   public override async update({ rack, slot, id }: ModuleDescription): Promise<ModulePayload> {
//     return await api_put(this.uri(id), { slot, rack });
//   }
// }