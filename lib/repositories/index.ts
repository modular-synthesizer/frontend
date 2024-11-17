import IAccount from "../interfaces/IAccount"
import { IGenerator } from "../interfaces/IGenerator"
import IMembership from "../interfaces/IMembership"
import ISynthesizer from "../interfaces/ISynthesizer"
import ITool, { IToolParameter } from "../interfaces/ITool"
import IGroup from "../interfaces/permissions/IGroup"
import IRight from "../interfaces/permissions/IRight"
import Synthesizer from "../wrappers/Synthesizer"
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./Repository"
import { WrappedRepository } from "./WrappedRepository"

export type Repositories = { [key: string]: Repository<any> }

export const repositories = {
  accounts: new Repository<IAccount>('accounts'),
  generators: new Repository<IGenerator>('generators'),
  groups: new Repository<IGroup>('groups'),
  memberships: new Repository<IMembership>('memberships'),
  links: new LinksRepository('links'),
  modules: new ModulesRepository('modules'),
  tool: {
    parameters: new Repository<IToolParameter>('tools/parameters'),
  },
  rights: new Repository<IRight>('rights'),
  synthesizers: new WrappedRepository<ISynthesizer, Synthesizer>('synthesizers', Synthesizer),
  tools: new Repository<ITool>('tools'),
}