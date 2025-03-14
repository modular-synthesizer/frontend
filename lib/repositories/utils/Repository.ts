import { map, remove } from "lodash";
import { BaseRepository } from "./BaseRepository";
import type { Identified } from "~/types/utils/Identified";

/**
 * A repository provides CRUD methods to access to a resource on the API. It wraps HTTP calls and
 * makes it easier to pass parameters, save or fetch elements.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class Repository<T extends Identified> extends BaseRepository {

  public async list(payload: any = {}): Promise<T[]> {
    return await api_get(this.uri(), payload);
  }

  public async wrap(wrapper: any, payload: any = {}) {
    const list: T[] = await this.list(payload);
    return map(list, (item: T) => new wrapper(item));
  }

  public async get(id: string): Promise<T> {
    return await api_get(this.uri(id));
  }

  public async delete(id: string, payload: any = {}): Promise<void> {
    return await api_delete(this.uri(id), payload);
  }

  public async create(payload: T): Promise<T> {
    return await api_post(this.uri(), payload);
  }

  public async update(payload: T): Promise<any> {
    return await api_put(this.uri(payload.id), payload);
  }

  public remove(list: T[]): (id: string) => Promise<void> {
    return async (id: string) => {
      remove(list, (element: T) => (element.id === id));
      this.delete(id);
    }
  }

  public add(list: T[]): (details: T) => Promise<T> {
    return async (details: T): Promise<T> => {
      const creation: T = await this.create(details)
      list.push(creation);
      return creation
    };
  }
}