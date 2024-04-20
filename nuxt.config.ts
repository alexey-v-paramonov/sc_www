//import { createResolver } from '@nuxt/kit'
//const { resolve } = createResolver(import.meta.url)
import vuetify from "vite-plugin-vuetify";

export default defineNuxtConfig({
  ssr: false,
  app: {
    keepalive: false
  },
  css: ["@/assets/main.scss", "@mdi/font/css/materialdesignicons.min.css"],
  devtools: { enabled: true },
  // enable takeover mode
  typescript: { shim: false },
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    'vue3-perfect-scrollbar/nuxt',
    async (options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins ||= [];
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  googleFonts: {
    families: {
      'Raleway':[400,500,600,700],
    }
  },
  i18n: {
    locales: [
      {
        code: 'en',
        file: 'en.json',
        domain: 'app.streaming.center'
      },
      {
        code: 'ru',
        file: 'ru.json',
        domain: 'app.radio-tochka.com'
        // domain: 'localhost'
      },
    ],
    lazy: true,
    langDir: 'lang',
    differentDomains: true,
    detectBrowserLanguage: false,
    defaultLocale: 'en'
  },
  runtimeConfig: {
    public: {
      baseURL: 'https://streaming.center/api/v1',
      //baseURL: 'http://localhost:9191/api/v1',
    },
  },
  //devServer: {
  //  port: 8080
  //}
})
