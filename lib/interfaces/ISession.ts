import { Identifiable } from "./common/Identifiable";

/**
 * A session gives information about who is currently logged in on a terminal,
 * and how they will be able to acess the API (their authentication token).
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default interface ISession extends Identifiable {
  id: string;
  // The authentication token to make queries on the API.
  token: string;
  // The display name of the user
  username: string;
  // The email to contact the user
  email: string;
  // TRUE if the user is an administrator, FALSE otherwise
  admin: boolean;
  account_id: string;
  rights: string[];
}