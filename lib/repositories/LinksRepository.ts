import ILink from "../interfaces/ILink";
import ISynthesizer from "../interfaces/ISynthesizer";
import { Repository } from "./Repository";

export default class LinksRepository extends Repository<ILink> {
    
  public async list(synthesizer: ISynthesizer): Promise<ILink[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }
}