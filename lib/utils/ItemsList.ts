import { api } from "../api/Api";
import { Identifiable, equals } from "../interfaces/common/Identifiable";

// Default values for the options, completing the ones provided when creating the list.
const defaults = {
  items: [],
  prepend: false,
  url: "",
  api: api,
  useClass: false,
}

/**
 * This function builds the item and parses the options to call appropriate methods depending on provided values :
 * - if autofetch set to TRUE then it triggers a fetch of the data
 * - if items have been passed in the options to initialize the list it appends them
 * @param options an option object used by the items list itself.
 */
export async function buildList<T extends Identifiable>(options = {}): Promise<ItemsList<T>> {
  const list: ItemsList<T> = new ItemsList<T>(options);
  if (list.options.items.length > 0) {
    list.touch();
    list.options.items.forEach((i: T) => list.append(i));
  }
  return list;
}


/**
 * Describes a list of item and provides methods to add/remove/edit them with or without calls to the API.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class ItemsList<T extends Identifiable> {
  protected items: T[] = [];

  private fetchedOnce: boolean = false;

  public options: { [key: string]: any };

  public constructor(options = {}) {
    this.options = { ...defaults, ...options }
  }

  public touch() {
    this.fetchedOnce = true;
  }

  public append(item: T): void {
    const instanced: any = this.options.useClass ? new this.options.useClass(item) : item
    this.all().push(instanced);
  }

  public prepend(item: T): void {
    const instanced: any = this.options.useClass ? new this.options.useClass(item) : item
    this.items = [instanced, ...this.all()];
  }

  public find(id: string): T {
    return this.all().find((i: T) => equals(i, { id })) as T;
  }

  public findIndex(id: string): number {
    return this.all().findIndex((i: T) => equals(i, { id }));
  }

  public update(id: string, payload: { [key: string]: any }): void {
    const item: T = this.find(id);
    Object.keys(payload).forEach((k: string) => {
      item[k as keyof T] = payload[k];
    })
  }

  public remove(id: string): void {
    this.all().splice(this.findIndex(id), 1);
  }

  public async create(payload: T): Promise<T> {
    const item: T = await this.options.api.auth_post(this.options.url, payload);
    this.options.prepend ? this.prepend(item) : this.append(item);
    return item;
  }

  public async delete(id: string): Promise<void> {
    this.remove(id);
    await api.auth_delete(`${this.options.url}/${id}`);
  }

  public async refresh(criterias: { [key: string]: any } = {}): Promise<void> {
    this.items = [];
    await this.fetch(criterias);
  }

  public async fetch(criterias: { [key: string]: any } = {}): Promise<void> {
    const items: T[] = await this.options.api.auth_get(this.options.url, criterias);
    items?.forEach((item: T) => this.append(item));
  }

  public all() {
    if (!this.fetchedOnce) {
      this.refresh();
      this.fetchedOnce = true;
    }
    return this.items;
  }

  public filter(comparator: (item: T) => boolean) {
    return this.all().filter(comparator)
  }

  public exclude(comparator: (item: T) => boolean) {
    return this.all().filter((item: T) => !comparator(item));
  }

  public get populated(): boolean {
    return !this.empty
  }

  public get empty(): boolean {
    return this.all().length <= 0;
  }
}