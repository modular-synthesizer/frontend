import type { Tool, UncategorizedTool } from "~/types/tools/Tool";
import { Repository } from "./utils/Repository";

export default class ToolsRepository extends Repository<Tool> {
  public override async create(tool: Tool): Promise<Tool> {
    const { name, slots } = tool
    return await api_post(this.uri(), { name, slots, categoryId: tool.category.id });
  }

  public override async update(payload: Tool): Promise<Tool> {
    return await api_put(this.uri(payload.id), { ...payload, categoryId: payload.category.id});
  }
}