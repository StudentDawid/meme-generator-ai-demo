import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  build: {
    transpile: ['vuetify'],
  },

  modules: ['@pinia/nuxt', (_options, nuxt) => {
    nuxt.hooks.hook('vite:extendConfig', (config) => {
      // @ts-expect-error plugin type workaround
      config.plugins.push(vuetify({ autoImport: true }))
    })
  }, '@nuxt/eslint'],

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})