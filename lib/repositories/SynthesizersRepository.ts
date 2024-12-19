import { pick } from "lodash";
import { Repository } from "./utils/Repository";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

export default class SynthesizersRepository extends Repository<Synthesizer> {
  public override async update(synthesizer: Synthesizer): Promise<Synthesizer> {
    return api_put(this.uri(synthesizer.id), pick(synthesizer, 'scale', 'x', 'y'))
  }
}