import { repositories } from "~/lib/repositories";
import type { ToolElementsRepository } from "~/lib/repositories/utils/ToolElementsRepository";
import type { InnerLink } from "~/types/blueprints/InnerLink";
import type { InnerNode } from "~/types/blueprints/InnerNode";
import type { ToolPort } from "~/types/blueprints/Port";
import type { Blueprint } from "~/types/blueprints/Blueprint";
import type { Identified } from "~/types/utils/Identified";

export interface ISelector {
  item?: any;
  delete(blueprint: Blueprint): void;
  select(item: any): void;
  reset(): void;
}

export class Selector<T extends Identified> implements ISelector {
  public item?: T;
  public readonly repository: ToolElementsRepository<T>;
  public readonly collection: keyof Blueprint;

  public constructor(repository: ToolElementsRepository<any>, collection: keyof Blueprint) {
    this.repository = repository;
    this.collection = collection;
  }

  public delete(blueprint: Blueprint): void {
    if (this.item !== undefined) {
      this.repository.remove(blueprint, blueprint[this.collection] as any[], this.item);
    }
    this.reset();
  }

  public select(item: T): void {
    useSelectables().reset();
    this.item = item;
  }

  public reset(): void {
    this.item = undefined;
  }
}

const state: Ref<Record<string, ISelector>> = ref({
  links: new Selector<InnerLink>(repositories.blueprint.links, 'links'),
  nodes: new Selector<InnerNode>(repositories.blueprint.nodes, 'nodes'),
  ports: new Selector<ToolPort>(repositories.blueprint.ports, 'ports'),
});

export function useSelectables() {
  return {
    state,
    delete(blueprint: Blueprint): void {
      Object.values(state.value).forEach((s: ISelector) => s.delete(blueprint));
    },
    reset() {
      Object.values(state.value).forEach((s: ISelector) => s.reset());
    }
  }
}