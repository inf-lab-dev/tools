<template>
    <div class="editor">
        <div v-if="!editor" class="editor__loader">
            <progress class="progress is-primary" max="100">Laden</progress>
            <h2 class="title">Lade den Editor</h2>
        </div>
        <MonacoEditor
            v-show="editor"
            v-model="modelValue"
            class="editor__monaco"
            :lang="language"
            :options="editorOptions"
            @load="onEditorLoaded"
        />
    </div>
</template>

<script lang="ts" setup>
import { type DecryptedAnnotation } from 'solution-zone';

export type Selection = Pick<DecryptedAnnotation, 'line' | 'column'>;

type Editor = import('monaco-editor').editor.IStandaloneCodeEditor;
type EditorOptions =
    import('monaco-editor').editor.IStandaloneDiffEditorConstructionOptions;

const monaco = useMonaco();

const editor = shallowRef<Editor>();

const props = defineProps<{
    language: string;
    annotations: DecryptedAnnotation[];
}>();

const emit = defineEmits<{
    updateSelection: [selection: Selection, hasContent: boolean];
}>();

const modelValue = defineModel<string>({ required: true });

const editorOptions = computed<EditorOptions>(() => ({
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
}));

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
        editor.value.getModel()!,
        'annotations',
        markers,
    );
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

    editor.value.revealRangeInCenter(monacoSelection);
    editor.value.setSelection(monacoSelection);
}

function onEditorLoaded(editorInstance: Editor) {
    editorInstance.onDidChangeModelContent(() => {
        const value = editorInstance.getValue();

        if (value !== modelValue.value) {
            modelValue.value = value;
        }
    });

    editorInstance.onDidChangeCursorSelection((event) => {
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

    editor.value = editorInstance;

    updateAnnotations();
}

watch(props, () => updateAnnotations(), { deep: true });

defineExpose({ gotoSelection });
</script>

<style lang="css" scoped>
.editor {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;

    .editor__monaco {
        width: 100%;
        height: 100%;
    }

    .editor__loader {
        display: flex;
        flex-direction: column;

        width: 100%;
        height: 100%;

        justify-content: center;
        align-items: center;
    }
}
</style>
