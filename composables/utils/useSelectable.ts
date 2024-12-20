import { repositories } from "~/lib/repositories";
import type { ToolElementsRepository } from "~/lib/repositories/utils/ToolElementsRepository";
import type { InnerLink } from "~/types/tools/InnerLink";
import type { InnerNode } from "~/types/tools/InnerNode";
import type { ToolPort } from "~/types/tools/Port";
import type { Tool } from "~/types/tools/Tool";
import type { Identified } from "~/types/utils/Identified";

export interface ISelector {
  item?: any;
  delete(tool: Tool): void;
  select(item: any): void;
  reset(): void;
}

export class Selector<T extends Identified> implements ISelector {
  public item?: T;
  public readonly repository: ToolElementsRepository<T>;
  public readonly collection: keyof Tool;

  public constructor(repository: ToolElementsRepository<any>, collection: keyof Tool) {
    this.repository = repository;
    this.collection = collection;
  }

  public delete(tool: Tool): void {
    if (this.item !== undefined) {
      this.repository.remove(tool, tool[this.collection] as any[], this.item);
    }
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
  links: new Selector<InnerLink>(repositories.tool.links, 'links'),
  nodes: new Selector<InnerNode>(repositories.tool.nodes, 'nodes'),
  ports: new Selector<ToolPort>(repositories.tool.ports, 'ports'),
});

export function useSelectables() {
  return {
    state,
    delete(tool: Tool): void {
      Object.values(state.value).forEach((s: ISelector) => {
        s.delete(tool);
        s.reset()
      })
    },
    reset() {
      Object.values(state.value).forEach((s: ISelector) => s.reset());
    }
  }
}