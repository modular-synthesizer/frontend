import type { Blueprint } from "~/types/blueprints/Blueprint";
import { Repository } from "./utils/Repository";
import type { InnerNode } from "~/types/blueprints/InnerNode";

export default class ToolsRepository extends Repository<Blueprint> {
  public override async create(blueprint: Blueprint): Promise<Blueprint> {
    const { name, slots } = blueprint
    return await api_post(this.uri(), { name, slots, categoryId: blueprint.category.id });
  }

  public override async update(blueprint: Blueprint): Promise<Blueprint> {
    const payload = { ...blueprint, categoryId: blueprint.category.id}
    return await api_put(this.uri(payload.id), blueprint);
  }

  public async updateNode(blueprint: Blueprint, node: InnerNode): Promise<InnerNode> {
    return await api_put(this.uri(`/nodes/${node.id}`), { ...node, blueprint_id: blueprint.id })
  }
}