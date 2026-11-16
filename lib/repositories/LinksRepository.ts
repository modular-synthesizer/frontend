import { Repository } from "./utils/Repository";
import type { Identified } from "~/types/utils/Identified";

export default class LinksRepository extends Repository<Identified> {
    
  public override async list(id: string): Promise<Identified[]> {
    return super.list({ synthesizer_id: id});
  }
}