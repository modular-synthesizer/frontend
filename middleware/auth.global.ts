import { routeGuard } from "~/features/sessions/shell/legacy/routeGuard.adapter";

export default defineNuxtRouteMiddleware(to => {
  const redirection = routeGuard(to.name)
  if (redirection !== null) return navigateTo(redirection)
});