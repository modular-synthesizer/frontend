import type { HttpError } from "../../../shared/http/http";
import type { Mapper } from "../../../shared/types/mapper.type";
import type { RegistrationError } from "../data/RegistrationError.type";

export const toRegistrationError: Mapper<HttpError, RegistrationError> = ({ status, key, message }) => {
  if (status >= 500) return { field: "form", reason: "unknown" }

  switch (`${key}.${message}`) {
    case "username.required":
      return { field: "username", reason: "required" }
    case "username.uniq":
      return { field: "username", reason: "uniq" }
    case "username.length":
      return { field: "username", reason: "minsize" }
    case "email.required":
      return { field: "email", reason: "required" }
    case "email.format":
      return { field: "email", reason: "format" }
    case "email.uniq":
      return { field: "email", reason: "uniq" }
    case "password.required":
      return { field: "password", reason: "required" }
    case "password_confirmation.required":
      return { field: "password_confirmation", reason: "required" }
    case "password_confirmation.confirmation":
      return { field: "password_confirmation", reason: "confirmation" }
    default:
      return { field: "form", reason: "unknown" }
  }
}