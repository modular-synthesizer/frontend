import IAccount from "../interfaces/IAccount";
import { Repository } from "./utils/Repository";

export default class AccountsRepository extends Repository<IAccount> {
  public async search(username: string): Promise<IAccount[]> {
    return api_get(this.uri('search'), { query: username });
  }
}