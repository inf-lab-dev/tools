<template>
    <article class="panel is-link">
        <h2 class="panel-heading">Datei Einstellungen</h2>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="language-selection">
                    Programmiersprache
                </label>
                <div class="control">
                    <div class="select">
                        <select v-model="modelLanguage" id="language-selection">
                            <option value="c">C</option>
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="name">Dateiname</label>
                <div class="control">
                    <input
                        v-model="modelName"
                        :class="[
                            'input',
                            {
                                'is-danger': !!!modelName,
                            },
                        ]"
                        id="name"
                        type="text"
                    />
                </div>
            </div>
        </div>
        <div class="panel-block is-flex is-flex-direction-column">
            <button
                class="button is-danger is-fullwidth"
                @click="onDeleteClicked"
            >
                Datei löschen
            </button>
        </div>
    </article>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
    delete: [];
}>();

const modelLanguage = defineModel<string>('language');
const modelName = defineModel<string>('name');

function onDeleteClicked() {
    const confirmed = confirm(
        `Möchtest du die Datei "${modelName.value}" wirklich löschen?`,
    );

    if (confirmed) {
        emit('delete');
    }
}
</script>
