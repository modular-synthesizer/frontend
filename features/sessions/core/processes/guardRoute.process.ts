import { ANONYMOUS_ROUTES, HOME_PATH, PUBLIC_ROUTES } from "../data/Constants"

export type GuardRouteFct = (route: string, authenticated: boolean) => string | null

export const guardRoute: GuardRouteFct = (route, authenticated) => {
  if (ANONYMOUS_ROUTES.includes(route)) return authenticated ? HOME_PATH : null
  if (PUBLIC_ROUTES.includes(route)) return null
  return authenticated ? null : HOME_PATH
}
