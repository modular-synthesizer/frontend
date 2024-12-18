import type { LinkPayload } from "~/types/Cable";
import type ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import { Repository } from "./utils/Repository";

export default class LinksRepository extends Repository<LinkPayload> {
    
  public override async list(synthesizer: ISynthesizer): Promise<LinkPayload[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }
}