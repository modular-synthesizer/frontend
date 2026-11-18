export type RegistrationError =
  | { field: "username", reason: "required" | "minsize" | "uniq" }
  | { field: "email", reason: "required" | "format" | "uniq" }
  | { field: "password", reason: "required" }
  | { field: "password_confirmation", reason: "required" | "confirmation" }
  | { field: "form", reason: "unknown" }