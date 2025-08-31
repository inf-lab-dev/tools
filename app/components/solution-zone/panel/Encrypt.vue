<template>
    <form class="encryptPanel panel is-primary" @submit.prevent="onFormSubmit">
        <h2 class="panel-heading">Verschlüsseln</h2>
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
            <div class="encryptPanel__textareaField field">
                <label class="label" :for="`${baseId}-content`">Inhalt</label>
                <div class="control">
                    <textarea
                        v-model="content"
                        :id="`${baseId}-content`"
                        :class="['textarea', !content && 'is-danger']"
                        :disabled="isLoading"
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="panel-block">
            <div class="encryptPanel__textareaField field">
                <label class="label" :for="`${baseId}-encrypted`"
                    >Verschlüsselter Inhalt</label
                >
                <div class="control">
                    <textarea
                        :value="encryptedContent"
                        :id="`${baseId}-encrypted`"
                        class="encryptPanel__result textarea"
                        readonly
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="panel-block is-flex is-flex-direction-column">
            <div class="buttons">
                <button
                    :disabled="hasError || isLoading"
                    :class="['button', 'is-primary', isLoading && 'is-loading']"
                    type="submit"
                >
                    Verschlüsseln
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
import { encrypt } from 'solution-zone';

const baseId = useId();

const isLoading = ref(false);

const key = ref('');
const content = ref('');
const encryptedContent = ref('');

const hasError = computed(() => !content.value || !key.value);

function onResetClick() {
    key.value = '';
    content.value = '';

    encryptedContent.value = '';
}

async function onFormSubmit() {
    isLoading.value = true;

    encryptedContent.value = await encrypt(key.value, content.value);

    isLoading.value = false;
}
</script>

<style lang="css" scoped>
.encryptPanel {
    .encryptPanel__textareaField {
        width: 100%;
    }

    .encryptPanel__result {
        user-select: all;
    }
}
</style>
