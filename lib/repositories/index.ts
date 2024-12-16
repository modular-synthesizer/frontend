import { IGenerator } from "../interfaces/IGenerator"
import IMembership from "../interfaces/synthesizers/IMembership"
import type { ToolPort } from '~~/types/tools/Port';
import type { ToolParameter } from '~~/types/tools/Parameter';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import IGroup from "../interfaces/permissions/IGroup"
import IRight from "../interfaces/permissions/IRight"
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./utils/Repository"
import IApplication from "../interfaces/IApplication"
import AccountsRepository from "./AccountsRepository"
import { IControl } from "../interfaces/IControl"
import SessionsRepository from "./SessionsRepository"
import SynthesizersRepository from "./SynthesizersRepository"
import ToolsRepository from "./toolsRepository"
import { ToolElementsRepository } from "./utils/ToolElementsRepository"
import type { Category } from "~/types/tools/Category";

export type Repositories = { [key: string]: Repository<any> }

export const repositories = {
  accounts: new AccountsRepository('accounts'),
  applications: new Repository<IApplication>('applications'),
  categories: new Repository<Category>('categories'),
  generators: new Repository<IGenerator>('generators'),
  groups: new Repository<IGroup>('groups'),
  links: new LinksRepository('links'),
  memberships: new Repository<IMembership>('memberships'),
  modules: new ModulesRepository('modules'),
  tool: {
    controls: new ToolElementsRepository<IControl>('controls'),
    links: new ToolElementsRepository<InnerLink>('links'),
    nodes: new ToolElementsRepository<InnerNode>('nodes'),
    parameters: new ToolElementsRepository<ToolParameter>('parameters'),
    ports: new ToolElementsRepository<ToolPort>('ports'),
  },
  rights: new Repository<IRight>('rights'),
  sessions: new SessionsRepository('sessions'),
  synthesizers: new SynthesizersRepository('synthesizers'),
  tools: new ToolsRepository('tools'),
}