import type { Generator } from "../../types/Generator"
import type { ToolPort } from '~~/types/tools/Port';
import type { ToolParameter } from '~~/types/tools/Parameter';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import LinksRepository from "./LinksRepository"
import { ModulesRepository } from "./ModulesRepository"
import { Repository } from "./utils/Repository"
import type { Application } from "../../types/Application"
import AccountsRepository from "./AccountsRepository"
import SessionsRepository from "./SessionsRepository"
import SynthesizersRepository from "./SynthesizersRepository"
import ToolsRepository from "./toolsRepository"
import { ToolElementsRepository } from "./utils/ToolElementsRepository"
import type { Category } from "~/types/tools/Category";
import type { Control } from "~/types/tools/Control";
import type { Membership } from "~/types/synthesizers/Membership";
import type { Right } from "~/types/permissions/Right";
import type { Group } from "~/types/permissions/Group";
import { ParametersRepository } from "./ParametersRepository";
import { GeneratorsRepository } from "@jsynple/core";
import { Api } from "@jsynple/core/dist/network/Api";

export type Repositories = Record<string, Repository<any>>;

export const api = new Api(window.fetch.bind(window));

export const repositories = {
  accounts: new AccountsRepository('accounts'),
  applications: new Repository<Application>('applications'),
  categories: new Repository<Category>('categories'),
  generators: new GeneratorsRepository(api),
  groups: new Repository<Group>('groups'),
  links: new LinksRepository('links'),
  memberships: new Repository<Membership>('memberships'),
  modules: new ModulesRepository('modules'),
  parameters: new ParametersRepository(),
  tool: {
    controls: new ToolElementsRepository<Control>('controls'),
    links: new ToolElementsRepository<InnerLink>('links'),
    nodes: new ToolElementsRepository<InnerNode>('nodes'),
    parameters: new ToolElementsRepository<ToolParameter>('parameters'),
    ports: new ToolElementsRepository<ToolPort>('ports'),
  },
  rights: new Repository<Right>('rights'),
  sessions: new SessionsRepository('sessions'),
  synthesizers: new SynthesizersRepository('synthesizers'),
  tools: new ToolsRepository('tools'),
}