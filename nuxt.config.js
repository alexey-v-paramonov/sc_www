module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Streaming.center',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Streaming.center website' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    //transpile: ['bootstrap-vue'], // Remove this with bootstrap rc.22
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        /*config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })*/
      }
    }
  },
  plugins: [],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    ['nuxt-i18n', {
      locales: [
        {
          code: 'en',
          name: 'English',
          file: 'en.js'
        },
        {
          code: 'ru',
          name: 'Русский',
          file: 'ru.js'
        }
      ],
      lazy: true,
      langDir: 'lang/',
      defaultLocale: 'en',
    }]
    //['@nuxtjs/axios', {
    //  baseURL: process.env.BASE_URL || 'http://localhost:8000'
    //}]
  ],

}
