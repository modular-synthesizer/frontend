import { createI18n } from 'vue-i18n'
import fr from "~/locales/fr.json"
import en from "~/locales/en.json"

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: localStorage.getItem("lang") || "fr",
    messages: { en, fr }
  })

  vueApp.use(i18n)
})