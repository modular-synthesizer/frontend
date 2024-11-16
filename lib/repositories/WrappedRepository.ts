import { Identifiable } from "../interfaces/common/Identifiable";
import { Repository } from "./Repository";

export class WrappedRepository<It extends Identifiable, T extends It> extends Repository<It> {

  private wrapper: any = null;
  
  public constructor(resource: string, wrapper: any = null) {
    super(resource);
    this.wrapper = wrapper;
  }

  public async list(): Promise<T[]> {
    return (await super.list()).map((details: It): T => {
      return new this.wrapper(details) as T;
    });
  }

  public async create(payload: It): Promise<T> {
    return new this.wrapper(await super.create(payload));
  }
}