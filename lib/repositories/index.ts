import { IGenerator } from "../interfaces/IGenerator"
import IMembership from "../interfaces/synthesizers/IMembership"
import ISynthesizer from "../interfaces/synthesizers/ISynthesizer"
import ITool, { IToolParameter } from "../interfaces/ITool"
import IGroup from "../interfaces/permissions/IGroup"
import IRight from "../interfaces/permissions/IRight"
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./Repository"
import IApplication from "../interfaces/IApplication"
import ICategory from "../interfaces/ICategory"
import AccountsRepository from "./AccountsRepository"
import { IControl } from "../interfaces/IControl"

export type Repositories = { [key: string]: Repository<any> }

export const repositories = {
  accounts: new AccountsRepository('accounts'),
  applications: new Repository<IApplication>('applications'),
  categories: new Repository<ICategory>('categories'),
  generators: new Repository<IGenerator>('generators'),
  groups: new Repository<IGroup>('groups'),
  memberships: new Repository<IMembership>('memberships'),
  links: new LinksRepository('links'),
  modules: new ModulesRepository('modules'),
  tool: {
    controls: new Repository<IControl>('tools/controls'),
    parameters: new Repository<IToolParameter>('tools/parameters'),
  },
  rights: new Repository<IRight>('rights'),
  synthesizers: new Repository<ISynthesizer>('synthesizers'),
  tools: new Repository<ITool>('tools'),
}