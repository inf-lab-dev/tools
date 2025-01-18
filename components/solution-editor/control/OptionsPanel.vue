<template>
    <article class="panel is-primary">
        <h2 class="panel-heading">Einstellungen</h2>
        <div class="panel-block">
            <div class="field">
                <label class="label" for="language-selection">
                    Programmiersprache
                </label>
                <div class="control">
                    <div class="select">
                        <select v-model="modelValue" id="language-selection">
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
                <label class="label" for="encryption-key">Schlüssel</label>
                <div class="control">
                    <input
                        v-model="key"
                        :class="[
                            'input',
                            {
                                'is-danger': !!!key,
                            },
                        ]"
                        id="encryption-key"
                        type="text"
                        placeholder="busybeaver"
                    />
                </div>
            </div>
        </div>
        <div class="panel-block is-flex is-flex-direction-column">
            <button
                :disabled="!!!key"
                class="button is-fullwidth mb-3"
                @click="load"
            >
                Verschlüsselte Lösung laden
            </button>
            <button
                :disabled="!!!key"
                class="button is-primary is-fullwidth"
                @click="save"
            >
                Verschlüsselte Lösung speichern
            </button>
            <input
                ref="fileInputElement"
                type="file"
                accept=".solution.json"
                hidden
                @change="loadSolution"
            />
        </div>
    </article>
</template>

<script lang="ts" setup>
import { decryptFile, type DecryptedSolution } from 'solution-zone';

const emit = defineEmits<{
    save: [key: string];
    loaded: [solution: DecryptedSolution];
}>();

const modelValue = defineModel<string>();

const fileInputElement = useTemplateRef('fileInputElement');
const key = shallowRef('');

function save() {
    emit('save', key.value);
}

function load() {
    fileInputElement.value!.click();
}

async function loadSolution(event: Event) {
    const target = event.target! as HTMLInputElement;
    const file = target.files![0];

    try {
        const json = JSON.parse(await file.text());
        const solution = await decryptFile(key.value, json);

        emit('loaded', solution);
    } catch (_) {
        alert(
            'Die Lösung konnte nicht entschlüsselt werden, ist der Schlüssel korrekt?',
        );
    }
}
</script>
