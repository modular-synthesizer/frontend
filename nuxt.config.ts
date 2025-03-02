import fs from 'fs'
import { startsWith } from 'lodash'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [ ],
  imports: {
    dirs: ['composables/**'],
  },
  ssr: false,
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
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
      ws_url: process.env.WS_URL || 'wss://synple.app/ws',
      processors_url: process.env.PROCESSORS_URL || 'https://localhost:9080',
      sse_url: process.env.SSE_URL || 'https://localhost:4000',
    }
  },
  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },
  hooks: {
    'components:extend': (components: Component[]) => {
      const filtered: Component[] = components.filter((c: any) => {
        return startsWith(c.kebabName, 'controls-');
      });
      const mapped: string[] = filtered.map((c: any) => c.pascalName);
      fs.writeFileSync ('public/json/controls.json', JSON.stringify(mapped));
    }
  }
})
