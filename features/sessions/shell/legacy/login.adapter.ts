import type { RunEffectFct } from "../../../shared/facts";
import type { Credentials } from "../../core/data/Credentials.type";
import type { LoginError } from "../../core/data/LoginError.type";
import type { CreateSessionFct } from "../api/createSession.http";
import type { SessionsEffect } from "../../core/data/Effect.type";
import { validateCredentials } from "../../core/processes/validateCredentials.process";
import { receiveLogin } from "../../core/processes/receiveLogin.process";
import type { Session as LegacySession } from "~/types/authentication/Session";
import type { Session } from "../../core/data/Session.type";
import type { Mapper } from "../../../shared/types/mapper.type";

export type LoginAdapterFct = (attempt: Credentials) => Promise<LoginError[]>

export type LoginAdapterFactory = (create: CreateSessionFct, run: RunEffectFct<SessionsEffect>) => LoginAdapterFct

export const makeLogin: LoginAdapterFactory = (create, run) =>
  async credentials => {
    const valid = validateCredentials(credentials)
    if (!valid.ok) return valid.error()
    const { errors, effects } = receiveLogin(await create(valid.orNull()))
    for (const effect of effects) await run(effect)
    return errors
  }

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