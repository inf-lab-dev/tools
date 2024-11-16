<template>
    <div class="view">
        <div class="view__interface">
            <div class="view__editor">
                <Editor
                    ref="editor"
                    v-model="decryptedSolution.code"
                    :annotations="decryptedSolution.annotations"
                    :language="decryptedSolution.language"
                    @update-selection="updateSelection"
                />
            </div>
            <div class="view__controls">
                <OptionsPanel
                    v-model="decryptedSolution.language"
                    @loaded="loadedSolution"
                    @save="save"
                />
                <CommentsPanel
                    :disabled="!!!selection"
                    @create="createAnnotation"
                />
            </div>
        </div>
        <div class="view__annotations">
            <Annotations
                v-model="decryptedSolution.annotations"
                @reveal="revealAnnotation"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { encryptFile, type DecryptedSolution } from 'solution-zone';
import CommentsPanel from './control/CommentsPanel.vue';
import OptionsPanel from './control/OptionsPanel.vue';
import Annotations from './view/Annotations.vue';
import Editor, { type Selection } from './view/Editor.vue';

const editor = useTemplateRef('editor');

const hasUnsavedChanges = shallowRef(false);
const selection = shallowRef<Selection | null>(null);

const decryptedSolution = ref<DecryptedSolution>({
    code: '',
    language: 'c',
    annotations: [],
});

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

    decryptedSolution.value.annotations.push({
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

function loadedSolution(solution: DecryptedSolution) {
    decryptedSolution.value = solution;

    nextTick(() => (hasUnsavedChanges.value = false));
}

async function save(key: string) {
    const encrypted = await encryptFile(key, decryptedSolution.value);

    const blob = new Blob([JSON.stringify(encrypted, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${key}.solution.json`;
    link.click();

    URL.revokeObjectURL(url);

    hasUnsavedChanges.value = false;
}

function onBeforeUnload(event: Event) {
    if (hasUnsavedChanges.value) {
        event.preventDefault();
        event.returnValue = false;
    }
}

watch(
    decryptedSolution,
    () => {
        hasUnsavedChanges.value = true;
    },
    { deep: true },
);

onMounted(() => window.addEventListener('beforeunload', onBeforeUnload));
onBeforeUnmount(() =>
    window.removeEventListener('beforeunload', onBeforeUnload),
);
</script>

<style lang="scss" scoped>
.view {
    display: flex;
    flex-direction: column;

    gap: 10px;
    padding: 1rem;

    &__interface {
        display: flex;

        gap: 20px;
    }

    &__controls {
        width: 20%;
    }

    &__editor {
        min-height: 50vh;

        width: 80%;
    }
}
</style>
