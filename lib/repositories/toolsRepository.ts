import type { Tool, UncategorizedTool } from "~/types/tools/Tool";
import { Repository } from "./utils/Repository";

export default class ToolsRepository extends Repository<Tool> {
  public override async create(tool: Tool): Promise<Tool> {
    const { name, slots } = tool
    return await api_post(this.uri(), { name, slots, categoryId: tool.category.id });
  }

  public override async update(tool: Tool): Promise<Tool> {
    const payload = { ...tool, categoryId: tool.category.id}
    return await api_put(this.uri(payload.id), tool);
  }

  public async updateNode(tool: Tool, node: InnerNode): Promise<InnerNode> {
    return await api_put(this.uri(`/nodes/${node.id}`), { ...node, tool_id: tool.id })
  }
}