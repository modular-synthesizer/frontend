export type LoginError =
  | { field: "username", reason: "required" | "minsize" | "unknown" | "forbidden" }
  | { field: "password", reason: "required" }
  | { field: "form", reason: "unknown" }

export type LoginField = "username" | "password"
