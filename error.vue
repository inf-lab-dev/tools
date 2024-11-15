<template>
    <div class="error">
        <div class="error__title">
            <span class="error__icon">{{ icon }}</span>
            <h1 class="error__code title">{{ error.statusCode }}</h1>
        </div>
        <p v-if="error.statusMessage" class="error__message subtitle">
            {{ error.statusMessage }}
        </p>

        <NuxtLink to="/" class="error__button button is-primary">
            Go back home
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const ICONS = {
    404: '🤔',
    default: '❌',
};

const appConfig = useAppConfig();

const props = defineProps<{
    error: NuxtError;
}>();

const icon = computed(
    () => ICONS[props.error.statusCode as keyof typeof ICONS] ?? ICONS.default,
);

useHead({
    title: `${props.error.statusCode} | ${appConfig.title}`,
});
</script>

<style lang="scss" scoped>
.error {
    display: flex;

    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 1rem;
    gap: 0.5rem;

    width: 100vw;
    height: 100vh;

    &__title {
        display: flex;

        justify-content: center;
        align-items: center;

        gap: 0.1rem;
    }

    &__icon {
        font-size: 1000%;
    }

    &__code {
        font-size: 400%;
    }

    &__message {
        font-size: 150%;
    }

    &__button {
        margin-top: 1.5rem;
    }
}
</style>
