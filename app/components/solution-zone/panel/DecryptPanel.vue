<template>
    <form class="decryptPanel panel is-link" @submit.prevent="onFormSubmit">
        <h2 class="panel-heading">Entschlüsseln</h2>
        <div class="panel-block">
            <div class="field">
                <label class="label" :for="`${baseId}-key`">Schlüssel</label>
                <div class="control">
                    <input
                        v-model="key"
                        :id="`${baseId}-key`"
                        :class="['input', !key && 'is-danger']"
                        :disabled="isLoading"
                        type="text"
                    />
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div class="decryptPanel__textareaField field">
                <label class="label" :for="`${baseId}-encrypted`"
                    >Verschlüsselter Inhalt</label
                >
                <div class="control">
                    <textarea
                        v-model="encryptedContent"
                        :id="`${baseId}-encrypted`"
                        :class="['textarea', !encryptedContent && 'is-danger']"
                        :disabled="isLoading"
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div class="decryptPanel__textareaField field">
                <label class="label" :for="`${baseId}-content`">Inhalt</label>
                <div class="control">
                    <textarea
                        :value="content"
                        :id="`${baseId}-content`"
                        class="decryptPanel__result textarea"
                        readonly
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="panel-block is-flex is-flex-direction-column">
            <div class="buttons">
                <button
                    :disabled="hasError || isLoading"
                    :class="['button', 'is-link', isLoading && 'is-loading']"
                    type="submit"
                >
                    Entschlüsseln
                </button>

                <button
                    :disabled="isLoading"
                    class="button"
                    type="button"
                    @click="onResetClick"
                >
                    Zurücksetzen
                </button>
            </div>
        </div>
    </form>
</template>

<script lang="ts" setup>
import { decrypt } from 'solution-zone';

const baseId = useId();

const isLoading = ref(false);

const key = ref('');
const encryptedContent = ref('');
const content = ref('');

const hasError = computed(() => !encryptedContent.value || !key.value);

function onResetClick() {
    key.value = '';
    encryptedContent.value = '';

    content.value = '';
}

async function onFormSubmit() {
    isLoading.value = true;

    content.value = await decrypt(key.value, encryptedContent.value);

    isLoading.value = false;
}
</script>

<style lang="css" scoped>
.decryptPanel {
    .decryptPanel__textareaField {
        width: 100%;
    }

    .decryptPanel__result {
        user-select: all;
    }
}
</style>
