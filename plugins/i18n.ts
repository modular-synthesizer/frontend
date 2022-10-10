import i18n from "~/lib/utils/i18n"

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(i18n)
});