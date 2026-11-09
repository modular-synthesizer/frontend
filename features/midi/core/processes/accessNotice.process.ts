import { assertNever } from "../../../shared/facts";
import type { AccessNotice, AccessStatus } from "../data/Access.type";

export type AccessNoticeFct = (status: AccessStatus) => AccessNotice | null

export const accessNotice: AccessNoticeFct = status => {
  switch (status) {
    case "unsupported":
      return "midi.access.unsupported"
    case "denied":
      return "midi.access.denied"
    case "ready":
      return null
    default:
      return assertNever(status)
  }
}