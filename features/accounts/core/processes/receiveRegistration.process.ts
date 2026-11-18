import type { HttpError } from "../../../shared/http/http";
import { ko, ok, type Result } from "../../../shared/results/result";
import type { RegistrationError } from "../data/RegistrationError.type";
import { toRegistrationError } from "../shared/toRegistrationError";

export type ReceiveRegistrationFct = (response: Result<void, HttpError>) => Result<void, RegistrationError[]>

export const receiveRegistration: ReceiveRegistrationFct = response => {
  return response.ok ? ok(undefined) : ko([ toRegistrationError(response.error()) ])
}
