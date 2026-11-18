import { ko, type Result } from "../../../shared/results/result"
import type { Registration } from "../../core/data/Registration.type"
import type { RegistrationError } from "../../core/data/RegistrationError.type"
import { createAccount, type CreateAccountFct } from "../api/createAccount.http"
import { validateRegistration } from "../../core/processes/validateRegistration.process"
import { receiveRegistration } from "../../core/processes/receiveRegistration.process"

export type RegisterAdapterFct = (registration: Registration) => Promise<Result<void, RegistrationError[]>>

export const makeRegister = (create: CreateAccountFct): RegisterAdapterFct => async registration => {
  const valid = validateRegistration(registration)
  if (!valid.ok) return ko<void, RegistrationError[]>(valid.error())
  return receiveRegistration(await create(valid.orNull()))
}

export const register = makeRegister(createAccount)
