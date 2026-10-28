// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  runtimeConfig: {
    public: {
      // Default value used if .env doesn't define NUXT_PUBLIC_API_BASE.
      // "public" means it is available in both server and browser code.
      apiBase: 'https://jsonplaceholder.typicode.com',
    },
  },
  
  modules: ['@nuxt/eslint', '@nuxt/hints','@pinia/nuxt', '@element-plus/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
