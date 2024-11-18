<template>
    <div class="wrapper">
        <h1 class="wrapper__title title">Tools</h1>
        <div class="wrapper__items grid is-col-min-11">
            <ToolCard
                title="Markdown zu PDF"
                href="/markdown-to-pdf"
                icon="🖨️"
            />
            <ToolCard title="Lösungseditor" href="/solution-editor" icon="🔒" />
            <ToolCard
                title="setup.sh Generator"
                href="/setup-generator"
                icon="📦"
            />
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

    width: 100vw;
    height: 100vh;

    &__title {
        font-size: 780%;
    }

    &__items {
        width: 100%;
        padding: 0 1rem;
    }
}
</style>
