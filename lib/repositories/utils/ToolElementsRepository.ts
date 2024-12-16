import { remove } from "lodash";
import { BaseRepository } from "./BaseRepository";
import type { Tool } from "~/types/tools/Tool";
import type { Identified } from "~/types/utils/Identified"

/**
 * This repository holds all the specific logic for elements embedded in a tool (nodes, links, parameters, etc.).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class ToolElementsRepository<T extends Identified> extends BaseRepository {

  constructor(path: string) {
    super(`tools/${path}`)
  }

  public async create(tool: Tool, element: T): Promise<T> {
    return await api_post(this.uri(), { ...element, tool_id: tool.id });
  }

  public async update(tool: Tool, collection: T[], item: T): Promise<T> {
    const updatedItem: T = await api_put(this.uri(item.id), { ...item, tool_id: tool.id });
    const index: number = collection.findIndex((e: T) => e.id === item.id);
    if (index > -1) collection[index] = updatedItem;
    return updatedItem;
  }

  public async delete(tool: Tool, element: T): Promise<void> {
    return await api_delete(this.uri(element.id), { tool_id: tool.id });
  }

  public async remove(tool: Tool, list: T[], element: T): Promise<void> {
    await this.delete(tool, element);
    remove(list, (i: T) => i.id === element.id);
  }
}