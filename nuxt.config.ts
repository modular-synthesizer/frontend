// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  imports: {
    dirs: ['stores/**', 'composables/**'],
  },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    'mdi/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  runtimeConfig: {
    public: {
      api_uri: process.env.API_URL || 'https://synple.app/api',
      dev_mode: process.env.DEV_MODE == 'true'
    }
  }
})
