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
  plugins: [
    {src: '~plugins/vee-validate.js', ssr: true},
  ],
  modules: [
    'bootstrap-vue/nuxt',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
       {
         set: '@fortawesome/free-solid-svg-icons',
         icons: ['fas']
       },
       {
         set:'@fortawesome/free-brands-svg-icons',
         icons: ['fab']
       }
     ]
    }],
    '@nuxtjs/axios',
    ['nuxt-i18n', {
      vueI18n: {
        fallbackLocale: 'en',
      },
      locales: [
        {
          code: 'en',
          name: 'English',
          file: 'en.js'
          // domain: 'streaming.center'
        },
        {
          code: 'ru',
          name: 'Русский',
          file: 'ru.js'
          // domain: 'radio-tochka.com'
        }
      ],
      detectBrowserLanguage: {
        // If enabled, a cookie is set once a user has been redirected to his
        // preferred language to prevent subsequent redirections
        // Set to false to redirect every time
        useCookie: true,
        // Cookie name
        cookieKey: 'i18n_redirected',
        // Set to always redirect to value stored in the cookie, not just once
        alwaysRedirect: false,
        // If no locale for the browsers locale is a match, use this one as a fallback
        fallbackLocale: 'en'
      },
      lazy: true,
      strategy: 'no_prefix',
      langDir: 'lang/',
      defaultLocale: 'en',
      // differentDomains: true
    }]
    //['@nuxtjs/axios', {
    //  baseURL: process.env.BASE_URL || 'http://localhost:8000'
    //}]
  ],

}
