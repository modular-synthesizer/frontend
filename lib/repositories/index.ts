import { IGenerator } from "../interfaces/IGenerator"
import IMembership from "../interfaces/synthesizers/IMembership"
import { InnerLink, InnerNode, IToolParameter, IToolPort } from "../interfaces/ITool"
import IGroup from "../interfaces/permissions/IGroup"
import IRight from "../interfaces/permissions/IRight"
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./utils/Repository"
import IApplication from "../interfaces/IApplication"
import ICategory from "../interfaces/ICategory"
import AccountsRepository from "./AccountsRepository"
import { IControl } from "../interfaces/IControl"
import SessionsRepository from "./SessionsRepository"
import SynthesizersRepository from "./SynthesizersRepository"
import ToolsRepository from "./toolsRepository"
import { ToolElementsRepository } from "./utils/ToolElementsRepository"

export type Repositories = { [key: string]: Repository<any> }

export const repositories = {
  accounts: new AccountsRepository('accounts'),
  applications: new Repository<IApplication>('applications'),
  categories: new Repository<ICategory>('categories'),
  generators: new Repository<IGenerator>('generators'),
  groups: new Repository<IGroup>('groups'),
  links: new LinksRepository('links'),
  memberships: new Repository<IMembership>('memberships'),
  modules: new ModulesRepository('modules'),
  tool: {
    controls: new ToolElementsRepository<IControl>('controls'),
    links: new ToolElementsRepository<InnerLink>('links'),
    nodes: new ToolElementsRepository<InnerNode>('nodes'),
    parameters: new ToolElementsRepository<IToolParameter>('parameters'),
    ports: new ToolElementsRepository<IToolPort>('ports'),
  },
  rights: new Repository<IRight>('rights'),
  sessions: new SessionsRepository('sessions'),
  synthesizers: new SynthesizersRepository('synthesizers'),
  tools: new ToolsRepository('tools'),
}