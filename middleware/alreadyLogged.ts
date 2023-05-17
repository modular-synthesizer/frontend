export default defineNuxtRouteMiddleware((_to, _from) => {
  if (process.client && localStorage.getItem('auth-token') !== null) {
    return navigateTo('/');
  }
});