import type { HttpError, HttpRequest } from "../../../shared/http/http"
import type { Registration } from "../../core/data/Registration.type"
import { ok, type Result } from "../../../shared/results/result"
import { post } from "../../../shared/http/nuxt.http"

export type CreateAccountFct = (registration: Registration) => Promise<Result<void, HttpError>>

export const makeCreateAccount = (post: HttpRequest): CreateAccountFct =>
  async ({ username, email, password, password_confirmation }) =>
    (await post("/proxy/accounts", { username, email, password, password_confirmation }))
      .flatMap(() => ok<void, HttpError>(undefined))

export const createAccount = makeCreateAccount(post)
