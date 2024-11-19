import { pick } from "lodash";
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import { Repository } from "./Repository";

export default class SynthesizersRepository extends Repository<ISynthesizer> {
  public async update(synthesizer: ISynthesizer): Promise<ISynthesizer> {
    return api_put(this.uri(synthesizer.id), pick(synthesizer, 'scale', 'x', 'y'))
  }
}