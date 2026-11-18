import { ko, ok, type Result } from "../../../shared/results/result"
import { USERNAME_MIN_LENGTH } from "../../../shared/data/Constants"
import { EMAIL_FORMAT } from "../data/Constants"
import type { Registration } from "../data/Registration.type"
import type { RegistrationError } from "../data/RegistrationError.type"

export type ValidateRegistrationFct = (registration: Registration) => Result<Registration, RegistrationError[]>

export const validateRegistration: ValidateRegistrationFct = ({ username, email, password, password_confirmation }) => {
  const errors: RegistrationError[] = []

  if (username === "") errors.push({ field: "username", reason: "required" })
  else if (username.length < USERNAME_MIN_LENGTH) errors.push({ field: "username", reason: "minsize" })

  if (email === "") errors.push({ field: "email", reason: "required" })
  else if (!EMAIL_FORMAT.test(email)) errors.push({ field: "email", reason: "format" })

  if (password === "") errors.push({ field: "password", reason: "required" })

  if (password_confirmation === "") errors.push({ field: "password_confirmation", reason: "required" })
  else if (password_confirmation !== password) errors.push({ field: "password_confirmation", reason: "confirmation" })

  return errors.length ? ko(errors) : ok({ username, password, email, password_confirmation })
}
