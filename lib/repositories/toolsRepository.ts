import type { Tool } from "~/types/tools/Tool";
import { Repository } from "./utils/Repository";

export default class ToolsRepository extends Repository<Tool> {
  public override async create(tool: Tool): Promise<Tool> {
    const { name, slots, categoryId } = tool
    return await api_post(this.uri(), { name, slots, categoryId });
  }
}