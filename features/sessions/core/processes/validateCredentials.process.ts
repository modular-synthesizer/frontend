import { ko, ok, type Result } from "../../../shared/results/result";
import { USERNAME_MIN_LENGTH } from "../data/Constants";
import type { Credentials } from "../data/Credentials.type";
import type { LoginError } from "../data/LoginError.type";

export type ValidateCredentialsFct = (credentials: Credentials) => Result<Credentials, LoginError[]>

export const validateCredentials: ValidateCredentialsFct = ({ username, password }) => {
  const errors: LoginError[] = []

  if (username === "") errors.push({ field: "username", reason: "required" })
  else if (username.length < USERNAME_MIN_LENGTH) errors.push({ field: "username", reason: "minsize" })

  if (password === "") errors.push({ field: "password", reason: "required" })

  return errors.length ? ko(errors) : ok({ username, password })
}