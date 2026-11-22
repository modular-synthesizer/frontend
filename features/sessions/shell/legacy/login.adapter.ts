import type { RunEffectFct } from "../../../shared/facts";
import type { Credentials } from "../../core/data/Credentials.type";
import type { LoginError } from "../../core/data/LoginError.type";
import { createSession, type CreateSessionFct } from "../api/createSession.http";
import type { SessionsEffect } from "../../core/data/Effect.type";
import { validateCredentials } from "../../core/processes/validateCredentials.process";
import { receiveLogin } from "../../core/processes/receiveLogin.process";
import { runEffect } from "../effect";

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

export const login = makeLogin(createSession, runEffect)