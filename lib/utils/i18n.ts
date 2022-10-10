import { createI18n } from "vue-i18n";
import fr from "~/locales/fr.json"
import en from "~/locales/en.json"

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  messages: { en, fr }
})

export default i18n;