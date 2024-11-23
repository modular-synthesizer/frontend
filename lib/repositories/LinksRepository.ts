import ILink from "../interfaces/ILink";
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import { Repository } from "./utils/Repository";

export default class LinksRepository extends Repository<ILink> {
    
  public async list(synthesizer: ISynthesizer): Promise<ILink[]> {
    return super.list({ synthesizer_id: synthesizer.id});
  }
}