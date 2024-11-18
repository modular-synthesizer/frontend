import { find, map, remove } from "lodash";
import { Identifiable } from "../interfaces/common/Identifiable";

/**
 * A repository provides CRUD methods to access to a resource on the API. It wraps HTTP calls and
 * makes it easier to pass parameters, save or fetch elements.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export class Repository<T extends Identifiable> {
  BASE_URI = '/proxy';

  private resource: string = '';

  public constructor(resource: string = '') {
    this.resource = resource;
  }

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

  public async update(payload: T): Promise<T> {
    return await api_put(this.uri(payload.id), payload);
  }

  protected uri(appended: string = ''): string {
    const resource: string[] = this.resource === '' ? [] : [ this.resource ];
    const ending: string[] = appended === '' ? [] : [ appended ];
    return [ this.BASE_URI, ...resource, ...ending ].join('/');
  }

  public remove(list: T[]): (id: string) => Promise<void> {
    return async (id: string) => {
      remove(list, (element: T) => (element.id === id));
      this.delete(id);
    }
  }

  public add(list: T[]): (details: T) => Promise<void> {
    return async (details: T) => {
      list.push(await this.create(details));
    };
  }
}