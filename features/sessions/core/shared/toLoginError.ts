import type { HttpError } from "../../../shared/http/http"
import type { Mapper } from "../../../shared/types/mapper.type"
import type { LoginError } from "../data/LoginError.type"

export const toLoginError: Mapper<HttpError, LoginError> = ({ status, key, message }) => {

  if (status >= 500 ) return { field: "form", reason: "unknown" }

  if (key === "username") {
    switch (message) {
      case "required":
        return { field: "username", reason: "required" }
      case "forbidden":
        return { field: "username", reason: "forbidden" }
      case "unknown":
        return { field: "username", reason: "unknown" }
    }
  }
  if (key === "password" && message === "required") {
    return { field: "password", reason: "required" }
  }
  
  return { field: "form", reason: "unknown" }
}
