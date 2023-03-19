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
    locales: [
      {
        code: 'en',
        file: 'en.json',
        domain: 'streaming.center'
      },
      {
        code: 'ru',
        file: 'ru.json',
        domain: 'radio-tochka.com'
      },
    ],
    lazy: true,
    langDir: 'lang',
    defaultLocale: 'en'
  }  
})
