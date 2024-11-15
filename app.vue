<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script lang="ts" setup>
const appConfig = useAppConfig();

useHead({
    titleTemplate: (titleChunk) =>
        titleChunk ? `${titleChunk} | ${appConfig.title}` : appConfig.title,
});
</script>
