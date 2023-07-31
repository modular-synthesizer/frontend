import { useAccounts } from "~~/stores/common/accounts";

export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (process.client) {
    if (localStorage.getItem('auth-token') === null) {
      return navigateTo('/');
    }
    else {
      await useAuthentication().refresh();
      if (!useAuthentication().authenticated) {
        useAuthentication().logout();
        return navigateTo('/');
      }
      useAccounts().fetchOwn()
    }
  }
});