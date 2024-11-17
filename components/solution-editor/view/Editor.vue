<template>
    <MonacoEditor
        v-model="modelValue"
        ref="editor"
        class="editor"
        :lang="language"
        :options="monacoOptions"
    />
</template>

<script lang="ts" setup>
import type * as Monaco from 'monaco-editor';
import { type DecryptedAnnotation } from 'solution-zone';

export type Selection = Pick<DecryptedAnnotation, 'line' | 'column'>;

const editor = useTemplateRef('editor');
const monaco = useMonaco();

const props = defineProps<{
    language: string;
    annotations: DecryptedAnnotation[];
}>();

const emit = defineEmits<{
    updateSelection: [selection: Selection, hasContent: boolean];
}>();

const modelValue = defineModel<string>({ required: true });

const monacoOptions = computed<Monaco.editor.IEditorConstructionOptions>(
    () => ({
        language: props.language,
        value: modelValue.value,
        lineNumbers: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        renderValidationDecorations: 'on',
        theme:
            import.meta.env.SSR ||
            matchMedia('(prefers-color-scheme: dark)').matches
                ? 'vs-dark'
                : 'vs-light',
    }),
);

function updateAnnotations() {
    if (!editor.value || !monaco) {
        return;
    }

    const markers = props.annotations.map(
        ({
            line: [startLineNumber, endLineNumber],
            column: [startColumn, endColumn],
            comment: message,
        }) => ({
            startLineNumber,
            endLineNumber,
            startColumn,
            endColumn,
            message,
            severity: monaco.MarkerSeverity.Info,
        }),
    );

    monaco.editor.setModelMarkers(
        editor.value.$editor!.getModel()!,
        'annotations',
        markers,
    );
}

async function setupEditor() {
    if (!editor.value) {
        throw new ReferenceError(
            'Could not find element to display solution within.',
        );
    }

    editor.value.$editor!.onDidChangeModelContent(() => {
        const value = editor.value!.$editor!.getValue();

        if (value !== modelValue.value) {
            modelValue.value = value;
        }
    });

    editor.value.$editor!.onDidChangeCursorSelection((event) => {
        const { startLineNumber, endLineNumber, startColumn, endColumn } =
            event.selection;

        emit(
            'updateSelection',
            {
                line: [startLineNumber, endLineNumber],
                column: [startColumn, endColumn],
            },
            startLineNumber !== endLineNumber || startColumn !== endColumn,
        );
    });

    updateAnnotations();
}

function gotoSelection(selection: Selection) {
    if (!editor.value) {
        throw new ReferenceError(
            'Could not find editor to go to selection within.',
        );
    }

    const {
        line: [startLineNumber, endLineNumber],
        column: [startColumn, endColumn],
    } = selection;

    const monacoSelection = {
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn,
    };

    editor.value.$editor!.revealRangeInCenter(monacoSelection);
    editor.value.$editor!.setSelection(monacoSelection);
}

watch(props, () => updateAnnotations(), { deep: true });

onMounted(() => nextTick(() => setupEditor()));

defineExpose({ gotoSelection });
</script>

<style lang="scss" scoped>
.editor {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
}
</style>
