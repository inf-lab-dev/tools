<template>
    <div class="view">
        <div class="tabs">
            <ul>
                <li
                    v-for="file in decryptedSolution.files"
                    :class="[activeFile === file && 'is-active']"
                >
                    <a @click="selectFile(file)">{{ file.name }}</a>
                </li>
            </ul>

            <div class="buttons ml-5">
                <button class="button is-primary" @click="createFile">
                    Datei hinzufügen
                </button>
            </div>
        </div>

        <FileEditor :model-value="activeFile" @delete="deleteFile">
            <OptionsPanel
                v-model="decryptedSolution.title"
                @loaded="loadedSolution"
                @save="save"
            />
        </FileEditor>
    </div>
</template>

<script lang="ts" setup>
import {
    encryptFile,
    type DecryptedSolution,
    type DecryptedSolutionFile,
} from 'solution-zone';
import OptionsPanel from './control/OptionsPanel.vue';
import FileEditor from './view/FileEditor.vue';

const createDefaultFile = () => ({
    name: 'Untitled.c',
    language: 'c',
    code: '',
    annotations: [],
});

const hasUnsavedChanges = ref(false);
const activeFile = ref<DecryptedSolutionFile>(createDefaultFile());
const decryptedSolution = ref<DecryptedSolution>({
    title: '',
    files: [activeFile.value],
});

function selectFile(newActiveFile: DecryptedSolutionFile) {
    activeFile.value = newActiveFile;
}

function createFile() {
    const newFile = createDefaultFile();

    decryptedSolution.value.files.push(newFile);
    selectFile(newFile);
}

function deleteFile(fileToDelete: DecryptedSolutionFile) {
    decryptedSolution.value.files = decryptedSolution.value.files.filter(
        (file) => file !== fileToDelete,
    );

    if (activeFile.value === fileToDelete) {
        selectFile(decryptedSolution.value.files[0]!);
    }

    if (decryptedSolution.value.files.length === 0) {
        createFile();
    }
}

function loadedSolution(solution: DecryptedSolution) {
    decryptedSolution.value = solution;

    selectFile(decryptedSolution.value.files[0]!);

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
