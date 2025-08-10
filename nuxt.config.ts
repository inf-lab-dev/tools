// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    css: ['bulma'],

    components: {
        dirs: [],
    },

    monacoEditor: {
        locale: 'de',
    },

    modules: ['nuxt-monaco-editor'],
});
