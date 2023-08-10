import { api } from "../api/Api";

export default class ItemsList<T extends { id: string }> {
  protected items: T[] = [];

  // URL used to make requests to create or delete elements.
  protected url: string;

  public constructor(url = "") {
    this.url = url;
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
    const response = await api.auth_post(`${this.url}`, payload);
    const item: T = response.data as T;
    this.append(item);
    return item;
  }
}