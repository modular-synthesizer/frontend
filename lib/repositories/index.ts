import { IGenerator } from "../interfaces/IGenerator"
import ISynthesizer from "../interfaces/ISynthesizer"
import IRight from "../interfaces/permissions/IRight"
import Synthesizer from "../wrappers/Synthesizer"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./Repository"
import { WrappedRepository } from "./WrappedRepository"

export type Repositories = { [key: string]: Repository<any> }

export const repositories = {
  generators: new Repository<IGenerator>('generators'),
  modules: new ModulesRepository('modules'),
  rights: new Repository<IRight>('rights'),
  synthesizers: new WrappedRepository<ISynthesizer, Synthesizer>('synthesizers', Synthesizer),
}