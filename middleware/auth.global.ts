export default defineNuxtRouteMiddleware(async (_to, _from) => {
  if (process.client) {
    try {
      await useAuthentication().refresh();
    }
    catch (exception: any) {
      return navigateTo('/');
    }
  }
});