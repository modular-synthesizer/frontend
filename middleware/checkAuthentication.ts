export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (process.client) {
    if (localStorage.getItem('auth-token') === null) {
      return navigateTo('/');
    }
    else {
      useAuthentication().refresh();
      if (!useAuthentication().authenticated) useAuthentication().logout();
    }
  }
});