import { useTab } from "../../../composables/usetab"
import { createPost, createPut, type Tokens } from "./axios.http"
import { withAuthenticationGuard, type HttpRequest } from "./http"

const getTokens: () => Tokens = () => ({ auth_token: useSession().token, tab_id: useTab().id })

const resetSession = () => useSession().reset()

type RouteCreator = (tokens: () => Tokens) => HttpRequest

const createRoute = (creator: RouteCreator) =>
  withAuthenticationGuard(creator(getTokens), resetSession)

export const put = createRoute(createPut)

export const post = createRoute(createPost)