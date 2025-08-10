<template>
    <div class="fileEditor">
        <div class="fileEditor__interface">
            <div class="fileEditor__interfaceEditor">
                <Editor
                    ref="editor"
                    v-model="modelValue.code"
                    :annotations="modelValue.annotations"
                    :language="modelValue.language"
                    @update-selection="updateSelection"
                />
            </div>
        </div>
        <div class="fileEditor__annotations">
            <Annotations
                v-model="modelValue.annotations"
                @reveal="revealAnnotation"
            />
        </div>

        <Teleport to="#commentsPanel">
            <CommentsPanel
                :disabled="!!!selection"
                @create="createAnnotation"
            />
        </Teleport>
    </div>
</template>

<script lang="ts" setup>
import { type DecryptedSolutionFile } from 'solution-zone';
import Annotations from './segment/Annotations.vue';
import CommentsPanel from './segment/CommentsPanel.vue';
import Editor, { type Selection } from './segment/Editor.vue';

const modelValue = defineModel<DecryptedSolutionFile>({ required: true });

const editor = useTemplateRef('editor');

const selection = shallowRef<Selection | null>(null);

function updateSelection(updatedSelection: Selection, hasContent: boolean) {
    if (!hasContent) {
        selection.value = null;
    } else {
        selection.value = updatedSelection;
    }
}

function createAnnotation(comment: string) {
    if (!selection.value) {
        throw new TypeError('Cannot create annotation without an selection.');
    }

    modelValue.value.annotations.push({
        ...selection.value,
        comment,
    });
}

function revealAnnotation(selection: Selection) {
    if (!editor.value) {
        throw new TypeError('Cannot goto an annotation without an editor.');
    }

    editor.value.gotoSelection(selection);
}
</script>

<style lang="css" scoped>
.fileEditor {
    display: flex;
    flex-direction: column;

    gap: 10px;

    .fileEditor__interface {
        display: flex;

        gap: 20px;
    }

    .fileEditor__interfaceEditor {
        min-height: 50vh;

        border-radius: var(--bulma-size-7);
        overflow: hidden;

        width: 100%;
    }

    .fileEditor__annotations {
        border-radius: var(--bulma-size-7);
        overflow: hidden;
    }
}
</style>
