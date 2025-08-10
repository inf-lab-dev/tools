<template>
    <div class="editorPanel">
        <article v-if="modelValue" class="message is-link">
            <div class="message-header">
                <p>{{ modelValue.name }}</p>
                <button
                    class="delete"
                    aria-label="Schließen"
                    @click="modelValue = null"
                ></button>
            </div>
            <div class="editorPanel__messageBody message-body">
                <SolutionEditorPanelEditorFile v-model="modelValue" />
            </div>
        </article>

        <div
            v-else
            class="editorPanel__empty is-flex is-align-items-center is-justify-content-center is-flex-direction-column"
        >
            <h2 class="is-size-1">🥱</h2>
            <span>Keine Datei geöffnet.</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { DecryptedSolutionFile } from 'solution-zone';

const modelValue = defineModel<DecryptedSolutionFile | null>({
    required: true,
});
</script>

<style lang="css" scoped>
.editorPanel {
    .editorPanel__messageBody {
        padding: 0;

        border: var(--bulma-size-7) solid
            hsl(
                var(--bulma-message-h),
                var(--bulma-message-s),
                var(--bulma-message-background-l)
            );
    }

    .editorPanel__empty {
        width: 100%;
        height: 100%;
    }
}
</style>
