import type { Credentials } from "../../core/data/Credentials.type";
import type { Session } from "../../core/data/Session.type";
import type { HttpError, HttpRequest } from "../../../shared/http/http";
import { type Result } from "../../../shared/results/result";
import { post } from "../../../shared/http/nuxt.http";
import { parseSession } from "../dto/ApiSession.dto";

export type CreateSessionFct = (credentials: Credentials) => Promise<Result<Session, HttpError>>

type CreateSessionFactory = (post: HttpRequest) => CreateSessionFct

export const makeCreateSession: CreateSessionFactory = post => async credentials => {
  return (await post("/proxy/sessions", credentials))
    .flatMap(parseSession)
}

export const createSession: CreateSessionFct = makeCreateSession(post)
