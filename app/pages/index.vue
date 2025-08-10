<template>
    <div class="wrapper">
        <h1 class="wrapper__title title">Tools</h1>
        <div class="wrapper__items grid is-col-min-11">
            <ToolCard title="Lösungseditor" href="/solution-editor" icon="🔒" />
            <ToolCard title="solution-zone" href="/solution-zone" icon="🔑" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import ToolCard from '~/components/ToolCard.vue';
</script>

<style lang="css" scoped>
.wrapper {
    display: flex;

    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 1.5rem;

    width: 100%;
    min-height: 80vh;

    .wrapper__title {
        font-size: 780%;
    }

    .wrapper__items {
        width: 100%;
    }
}
</style>
