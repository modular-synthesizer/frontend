import { remove } from "lodash";
import { Identifiable } from "../../interfaces/common/Identifiable";
import ITool from "../../interfaces/ITool";
import { BaseRepository } from "./BaseRepository";

/**
 * This repository holds all the specific logic for elements embedded in a tool (nodes, links, parameters, etc.).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class ToolElementsRepository<T extends Identifiable> extends BaseRepository {

  constructor(path: string) {
    super(`tools/${path}`)
  }

  public async create(tool: ITool, element: T): Promise<T> {
    return await api_post(this.uri(), { ...element, tool_id: tool.id });
  }

  public async update(tool: ITool, collection: T[], item: T): Promise<T> {
    const updatedItem: T = await api_put(this.uri(item.id), { ...item, tool_id: tool.id });
    const index: number = collection.findIndex((e: T) => e.id === item.id);
    if (index > -1) collection[index] = updatedItem;
    return updatedItem;
  }

  public async delete(tool: ITool, element: T): Promise<void> {
    return await api_delete(this.uri(element.id), { tool_id: tool.id });
  }

  public async remove(tool: ITool, list: T[], element: T): Promise<void> {
    await this.delete(tool, element);
    remove(list, (i: T) => i.id === element.id);
  }
}