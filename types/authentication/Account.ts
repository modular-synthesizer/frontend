import type { Identified } from "../utils/Identified";

type HasUsername = {
  // The nickname of the user, supposed to be uniq for each account.
  username: string;
}

type HasPassword = {
  // The password, non-encrypted, of the user.
  password: string;
}

export type UnauthenticatedAccount = Identified & HasUsername & {
  // The email address of the user, supposed to be uniq.
  email: string;
}

export type Account = UnauthenticatedAccount & HasPassword & {
  // Supposed to be the same value than password, used to detect typos when registering.
  password_confirmation: string;
}

export type LoginAttempt = HasUsername & HasPassword;