import ISession from "../interfaces/ISession";
import { Repository } from "./Repository";

export default class SessionsRepository extends Repository<ISession> {
  public async auth(username: string, password: string): Promise<ISession> {
    return api_post(this.uri(), { username, password });
  }
}