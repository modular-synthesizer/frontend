import { type RouteRecordName } from "vue-router";

const EXCLUDED_ROUTES: (RouteRecordName|undefined|null)[] = ['login', 'register']

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (EXCLUDED_ROUTES.includes(to.name)) return;
  if (process.client) {
    if (to.name !== "index" && !useSession().authenticated) return navigateTo('/');
  }
});