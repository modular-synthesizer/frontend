import type { Session } from "../../../core/data/Session.type";
import type { Mapper } from "../../../../shared/types/mapper.type";
import type { Session as LegacySession } from "../../../../../types/authentication/Session";

export const toLegacySession: Mapper<Session, LegacySession> = session => ({
  id: "",
  token: session.token,
  admin: session.admin,
  rights: session.rights.map(r => ({ id: "", label: r})),
  account: {
    id: session.account.id,
    username: session.account.username,
    email: session.account.email
  }
})