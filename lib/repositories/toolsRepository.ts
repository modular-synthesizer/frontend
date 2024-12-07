import ITool, { InnerNode } from "../interfaces/ITool";
import { Repository } from "./utils/Repository";

export default class ToolsRepository extends Repository<ITool> {
  public async create(tool: ITool): Promise<ITool> {
    const { name, slots, categoryId } = tool
    return await api_post(this.uri(), { name, slots, categoryId });
  }
}