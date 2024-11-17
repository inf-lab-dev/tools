// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    css: ['bulma'],

    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    silenceDeprecations: ['legacy-js-api'],
                    quietDeps: true,
                },
            },
        },
    },

    components: {
        dirs: [],
    },
});
