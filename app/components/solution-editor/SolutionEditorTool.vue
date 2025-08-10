<template>
    <div class="columns">
        <div class="column is-two-fifths">
            <div class="columns">
                <div class="column">
                    <OptionsPanel
                        v-model="decryptedSolution.title"
                        @loaded="loadedSolution"
                        @save="save"
                    />
                </div>
                <div class="column" id="commentsPanel"></div>
            </div>

            <FileExplorerPanel
                v-model:files="decryptedSolution.files"
                v-model:active-file="activeFile"
            />
        </div>

        <EditorPanel class="column" :model-value="activeFile" />
    </div>
</template>

<script lang="ts" setup>
import {
    encryptFile,
    type DecryptedSolution,
    type DecryptedSolutionFile,
} from 'solution-zone';
import EditorPanel from './panel/EditorPanel.vue';
import FileExplorerPanel from './panel/FileExplorerPanel.vue';
import OptionsPanel from './panel/OptionsPanel.vue';

const hasUnsavedChanges = ref(false);
const activeFile = ref<DecryptedSolutionFile>();
const decryptedSolution = ref<DecryptedSolution>({
    title: '',
    files: [],
});

function loadedSolution(solution: DecryptedSolution) {
    decryptedSolution.value = solution;

    activeFile.value = decryptedSolution.value.files[0]!;

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
}
</style>
