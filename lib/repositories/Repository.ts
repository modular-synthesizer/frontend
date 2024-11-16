import { find, remove } from "lodash";
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

  public async list(): Promise<T[]> {
    console.log(this.BASE_URI, this.resource);
    return await api_get([this.BASE_URI, this.resource].join('/'));
  }

  public async get(id: string): Promise<T> {
    return await api_get([this.BASE_URI, this.resource, id].join('/'));
  }

  public async delete(id: string, payload: any = {}): Promise<void> {
    return await api_delete([this.BASE_URI, this.resource, id].join('/'), payload);
  }

  public async create(payload: T): Promise<T> {
    return await api_post([this.BASE_URI, this.resource].join('/'), payload);
  }

  public async update(payload: T) {
    const uri: string = [this.BASE_URI, this.resource, payload.id].join('/')
    return await api_put(uri, payload);
  }

  public remove(list: T[]) {
    return async (id: string) => {
      remove(list, (element: T) => (element.id === id));
      this.delete(id);
    }
  }
}