import { Repository } from "@jsynple/core";
import type { Requestable } from "@jsynple/core/dist/network/Api";
import { pick } from "lodash";
import type { Synthesizer } from "~/types/synthesizers/Synthesizer";

export default class SynthesizersRepository extends Repository<Synthesizer> {
  public constructor(api: Requestable) {
    super('synthesizers', api);
  }
  public override async update(synthesizer: Synthesizer): Promise<Synthesizer> {
    return api_put(this.uri(synthesizer.id), pick(synthesizer, 'scale', 'x', 'y'))
  }
}