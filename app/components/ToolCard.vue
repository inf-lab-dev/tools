<template>
    <div class="card">
        <span class="card__icon">{{ icon }}</span>
        <NuxtLink as="h1" class="card__title" :to="href">
            {{ title }}
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    icon: string;
    href: string;
}>();
</script>

<style lang="scss" scoped>
.card {
    position: relative;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    padding: 1rem;
    margin-bottom: 0;

    &__icon {
        font-size: 330%;
    }

    &__title {
        font-size: 300%;
        font-weight: bold;
        text-align: center;
    }
}
</style>
