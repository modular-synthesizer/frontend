import IAccount from "../interfaces/IAccount"
import { IGenerator } from "../interfaces/IGenerator"
import IMembership from "../interfaces/synthesizers/IMembership"
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer"
import ITool, { IToolParameter } from "../interfaces/ITool"
import IGroup from "../interfaces/permissions/IGroup"
import IRight from "../interfaces/permissions/IRight"
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./Repository"

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
  synthesizers: new Repository<ISynthesizer>('synthesizers'),
  tools: new Repository<ITool>('tools'),
}