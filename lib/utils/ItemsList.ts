import { api } from "../api/Api";

// Default values for the options, completing the ones provided when creating the list.
const defaults = {
  items: [],
  autofetch: true,
  prepend: false,
  url: "",
  api: api,
}

/**
 * This function builds the item and parses the options to call appropriate methods depending on provided values :
 * - if autofetch set to TRUE then it triggers a fetch of the data
 * - if items have been passed in the options to initialize the list it appends them
 * @param options an option object used by the items list itself.
 */
export async function buildList<T extends { id?: string; }>(options = {}): Promise<ItemsList<T>> {
  const list: ItemsList<T> = new ItemsList<T>(options);
  if (list.options.autofetch) await list.refresh();
  list.options.items.forEach((i: T) => list.append(i));
  return list;
}


/**
 * Describes a list of item and provides methods to add/remove/edit them with or without calls to the API.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class ItemsList<T extends { id?: string }> {
  protected items: T[] = [];

  public options: { [key: string]: any };

  public constructor(options = {}) {
    this.options = { ...defaults, ...options }
  }

  public append(item: T): void {
    this.items.push(item);
  }

  public prepend(item: T): void {
    this.items = [item, ...this.items];
  }

  public find(id: string): T {
    return this.items.find((i: T) => i.id === id) as T;
  }

  public findIndex(id: string): number {
    return this.items.findIndex((i: T) => i.id === id);
  }

  public update(id: string, payload: { [key: string]: any }): void {
    const item: T = this.find(id);
    Object.keys(payload).forEach((k: string) => {
      item[k as keyof T] = payload[k];
    })
  }

  public remove(id: string): void {
    this.items.splice(this.findIndex(id), 1);
  }

  public async create(payload: T): Promise<T> {
    const item: T = await this.options.api.auth_post(this.options.url, payload);
    this.options.prepend ? this.prepend(item) : this.append(item);
    return item;
  }

  public async delete(id: string): Promise<void> {
    await api.auth_delete(`${this.options.url}/${id}`)
    this.remove(id);
  }

  public async refresh(): Promise<void> {
    this.items = [];
    await this.fetch();
  }

  public async fetch(): Promise<void> {
    const items: T[] = await this.options.api.auth_get(this.options.url);
    items?.forEach((item: T) => this.append(item));
  }

  public all() {
    return this.items;
  }

  public get populated(): boolean {
    return !this.empty
  }

  public get empty(): boolean {
    return this.items.length <= 0;
  }
}