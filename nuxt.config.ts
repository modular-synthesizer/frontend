// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/robots'
  ],
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
  vue: {
    compilerOptions: {
      isCustomElement: tag => [
        'v-card-header',
        'v-card-header-text',
      ].includes(tag)
    }
  },
  runtimeConfig: {
    public: {
      api_uri: process.env.API_URL || 'https://synple.app/api',
      dev_mode: process.env.DEV_MODE == 'true',
      ws_url: process.env.WS_URL || 'wss://synple.app/ws',
      processors_url: process.env.PROCESSORS_URL || 'https://localhost:9080',
    }
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
})
