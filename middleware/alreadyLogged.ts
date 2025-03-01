export default defineNuxtRouteMiddleware((_to, _from) => {
  if (process.client && useSession().authenticated) {
    return navigateTo('/');
  }
});