import { Repository } from "./utils/Repository";
import type { Account } from '~/types/authentication/Account'

export default class AccountsRepository extends Repository<Account> {
  public async search(username: string): Promise<Account[]> {
    return api_get(this.uri('search'), { query: username });
  }
}