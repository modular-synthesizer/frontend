import type { Identified } from "../utils/Identified";
import type { UnauthenticatedAccount } from "./Account";

export type Session = Identified & {
  // The authentication token to make queries on the API.
  token: string;
  // DEPRECATED : TRUE if the user is an administrator, FALSE otherwise
  admin: boolean;
  // The list of rights the user is supposed to have. Rights are double checked on the API.
  rights: string[];
  // The informations about the account that created this session.
  account: UnauthenticatedAccount;
}