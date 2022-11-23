// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
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
  vue: {
    compilerOptions: {
      isCustomElement: tag => [
        'v-card-header',
        'v-card-header-text',
        'v-app-bar',
        'v-app-bar-title'
      ].includes(tag)
    }
  },
  runtimeConfig: {
    public: {
      api_uri: process.env.API_URL || 'http://localhost:3000',
      dev_mode: process.env.DEV_MODE == 'true'
    }
  }
})
