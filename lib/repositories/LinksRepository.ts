import type { LinkPayload } from "~/types/Cable";
import { Repository } from "./utils/Repository";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

export default class LinksRepository extends Repository<LinkPayload> {
    
  public override async list(id: string): Promise<LinkPayload[]> {
    return super.list({ synthesizer_id: id});
  }

  public override async create(payload: LinkPayload, synthesizer: Synthesizer|null = null) {
    if (synthesizer === null) return;
    return await api_post(this.uri(), { ...payload, synthesizer_id: synthesizer.id });
  }
}