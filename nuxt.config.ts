// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["vuetify/lib/styles/main.sass", "@mdi/font/css/materialdesignicons.min.css"],
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
  modules: [
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: ['en', 'ru',],
    defaultLocale: 'ru',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          welcome: 'Welcome'
        },
        ru: {
          welcome: 'Буржур'
        }
      }
    }
  }  
})
