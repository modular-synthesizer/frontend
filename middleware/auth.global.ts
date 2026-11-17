const EXCLUDED_ROUTES: (string|symbol|undefined|null)[] = ['login', 'register']

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (EXCLUDED_ROUTES.includes(to.name)) return;
  if (process.client) {
    if (to.name !== "index" && !useSession().authenticated) return navigateTo('/');
  }
});