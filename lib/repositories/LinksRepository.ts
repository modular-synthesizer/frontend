import type { LinkPayload } from "~/types/Cable";
import { Repository } from "./utils/Repository";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

export default class LinksRepository extends Repository<LinkPayload> {
    
  public override async list(synthesizer: Synthesizer): Promise<LinkPayload[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }
}