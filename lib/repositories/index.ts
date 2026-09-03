import type { ToolPort } from '~~/types/blueprints/Port';
import type { ToolParameter } from '~~/types/blueprints/Parameter';
import type { InnerLink } from '~~/types/blueprints/InnerLink';
import type { InnerNode } from '~~/types/blueprints/InnerNode';
import LinksRepository from "./LinksRepository"
import { Repository } from "./utils/Repository"
import type { Application } from "../../types/Application"
import AccountsRepository from "./AccountsRepository"
import SessionsRepository from "./SessionsRepository"
import ToolsRepository from "./toolsRepository"
import { ToolElementsRepository } from "./utils/ToolElementsRepository"
import type { Category } from "~/types/blueprints/Category";
import type { Control } from "~/types/blueprints/Control";
import type { Membership } from "~/types/synthesizers/Membership";
import type { Right } from "~/types/permissions/Right";
import type { Group } from "~/types/permissions/Group";
import type { Generator, ModulePayload, Synthesizer } from '~/types/Index';
import type { Parameter } from '~/types/modules/Parameter';

export type Repositories = Record<string, Repository<{ id: string }>>;

export const repositories = {
  accounts: new AccountsRepository('accounts'),
  applications: new Repository<Application>('applications'),
  categories: new Repository<Category>('categories'),
  generators: new Repository<Generator>('generators'),
  groups: new Repository<Group>('groups'),
  links: new LinksRepository('links'),
  memberships: new Repository<Membership>('memberships'),
  modules: new Repository<ModulePayload>('modules'),
  parameters: new Repository<Parameter>('modules/parameters'),
  blueprint: {
    controls: new ToolElementsRepository<Control>('controls'),
    links: new ToolElementsRepository<InnerLink>('links'),
    nodes: new ToolElementsRepository<InnerNode>('nodes'),
    parameters: new ToolElementsRepository<ToolParameter>('parameters'),
    ports: new ToolElementsRepository<ToolPort>('ports'),
  },
  rights: new Repository<Right>('rights'),
  sessions: new SessionsRepository('sessions'),
  synthesizers: new Repository<Synthesizer>('synthesizers'),
  blueprints: new ToolsRepository('blueprints'),
}