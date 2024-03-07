import { VuetifyOptions, createVuetify } from 'vuetify'
import * as labs from 'vuetify/labs/components';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@/styles/main.scss'

export default defineNuxtPlugin(nuxtApp => {
  const opt: VuetifyOptions = {
    theme: {
      defaultTheme: 'dark',
    },
    components: {
      ...components,
      ...labs
    },
    directives,
  }
  nuxtApp.vueApp.use(createVuetify(opt))
})