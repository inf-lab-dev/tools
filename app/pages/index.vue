<template>
    <div class="wrapper">
        <h1 class="wrapper__title title">Tools</h1>
        <div class="wrapper__items grid is-col-min-11">
            <ToolCard title="Lösungseditor" href="/solution-editor" icon="🔒" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import ToolCard from '~/components/ToolCard.vue';
</script>

<style lang="scss" scoped>
.wrapper {
    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 1.5rem;

    width: 100%;
    min-height: 80vh;

    &__title {
        font-size: 780%;
    }

    &__items {
        width: 100%;
    }
}
</style>
