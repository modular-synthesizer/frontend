import { createVuetify } from 'vuetify'
import * as labs from 'vuetify/labs/components';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'dark',
    },
    components: {
      ...components,
      ...labs
    },
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})