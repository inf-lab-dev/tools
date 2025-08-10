<template>
    <form class="field has-addons" @submit.prevent="onFormSubmitted">
        <div class="control is-expanded">
            <input
                v-model="fileName"
                :class="['input', errorMessage && 'is-danger']"
                type="text"
                placeholder="Dateiname"
            />
            <p class="help is-danger" v-if="errorMessage">
                {{ errorMessage }}
            </p>
        </div>
        <div class="control">
            <button class="button" type="submit" :disabled="!!errorMessage">
                {{ label }}
            </button>
        </div>
    </form>
</template>

<script lang="ts" setup>
export interface FileName {
    fileName: string;
    language: string;
}

const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
    c: 'c',
    py: 'python',
    js: 'javascript',
    html: 'html',
    css: 'css',
};

const emit = defineEmits<{
    saved: [FileName];
    abort: [];
}>();

const props = withDefaults(
    defineProps<{
        label: string;
        initialName?: string;
    }>(),
    {
        initialName: '',
    },
);

const fileName = ref(props.initialName);
const language = computed(() => {
    const segments = fileName.value.split('.');
    const extension = segments.at(-1);

    return extension ? EXTENSION_LANGUAGE_MAP[extension] : undefined;
});

const errorMessage = computed(() => {
    if (fileName.value.trim().length === 0) {
        return 'Dateiname muss ausgefüllt sein.';
    } else if (!language.value) {
        return `Dateiname muss erlaubte Endung haben, erlaubt sind: ${Object.keys(EXTENSION_LANGUAGE_MAP).join(', ')}`;
    }
});

function onFormSubmitted() {
    if (!errorMessage.value) {
        emit('saved', {
            fileName: fileName.value,
            language: language.value!,
        });

        fileName.value = '';
    }
}
</script>
