<template>
    <nav class="panel">
        <p class="panel-heading">Dateien</p>
        <a
            v-for="file in files"
            :class="['panel-block', activeFile === file && 'is-active']"
            @click.prevent="activeFile = file"
        >
            <div class="fileButtons buttons">
                <template v-if="renamingFile == file">
                    <SolutionEditorPanelExplorerFileNameForm
                        class="is-flex-grow-1"
                        @saved="
                            file.name = $event.fileName;
                            file.language = $event.language;

                            renamingFile = undefined;
                        "
                        label="Speichern"
                        :initial-name="file.name"
                    />

                    <button class="button" @click="renamingFile = undefined">
                        Abbruch
                    </button>
                </template>

                <template v-else>
                    <div class="is-flex-grow-1 is-clipped">
                        {{ file.name }}
                    </div>

                    <button class="button" @click="renamingFile = file">
                        Umbenennen
                    </button>
                </template>

                <button class="button is-danger" @click="onDeleteClicked(file)">
                    Löschen
                </button>
            </div>
        </a>
        <div class="panel-block" v-if="files.length === 0">
            <div
                class="emptyNotice is-flex is-align-items-center is-justify-content-center is-flex-direction-column"
            >
                <h2 class="is-size-1">🧐</h2>
                <span>Keine Dateien erstellt.</span>
            </div>
        </div>

        <div class="panel-block">
            <SolutionEditorPanelExplorerFileNameForm
                class="fileCreateForm"
                @saved="createFile"
                label="Datei erstellen"
            />
        </div>
    </nav>
</template>

<script lang="ts" setup>
import type { DecryptedSolutionFile } from 'solution-zone';
import type { FileName } from './explorer/FileNameForm.vue';

const files = defineModel<DecryptedSolutionFile[]>('files', { required: true });
const activeFile = defineModel<DecryptedSolutionFile | null>('activeFile', {
    required: true,
});

const renamingFile = ref<DecryptedSolutionFile>();

function createFile({ fileName, language }: FileName) {
    const newFile = {
        name: fileName,
        code: '',
        language,
        annotations: [],
    };

    files.value.push(newFile);
    activeFile.value = newFile;
}

function onDeleteClicked(fileToDelete: DecryptedSolutionFile) {
    const confirmed = confirm(
        `Willst du die Datei "${fileToDelete.name}" wirklich löschen?`,
    );

    if (confirmed) {
        files.value = files.value.filter((file) => file !== fileToDelete);

        if (renamingFile.value == fileToDelete) {
            renamingFile.value = undefined;
        }

        if (activeFile.value == fileToDelete) {
            activeFile.value = null;
        }
    }
}
</script>

<style lang="css" scoped>
.fileButtons {
    width: 100%;
}

.fileCreateForm {
    width: 100%;
}

.emptyNotice {
    width: 100%;
}
</style>
