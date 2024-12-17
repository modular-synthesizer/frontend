import type { Session } from "~/types/authentication/Session";
import { Repository } from "./utils/Repository";

export default class SessionsRepository extends Repository<Session> {
  public async auth(username: string, password: string): Promise<Session> {
    return api_post(this.uri(), { username, password });
  }
}