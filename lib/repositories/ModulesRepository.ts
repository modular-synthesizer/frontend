import IModule from "../interfaces/IModule";
import ISynthesizer from "../interfaces/ISynthesizer";
import { Repository } from "./Repository";

type CreationPayload = { tool_id: string, synthesizer_id: string, rack: number, slot: number };

export class ModulesRepository extends Repository<IModule> {
  public async createInSynthesizer(payload: CreationPayload): Promise<IModule> {
    return await api_post(`${this.BASE_URI}/modules`, payload);
  }

  public async list(synthesizer: ISynthesizer): Promise<IModule[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }
}