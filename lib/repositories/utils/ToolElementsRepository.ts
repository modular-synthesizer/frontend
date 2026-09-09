import { remove } from "lodash";
import { BaseRepository } from "./BaseRepository";
import type { Blueprint } from "~/types/blueprints/Blueprint";
import type { Identified } from "~/types/utils/Identified"

/**
 * This repository holds all the specific logic for elements embedded in a blueprint (nodes, links, parameters, etc.).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class ToolElementsRepository<T extends Identified> extends BaseRepository {

  constructor(path: string) {
    super(`blueprints/${path}`)
  }

  public async create(blueprint: Blueprint, element: T): Promise<T> {
    return await api_post(this.uri(), { ...element, blueprint_id: blueprint.id });
  }

  public async update(blueprint: Blueprint, item: T): Promise<T> {
    return await api_put(this.uri(item.id), { ...item, blueprint_id: blueprint.id });
  }

  public async delete(blueprint: Blueprint, element: T): Promise<void> {
    return await api_delete(this.uri(element.id), { blueprint_id: blueprint.id });
  }

  public async remove(blueprint: Blueprint, list: T[], element: T): Promise<void> {
    await this.delete(blueprint, element);
    remove(list, (i: T) => i.id === element.id);
  }
}