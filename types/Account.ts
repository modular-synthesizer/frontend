import type { Identified } from "./utils/Identified";

export type Account = Identified & {
  // The nickname of the user, supposed to be uniq for each account.
  username: string;
  // The password, non-encrypted, of the user.
  password: string;
  // Supposed to be the same value than password, used to detect typos when registering.
  password_confirmation: string;
  // The email address of the user, supposed to be uniq.
  email: string;
}