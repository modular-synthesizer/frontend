import { guardRoute } from "../../core/processes/guardRoute.process"
import { isAuthenticated } from "../../core/shared/isAuthenticated"

export type RouteGuardAdapterFct = (name: unknown) => string | null

export const makeRouteGuard = (token: () => string): RouteGuardAdapterFct => name =>
  guardRoute(typeof name === "string" ? name : "", isAuthenticated(token()))

export const routeGuard = makeRouteGuard(() => useSession().token)
